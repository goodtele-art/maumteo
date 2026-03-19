import type { InfantIssue } from "@/types/infant/patient.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";
import type { InfantFacilityType } from "@/types/infant/facility.ts";
import type { InfantFloorConfig } from "@/types/infant/floor.ts";
import type { MilestoneStatus } from "@/types/infant/patient.ts";

// ── 영유아센터 층 구성 ──
export const INFANT_FLOORS: InfantFloorConfig[] = [
  { id: "infant_bloom",   label: "꽃피는 놀이방", icon: "✿", color: "floor-infant-bloom",   emRange: [0, 25] },
  { id: "infant_nurture", label: "따뜻한 돌봄방", icon: "♡", color: "floor-infant-nurture", emRange: [26, 50] },
  { id: "infant_care",    label: "발달지원센터",   icon: "◎", color: "floor-infant-care",    emRange: [51, 75] },
  { id: "infant_cocoon",  label: "안전한 둥지",   icon: "◑", color: "floor-infant-cocoon",  emRange: [76, 100] },
];

// ── 영유아 수치 ──
export const INFANT_DISCHARGE_THRESHOLD = 20;
export const INFANT_DISCHARGE_ALL_MILESTONES = 30;
export const INFANT_EM_INCREASE_BASE = 3;
export const INFANT_EM_INCREASE_VARIANCE = 2;
export const INFANT_PARENT_DECAY = 3;
export const INFANT_INCOME_PER_SESSION = 3;
export const INFANT_GOVERNMENT_SUPPORT = 50;
export const GOLDEN_TIME_TURNS = 12;
export const GOLDEN_TIME_EM_TARGET = 40;
export const GOLDEN_TIME_PENALTY_PER_TURN = 0.05;
export const GOLDEN_TIME_MAX_PENALTY = 0.5;

// ── AP 비용 ──
export const INFANT_AP_COST = {
  treat: 2,
  build: 3,
  hire: 2,
  encourage: 1,
  upgrade: 2,
  parentCoaching: 2,
  assess: 1,
  hirePsychologist: 2,
  hireDirector: 3,
  resolveStress: 2,
} as const;

// ── 문제영역 설정 ──
export interface InfantIssueConfig {
  label: string;
  description: string;
  emIncreaseRate: number;
  rapportDifficulty: number;
  relapseChance: number;
  emStartMin: number;
  emStartMax: number;
  unlockTurn: number;
  initialParentInvolvement: number;
  milestones: Omit<MilestoneStatus, "achieved" | "achievedTurn">[];
}

export const INFANT_ISSUE_CONFIG: Record<InfantIssue, InfantIssueConfig> = {
  asd_early: {
    label: "자폐스펙트럼(조기)",
    description: "ECT Lv1: 포괄 ABA. ESDM: 언어 d=2.52",
    emIncreaseRate: 2, rapportDifficulty: 1.5, relapseChance: 0,
    emStartMin: 55, emStartMax: 80, unlockTurn: 70,
    initialParentInvolvement: 50,
    milestones: [
      { id: "eye_contact", label: "눈맞춤", emThreshold: 70 },
      { id: "joint_attention", label: "공동주의", emThreshold: 50 },
      { id: "imitation", label: "모방", emThreshold: 30 },
      { id: "functional_play", label: "기능적 놀이", emThreshold: 15 },
    ],
  },
  dev_delay: {
    label: "발달지연",
    description: "ESDM·DIR/Floortime",
    emIncreaseRate: 1, rapportDifficulty: 1.0, relapseChance: 0,
    emStartMin: 40, emStartMax: 65, unlockTurn: 61,
    initialParentInvolvement: 60,
    milestones: [
      { id: "gross_motor", label: "대근육 발달", emThreshold: 70 },
      { id: "fine_motor", label: "소근육 발달", emThreshold: 50 },
      { id: "symbolic_play", label: "상징놀이", emThreshold: 30 },
    ],
  },
  attachment: {
    label: "애착문제",
    description: "RAD/DSED. ABC 10회기 매뉴얼",
    emIncreaseRate: 2, rapportDifficulty: 1.6, relapseChance: 0.05,
    emStartMin: 50, emStartMax: 75, unlockTurn: 65,
    initialParentInvolvement: 35,
    milestones: [
      { id: "safe_base", label: "안전기지 행동", emThreshold: 70 },
      { id: "reunion", label: "분리 후 재결합", emThreshold: 50 },
      { id: "selective_attach", label: "선택적 애착", emThreshold: 30 },
      { id: "emotion_sharing", label: "감정 공유", emThreshold: 15 },
    ],
  },
  sensory: {
    label: "감각처리 어려움",
    description: "Ayres SI",
    emIncreaseRate: 1, rapportDifficulty: 0.8, relapseChance: 0,
    emStartMin: 35, emStartMax: 60, unlockTurn: 62,
    initialParentInvolvement: 70,
    milestones: [
      { id: "texture", label: "새 질감 수용", emThreshold: 70 },
      { id: "sound", label: "소리 적응", emThreshold: 50 },
      { id: "sensory_play", label: "감각놀이 참여", emThreshold: 30 },
    ],
  },
  speech_delay: {
    label: "언어발달지연",
    description: "초기 언어중재, 부모매개 의사소통",
    emIncreaseRate: 1, rapportDifficulty: 1.0, relapseChance: 0,
    emStartMin: 40, emStartMax: 60, unlockTurn: 65,
    initialParentInvolvement: 65,
    milestones: [
      { id: "babbling", label: "옹알이", emThreshold: 70 },
      { id: "first_word", label: "첫 단어", emThreshold: 50 },
      { id: "two_words", label: "두 단어 조합", emThreshold: 30 },
      { id: "sentence", label: "간단한 문장", emThreshold: 15 },
    ],
  },
  behavioral_infant: {
    label: "영유아 행동문제",
    description: "PCIT(2~7세, d=1.65), Triple P Lv4",
    emIncreaseRate: 3, rapportDifficulty: 1.2, relapseChance: 0.1,
    emStartMin: 45, emStartMax: 70, unlockTurn: 75,
    initialParentInvolvement: 45,
    milestones: [
      { id: "follow_instruction", label: "지시 따르기", emThreshold: 70 },
      { id: "wait_turn", label: "순서 기다리기", emThreshold: 50 },
      { id: "express_emotion", label: "감정 표현", emThreshold: 30 },
    ],
  },
};

// ── 상담사 전공 매칭 ──
export interface InfantSpecialtyConfig {
  label: string;
  description: string;
  optimalIssues: InfantIssue[];
  supportiveIssues: InfantIssue[];
}

export const INFANT_SPECIALTY_CONFIG: Record<InfantSpecialty, InfantSpecialtyConfig> = {
  aba: {
    label: "응용행동분석",
    description: "ABA, EIBI, 포괄적 행동중재",
    optimalIssues: ["asd_early", "behavioral_infant"],
    supportiveIssues: ["dev_delay"],
  },
  developmental: {
    label: "발달놀이중재",
    description: "DIR/Floortime, ESDM",
    optimalIssues: ["dev_delay", "asd_early"],
    supportiveIssues: ["sensory", "speech_delay"],
  },
  attachment_therapy: {
    label: "애착중재",
    description: "COS-P, VIPP-SD, Watch Wait Wonder",
    optimalIssues: ["attachment"],
    supportiveIssues: ["behavioral_infant", "dev_delay"],
  },
  sensory_integration: {
    label: "감각통합치료",
    description: "Ayres SI, 감각처리 중재",
    optimalIssues: ["sensory"],
    supportiveIssues: ["asd_early", "dev_delay"],
  },
  speech_language: {
    label: "언어치료",
    description: "초기 언어중재, AAC, 부모매개 의사소통",
    optimalIssues: ["speech_delay"],
    supportiveIssues: ["asd_early", "dev_delay"],
  },
};

export const INFANT_MATCH_OPTIMAL = 1.4;
export const INFANT_MATCH_SUPPORTIVE = 1.15;
export const INFANT_MATCH_MISMATCH = 0.85;

export function getInfantMatchMultiplier(
  specialty: InfantSpecialty,
  issue: InfantIssue,
): number {
  const config = INFANT_SPECIALTY_CONFIG[specialty];
  if (config.optimalIssues.includes(issue)) return INFANT_MATCH_OPTIMAL;
  if (config.supportiveIssues.includes(issue)) return INFANT_MATCH_SUPPORTIVE;
  // dev_delay는 불일치 없음 (최소 ×1.0)
  if (issue === "dev_delay") return 1.0;
  return INFANT_MATCH_MISMATCH;
}

// ── 치료실 템플릿 ──
export interface InfantFacilityTemplate {
  label: string;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
  effect: string;
  synergySpecialties: InfantSpecialty[];
  bonusIssues: InfantIssue[];
  unlockTurn: number;
}

export const INFANT_FACILITY_TEMPLATES: Record<InfantFacilityType, InfantFacilityTemplate> = {
  infant_play: {
    label: "영유아 놀이실", buildCost: 100, upkeepPerTurn: 8, emReduction: 7,
    effect: "none", synergySpecialties: ["developmental", "attachment_therapy"],
    bonusIssues: [], unlockTurn: 61,
  },
  sensory_room: {
    label: "감각통합실", buildCost: 180, upkeepPerTurn: 15, emReduction: 9,
    effect: "issue_bonus", synergySpecialties: ["sensory_integration", "developmental"],
    bonusIssues: ["sensory", "asd_early", "dev_delay"], unlockTurn: 61,
  },
  parent_coaching: {
    label: "부모코칭실", buildCost: 120, upkeepPerTurn: 10, emReduction: 5,
    effect: "parent_boost", synergySpecialties: ["attachment_therapy", "aba"],
    bonusIssues: [], unlockTurn: 65,
  },
  language_lab: {
    label: "언어치료실", buildCost: 150, upkeepPerTurn: 12, emReduction: 8,
    effect: "issue_bonus", synergySpecialties: ["speech_language", "developmental"],
    bonusIssues: ["speech_delay"], unlockTurn: 70,
  },
  structured_teaching: {
    label: "구조화교실", buildCost: 200, upkeepPerTurn: 18, emReduction: 10,
    effect: "issue_bonus", synergySpecialties: ["aba"],
    bonusIssues: ["asd_early"], unlockTurn: 75,
  },
};

// ── 바우처 사업 설정 ──
export const VOUCHER_REFERRAL = {
  patientsPerTurn: 4,
  maxPatientsPerTurn: 6,
  incomePerSession: 3,
  stressChancePerPatient: 0.06, // 5~8% 중간값
  issueDistribution: {
    dev_delay: 0.30, speech_delay: 0.25, sensory: 0.20,
    asd_early: 0.15, behavioral_infant: 0.10,
  },
} as const;
