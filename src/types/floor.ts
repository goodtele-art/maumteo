export type FloorId =
  | "basement"
  | "diagnostic"
  | "counseling"
  | "insight"
  | "garden";

export interface FloorConfig {
  id: FloorId;
  label: string;
  icon: string;
  color: string;
  emRange: [number, number];
  unlockTurn: number;
}
