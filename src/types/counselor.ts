export type CounselorSpecialty =
  | "cbt"
  | "psychodynamic"
  | "interpersonal"
  | "dbt"
  | "trauma_focused"
  | "family_systemic";

export interface Counselor {
  id: string;
  name: string;
  specialty: CounselorSpecialty;
  skill: number;
  salary: number;
  assignedPatientId: string | null;
  treatmentCount: number;
  /** 특별 휴가 중 (다음 턴 상담 불가, 턴 종료 시 자동 복귀) */
  onLeave?: boolean;
  /** 마지막으로 상담을 수행한 턴 (유휴 추적) */
  lastTreatmentTurn?: number;
  /** 이번 턴 상담 횟수 (턴 종료 시 리셋) */
  treatmentsThisTurn?: number;
  /** 연속 과로 턴 수 (턴당 3회 이상 상담 시 +1) */
  turnsOverworked?: number;
}
