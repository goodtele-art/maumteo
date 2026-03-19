/**
 * 아동청소년센터 전용 엔진 함수 (순수 함수)
 * - 부모참여도 감소, 학교자문 효과, 치료효과 보정
 */
import type { ChildPatient, ChildIssue } from "@/types/child/patient.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { ChildFloorId } from "@/types/child/floor.ts";
import { getParentMultiplier } from "@/types/child/patient.ts";
import { clampEM } from "./em.ts";
import {
  CHILD_PARENT_DECAY,
  CHILD_INCIDENT_THRESHOLD,
  CHILD_DISCHARGE_THRESHOLD,
  CHILD_DISCHARGE_ACTIVE_PARENT,
  CHILD_EM_INCREASE_BASE,
  CHILD_EM_INCREASE_VARIANCE,
  CHILD_ISSUE_CONFIG,
  getChildMatchMultiplier,
  CHILD_FLOORS,
  PLAY_THERAPY_RAPPORT_MULTIPLIER,
  PARENT_BURNOUT_THRESHOLD,
  PARENT_BURNOUT_TURNS,
  PARENT_BURNOUT_DECAY_PENALTY,
  SPECIALIZATION_TRAUMA_BONUS,
  SPECIALIZATION_TRAUMA_PENALTY,
  SPECIALIZATION_TRAUMA_ISSUES,
} from "@/lib/constants/childConstants.ts";
import {
  ASSESSMENT_MULTIPLIER,
  ASSESSMENT_CBT_BONUS,
  SUPERVISION_BONUS,
  NO_SUPERVISION_PENALTY,
} from "@/lib/constants/crossStageConstants.ts";

/** 부모참여도 자연 감소 (매 턴) */
export function decayParentInvolvement(
  current: number,
  hasDirector: boolean,
): number {
  const decay = hasDirector ? 1 : CHILD_PARENT_DECAY;
  return Math.max(0, Math.min(100, current - decay));
}

/** 부모면담 효과 */
export function applyParentInterview(
  current: number,
  hasParentRoom: boolean,
): number {
  const gain = hasParentRoom ? 15 : 8;
  return Math.max(0, Math.min(100, current + gain));
}

/** 학교자문 효과: EM 감소 보너스 배율 */
export function getSchoolConsultBonus(
  patient: ChildPatient,
): number {
  if (!patient.schoolConsulted) return 1.0;
  return 1.3; // +30%
}

/** 아동센터 EM 자연증가 계산 */
export function calcChildEmIncrease(patient: ChildPatient): number {
  const issueConfig = CHILD_ISSUE_CONFIG[patient.dominantIssue];
  const base = CHILD_EM_INCREASE_BASE + Math.floor(Math.random() * (CHILD_EM_INCREASE_VARIANCE + 1));
  const issueRate = issueConfig.emIncreaseRate;

  // ADHD + 학교자문: EM 자연증가 0
  if (patient.dominantIssue === "adhd" && patient.schoolConsulted) return 0;

  return base + issueRate;
}

/** 아동센터 치료효과 계산 (모든 보정 포함) */
export function calcChildTreatmentMultiplier(
  specialty: ChildSpecialty,
  patient: ChildPatient,
  hasDirector: boolean,
): number {
  // 전공-문제 매칭
  let multiplier = getChildMatchMultiplier(specialty, patient.dominantIssue);

  // 부모참여도 보정
  multiplier *= getParentMultiplier(patient.parentInvolvement, patient.dominantIssue);

  // 학교자문 보너스
  multiplier *= getSchoolConsultBonus(patient);

  // 심리검사 완료 보너스
  if (patient.assessed) {
    multiplier *= ASSESSMENT_MULTIPLIER;
    // CBT 보조 추가
    if (specialty === "child_cbt") {
      multiplier *= (1 + ASSESSMENT_CBT_BONUS);
    }
  }

  // 슈퍼비전 효과
  if (hasDirector) {
    multiplier *= (1 + SUPERVISION_BONUS);
  } else {
    multiplier *= (1 - NO_SUPERVISION_PENALTY);
  }

  // 놀이치료 라포 보너스는 별도 (라포 획득 시 적용)

  return multiplier;
}

/** 위기 발생 여부 (EM >= 90) */
export function checkChildIncident(em: number): boolean {
  return em >= CHILD_INCIDENT_THRESHOLD;
}

/** 종결 가능 여부 */
export function checkChildDischarge(
  em: number,
  parentInvolvement: number,
): boolean {
  const threshold = parentInvolvement >= 60
    ? CHILD_DISCHARGE_ACTIVE_PARENT
    : CHILD_DISCHARGE_THRESHOLD;
  return em <= threshold;
}

/** EM에 따른 아동센터 층 결정 */
export function getChildFloorForEM(em: number): ChildFloorId {
  const clamped = clampEM(em);
  for (const floor of CHILD_FLOORS) {
    if (clamped >= floor.emRange[0] && clamped <= floor.emRange[1]) {
      return floor.id;
    }
  }
  return "child_care";
}

/** 놀이치료 전공 라포 획득 배율 (고유효과 ×1.3) */
export function getPlayTherapyRapportMultiplier(
  specialty: ChildSpecialty,
): number {
  return specialty === "play_therapy" ? PLAY_THERAPY_RAPPORT_MULTIPLIER : 1.0;
}

/** 부모 번아웃 카운터 업데이트 (매 턴 호출) */
export function updateParentBurnout(
  patient: ChildPatient,
): { newCounter: number; isBurnout: boolean } {
  if (patient.parentInvolvement >= PARENT_BURNOUT_THRESHOLD) {
    const newCounter = patient.parentBurnoutCounter + 1;
    return {
      newCounter,
      isBurnout: newCounter >= PARENT_BURNOUT_TURNS,
    };
  }
  return { newCounter: 0, isBurnout: false };
}

/** 부모 번아웃 시 추가 감소량 */
export function getBurnoutDecay(): number {
  return PARENT_BURNOUT_DECAY_PENALTY;
}

/** 센터 특화 치료효과 배율 */
export function getSpecializationMultiplier(
  specialization: "trauma_focused" | "general" | null,
  issue: ChildIssue,
): number {
  if (!specialization) return 1.0;
  if (specialization === "trauma_focused") {
    if (SPECIALIZATION_TRAUMA_ISSUES.includes(issue)) {
      return 1 + SPECIALIZATION_TRAUMA_BONUS;
    }
    return 1 - SPECIALIZATION_TRAUMA_PENALTY;
  }
  return 1.0; // general: 균등 (건설 할인은 별도 처리)
}

/** 무단결석 판정 (보호관찰소 연계 내담자) */
export function isAbsent(patient: ChildPatient): boolean {
  if (patient.referralSource !== "probation") return false;
  return Math.random() < 0.3; // 30% 확률
}
