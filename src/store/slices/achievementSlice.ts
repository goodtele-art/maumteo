import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";

export interface AchievementSlice {
  unlockedAchievementIds: string[];
  apBonus: number;
  unlockAchievement: (id: string) => void;
  addApBonus: (amount: number) => void;
  setAchievements: (ids: string[], apBonus: number) => void;
}

export const createAchievementSlice: StateCreator<
  GameStore,
  [],
  [],
  AchievementSlice
> = (set) => ({
  unlockedAchievementIds: [],
  apBonus: 0,

  unlockAchievement: (id) =>
    set((s) => ({
      unlockedAchievementIds: s.unlockedAchievementIds.includes(id)
        ? s.unlockedAchievementIds
        : [...s.unlockedAchievementIds, id],
    })),

  addApBonus: (amount) =>
    set((s) => ({ apBonus: s.apBonus + amount })),

  setAchievements: (ids, apBonus) =>
    set({ unlockedAchievementIds: ids, apBonus }),
});
