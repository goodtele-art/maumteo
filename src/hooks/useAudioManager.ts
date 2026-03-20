/**
 * BGM/환경음 자동 전환 훅
 * - activeStage 변경 시 BGM 자동 전환
 * - selectedFloor 변경 시 환경음 자동 전환
 * - 파일이 없으면 조용히 실패 (graceful degradation)
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

export function useAudioManager(): void {
  const activeStage = useGameStore((s) => s.activeStage);
  const selectedFloor = useGameStore((s) => s.selectedFloorId);
  const childFloor = useGameStore((s) => s.childStage?.selectedFloorId);
  const infantFloor = useGameStore((s) => s.infantStage?.selectedFloorId);
  const gameOver = useGameStore((s) => s.currentTurn <= 0);
  const prevStage = useRef<StageId | null>(null);

  // BGM: 센터 전환 시 자동 변경
  useEffect(() => {
    if (gameOver) { stopBgm(); return; }
    if (activeStage === prevStage.current) return;
    prevStage.current = activeStage;
    const track = STAGE_BGM[activeStage];
    if (track) playBgm(track);
  }, [activeStage, gameOver]);

  // 환경음: 층 전환 시 자동 변경
  useEffect(() => {
    const floor = activeStage === "child" ? childFloor
      : activeStage === "infant" ? infantFloor
      : selectedFloor;
    if (!floor) { stopAmbient(); return; }
    const track = FLOOR_AMBIENT[floor];
    if (track) playAmbient(track);
  }, [activeStage, selectedFloor, childFloor, infantFloor]);
}
