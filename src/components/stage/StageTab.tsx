import { useEffect, useCallback } from "react";
import { m } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import type { StageId } from "@/types/stage.ts";
import {
  CHILD_STAGE_OPEN_TURN,
  INFANT_STAGE_OPEN_TURN,
} from "@/lib/constants/crossStageConstants.ts";

interface StageTabInfo {
  id: StageId;
  label: string;
  shortcut: string;
  unlockTurn: number;
}

const STAGES: StageTabInfo[] = [
  { id: "adult", label: "성인센터", shortcut: "1", unlockTurn: 1 },
  { id: "child", label: "아동센터", shortcut: "2", unlockTurn: CHILD_STAGE_OPEN_TURN },
  { id: "infant", label: "영유아센터", shortcut: "3", unlockTurn: INFANT_STAGE_OPEN_TURN },
];

export default function StageTab() {
  const activeStage = useGameStore((s) => s.activeStage);
  const switchStage = useGameStore((s) => s.switchStage);
  const currentTurn = useGameStore((s) => s.currentTurn);

  const isUnlocked = useCallback(
    (stage: StageTabInfo) => currentTurn >= stage.unlockTurn,
    [currentTurn],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = ["1", "2", "3"].indexOf(e.key);
      if (idx >= 0) {
        const stage = STAGES[idx]!;
        if (currentTurn >= stage.unlockTurn) {
          switchStage(stage.id);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTurn, switchStage]);

  return (
    <nav
      className="flex gap-1 px-2 py-1.5 bg-surface-raised border-b border-theme-default"
      role="tablist"
      aria-label="센터 탭"
    >
      {STAGES.filter((stage) => isUnlocked(stage)).map((stage) => {
        const active = activeStage === stage.id;

        return (
          <button
            key={stage.id}
            role="tab"
            aria-selected={active}
            onClick={() => switchStage(stage.id)}
            className={`relative flex-1 text-xs font-medium py-2 px-2 rounded-md transition-colors ${
              active
                ? "text-theme-primary bg-surface-card"
                : "text-theme-secondary hover:text-theme-primary hover:bg-surface-card-hover"
            }`}
          >
            <span>{stage.label}</span>
            <kbd className="ml-1 text-[10px] px-1 py-0.5 rounded border border-theme-default text-theme-tertiary">
              {stage.shortcut}
            </kbd>
            {active && (
              <m.div
                layoutId="stage-tab-glow"
                className="absolute inset-0 rounded-md border border-theme-default shadow-glow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
