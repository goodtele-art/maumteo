import type { ChildFloorId } from "./floor.ts";

export type ChildFacilityType =
  | "play_room"
  | "parent_room"
  | "group_activity"
  | "exposure_child"
  | "nutrition_clinic"
  | "crisis_room";

export interface ChildFacility {
  id: string;
  type: ChildFacilityType;
  floorId: ChildFloorId;
  slotIndex: number;
  level: number;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
}
