import type { ReactNode } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { AP_COST } from "@/lib/constants.ts";
import { IconTreat, IconBuild, IconHire } from "@/components/shared/GameIcons.tsx";

export default function ActionPanel() {
  const ap = useGameStore((s) => s.ap);
  const selectedFloorId = useGameStore((s) => s.selectedFloorId);
  const patients = useGameStore((s) => s.patients);
  const openModal = useGameStore((s) => s.openModal);

  const floorPatients = Object.values(patients).filter(
    (p) => p.currentFloorId === selectedFloorId,
  );

  const actions: Array<{
    label: string;
    cost: number;
    icon: ReactNode;
    disabled: boolean;
    onClick: () => void;
  }> = [
    {
      label: "상담/격려",
      cost: AP_COST.encourage,
      icon: <IconTreat size={18} />,
      disabled: floorPatients.length === 0,
      onClick: () => openModal("treat"),
    },
    {
      label: "시설 건설",
      cost: AP_COST.build,
      icon: <IconBuild size={18} />,
      disabled: false,
      onClick: () => openModal("build"),
    },
    {
      label: "상담사 고용",
      cost: AP_COST.hire,
      icon: <IconHire size={18} />,
      disabled: false,
      onClick: () => openModal("hire"),
    },
  ];

  return (
    <div className="rounded-lg p-3 glass-card">
      <h3 className="text-sm font-medium text-theme-secondary mb-3">
        행동 <span className="text-green-400">⚡ {ap}</span>
      </h3>
      <div className="space-y-2">
        {actions.map((action) => {
          const canDo = ap >= action.cost && !action.disabled;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={!canDo}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                canDo
                  ? "bg-surface-card hover:bg-surface-card-hover text-theme-primary"
                  : "bg-surface-disabled text-theme-disabled cursor-not-allowed"
              }`}
            >
              <span>{action.icon}</span>
              <span className="flex-1">{action.label}</span>
              <span
                className={`text-xs ${canDo ? "text-green-400" : "text-theme-disabled"}`}
              >
                AP {action.cost}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
