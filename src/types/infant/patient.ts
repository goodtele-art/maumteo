import type { InfantFloorId } from "./floor.ts";

export type InfantIssue =
  | "asd_early"
  | "dev_delay"
  | "attachment"
  | "sensory"
  | "speech_delay"
  | "behavioral_infant";

export interface MilestoneStatus {
  id: string;
  label: string;
  emThreshold: number;
  achieved: boolean;
  achievedTurn?: number;
}

export interface InfantPatient {
  id: string;
  name: string;
  age: number; // 개월 수 12~72
  em: number;
  dominantIssue: InfantIssue;
  currentFloorId: InfantFloorId;
  rapport: number;
  backstory: string;
  turnAdmitted: number;
  treatmentCount: number;
  parentInvolvement: number; // 0~100
  assessed: boolean; // 심리검사 완료 여부
  milestones: MilestoneStatus[];
  interventionStartTurn: number;
  referralSource: "voucher" | "walk_in";
}
