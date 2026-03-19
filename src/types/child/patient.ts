import type { ChildFloorId } from "./floor.ts";

export type ChildIssue =
  | "child_anxiety"
  | "child_depression"
  | "adhd"
  | "behavior_regulation"
  | "child_trauma"
  | "child_ocd"
  | "eating_disorder"
  | "emotion_crisis";

export interface ChildPatient {
  id: string;
  name: string;
  age: number; // 7~17
  em: number;
  dominantIssue: ChildIssue;
  currentFloorId: ChildFloorId;
  rapport: number;
  backstory: string;
  turnAdmitted: number;
  treatmentCount: number;
  parentInvolvement: number; // 0~100
  schoolConsulted: boolean;
  assessed: boolean;
  referralSource: "wee_center" | "probation" | "walk_in";
  parentBurnoutCounter: number; // 3턴 연속 참여도 80+ 추적
  caseConferenceBoost?: boolean; // 사례회의 다음 턴 치료효과 +15%
}

/** 부모참여도 3단계 상태 (UI 표시용) */
export type ParentStatus = "active" | "normal" | "uncooperative";

export function getParentStatus(involvement: number): ParentStatus {
  if (involvement >= 60) return "active";
  if (involvement >= 30) return "normal";
  return "uncooperative";
}

/** 부모참여도에 따른 치료효과 배율 */
export function getParentMultiplier(
  involvement: number,
  issue: ChildIssue,
): number {
  const status = getParentStatus(involvement);
  if (status === "active") return 1.2;
  if (status === "normal") return 1.0;
  // 비협조
  if (issue === "adhd" || issue === "behavior_regulation") return 0.3;
  return 0.7;
}
