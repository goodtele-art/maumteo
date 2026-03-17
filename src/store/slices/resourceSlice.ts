import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import { INITIAL_GOLD, INITIAL_REPUTATION, AP_BASE } from "@/lib/constants.ts";

export interface ResourceSlice {
  gold: number;
  reputation: number;
  ap: number;
  maxAp: number;
  spendGold: (amount: number) => void;
  earnGold: (amount: number) => void;
  spendAP: (amount: number) => boolean;
  resetAP: (maxAp: number) => void;
  addReputation: (amount: number) => void;
  setResources: (patch: Partial<Pick<ResourceSlice, "gold" | "reputation" | "ap" | "maxAp">>) => void;
}

export const createResourceSlice: StateCreator<
  GameStore,
  [],
  [],
  ResourceSlice
> = (set, get) => ({
  gold: INITIAL_GOLD,
  reputation: INITIAL_REPUTATION,
  ap: AP_BASE,
  maxAp: AP_BASE,

  spendGold: (amount) =>
    set((s) => ({ gold: Math.max(0, s.gold - amount) })),

  earnGold: (amount) =>
    set((s) => ({ gold: s.gold + amount })),

  spendAP: (amount) => {
    if (get().ap < amount) return false;
    set((s) => ({ ap: s.ap - amount }));
    return true;
  },

  resetAP: (maxAp) =>
    set({ ap: maxAp, maxAp }),

  addReputation: (amount) =>
    set((s) => ({ reputation: s.reputation + amount })),

  setResources: (patch) => set(patch),
});
