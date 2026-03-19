export type InfantFacilityType =
  | "infant_play"
  | "sensory_room"
  | "parent_coaching"
  | "language_lab"
  | "structured_teaching";

export interface InfantFacility {
  id: string;
  type: InfantFacilityType;
  slotIndex: number;
  level: number;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
}
