export type InfantFloorId =
  | "infant_bloom"
  | "infant_nurture"
  | "infant_care"
  | "infant_cocoon";

export interface InfantFloorConfig {
  id: InfantFloorId;
  label: string;
  icon: string;
  color: string;
  emRange: [number, number];
}
