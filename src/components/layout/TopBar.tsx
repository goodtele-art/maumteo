import { useGameStore } from "@/store/gameStore.ts";
import ResourceDisplay from "@/components/shared/ResourceDisplay.tsx";
import ThemeToggle from "@/components/shared/ThemeToggle.tsx";
import { IconMenu, IconAP, IconGold } from "@/components/shared/GameIcons.tsx";
import { getReputationGrade } from "@/lib/constants.ts";
import type { ThemeMode } from "@/hooks/useTheme.ts";

interface TopBarProps {
  onEndTurn: () => void;
  onOpenMenu: () => void;
  onToggleSidebar: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export default function TopBar({ onEndTurn, onOpenMenu, onToggleSidebar, theme, onToggleTheme }: TopBarProps) {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const gold = useGameStore((s) => s.gold);
  const reputation = useGameStore((s) => s.reputation);
  const ap = useGameStore((s) => s.ap);
  const maxAp = useGameStore((s) => s.maxAp);

  return (
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
        <span className="hidden md:inline text-xs px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-800/30" title={getReputationGrade(reputation).label}>
          {getReputationGrade(reputation).grade} {getReputationGrade(reputation).label}
        </span>
      </div>
      <div className="hidden sm:block">
        <ResourceDisplay gold={gold} reputation={reputation} ap={ap} maxAp={maxAp} />
      </div>
      {/* 모바일에서는 축약 표시 */}
      <div className="sm:hidden flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-yellow-400"><IconGold size={14} className="text-yellow-400" />{gold}</span>
        <span className="flex items-center gap-1 text-green-400"><IconAP size={14} className="text-green-400" />{ap}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={onEndTurn}
          className="px-3 md:px-4 py-1.5 bg-floor-counseling hover:bg-sky-600 text-white text-xs md:text-sm font-medium rounded-lg transition-colors"
        >
          턴 종료
        </button>
      </div>
    </header>
  );
}
