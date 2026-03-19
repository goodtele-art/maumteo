import type { StageId } from "@/types/stage.ts";

// ── 전체 턴 구조 (90턴) ──
export const STAGE_TURN_RANGES: Record<StageId, { start: number; end: number }> = {
  adult: { start: 1, end: 30 },
  child: { start: 31, end: 60 },
  infant: { start: 61, end: 90 },
};

// ── 센터 오픈 턴 ──
export const CHILD_STAGE_OPEN_TURN = 31;
export const INFANT_STAGE_OPEN_TURN = 61;

// ── 평판 등급 (S등급 추가) ──
export interface ExtendedReputationGrade {
  grade: string;
  label: string;
  min: number;
  max: number;
  patientBonus: number;
}

export const EXTENDED_REPUTATION_GRADES: ExtendedReputationGrade[] = [
  { grade: "F", label: "무명 상담소",     min: 0,  max: 19, patientBonus: -1 },
  { grade: "D", label: "동네 치료실",     min: 20, max: 39, patientBonus: 0 },
  { grade: "C", label: "지역 상담센터",   min: 40, max: 59, patientBonus: 1 },
  { grade: "B", label: "유명 치유센터",   min: 60, max: 79, patientBonus: 1 },
  { grade: "A", label: "마음의 등대",     min: 80, max: 89, patientBonus: 2 },
  { grade: "S", label: "통합발달치유원",  min: 90, max: 100, patientBonus: 3 },
];

export function getExtendedReputationGrade(
  reputation: number,
): ExtendedReputationGrade {
  const clamped = Math.max(0, Math.min(100, reputation));
  for (const g of EXTENDED_REPUTATION_GRADES) {
    if (clamped >= g.min && clamped <= g.max) return g;
  }
  return EXTENDED_REPUTATION_GRADES[0]!;
}

// ── 센터별 운영비 (기생 전략 방지) ──
export const CENTER_UPKEEP: Record<StageId, number> = {
  adult: 0,    // 성인은 기존 그대로
  child: 30,
  infant: 25,
};

// ── 연구 시너지 ──
export const RESEARCH_SYNERGY_BONUS = 0.1; // 3개 센터 동시 운영 → +10%

// ── 가족 연계 ──
export const FAMILY_LINK_PARENT_BOOST = 10; // 성인 내담자가 아동 부모 → 참여도 +10

// ── 법적 분쟁 ──
export const CONFLICT_RESOLUTION_TURNS = 3;  // 법적 분쟁 해결 소요 턴
export const CONFLICT_COST_PER_TURN = 50;    // 매 턴 법률 비용

// ── 부센터장 해금 턴 ──
export const VICE_DIRECTOR_UNLOCK_ADULT = 40;
export const VICE_DIRECTOR_UNLOCK_CHILD = 70;

// ── 엔딩 분기 ──
export const ENDING_A_TURN = 60;
export const ENDING_S_TURN = 90;

// ── 위기 시 도움 정보 ──
export const CRISIS_HELP_INFO = {
  suicidePrevention: "자살예방상담전화 1393",
  mentalHealthCrisis: "정신건강위기상담전화 1577-0199",
  message: "힘든 상황이라면 전문가의 도움을 받으세요.",
} as const;

// ── 슈퍼비전/사례회의 효과 ──
export const SUPERVISION_BONUS = 0.10;           // +10% 치료효과
export const CASE_CONFERENCE_BONUS = 0.15;       // +15% 다음 턴 치료효과
export const NO_SUPERVISION_PENALTY = 0.15;      // -15% 치료효과

// ── 심리검사 효과 ──
export const ASSESSMENT_MULTIPLIER = 1.5;        // 검사 완료 후 치료효과 ×1.5
export const ASSESSMENT_CBT_BONUS = 0.20;        // CBT 보조 추가 +20%
