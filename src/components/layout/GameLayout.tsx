import { useState } from "react";
import type { ReactNode } from "react";
import TopBar from "./TopBar.tsx";
import FloorSidebar from "./FloorSidebar.tsx";
import StageTab from "@/components/stage/StageTab.tsx";
import StageDashboard from "@/components/stage/StageDashboard.tsx";
import { useTheme } from "@/hooks/useTheme.ts";
import { useGameStore } from "@/store/gameStore.ts";
import { CHILD_STAGE_OPEN_TURN } from "@/lib/constants/crossStageConstants.ts";

interface GameLayoutProps {
  onEndTurn: () => void;
  onOpenMenu: () => void;
  children: ReactNode;
}

export default function GameLayout({ onEndTurn, onOpenMenu, children }: GameLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const currentTurn = useGameStore((s) => s.currentTurn);
  const showStages = currentTurn >= CHILD_STAGE_OPEN_TURN;

  return (
    <div className="h-screen flex flex-col bg-surface-base text-theme-primary">
      <TopBar
        onEndTurn={onEndTurn}
        onOpenMenu={onOpenMenu}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {showStages && <StageTab />}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 데스크톱: 항상 표시 / 모바일: 오버레이 */}
        <div
          className={`
            shrink-0
            md:relative md:block
            ${sidebarOpen ? "absolute inset-y-0 left-0 z-30 block" : "hidden md:block"}
          `}
        >
          {showStages && <StageDashboard />}
          <FloorSidebar onSelectFloor={() => setSidebarOpen(false)} />
        </div>
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto p-3 md:p-4">{children}</main>
      </div>
    </div>
  );
}
