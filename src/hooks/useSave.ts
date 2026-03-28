import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { serialize, deserialize } from "@/lib/engine/save.ts";
import { generatePatient } from "@/lib/engine/patient.ts";
import {
  SAVE_KEY,
  INITIAL_GOLD,
  INITIAL_REPUTATION,
} from "@/lib/constants.ts";
import { INITIAL_LIFETIME_STATS } from "@/store/slices/lifetimeStatsSlice.ts";

function initNewGame(): void {
  const s = useGameStore.getState();
  // 튜토리얼 시작: AP 1, 상담사 0명, 시설 0개, 내담자 1명(불안)
  s.setResources({ gold: INITIAL_GOLD, reputation: INITIAL_REPUTATION, ap: 1, maxAp: 1 });
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

  // LifetimeStats / ActionStats / EventChoiceHistory 초기화
  s.resetLifetimeStats();
  useGameStore.setState({
    actionStats: {
      treatCount: 0, encourageCount: 0,
      treatOptimalCount: 0, treatSubCount: 0, treatMismatchCount: 0,
      buildCount: 0, upgradeCount: 0,
    },
    eventChoiceHistory: [],
  });

  // 초기 내담자 1명 (불안 강제 배정)
  const p1 = generatePatient(1, 1, "anxiety");
  // 튜토리얼 1턴: EM을 심리치료센터 범위(36~60)로 고정
  if (p1.em > 60) p1.em = 55;
  if (p1.em < 36) p1.em = 45;
  p1.currentFloorId = "counseling";
  s.addPatient(p1);
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
        // Stage 2-3 복원 (v1 세이브는 기본값, 누락 필드 보정)
        activeStage: data.activeStage ?? "adult",
        childStage: data.childStage ? {
          ...data.childStage,
          psychologists: data.childStage.psychologists ?? {},
          viceDirector: data.childStage.viceDirector ?? null,
        } : null,
        infantStage: data.infantStage ? {
          ...data.infantStage,
          psychologists: data.infantStage.psychologists ?? {},
        } : null,
        viceDirector: data.viceDirector ?? null,
        specialLetters: data.specialLetters ?? [],
        // DNA 리포트 통계 복원
        lifetimeStats: data.lifetimeStats ?? { ...INITIAL_LIFETIME_STATS, issueDischarges: {} },
        actionStats: data.actionStats ?? {
          treatCount: 0, encourageCount: 0,
          treatOptimalCount: 0, treatSubCount: 0, treatMismatchCount: 0,
          buildCount: 0, upgradeCount: 0,
        },
        eventChoiceHistory: data.eventChoiceHistory ?? [],
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
