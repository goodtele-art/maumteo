import type { FloorId } from "@/types/index.ts";
import { FLOORS } from "@/lib/constants.ts";

export function getUnlockedFloors(currentTurn: number): FloorId[] {
  return FLOORS.filter((f) => f.unlockTurn <= currentTurn).map((f) => f.id);
}

export function isFloorUnlocked(
  floorId: FloorId,
  currentTurn: number,
): boolean {
  const floor = FLOORS.find((f) => f.id === floorId);
  if (!floor) return false;
  return floor.unlockTurn <= currentTurn;
}
