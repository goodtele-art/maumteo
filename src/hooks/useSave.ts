import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { serialize, deserialize } from "@/lib/engine/save.ts";
import { generatePatient } from "@/lib/engine/patient.ts";
import {
  SAVE_KEY,
  INITIAL_GOLD,
  INITIAL_REPUTATION,
  AP_BASE,
} from "@/lib/constants.ts";

function initNewGame(): void {
  const s = useGameStore.getState();
  s.setResources({ gold: INITIAL_GOLD, reputation: INITIAL_REPUTATION, ap: AP_BASE, maxAp: AP_BASE });
  s.setPatients({});
  s.setFacilities({});
  s.setCounselors({});
  s.setTurnState({ currentTurn: 1, turnLog: [] });
  s.selectFloor("counseling");
  s.closeModal();

  // Stage 2-3 초기화
  useGameStore.setState({
    activeStage: "adult",
    childStage: null,
    infantStage: null,
  });

  const p1 = generatePatient(1, 1);
  const p2 = generatePatient(1, 2);
  s.addPatient(p1);
  s.addPatient(p2);
  s.hireCounselor("김마음", "cbt", 3, 25);
  s.buildFacility("individual_room", 0);
}

export function useSave() {
  const save = useCallback((): boolean => {
    try {
      const state = useGameStore.getState();
      const data = serialize(state);
      localStorage.setItem(SAVE_KEY, data);
      return true;
    } catch {
      useGameStore.getState().addNotification("저장 실패 — 저장 공간이 부족합니다", "warning");
      return false;
    }
  }, []);

  const load = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = deserialize(raw);
      if (!data) {
        localStorage.removeItem(SAVE_KEY);
        return false;
      }

      useGameStore.setState({
        currentTurn: data.currentTurn,
        gold: data.gold,
        reputation: data.reputation,
        ap: data.ap,
        maxAp: data.maxAp,
        patients: data.patients,
        facilities: data.facilities,
        counselors: data.counselors,
        turnLog: data.turnLog,
        // Stage 2-3 복원 (v1 세이브는 기본값)
        activeStage: data.activeStage ?? "adult",
        childStage: data.childStage ?? null,
        infantStage: data.infantStage ?? null,
      });

      return true;
    } catch {
      localStorage.removeItem(SAVE_KEY);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    initNewGame();
  }, []);

  const hasSave = useCallback((): boolean => {
    return localStorage.getItem(SAVE_KEY) !== null;
  }, []);

  return { save, load, reset, hasSave, initNewGame };
}

export { initNewGame };
