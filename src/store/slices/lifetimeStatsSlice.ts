import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";

export interface LifetimeStats {
  adultDischarges: number;
  adultAdmissions: number;
  adultIncidents: number;
  childDischarges: number;
  childAdmissions: number;
  childIncidents: number;
  infantDischarges: number;
  infantAdmissions: number;
  infantIncidents: number;
  totalGoldEarned: number;
  peakReputation: number;
  treatmentTurnSum: number;
  treatmentTurnCount: number;
  issueDischarges: Record<string, number>;
}

export const INITIAL_LIFETIME_STATS: LifetimeStats = {
  adultDischarges: 0,
  adultAdmissions: 0,
  adultIncidents: 0,
  childDischarges: 0,
  childAdmissions: 0,
  childIncidents: 0,
  infantDischarges: 0,
  infantAdmissions: 0,
  infantIncidents: 0,
  totalGoldEarned: 0,
  peakReputation: 0,
  treatmentTurnSum: 0,
  treatmentTurnCount: 0,
  issueDischarges: {},
};

export interface LifetimeStatsSlice {
  lifetimeStats: LifetimeStats;
  recordDischarge: (stage: "adult" | "child" | "infant", issue: string, treatmentTurns: number) => void;
  recordAdmission: (stage: "adult" | "child" | "infant") => void;
  recordIncident: (stage: "adult" | "child" | "infant") => void;
  recordIncome: (amount: number) => void;
  updatePeakReputation: (rep: number) => void;
  resetLifetimeStats: () => void;
}

export const createLifetimeStatsSlice: StateCreator<
  GameStore,
  [],
  [],
  LifetimeStatsSlice
> = (set) => ({
  lifetimeStats: { ...INITIAL_LIFETIME_STATS },

  recordDischarge: (stage, issue, treatmentTurns) =>
    set((s) => {
      const stats = { ...s.lifetimeStats };
      if (stage === "adult") stats.adultDischarges++;
      else if (stage === "child") stats.childDischarges++;
      else stats.infantDischarges++;
      stats.treatmentTurnSum += treatmentTurns;
      stats.treatmentTurnCount++;
      stats.issueDischarges = {
        ...stats.issueDischarges,
        [issue]: (stats.issueDischarges[issue] ?? 0) + 1,
      };
      return { lifetimeStats: stats };
    }),

  recordAdmission: (stage) =>
    set((s) => {
      const stats = { ...s.lifetimeStats };
      if (stage === "adult") stats.adultAdmissions++;
      else if (stage === "child") stats.childAdmissions++;
      else stats.infantAdmissions++;
      return { lifetimeStats: stats };
    }),

  recordIncident: (stage) =>
    set((s) => {
      const stats = { ...s.lifetimeStats };
      if (stage === "adult") stats.adultIncidents++;
      else if (stage === "child") stats.childIncidents++;
      else stats.infantIncidents++;
      return { lifetimeStats: stats };
    }),

  recordIncome: (amount) =>
    set((s) => ({
      lifetimeStats: {
        ...s.lifetimeStats,
        totalGoldEarned: s.lifetimeStats.totalGoldEarned + amount,
      },
    })),

  updatePeakReputation: (rep) =>
    set((s) => ({
      lifetimeStats: {
        ...s.lifetimeStats,
        peakReputation: Math.max(s.lifetimeStats.peakReputation, rep),
      },
    })),

  resetLifetimeStats: () =>
    set({ lifetimeStats: { ...INITIAL_LIFETIME_STATS, issueDischarges: {} } }),
});
