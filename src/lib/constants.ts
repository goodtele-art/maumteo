import type { FloorConfig, FacilityType, DominantIssue } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

// ── 층 구성 ──
export const FLOORS: FloorConfig[] = [
  { id: "garden",     label: "옥상하늘정원", icon: "♥", color: "floor-garden",     emRange: [0, 15],   unlockTurn: 18 },
  { id: "insight",    label: "심리상담센터", icon: "★", color: "floor-insight",    emRange: [16, 35],  unlockTurn: 18 },
  { id: "counseling", label: "심리치료센터", icon: "●", color: "floor-counseling", emRange: [36, 60],  unlockTurn: 3 },  // 튜토리얼 3턴부터 사이드바 표시
  { id: "diagnostic", label: "집중치료센터", icon: "◆", color: "floor-diagnostic", emRange: [61, 80],  unlockTurn: 13 },
  { id: "basement",   label: "거주치료센터", icon: "▼", color: "floor-basement",   emRange: [81, 100], unlockTurn: 15 },
];

// ── 기본 수치 ──
export const AP_BASE = 5;
export const AP_PER_COUNSELOR = 1;
export const TREATMENT_VARIANCE = 0.25;
export const RAPPORT_PER_TREATMENT = 5;
export const MAX_HISTORY_TURNS = 20;
export const SAVE_KEY = "maumteo_save_v1";
export const INITIAL_GOLD = 500;
export const INITIAL_REPUTATION = 10;
export const PATIENTS_PER_TURN_BASE = 1;
export const INCOME_PER_PATIENT = 25;
export const REPUTATION_INCOME_BONUS = 0.5;
export const MAX_PATIENTS = 15;
export const OVERCROWDED_REPUTATION_PENALTY = 1;
export const BANKRUPTCY_TURNS = 3;
export const EM_NATURAL_INCREASE_BASE = 3;
export const EM_NATURAL_INCREASE_VARIANCE = 2;
export const INCIDENT_REPUTATION_LOSS = 5;
export const INCIDENT_THRESHOLD = 100;

// ── 평판 등급 ──
export interface ReputationGrade {
  grade: string;
  label: string;
  min: number;
  max: number;
  patientBonus: number;
}

export const REPUTATION_GRADES: ReputationGrade[] = [
  { grade: "F", label: "무명 상담소",   min: 0,  max: 19, patientBonus: -1 },
  { grade: "D", label: "동네 치료실",   min: 20, max: 39, patientBonus: 0 },
  { grade: "C", label: "지역 상담센터", min: 40, max: 59, patientBonus: 1 },
  { grade: "B", label: "유명 치유센터", min: 60, max: 79, patientBonus: 1 },
  { grade: "A", label: "마음의 등대",   min: 80, max: 100, patientBonus: 2 },
];

export function getReputationGrade(reputation: number): ReputationGrade {
  const clamped = Math.max(0, Math.min(100, reputation));
  for (const g of REPUTATION_GRADES) {
    if (clamped >= g.min && clamped <= g.max) return g;
  }
  return REPUTATION_GRADES[0]!;
}

export const AP_COST = {
  treat: 2,
  build: 3,
  hire: 2,
  encourage: 1,
  upgrade: 2,
} as const;

// ── 문제영역(진단) 설정 ──
export interface IssueConfig {
  label: string;
  description: string;
  emIncreaseRate: number;   // 자연 EM 증가 기본값 (기본 3에 더해짐)
  rapportDifficulty: number; // 라포 쌓기 난이도 배율 (1.0 = 보통)
  relapseChance: number;     // 매 턴 재발 확률 (0~1, 0이면 재발 없음)
  emStartMin: number;
  emStartMax: number;
  unlockTurn: number;
}

export const ISSUE_CONFIG: Record<DominantIssue, IssueConfig> = {
  depression: {
    label: "우울",
    description: "무기력, 흥미 상실, 의욕 저하",
    emIncreaseRate: 0,
    rapportDifficulty: 1.3,
    relapseChance: 0,
    emStartMin: 40, emStartMax: 70,
    unlockTurn: 3, // 튜토리얼 3턴에 첫 등장
  },
  anxiety: {
    label: "불안",
    description: "범불안, 공황, 사회불안",
    emIncreaseRate: 2,
    rapportDifficulty: 1.0,
    relapseChance: 0,
    emStartMin: 45, emStartMax: 75,
    unlockTurn: 1, // 튜토리얼 1턴에 강제 생성
  },
  relationship: {
    label: "관계",
    description: "대인관계 갈등, 애착 문제",
    emIncreaseRate: 0,
    rapportDifficulty: 0.8,
    relapseChance: 0,
    emStartMin: 40, emStartMax: 65,
    unlockTurn: 5, // 튜토리얼 5턴에 등장 (고용 버튼과 함께)
  },
  obsession: {
    label: "강박",
    description: "강박사고, 강박행동 (OCD)",
    emIncreaseRate: 1,
    rapportDifficulty: 1.0,
    relapseChance: 0.15,
    emStartMin: 50, emStartMax: 75,
    unlockTurn: 7, // 튜토리얼 7턴
  },
  trauma: {
    label: "트라우마",
    description: "PTSD, 복합외상",
    emIncreaseRate: 1,
    rapportDifficulty: 1.2,
    relapseChance: 0,
    emStartMin: 65, emStartMax: 90,
    unlockTurn: 15,
  },
  addiction: {
    label: "중독",
    description: "물질/행동 중독",
    emIncreaseRate: 1,
    rapportDifficulty: 1.1,
    relapseChance: 0.2,
    emStartMin: 50, emStartMax: 80,
    unlockTurn: 15,
  },
  personality: {
    label: "정서조절",
    description: "경계선 인격, 감정 불안정",
    emIncreaseRate: 1,
    rapportDifficulty: 1.5,
    relapseChance: 0.1,
    emStartMin: 55, emStartMax: 85,
    unlockTurn: 17,
  },
  psychosis: {
    label: "정신증",
    description: "조현병, 양극성장애",
    emIncreaseRate: 2,
    rapportDifficulty: 1.4,
    relapseChance: 0.1,
    emStartMin: 75, emStartMax: 95,
    unlockTurn: 20,
  },
};

// ── 상담사 전공 매칭 ──
export interface SpecialtyConfig {
  label: string;
  description: string;
  optimal: DominantIssue[];    // ×1.4
  supportive: DominantIssue[]; // ×1.15
  // 그 외 = ×0.85 (불일치)
}

export const SPECIALTY_CONFIG: Record<CounselorSpecialty, SpecialtyConfig> = {
  cbt: {
    label: "인지행동치료",
    description: "CBT, CT, ERP, 행동활성화",
    optimal: ["anxiety", "obsession", "depression"],
    supportive: ["addiction", "trauma"],
  },
  psychodynamic: {
    label: "정신역동",
    description: "통찰치료, 정신화기반치료(MBT)",
    optimal: ["personality", "relationship"],
    supportive: ["trauma", "depression"],
  },
  interpersonal: {
    label: "대인관계치료",
    description: "IPT, IPSRT, 문제해결치료",
    optimal: ["depression", "relationship"],
    supportive: ["personality"],
  },
  dbt: {
    label: "변증법적행동치료",
    description: "DBT, 마음챙김, 수용전념치료(ACT)",
    optimal: ["personality", "addiction"],
    supportive: ["depression", "anxiety"],
  },
  trauma_focused: {
    label: "트라우마초점치료",
    description: "지속노출(PE), 인지처리(CPT), EMDR",
    optimal: ["trauma"],
    supportive: ["anxiety", "personality"],
  },
  family_systemic: {
    label: "가족/체계치료",
    description: "가족중심치료(FFT), 가족심리교육",
    optimal: ["psychosis", "relationship"],
    supportive: ["addiction", "depression"],
  },
};

export function getMatchMultiplier(
  specialty: CounselorSpecialty,
  issue: DominantIssue,
): number {
  const config = SPECIALTY_CONFIG[specialty];
  if (config.optimal.includes(issue)) return 1.4;
  if (config.supportive.includes(issue)) return 1.15;
  return 0.85;
}

// ── 치료실 설정 ──
export type FacilityEffect =
  | "none"
  | "reduce_variance"
  | "boost_encourage"
  | "remove_mismatch_penalty"
  | "easier_discharge"
  | "group_treat"
  | "issue_bonus";

export interface FacilityTemplate {
  label: string;
  description: string;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
  effect: FacilityEffect;
  synergySpecialties: CounselorSpecialty[];
  bonusIssues: DominantIssue[];
  unlockTurn: number;
}

export const FACILITY_TEMPLATES: Record<FacilityType, FacilityTemplate> = {
  individual_room: {
    label: "개인상담실",
    description: "기본 상담 공간. EM 감소(상당 수준).",
    buildCost: 100,
    upkeepPerTurn: 10,
    emReduction: 8,
    effect: "none",
    synergySpecialties: ["cbt", "psychodynamic"],
    bonusIssues: [],
    unlockTurn: 4, // 튜토리얼 4턴 (건설 버튼 해금)
  },
  group_room: {
    label: "집단상담실",
    description: "같은 문제 내담자 2명 동시 치료 (각 70% 효과).",
    buildCost: 150,
    upkeepPerTurn: 12,
    emReduction: 6,
    effect: "group_treat",
    synergySpecialties: ["interpersonal", "dbt"],
    bonusIssues: ["relationship", "depression"],
    unlockTurn: 13,
  },
  exposure_lab: {
    label: "노출치료실",
    description: "불안/강박/트라우마 EM 감소 ×1.5. 타 문제 효과 감소.",
    buildCost: 180,
    upkeepPerTurn: 15,
    emReduction: 10,
    effect: "issue_bonus",
    synergySpecialties: ["cbt", "trauma_focused"],
    bonusIssues: ["anxiety", "obsession", "trauma"],
    unlockTurn: 13,
  },
  mindfulness_room: {
    label: "마음챙김실",
    description: "격려 2배 + 재발 확률 감소.",
    buildCost: 130,
    upkeepPerTurn: 10,
    emReduction: 7,
    effect: "boost_encourage",
    synergySpecialties: ["dbt"],
    bonusIssues: ["personality", "addiction"],
    unlockTurn: 15,
  },
  family_room: {
    label: "가족상담실",
    description: "정신증/관계 EM ×1.3 + 치료 시 평판 보너스.",
    buildCost: 160,
    upkeepPerTurn: 14,
    emReduction: 7,
    effect: "issue_bonus",
    synergySpecialties: ["family_systemic", "interpersonal"],
    bonusIssues: ["psychosis", "relationship"],
    unlockTurn: 17,
  },
  activity_room: {
    label: "활동치료실",
    description: "전공 불일치 페널티 제거 + 종결 기준 완화(EM≤20).",
    buildCost: 120,
    upkeepPerTurn: 8,
    emReduction: 6,
    effect: "remove_mismatch_penalty",
    synergySpecialties: [],
    bonusIssues: [],
    unlockTurn: 15,
  },
};

// ── 치료실 해금 여부 ──
export function isFacilityUnlocked(type: FacilityType, turn: number): boolean {
  return FACILITY_TEMPLATES[type].unlockTurn <= turn;
}
