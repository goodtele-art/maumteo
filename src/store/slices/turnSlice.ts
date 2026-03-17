import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { TurnLogEntry } from "@/types/index.ts";
import { processTurn } from "@/lib/engine/turn.ts";
import type { TurnResult } from "@/lib/engine/turn.ts";

export interface TurnSlice {
  currentTurn: number;
  turnLog: TurnLogEntry[];
  advanceTurn: () => TurnResult;
  setTurnState: (patch: { currentTurn: number; turnLog: TurnLogEntry[] }) => void;
}

export const createTurnSlice: StateCreator<
  GameStore,
  [],
  [],
  TurnSlice
> = (set, get) => ({
  currentTurn: 1,
  turnLog: [],

  advanceTurn: () => {
    const state = get();
    const result = processTurn(state);

    // 휴가 중인 상담사 복귀
    const counselors = { ...state.counselors };
    for (const [id, c] of Object.entries(counselors)) {
      if (c.onLeave) {
        counselors[id] = { ...c, onLeave: false };
      }
    }

    set({
      gold: result.gold,
      reputation: result.reputation,
      ap: result.ap,
      maxAp: result.maxAp,
      currentTurn: result.currentTurn,
      patients: result.patients,
      counselors,
      turnLog: result.turnLog,
    });

    return result;
  },

  setTurnState: (patch) => set(patch),
});
