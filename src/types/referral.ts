export interface CommunityReferral {
  id: string;
  type: "wee_center" | "probation" | "voucher";
  active: boolean;
  acceptedTurn?: number;
  patientsPerTurn: number;
  maxPatientsPerTurn: number;
  incidentCount: number;
  paused: boolean;
  issueDistribution: Record<string, number>;
}

export type ParentStressSeverity = "concern" | "distress" | "conflict";

export interface ParentStress {
  id: string;
  patientId: string;
  severity: ParentStressSeverity;
  description: string;
  turnOccurred: number;
  resolved: boolean;
  resolvedBy?: "director" | "player" | "unresolved";
  conflictTurnsRemaining?: number; // 법적 분쟁 해결까지 남은 턴 (3턴)
}

/** 양육 스트레스 단계별 확률 분포 */
export const PARENT_STRESS_SEVERITY_WEIGHTS: Record<
  ParentStressSeverity,
  number
> = {
  concern: 0.7,
  distress: 0.25,
  conflict: 0.05,
};
