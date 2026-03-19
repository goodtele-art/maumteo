/**
 * 심리검사(종합심리평가) 엔진 (순수 함수)
 */
import type { ClinicalPsychologist } from "@/types/staff/index.ts";
import { getMaxAssessments } from "@/types/staff/index.ts";
import {
  ASSESSMENT_MULTIPLIER,
  ASSESSMENT_CBT_BONUS,
} from "@/lib/constants/crossStageConstants.ts";

/** 이번 턴 추가 검사 가능 여부 */
export function canAssess(psychologist: ClinicalPsychologist): boolean {
  return psychologist.assessmentsThisTurn < psychologist.maxAssessments;
}

/** 검사 실시 후 상태 업데이트 */
export function performAssessment(
  psychologist: ClinicalPsychologist,
): ClinicalPsychologist {
  return {
    ...psychologist,
    assessmentsThisTurn: psychologist.assessmentsThisTurn + 1,
  };
}

/** 턴 시작 시 검사 횟수 리셋 */
export function resetAssessments(
  psychologist: ClinicalPsychologist,
): ClinicalPsychologist {
  return {
    ...psychologist,
    assessmentsThisTurn: 0,
    maxAssessments: getMaxAssessments(psychologist.skill),
  };
}

/** assessed 상태에 따른 치료효과 배율 */
export function getAssessmentMultiplier(assessed: boolean): number {
  return assessed ? ASSESSMENT_MULTIPLIER : 1.0;
}

/** CBT 보조 추가 배율 (assessed + child_cbt 전공일 때) */
export function getCbtAssistBonus(assessed: boolean, isCbt: boolean): number {
  if (assessed && isCbt) return 1 + ASSESSMENT_CBT_BONUS;
  return 1.0;
}
