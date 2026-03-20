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

/** 상담사 유휴/번아웃 턴 종료 처리 (공통 함수) */
function processCounselorTurnEnd(
  counselors: Record<string, { name: string; onLeave?: boolean; lastTreatmentTurn?: number; treatmentsThisTurn?: number; turnsOverworked?: number; [key: string]: unknown }>,
  currentTurn: number,
  notify: (msg: string, type: "info" | "warning") => void,
): { updated: typeof counselors; firedIds: string[] } {
  const updated = { ...counselors };
  const firedIds: string[] = [];

  for (const [id, c] of Object.entries(updated)) {
    const u = { ...c };

    // 기존 휴가 복귀 (번아웃 강제 휴가와 별개)
    if (u.onLeave) {
      u.onLeave = false;
    }

    // 번아웃: 이번 턴 3회 이상 상담 → 과로 누적
    const thisTurn = u.treatmentsThisTurn ?? 0;
    u.turnsOverworked = thisTurn >= 3 ? (u.turnsOverworked ?? 0) + 1 : 0;

    if (u.turnsOverworked === 3) {
      notify(`${u.name} 상담사가 과로 징후를 보입니다. 상담 배분을 조정해주세요.`, "warning");
    }
    if (u.turnsOverworked >= 5) {
      u.onLeave = true;
      u.turnsOverworked = 0;
      notify(`${u.name} 상담사가 번아웃으로 휴가를 냈습니다.`, "warning");
    }

    // 유휴: 7턴 무상담 → 퇴사
    const idleTurns = currentTurn - (u.lastTreatmentTurn ?? currentTurn);
    if (idleTurns >= 7) {
      firedIds.push(id);
      notify(`${u.name} 상담사가 7턴 동안 상담을 맡지 못하여 퇴사하고 길 건너 상담센터에 취업하였습니다.`, "warning");
    } else if (idleTurns >= 5) {
      notify(`${u.name} 상담사가 5턴 동안 상담을 맡지 못하여 의욕이 저하되었습니다.`, "info");
    }

    u.treatmentsThisTurn = 0;
    updated[id] = u;
  }
  for (const id of firedIds) delete updated[id];
  return { updated, firedIds };
}

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

    // 상담사 턴 종료 처리: 휴가 복귀 + 유휴/번아웃 체크
    const notify = (msg: string, type: "info" | "warning") => state.addNotification(msg, type);
    const { updated: counselors } = processCounselorTurnEnd(
      state.counselors as unknown as Record<string, Parameters<typeof processCounselorTurnEnd>[0][string]>,
      result.currentTurn,
      notify,
    );

    set({
      gold: result.gold,
      reputation: result.reputation,
      ap: result.ap,
      maxAp: result.maxAp,
      currentTurn: result.currentTurn,
      patients: result.patients,
      counselors: counselors as unknown as Record<string, import("@/types/counselor.ts").Counselor>,
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
      // 아동 상담사 유휴/번아웃 체크
      const { updated: childCounselors } = processCounselorTurnEnd(
        afterChildInit.childStage.counselors as unknown as Record<string, Parameters<typeof processCounselorTurnEnd>[0][string]>,
        result.currentTurn,
        notify,
      );
      const childCounselorCount = Object.keys(childCounselors).length;
      const childMaxAp = 5 + childCounselorCount;
      set({
        childStage: {
          ...afterChildInit.childStage,
          patients: updatedChildPatients,
          counselors: childCounselors as unknown as Record<string, import("@/types/child/counselor.ts").ChildCounselor>,
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
      // 영유아 상담사 유휴/번아웃 체크
      const { updated: infantCounselors } = processCounselorTurnEnd(
        afterInfantInit.infantStage.counselors as unknown as Record<string, Parameters<typeof processCounselorTurnEnd>[0][string]>,
        result.currentTurn,
        notify,
      );
      const infantCounselorCount = Object.keys(infantCounselors).length;
      const infantMaxAp = 5 + infantCounselorCount;
      set((s) => ({
        infantStage: s.infantStage ? {
          ...s.infantStage,
          patients: updatedInfantPatients,
          counselors: infantCounselors as unknown as Record<string, import("@/types/infant/counselor.ts").InfantCounselor>,
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
