/**
 * 영유아발달센터 전용 엔진 함수 (순수 함수)
 * - 발달이정표, 조기개입 타이머, 부모매개 중재 보정
 */
import type { InfantPatient } from "@/types/infant/patient.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";
import type { InfantFloorId } from "@/types/infant/floor.ts";
import { clampEM } from "./em.ts";
import {
  INFANT_EM_INCREASE_BASE,
  INFANT_EM_INCREASE_VARIANCE,
  INFANT_DISCHARGE_THRESHOLD,
  INFANT_DISCHARGE_ALL_MILESTONES,
  INFANT_PARENT_DECAY,
  INFANT_ISSUE_CONFIG,
  getInfantMatchMultiplier,
  INFANT_FLOORS,
  GOLDEN_TIME_TURNS,
  GOLDEN_TIME_EM_TARGET,
  GOLDEN_TIME_PENALTY_PER_TURN,
  GOLDEN_TIME_MAX_PENALTY,
} from "@/lib/constants/infantConstants.ts";
import {
  ASSESSMENT_MULTIPLIER,
  SUPERVISION_BONUS,
  NO_SUPERVISION_PENALTY,
} from "@/lib/constants/crossStageConstants.ts";

/** 부모참여도 자연 감소 */
export function decayInfantParentInvolvement(
  current: number,
  hasDirector: boolean,
  hasParentCoaching: boolean,
): number {
  // 기본 -3, 상담실장 OR 부모코칭실 중 최대 효과 하나만 적용 (스택 불가)
  // 상담실장: -3 → -1, 부모코칭실: -3 → -1, 둘 다: -3 → -1 (최소 1)
  let decay = INFANT_PARENT_DECAY;
  if (hasDirector || hasParentCoaching) decay = 1;
  return Math.max(0, Math.min(100, current - decay));
}

/** 부모코칭 세션 효과 */
export function applyParentCoaching(
  current: number,
  hasParentCoachingRoom: boolean,
): number {
  const gain = hasParentCoachingRoom ? 30 : 20;
  return Math.max(0, Math.min(100, current + gain));
}

/** EM 자연증가 */
export function calcInfantEmIncrease(patient: InfantPatient): number {
  const issueConfig = INFANT_ISSUE_CONFIG[patient.dominantIssue];
  const base = INFANT_EM_INCREASE_BASE + Math.floor(Math.random() * (INFANT_EM_INCREASE_VARIANCE + 1));
  return base + issueConfig.emIncreaseRate;
}

/** 부모매개 중재 치료효과 계산 */
export function calcInfantTreatmentMultiplier(
  specialty: InfantSpecialty,
  patient: InfantPatient,
  hasDirector: boolean,
): number {
  // 전공-문제 매칭
  let multiplier = getInfantMatchMultiplier(specialty, patient.dominantIssue);

  // 부모매개: 치료효과 = 기본 × (참여도/100)
  multiplier *= (patient.parentInvolvement / 100);

  // 심리검사 보너스
  if (patient.assessed) {
    multiplier *= ASSESSMENT_MULTIPLIER;
  }

  // 슈퍼비전 효과
  if (hasDirector) {
    multiplier *= (1 + SUPERVISION_BONUS);
  } else {
    multiplier *= (1 - NO_SUPERVISION_PENALTY);
  }

  // 골든타임 페널티
  const goldenPenalty = calcGoldenTimePenalty(patient);
  multiplier *= (1 - goldenPenalty);

  return Math.max(0, multiplier);
}

/** 골든타임 페널티 계산 */
export function calcGoldenTimePenalty(patient: InfantPatient): number {
  const turnsSinceAdmission = patient.treatmentCount; // 간접 추적

  // 아직 골든타임 내라면 페널티 없음
  if (patient.em <= GOLDEN_TIME_EM_TARGET) return 0;

  // interventionStartTurn에서 GOLDEN_TIME_TURNS 이후부터 페널티 적용
  const currentTurnEstimate = patient.turnAdmitted + turnsSinceAdmission;
  const deadline = patient.interventionStartTurn + GOLDEN_TIME_TURNS;
  if (currentTurnEstimate <= deadline) return 0;

  const overdueTurns = currentTurnEstimate - deadline;
  return Math.min(overdueTurns * GOLDEN_TIME_PENALTY_PER_TURN, GOLDEN_TIME_MAX_PENALTY);
}

/** 골든타임 확보 여부 */
export function isGoldenTimeSecured(patient: InfantPatient): boolean {
  return patient.em <= GOLDEN_TIME_EM_TARGET;
}

/** 종결 가능 여부 */
export function checkInfantDischarge(patient: InfantPatient): boolean {
  const allMilestones = patient.milestones.every(m => m.achieved);
  const threshold = allMilestones
    ? INFANT_DISCHARGE_ALL_MILESTONES
    : INFANT_DISCHARGE_THRESHOLD;
  return patient.em <= threshold;
}

/** EM에 따른 영유아센터 층 결정 */
export function getInfantFloorForEM(em: number): InfantFloorId {
  const clamped = clampEM(em);
  for (const floor of INFANT_FLOORS) {
    if (clamped >= floor.emRange[0] && clamped <= floor.emRange[1]) {
      return floor.id;
    }
  }
  return "infant_care";
}
