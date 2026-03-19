import { useGameStore } from "@/store/gameStore.ts";
import { FLOORS } from "@/lib/constants.ts";
import { CHILD_FLOORS } from "@/lib/constants/childConstants.ts";
import { INFANT_FLOORS } from "@/lib/constants/infantConstants.ts";
import { getUnlockedFloors } from "@/lib/engine/unlock.ts";

interface FloorSidebarProps {
  onSelectFloor?: () => void;
}

export default function FloorSidebar({ onSelectFloor }: FloorSidebarProps) {
  const activeStage = useGameStore((s) => s.activeStage);
  const selectedFloorId = useGameStore((s) => s.selectedFloorId);
  const selectFloor = useGameStore((s) => s.selectFloor);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const adultPatients = useGameStore((s) => s.patients);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);

  // 스테이지에 따라 층 목록, 내담자, 선택 층 결정
  const floors = activeStage === "child"
    ? CHILD_FLOORS.map((f) => ({ ...f, unlockTurn: 0 }))
    : activeStage === "infant"
      ? INFANT_FLOORS.map((f) => ({ ...f, unlockTurn: 0 }))
      : FLOORS;

  const patients = activeStage === "child" && childStage
    ? childStage.patients
    : activeStage === "infant" && infantStage
      ? infantStage.patients
      : adultPatients;

  const currentSelectedFloor = activeStage === "child" && childStage
    ? childStage.selectedFloorId
    : activeStage === "infant" && infantStage
      ? infantStage.selectedFloorId
      : selectedFloorId;

  const unlockedAdult = getUnlockedFloors(currentTurn);

  const patientCountByFloor = (floorId: string) =>
    Object.values(patients).filter((p) => p.currentFloorId === floorId).length;

  const handleSelectFloor = (floorId: string) => {
    if (activeStage === "adult") {
      selectFloor(floorId as import("@/types/index.ts").FloorId);
    } else if (activeStage === "child" && childStage) {
      useGameStore.setState({
        childStage: { ...childStage, selectedFloorId: floorId as import("@/types/child/floor.ts").ChildFloorId },
      });
    } else if (activeStage === "infant" && infantStage) {
      useGameStore.setState({
        infantStage: { ...infantStage, selectedFloorId: floorId as import("@/types/infant/floor.ts").InfantFloorId },
      });
    }
    onSelectFloor?.();
  };

  return (
    <aside className="w-48 bg-surface-raised border-r border-theme-default flex flex-col backdrop-blur-md">
      <div className="p-3 text-xs text-theme-tertiary uppercase tracking-wider">
        센터 안내
      </div>
      {floors.map((floor) => {
        const isUnlocked = activeStage === "adult"
          ? unlockedAdult.includes(floor.id as import("@/types/index.ts").FloorId)
          : true; // 아동/영유아 층은 센터 오픈 시 모두 해금
        const isSelected = currentSelectedFloor === floor.id;
        const count = patientCountByFloor(floor.id);
        const colorVar = `var(--color-${floor.color})`;

        return (
          <button
            key={floor.id}
            onClick={() => { if (isUnlocked) handleSelectFloor(floor.id); }}
            disabled={!isUnlocked}
            className={`flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors border-l-2 ${
              isSelected
                ? "text-white sidebar-glow"
                : isUnlocked
                  ? "text-theme-secondary hover:bg-surface-card/50 border-transparent"
                  : "text-theme-tertiary cursor-not-allowed border-transparent"
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
            {!isUnlocked && "unlockTurn" in floor && (
              <span className="text-xs text-theme-tertiary">턴 {(floor as { unlockTurn: number }).unlockTurn}</span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
