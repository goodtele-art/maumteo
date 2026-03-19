import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { StageId, ChildStageState, InfantStageState } from "@/types/stage.ts";
import type { ChildFloorId } from "@/types/child/floor.ts";
import type { InfantFloorId } from "@/types/infant/floor.ts";

export interface StageSlice {
  activeStage: StageId;
  childStage: ChildStageState | null;
  infantStage: InfantStageState | null;
  switchStage: (stage: StageId) => void;
  initChildStage: () => void;
  initInfantStage: () => void;
}

export const createStageSlice: StateCreator<GameStore, [], [], StageSlice> = (
  set,
) => ({
  activeStage: "adult" as StageId,
  childStage: null,
  infantStage: null,

  switchStage: (stage) => set({ activeStage: stage }),

  initChildStage: () =>
    set({
      childStage: {
        ap: 5,
        maxAp: 5,
        patients: {},
        facilities: {},
        counselors: {},
        psychologists: {},
        director: null,
        viceDirector: null,
        referral: null,
        specialization: null,
        selectedFloorId: "child_care" as ChildFloorId,
      },
    }),

  initInfantStage: () =>
    set({
      infantStage: {
        ap: 5,
        maxAp: 5,
        patients: {},
        facilities: {},
        counselors: {},
        psychologists: {},
        director: null,
        voucherReferral: null,
        parentStresses: [],
        selectedFloorId: "infant_care" as InfantFloorId,
      },
    }),
});
