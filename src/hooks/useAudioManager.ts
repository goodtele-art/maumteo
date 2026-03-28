/**
 * BGM/환경음 자동 전환 훅
 * - 브라우저 오디오 정책: 유저 상호작용 전까지 오디오 호출 차단
 * - 첫 클릭/터치 후 BGM 시작, 이후 activeStage 변경 시 자동 전환
 * - MP3 파일 우선 → 없으면 절차적 합성 폴백
 */
import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { playBgm, playAmbient, stopBgm, stopAmbient } from "@/lib/audio.ts";
import type { StageId } from "@/types/stage.ts";

const STAGE_BGM: Record<StageId, string> = {
  adult: "adult_ambient.mp3",
  child: "child_playful.mp3",
  infant: "infant_gentle.mp3",
};

const FLOOR_AMBIENT: Record<string, string> = {
  // 성인
  garden: "garden_birds.mp3",
  insight: "office_calm.mp3",
  counseling: "office_calm.mp3",
  diagnostic: "rain_window.mp3",
  basement: "rain_window.mp3",
  // 아동
  child_garden: "nature_stream.mp3",
  child_comfort: "playground_indoor.mp3",
  child_care: "playground_indoor.mp3",
  child_intensive: "school_hallway.mp3",
  child_shelter: "school_hallway.mp3",
  // 영유아
  infant_bloom: "soft_chimes.mp3",
  infant_nurture: "music_box.mp3",
  infant_care: "music_box.mp3",
  infant_cocoon: "heartbeat_womb.mp3",
};

/** 유저가 페이지와 상호작용했는지 여부 */
let userHasInteracted = false;

export function useAudioManager(): void {
  const activeStage = useGameStore((s) => s.activeStage);
  const selectedFloor = useGameStore((s) => s.selectedFloorId);
  const childFloor = useGameStore((s) => s.childStage?.selectedFloorId);
  const infantFloor = useGameStore((s) => s.infantStage?.selectedFloorId);
  const gameOver = useGameStore((s) => s.currentTurn <= 0);
  const prevStage = useRef<StageId | null>(null);

  // 1) 첫 유저 상호작용 감지 → BGM 시작
  useEffect(() => {
    if (userHasInteracted) return;

    const onInteract = () => {
      if (userHasInteracted) return;
      userHasInteracted = true;
      document.removeEventListener("click", onInteract, true);
      document.removeEventListener("touchstart", onInteract, true);
      document.removeEventListener("keydown", onInteract, true);

      // 유저 상호작용 후 BGM 시작
      const state = useGameStore.getState();
      if (state.currentTurn <= 0) return;
      const track = STAGE_BGM[state.activeStage];
      if (track) {
        prevStage.current = state.activeStage;
        playBgm(track);
      }
    };

    document.addEventListener("click", onInteract, { capture: true });
    document.addEventListener("touchstart", onInteract, { capture: true });
    document.addEventListener("keydown", onInteract, { capture: true });

    return () => {
      document.removeEventListener("click", onInteract, true);
      document.removeEventListener("touchstart", onInteract, true);
      document.removeEventListener("keydown", onInteract, true);
    };
  }, []);

  // 2) 센터 전환 시 BGM 변경 (유저 상호작용 이후에만)
  useEffect(() => {
    if (!userHasInteracted) return;
    if (gameOver) { stopBgm(); return; }
    if (activeStage === prevStage.current) return;
    prevStage.current = activeStage;
    const track = STAGE_BGM[activeStage];
    if (track) playBgm(track);
  }, [activeStage, gameOver]);

  // 3) 환경음: 층 전환 시 자동 변경
  useEffect(() => {
    if (!userHasInteracted) return;
    const floor = activeStage === "child" ? childFloor
      : activeStage === "infant" ? infantFloor
      : selectedFloor;
    if (!floor) { stopAmbient(); return; }
    const track = FLOOR_AMBIENT[floor];
    if (track) playAmbient(track);
  }, [activeStage, selectedFloor, childFloor, infantFloor]);
}
