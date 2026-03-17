import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { Facility, FacilityType, FloorId } from "@/types/index.ts";
import { FACILITY_TEMPLATES } from "@/lib/constants.ts";

export interface FacilitySlice {
  facilities: Record<string, Facility>;
  buildFacility: (floorId: FloorId, type: FacilityType, slotIndex: number) => string;
  upgradeFacility: (id: string) => void;
  setFacilities: (facilities: Record<string, Facility>) => void;
}

function nextFacilityId(facilities: Record<string, Facility>): string {
  let max = 0;
  for (const id of Object.keys(facilities)) {
    const n = parseInt(id.replace("f_", ""), 10);
    if (n > max) max = n;
  }
  return `f_${max + 1}`;
}

export const createFacilitySlice: StateCreator<
  GameStore,
  [],
  [],
  FacilitySlice
> = (set, get) => ({
  facilities: {},

  buildFacility: (floorId, type, slotIndex) => {
    const template = FACILITY_TEMPLATES[type];
    const id = nextFacilityId(get().facilities);
    const facility: Facility = {
      id,
      type,
      floorId,
      slotIndex,
      level: 1,
      buildCost: template.buildCost,
      upkeepPerTurn: template.upkeepPerTurn,
      emReduction: template.emReduction,
    };
    set((s) => ({
      facilities: { ...s.facilities, [id]: facility },
    }));
    return id;
  },

  upgradeFacility: (id) =>
    set((s) => {
      const facility = s.facilities[id];
      if (!facility || facility.level >= 3) return s;
      return {
        facilities: {
          ...s.facilities,
          [id]: {
            ...facility,
            level: facility.level + 1,
            emReduction: Math.round(facility.emReduction * 1.3),
            upkeepPerTurn: Math.round(facility.upkeepPerTurn * 1.2),
          },
        },
      };
    }),

  setFacilities: (facilities) => set({ facilities }),
});
