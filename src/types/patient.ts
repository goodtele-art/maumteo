import type { FloorId } from "./floor.ts";

export type DominantIssue =
  | "depression"
  | "anxiety"
  | "trauma"
  | "obsession"
  | "personality"
  | "addiction"
  | "relationship"
  | "psychosis";

export interface Patient {
  id: string;
  name: string;
  em: number;
  dominantIssue: DominantIssue;
  currentFloorId: FloorId;
  rapport: number;
  backstory: string;
  turnAdmitted: number;
  treatmentCount: number;
}
