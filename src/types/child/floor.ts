export type ChildFloorId =
  | "child_garden"
  | "child_comfort"
  | "child_care"
  | "child_intensive"
  | "child_shelter";

export interface ChildFloorConfig {
  id: ChildFloorId;
  label: string;
  icon: string;
  color: string;
  emRange: [number, number];
}
