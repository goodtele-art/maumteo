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
}
