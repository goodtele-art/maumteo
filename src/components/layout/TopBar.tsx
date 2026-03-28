import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import LetterCollection from "@/components/shared/LetterCollection.tsx";
import ResourceDisplay from "@/components/shared/ResourceDisplay.tsx";
import ThemeToggle from "@/components/shared/ThemeToggle.tsx";
import { IconMenu, IconGold } from "@/components/shared/GameIcons.tsx";
import { getReputationGrade } from "@/lib/constants.ts";
import { getTutorialConfig } from "@/lib/tutorialConfig.ts";
import {
  getAudioSettings, toggleBgm, toggleSfx, toggleAmbient, saveAudioSettings,
  stopBgm, stopAmbient,
} from "@/lib/audio.ts";
import { stopProceduralBgm } from "@/lib/proceduralBgm.ts";
import type { ThemeMode } from "@/hooks/useTheme.ts";

function MuteToggle() {
  const [muted, setMuted] = useState(() => {
    const s = getAudioSettings();
    return !s.bgmEnabled && !s.sfxEnabled && !s.ambientEnabled;
  });

  const toggle = useCallback(() => {
    const next = !muted;
    if (next) {
      // 전체 음소거
      toggleBgm(false);
      toggleSfx(false);
      toggleAmbient(false);
      stopBgm();
      stopProceduralBgm();
      stopAmbient();
    } else {
      // 음소거 해제
      toggleBgm(true);
      toggleSfx(true);
      toggleAmbient(true);
    }
    saveAudioSettings();
    setMuted(next);
  }, [muted]);

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-theme-tertiary hover:text-theme-primary hover:bg-surface-card transition-colors"
      aria-label={muted ? "소리 켜기" : "소리 끄기"}
      title={muted ? "소리 켜기" : "소리 끄기"}
    >
      <span className="text-base">{muted ? "🔇" : "🔊"}</span>
    </button>
  );
}

function LetterButton({ onClick }: { onClick: () => void }) {
  const count = useGameStore((s) => s.specialLetters.length);
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-theme-tertiary hover:text-theme-primary hover:bg-surface-card transition-colors flex items-center gap-1 relative"
      aria-label="수집한 편지"
      title="수집한 스페셜 편지"
    >
      <span className="text-base">📜</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function DisplayModeToggle() {
  const displayMode = useGameStore((s) => s.displayMode);
  const toggleDisplayMode = useGameStore((s) => s.toggleDisplayMode);
  const isBeginner = displayMode === "beginner";

  return (
    <button
      onClick={toggleDisplayMode}
      className="p-1.5 rounded-lg text-theme-tertiary hover:text-theme-primary hover:bg-surface-card transition-colors flex items-center gap-1"
      aria-label={isBeginner ? "상세 모드로 전환" : "간편 모드로 전환"}
      title={isBeginner ? "상세 모드로 전환" : "간편 모드로 전환"}
    >
      <span className="text-base">{isBeginner ? "🔹" : "📊"}</span>
      <span className="hidden md:inline text-xs">{isBeginner ? "간편" : "상세"}</span>
    </button>
  );
}

interface TopBarProps {
  onEndTurn: () => void;
  onOpenMenu: () => void;
  onToggleSidebar: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export default function TopBar({ onEndTurn, onOpenMenu, onToggleSidebar, theme, onToggleTheme }: TopBarProps) {
  const [letterOpen, setLetterOpen] = useState(false);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const gold = useGameStore((s) => s.gold);
  const reputation = useGameStore((s) => s.reputation);
  const adultAp = useGameStore((s) => s.ap);
  const adultMaxAp = useGameStore((s) => s.maxAp);
  const activeStage = useGameStore((s) => s.activeStage);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);

  // 활성 센터의 AP 표시
  const ap = activeStage === "child" && childStage ? childStage.ap
    : activeStage === "infant" && infantStage ? infantStage.ap
    : adultAp;
  const maxAp = activeStage === "child" && childStage ? childStage.maxAp
    : activeStage === "infant" && infantStage ? infantStage.maxAp
    : adultMaxAp;

  const tutConfig = getTutorialConfig(currentTurn);
  const letterCount = useGameStore((s) => s.specialLetters.length);
  const letterJustUnlocked = letterCount === 1; // 첫 편지 수신 시 깜박임

  return (
    <>
    <header className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-surface-raised border-b border-theme-default gap-2 backdrop-blur-md">
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-theme-tertiary hover:text-theme-primary p-1"
          aria-label="센터 안내 열기"
        >
          <IconMenu size={20} />
        </button>
        <button
          onClick={onOpenMenu}
          className="text-base md:text-lg font-bold text-floor-counseling hover:text-sky-400 transition-colors"
          title="메뉴"
        >
          마음터
        </button>
        <span className="text-xs md:text-sm text-theme-tertiary">턴 {currentTurn}</span>
        {tutConfig.showReputationGrade && (
          <span className="hidden md:inline text-xs px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-800/30" title={getReputationGrade(reputation).label}>
            {getReputationGrade(reputation).grade} {getReputationGrade(reputation).label}
          </span>
        )}
      </div>
      <div className="hidden sm:block">
        <ResourceDisplay gold={gold} reputation={reputation} ap={ap} maxAp={maxAp} />
      </div>
      {/* 모바일에서는 축약 표시 */}
      <div className="sm:hidden flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-yellow-400"><IconGold size={14} className="text-yellow-400" />{gold}</span>
        <span className="flex items-center gap-1 text-amber-300">★ {reputation}</span>
        <span className="flex items-center gap-1 text-green-400">⚡ {ap}/{maxAp}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {letterCount > 0 && (
          <span className={letterJustUnlocked ? "new-feature-glow rounded-lg" : ""}>
            <LetterButton onClick={() => setLetterOpen(true)} />
          </span>
        )}
        {tutConfig.showModeToggle && (
          <span className={tutConfig.newFeatures.includes("modeToggle") ? "new-feature-glow rounded-lg" : ""}>
            <DisplayModeToggle />
          </span>
        )}
        <MuteToggle />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={onEndTurn}
          className="px-3 md:px-4 py-1.5 bg-floor-counseling hover:bg-sky-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors"
        >
          턴 종료
        </button>
      </div>
    </header>
    <AnimatePresence>
      {letterOpen && <LetterCollection onClose={() => setLetterOpen(false)} />}
    </AnimatePresence>
    </>
  );
}
