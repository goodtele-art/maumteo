/**
 * 슈퍼비전/사례회의 엔진 (순수 함수)
 * 상담실장의 핵심 역할
 */
import type { CenterDirector } from "@/types/staff/index.ts";
import { getDirectorResolveRate } from "@/types/staff/index.ts";
import {
  SUPERVISION_BONUS,
  CASE_CONFERENCE_BONUS,
  NO_SUPERVISION_PENALTY,
} from "@/lib/constants/crossStageConstants.ts";

/** 슈퍼비전 치료효과 보너스 */
export function getSupervisionMultiplier(director: CenterDirector | null): number {
  if (director) return 1 + SUPERVISION_BONUS;
  return 1 - NO_SUPERVISION_PENALTY;
}

/** 사례회의 효과: 가장 EM 높은 내담자 1~2명에 적용할 보너스 */
export function getCaseConferenceBonus(): number {
  return CASE_CONFERENCE_BONUS;
}

/** 사례회의 대상 선택: EM 기준 상위 2명 */
export function selectCaseConferenceTargets<
  T extends { id: string; em: number },
>(patients: T[]): string[] {
  return [...patients]
    .sort((a, b) => b.em - a.em)
    .slice(0, 2)
    .map(p => p.id);
}

/** 양육 스트레스 자동 해결 시도 */
export function tryAutoResolveStress(
  director: CenterDirector,
): boolean {
  const rate = getDirectorResolveRate(director.communicationSkill);
  return Math.random() < rate;
}
