import { useGameStore } from "@/store/gameStore.ts";
import { FLOORS } from "@/lib/constants.ts";
import { getUnlockedFloors } from "@/lib/engine/unlock.ts";
import type { FloorId } from "@/types/index.ts";

interface FloorSidebarProps {
  onSelectFloor?: () => void;
}

export default function FloorSidebar({ onSelectFloor }: FloorSidebarProps) {
  const selectedFloorId = useGameStore((s) => s.selectedFloorId);
  const selectFloor = useGameStore((s) => s.selectFloor);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const patients = useGameStore((s) => s.patients);
  const unlocked = getUnlockedFloors(currentTurn);

  const patientCountByFloor = (floorId: FloorId) =>
    Object.values(patients).filter((p) => p.currentFloorId === floorId).length;

  return (
    <aside className="w-48 bg-surface-raised border-r border-theme-default flex flex-col backdrop-blur-md">
      <div className="p-3 text-xs text-theme-disabled uppercase tracking-wider">
        센터 안내
      </div>
      {FLOORS.map((floor) => {
        const isUnlocked = unlocked.includes(floor.id);
        const isSelected = selectedFloorId === floor.id;
        const count = patientCountByFloor(floor.id);
        const colorVar = `var(--color-${floor.color})`;

        return (
          <button
            key={floor.id}
            onClick={() => { if (isUnlocked) { selectFloor(floor.id); onSelectFloor?.(); } }}
            disabled={!isUnlocked}
            className={`flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors border-l-2 ${
              isSelected
                ? "text-white sidebar-glow"
                : isUnlocked
                  ? "text-theme-secondary hover:bg-surface-card/50 border-transparent"
                  : "text-theme-faint cursor-not-allowed border-transparent"
            }`}
            style={
              isSelected
                ? {
                    borderLeftColor: colorVar,
                    backgroundColor: `color-mix(in srgb, ${colorVar} 15%, transparent)`,
                    ["--glow-color" as string]: `color-mix(in srgb, ${colorVar} 30%, transparent)`,
                  }
                : undefined
            }
          >
            <span className="text-base">{isUnlocked ? floor.icon : "🔒"}</span>
            <span className="flex-1">{floor.label}</span>
            {isUnlocked && count > 0 && (
              <span className="text-xs bg-surface-badge px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
            {!isUnlocked && (
              <span className="text-xs text-theme-faint">턴 {floor.unlockTurn}</span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
