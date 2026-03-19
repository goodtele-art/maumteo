export type ChildSpecialty =
  | "child_cbt"
  | "play_therapy"
  | "parent_training"
  | "dbt_a"
  | "tf_cbt"
  | "family_therapy";

export interface ChildCounselor {
  id: string;
  name: string;
  specialty: ChildSpecialty;
  skill: number;
  salary: number;
  assignedPatientId: string | null;
  treatmentCount: number;
  onLeave?: boolean;
}
