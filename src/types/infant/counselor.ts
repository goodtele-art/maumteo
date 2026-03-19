export type InfantSpecialty =
  | "aba"
  | "developmental"
  | "attachment_therapy"
  | "sensory_integration"
  | "speech_language";

export interface InfantCounselor {
  id: string;
  name: string;
  specialty: InfantSpecialty;
  skill: number;
  salary: number;
  assignedPatientId: string | null;
  treatmentCount: number;
  onLeave?: boolean;
}
