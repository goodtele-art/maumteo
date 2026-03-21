import type { ChildIssue } from "@/types/child/patient.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { ChildFacilityType } from "@/types/child/facility.ts";
import type { ChildFloorConfig } from "@/types/child/floor.ts";

// ── 아동센터 층 구성 ──
export const CHILD_FLOORS: ChildFloorConfig[] = [
  { id: "child_garden",    label: "하늘놀이터",   icon: "☀", color: "floor-child-garden",    emRange: [0, 20] },
  { id: "child_comfort",   label: "안심상담실",   icon: "◇", color: "floor-child-comfort",   emRange: [21, 40] },
  { id: "child_care",      label: "마음돌봄센터", icon: "○", color: "floor-child-care",      emRange: [41, 60] },
  { id: "child_intensive", label: "집중돌봄센터", icon: "◈", color: "floor-child-intensive", emRange: [61, 80] },
  { id: "child_shelter",   label: "보호치료센터", icon: "▽", color: "floor-child-shelter",   emRange: [81, 100] },
];

// ── 아동 수치 ──
export const CHILD_INCIDENT_THRESHOLD = 90;
export const CHILD_DISCHARGE_THRESHOLD = 20;
export const CHILD_DISCHARGE_ACTIVE_PARENT = 25;
export const CHILD_EM_INCREASE_BASE = 4;
export const CHILD_EM_INCREASE_VARIANCE = 2;
export const CHILD_PARENT_DECAY = 3;
export const CHILD_INCOME_PER_PATIENT = 30;

// ── AP 비용 ──
export const CHILD_AP_COST = {
  treat: 2,
  build: 3,
  hire: 2,
  encourage: 1,
  upgrade: 2,
  parentInterview: 2,
  schoolConsult: 2,
  assess: 1,
  hirePsychologist: 2,
  hireDirector: 3,
} as const;

// ── 문제영역 설정 ──
export interface ChildIssueConfig {
  label: string;
  description: string;
  emIncreaseRate: number;
  rapportDifficulty: number;
  relapseChance: number;
  emStartMin: number;
  emStartMax: number;
  unlockTurn: number;
  initialParentInvolvement: number;
}

export const CHILD_ISSUE_CONFIG: Record<ChildIssue, ChildIssueConfig> = {
  child_anxiety: {
    label: "아동 불안",
    description: "ECT Lv1: CBT 7변형, 노출, 가족기반CBT",
    emIncreaseRate: 2, rapportDifficulty: 0.9, relapseChance: 0,
    emStartMin: 40, emStartMax: 65, unlockTurn: 31,
    initialParentInvolvement: 70,
  },
  child_depression: {
    label: "청소년 우울",
    description: "ECT Lv1: CBT·IPT(청소년만). 아동 Lv3~4",
    emIncreaseRate: 1, rapportDifficulty: 1.3, relapseChance: 0.05,
    emStartMin: 45, emStartMax: 70, unlockTurn: 35,
    initialParentInvolvement: 50,
  },
  adhd: {
    label: "ADHD",
    description: "ECT Lv1: BPT·BCM",
    emIncreaseRate: 3, rapportDifficulty: 0.7, relapseChance: 0.1,
    emStartMin: 35, emStartMax: 60, unlockTurn: 33,
    initialParentInvolvement: 60,
  },
  behavior_regulation: {
    label: "행동조절 어려움",
    description: "ECT Lv1: PCIT(d=1.65), MST·FFT",
    emIncreaseRate: 2, rapportDifficulty: 1.4, relapseChance: 0.15,
    emStartMin: 50, emStartMax: 75, unlockTurn: 35,
    initialParentInvolvement: 40,
  },
  child_trauma: {
    label: "아동 트라우마",
    description: "ECT Lv1: TF-CBT(25 RCT, PRACTICE 모델)",
    emIncreaseRate: 1, rapportDifficulty: 1.2, relapseChance: 0,
    emStartMin: 60, emStartMax: 85, unlockTurn: 40,
    initialParentInvolvement: 50,
  },
  child_ocd: {
    label: "아동 강박",
    description: "ECT Lv1: 가족중심 CBT+ERP",
    emIncreaseRate: 1, rapportDifficulty: 1.0, relapseChance: 0.15,
    emStartMin: 45, emStartMax: 70, unlockTurn: 40,
    initialParentInvolvement: 60,
  },
  eating_disorder: {
    label: "섭식장애",
    description: "ECT Lv1: FBT/Maudsley(관해율 39%)",
    emIncreaseRate: 2, rapportDifficulty: 1.3, relapseChance: 0.1,
    emStartMin: 55, emStartMax: 80, unlockTurn: 45,
    initialParentInvolvement: 55,
  },
  emotion_crisis: {
    label: "정서위기",
    description: "ECT Lv1: DBT-A",
    emIncreaseRate: 3, rapportDifficulty: 1.5, relapseChance: 0.1,
    emStartMin: 70, emStartMax: 95, unlockTurn: 48,
    initialParentInvolvement: 45,
  },
};

// ── 상담사 전공 매칭 ──
export interface ChildSpecialtyConfig {
  label: string;
  description: string;
  optimalIssues: ChildIssue[];
  supportiveIssues: ChildIssue[];
}

export const CHILD_SPECIALTY_CONFIG: Record<ChildSpecialty, ChildSpecialtyConfig> = {
  child_cbt: {
    label: "아동 인지행동치료",
    description: "CBT-C, 노출치료",
    optimalIssues: ["child_anxiety", "child_ocd", "child_depression"],
    supportiveIssues: ["child_trauma", "eating_disorder"],
  },
  play_therapy: {
    label: "놀이치료",
    description: "CCPT, 지시적/비지시적 놀이치료. 라포 쌓기 ×1.3 고유효과",
    optimalIssues: [], // 근거 Lv3~4이므로 최적 매칭 없음
    supportiveIssues: ["child_anxiety", "child_trauma", "adhd"],
  },
  parent_training: {
    label: "부모훈련/PCIT",
    description: "BPT, PCIT, PMTO, Triple P",
    optimalIssues: ["adhd", "behavior_regulation"],
    supportiveIssues: ["child_anxiety", "child_ocd"],
  },
  dbt_a: {
    label: "청소년 DBT",
    description: "DBT-A, 감정조절 기술훈련",
    optimalIssues: ["emotion_crisis", "eating_disorder"],
    supportiveIssues: ["child_depression", "behavior_regulation"],
  },
  tf_cbt: {
    label: "트라우마초점 CBT",
    description: "TF-CBT, 부모참여 외상치료",
    optimalIssues: ["child_trauma"],
    supportiveIssues: ["child_anxiety", "emotion_crisis"],
  },
  family_therapy: {
    label: "가족치료/MST",
    description: "FFT, MST, FBT(Maudsley)",
    optimalIssues: ["eating_disorder", "behavior_regulation"],
    supportiveIssues: ["child_ocd", "child_depression"],
  },
};

/** 전공-문제영역 매칭 배율 */
export const CHILD_MATCH_OPTIMAL = 1.4;
export const CHILD_MATCH_SUPPORTIVE = 1.15;
export const CHILD_MATCH_MISMATCH = 0.85;

export function getChildMatchMultiplier(
  specialty: ChildSpecialty,
  issue: ChildIssue,
): number {
  const config = CHILD_SPECIALTY_CONFIG[specialty];
  if (config.optimalIssues.includes(issue)) return CHILD_MATCH_OPTIMAL;
  if (config.supportiveIssues.includes(issue)) return CHILD_MATCH_SUPPORTIVE;
  return CHILD_MATCH_MISMATCH;
}

// ── 치료실 템플릿 ──
export interface ChildFacilityTemplate {
  label: string;
  description: string;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
  effect: string;
  synergySpecialties: ChildSpecialty[];
  bonusIssues: ChildIssue[];
  unlockTurn: number;
}

export const CHILD_FACILITY_TEMPLATES: Record<ChildFacilityType, ChildFacilityTemplate> = {
  play_room: {
    label: "놀이치료실", description: "라포 쌓기 효과 2배. 놀이치료/아동CBT 시너지.",
    buildCost: 120, upkeepPerTurn: 10, emReduction: 8,
    effect: "rapport_boost", synergySpecialties: ["play_therapy", "child_cbt"],
    bonusIssues: [], unlockTurn: 32,
  },
  parent_room: {
    label: "부모상담실", description: "부모참여도 자연감소 완화. 부모훈련/가족치료 시너지.",
    buildCost: 100, upkeepPerTurn: 8, emReduction: 5,
    effect: "parent_boost", synergySpecialties: ["parent_training", "family_therapy"],
    bonusIssues: [], unlockTurn: 31,
  },
  group_activity: {
    label: "사회기술훈련실", description: "동시 치료 (각 70%). ADHD/행동조절 보너스.",
    buildCost: 160, upkeepPerTurn: 14, emReduction: 7,
    effect: "group_treat", synergySpecialties: ["parent_training", "dbt_a"],
    bonusIssues: ["adhd", "behavior_regulation"], unlockTurn: 35,
  },
  exposure_child: {
    label: "아동노출치료실", description: "불안/강박/트라우마 EM 감소 ×1.5.",
    buildCost: 180, upkeepPerTurn: 15, emReduction: 10,
    effect: "issue_bonus", synergySpecialties: ["child_cbt", "tf_cbt"],
    bonusIssues: ["child_anxiety", "child_ocd", "child_trauma"], unlockTurn: 40,
  },
  nutrition_clinic: {
    label: "영양치료실", description: "섭식장애 EM 감소 ×1.5.",
    buildCost: 150, upkeepPerTurn: 12, emReduction: 6,
    effect: "issue_bonus", synergySpecialties: ["family_therapy", "dbt_a"],
    bonusIssues: ["eating_disorder"], unlockTurn: 45,
  },
  crisis_room: {
    label: "위기개입실", description: "정서위기 EM 감소 ×1.5. 위기 시 사고 방지.",
    buildCost: 200, upkeepPerTurn: 18, emReduction: 9,
    effect: "crisis_protect", synergySpecialties: ["dbt_a", "tf_cbt"],
    bonusIssues: ["emotion_crisis"], unlockTurn: 48,
  },
};

// ── 센터 특화 보너스 ──
export const SPECIALIZATION_TRAUMA_BONUS = 0.25;  // 외상전문: 트라우마/위기 +25%
export const SPECIALIZATION_TRAUMA_PENALTY = 0.10; // 외상전문: 기타 문제 -10%
export const SPECIALIZATION_GENERAL_BUILD_DISCOUNT = 0.20; // 종합: 건설 비용 -20%
export const SPECIALIZATION_TRAUMA_ISSUES: ChildIssue[] = ["child_trauma", "emotion_crisis"];

// ── 놀이치료 라포 고유효과 ──
export const PLAY_THERAPY_RAPPORT_MULTIPLIER = 1.3;

// ── 부모 번아웃 ──
export const PARENT_BURNOUT_THRESHOLD = 80;     // 참여도 이 이상이면 카운터 증가
export const PARENT_BURNOUT_TURNS = 3;           // 연속 턴 수
export const PARENT_BURNOUT_DECAY_PENALTY = 15;  // 번아웃 시 추가 감소

// ── Wee센터 연계 설정 ──
export const WEE_CENTER_REFERRAL = {
  patientsPerTurn: 3,
  maxPatientsPerTurn: 4,
  incomePerPatient: 15,
  maxIncidents: 3,
  issueDistribution: { child_depression: 0.35, child_anxiety: 0.35, emotion_crisis: 0.30 },
  emRange: [70, 90] as [number, number],
  parentRange: [25, 40] as [number, number],
} as const;

// ── 보호관찰소 연계 설정 ──
export const PROBATION_REFERRAL = {
  patientsPerTurn: 3,
  maxPatientsPerTurn: 5,
  fixedIncomePerTurn: 80,
  maxIncidents: 5,
  issueDistribution: { behavior_regulation: 0.40, child_trauma: 0.35, adhd: 0.25 },
  emRange: [65, 85] as [number, number],
  parentRange: [15, 30] as [number, number],
  rapportPenalty: -20,
  absentChance: 0.3,
} as const;
