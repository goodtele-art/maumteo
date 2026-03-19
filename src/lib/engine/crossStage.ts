/**
 * Cross-Stage 상호작용 엔진 (순수 함수)
 * 센터 간 연계: 연구 시너지, 가족 연계, 골든타임
 */
import type { InfantPatient } from "@/types/infant/patient.ts";
import type { ChildPatient } from "@/types/child/patient.ts";
import {
  RESEARCH_SYNERGY_BONUS,
  FAMILY_LINK_PARENT_BOOST,
} from "@/lib/constants/crossStageConstants.ts";
import {
  GOLDEN_TIME_TURNS,
  GOLDEN_TIME_EM_TARGET,
} from "@/lib/constants/infantConstants.ts";

/**
 * 연구 시너지: 3개 센터 동시 운영 시 치료효과 +10%
 */
export function calcResearchSynergy(
  hasAdult: boolean,
  hasChild: boolean,
  hasInfant: boolean,
): number {
  if (hasAdult && hasChild && hasInfant) {
    return 1 + RESEARCH_SYNERGY_BONUS;
  }
  return 1.0;
}

/**
 * 가족 연계: 성인 내담자가 아동 내담자의 부모일 확률 10%
 * 해당 시 부모참여도 +10
 * @returns 참여도 부스트를 받은 아동 내담자 ID 목록
 */
export function checkFamilyLink(
  adultPatientCount: number,
  childPatients: ChildPatient[],
): string[] {
  if (adultPatientCount <= 0 || childPatients.length === 0) return [];

  const boostedIds: string[] = [];
  for (const child of childPatients) {
    // 성인 내담자 수에 비례하여 확률 증가 (내담자당 10%)
    const chance = Math.min(adultPatientCount * 0.1, 0.5);
    if (Math.random() < chance) {
      boostedIds.push(child.id);
    }
  }
  return boostedIds;
}

/** 가족 연계 부스트 값 */
export function getFamilyLinkBoost(): number {
  return FAMILY_LINK_PARENT_BOOST;
}

/**
 * 골든타임 남은 턴 계산
 * @returns 남은 턴 수, 또는 -1 (이미 확보됨)
 */
export function getGoldenTimeRemaining(
  patient: InfantPatient,
  currentTurn: number,
): number {
  // EM이 목표 이하면 이미 확보
  if (patient.em <= GOLDEN_TIME_EM_TARGET) return -1;

  const deadline = patient.interventionStartTurn + GOLDEN_TIME_TURNS;
  const remaining = deadline - currentTurn;
  return Math.max(0, remaining);
}
