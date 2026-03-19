import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { TurnLogEntry } from "@/types/index.ts";
import { processTurn } from "@/lib/engine/turn.ts";
import type { TurnResult } from "@/lib/engine/turn.ts";
import { processChildTurn } from "@/lib/engine/childTurn.ts";
import { processInfantTurn } from "@/lib/engine/infantTurn.ts";
import {
  CHILD_STAGE_OPEN_TURN,
  INFANT_STAGE_OPEN_TURN,
} from "@/lib/constants/crossStageConstants.ts";

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

    // ── Stage 2: 아동센터 초기화 및 턴 처리 ──
    const afterAdult = get();
    if (result.currentTurn >= CHILD_STAGE_OPEN_TURN && afterAdult.childStage === null) {
      afterAdult.initChildStage();
    }
    const afterChildInit = get();
    if (afterChildInit.childStage !== null) {
      const childResult = processChildTurn(
        afterChildInit.childStage,
        result.currentTurn,
        afterChildInit.childStage.director !== null,
      );
      // 종결된 내담자 제거, 나머지 업데이트
      const updatedChildPatients = { ...childResult.updatedPatients };
      for (const id of childResult.dischargedIds) {
        delete updatedChildPatients[id];
      }
      const childCounselorCount = Object.keys(afterChildInit.childStage.counselors).length;
      const childMaxAp = 5 + childCounselorCount;
      set({
        childStage: {
          ...afterChildInit.childStage,
          patients: updatedChildPatients,
          ap: childMaxAp,
          maxAp: childMaxAp,
        },
      });
    }

    // ── Stage 3: 영유아센터 초기화 및 턴 처리 ──
    const afterChild = get();
    if (result.currentTurn >= INFANT_STAGE_OPEN_TURN && afterChild.infantStage === null) {
      afterChild.initInfantStage();
    }
    const afterInfantInit = get();
    if (afterInfantInit.infantStage !== null) {
      const infantResult = processInfantTurn(
        afterInfantInit.infantStage,
        result.currentTurn,
        afterInfantInit.gold,
      );
      // 종결된 내담자 제거, 나머지 업데이트
      const updatedInfantPatients = { ...infantResult.updatedPatients };
      for (const id of infantResult.dischargedIds) {
        delete updatedInfantPatients[id];
      }
      const infantCounselorCount = Object.keys(afterInfantInit.infantStage.counselors).length;
      const infantMaxAp = 5 + infantCounselorCount;
      set((s) => ({
        infantStage: s.infantStage ? {
          ...s.infantStage,
          patients: updatedInfantPatients,
          parentStresses: infantResult.updatedStresses,
          ap: infantMaxAp,
          maxAp: infantMaxAp,
        } : null,
        gold: Math.max(0, s.gold - infantResult.goldCost),
      }));
    }

    return result;
  },

  setTurnState: (patch) => set(patch),
});
