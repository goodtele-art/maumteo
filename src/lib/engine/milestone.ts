/**
 * 발달이정표 엔진 (순수 함수)
 * EM 기반 자동 달성: EM이 특정 구간 도달 시 순서대로 달성
 */
import type { MilestoneStatus } from "@/types/infant/patient.ts";
import type { InfantIssue } from "@/types/infant/patient.ts";
import { INFANT_ISSUE_CONFIG } from "@/lib/constants/infantConstants.ts";

/** 문제영역에 맞는 초기 이정표 생성 */
export function createMilestones(issue: InfantIssue): MilestoneStatus[] {
  const config = INFANT_ISSUE_CONFIG[issue];
  return config.milestones.map(m => ({
    id: m.id,
    label: m.label,
    emThreshold: m.emThreshold,
    achieved: false,
  }));
}

/**
 * 이정표 달성 체크 (EM 기반 자동 달성)
 * 순서대로만 달성 가능: 이전 이정표가 달성되어야 다음 이정표 달성
 * @returns 새로 달성된 이정표 목록 + 업데이트된 milestones 배열
 */
export function checkMilestones(
  milestones: MilestoneStatus[],
  currentEM: number,
  currentTurn: number,
): { updated: MilestoneStatus[]; newlyAchieved: MilestoneStatus[] } {
  const updated = milestones.map(m => ({ ...m }));
  const newlyAchieved: MilestoneStatus[] = [];

  for (const milestone of updated) {
    if (milestone.achieved) continue;
    if (currentEM <= milestone.emThreshold) {
      milestone.achieved = true;
      milestone.achievedTurn = currentTurn;
      newlyAchieved.push({ ...milestone });
    } else {
      break; // 순서대로만 달성
    }
  }

  return { updated, newlyAchieved };
}

/** 모든 이정표 달성 여부 */
export function allMilestonesAchieved(milestones: MilestoneStatus[]): boolean {
  return milestones.length > 0 && milestones.every(m => m.achieved);
}

/** 이정표 진행률 (0~1) */
export function getMilestoneProgress(milestones: MilestoneStatus[]): number {
  if (milestones.length === 0) return 0;
  const achieved = milestones.filter(m => m.achieved).length;
  return achieved / milestones.length;
}
