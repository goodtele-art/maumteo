import { useState } from "react";
import type { ReactNode } from "react";
import TopBar from "./TopBar.tsx";
import FloorSidebar from "./FloorSidebar.tsx";
import { useTheme } from "@/hooks/useTheme.ts";

interface GameLayoutProps {
  onEndTurn: () => void;
  onOpenMenu: () => void;
  children: ReactNode;
}

export default function GameLayout({ onEndTurn, onOpenMenu, children }: GameLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex flex-col bg-surface-base text-theme-primary">
      <TopBar
        onEndTurn={onEndTurn}
        onOpenMenu={onOpenMenu}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* 데스크톱: 항상 표시 / 모바일: 오버레이 */}
        <div
          className={`
            shrink-0
            md:relative md:block
            ${sidebarOpen ? "absolute inset-y-0 left-0 z-30 block" : "hidden md:block"}
          `}
        >
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
