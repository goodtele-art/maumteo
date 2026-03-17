import type { FloorId } from "./floor.ts";

export type FacilityType =
  | "individual_room"
  | "group_room"
  | "exposure_lab"
  | "mindfulness_room"
  | "family_room"
  | "activity_room";

export interface Facility {
  id: string;
  type: FacilityType;
  floorId: FloorId;
  slotIndex: number;
  level: number;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
}
