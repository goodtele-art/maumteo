import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { ParentStress } from "@/types/referral.ts";
import {
  createWeeReferral,
  createProbationReferral,
  createVoucherReferral,
} from "@/lib/engine/referralEngine.ts";

export interface ReferralSlice {
  acceptWeeCenter: (turn: number) => void;
  acceptProbation: (turn: number) => void;
  acceptVoucher: (turn: number) => void;
  pauseReferral: (stage: "child" | "infant") => void;
  resumeReferral: (stage: "child" | "infant") => void;
  addParentStress: (stress: ParentStress) => void;
  resolveParentStress: (stressId: string, resolvedBy: "director" | "player") => void;
}

export const createReferralSlice: StateCreator<
  GameStore,
  [],
  [],
  ReferralSlice
> = (set) => ({
  acceptWeeCenter: (turn) =>
    set((state) => {
      if (!state.childStage || state.childStage.referral !== null) return {};
      return {
        childStage: {
          ...state.childStage,
          referral: createWeeReferral(turn),
        },
      };
    }),

  acceptProbation: (turn) =>
    set((state) => {
      if (!state.childStage || state.childStage.referral !== null) return {};
      return {
        childStage: {
          ...state.childStage,
          referral: createProbationReferral(turn),
        },
      };
    }),

  acceptVoucher: (turn) =>
    set((state) => {
      if (!state.infantStage) return {};
      return {
        infantStage: {
          ...state.infantStage,
          voucherReferral: createVoucherReferral(turn),
        },
      };
    }),

  pauseReferral: (stage) =>
    set((state) => {
      if (stage === "child" && state.childStage?.referral) {
        return {
          childStage: {
            ...state.childStage,
            referral: { ...state.childStage.referral, paused: true },
          },
        };
      }
      if (stage === "infant" && state.infantStage?.voucherReferral) {
        return {
          infantStage: {
            ...state.infantStage,
            voucherReferral: { ...state.infantStage.voucherReferral, paused: true },
          },
        };
      }
      return {};
    }),

  resumeReferral: (stage) =>
    set((state) => {
      if (stage === "child" && state.childStage?.referral) {
        return {
          childStage: {
            ...state.childStage,
            referral: { ...state.childStage.referral, paused: false },
          },
        };
      }
      if (stage === "infant" && state.infantStage?.voucherReferral) {
        return {
          infantStage: {
            ...state.infantStage,
            voucherReferral: { ...state.infantStage.voucherReferral, paused: false },
          },
        };
      }
      return {};
    }),

  addParentStress: (stress) =>
    set((state) => {
      if (!state.infantStage) return {};
      return {
        infantStage: {
          ...state.infantStage,
          parentStresses: [...state.infantStage.parentStresses, stress],
        },
      };
    }),

  resolveParentStress: (stressId, resolvedBy) =>
    set((state) => {
      if (!state.infantStage) return {};
      return {
        infantStage: {
          ...state.infantStage,
          parentStresses: state.infantStage.parentStresses.map((s) =>
            s.id === stressId ? { ...s, resolved: true, resolvedBy } : s,
          ),
        },
      };
    }),
});
