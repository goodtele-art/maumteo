import type { ReactNode } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { AP_COST } from "@/lib/constants.ts";
import { IconTreat, IconBuild, IconHire } from "@/components/shared/GameIcons.tsx";

export default function ActionPanel() {
  const adultAp = useGameStore((s) => s.ap);
  const activeStage = useGameStore((s) => s.activeStage);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const selectedFloorId = useGameStore((s) => s.selectedFloorId);
  const patients = useGameStore((s) => s.patients);
  const openModal = useGameStore((s) => s.openModal);

  // 활성 센터의 AP
  const ap = activeStage === "child" && childStage ? childStage.ap
    : activeStage === "infant" && infantStage ? infantStage.ap
    : adultAp;

  // 활성 센터의 내담자
  const stagePatients = activeStage === "child" && childStage
    ? Object.values(childStage.patients)
    : activeStage === "infant" && infantStage
      ? Object.values(infantStage.patients)
      : Object.values(patients);

  const currentFloor = activeStage === "child" && childStage
    ? childStage.selectedFloorId
    : activeStage === "infant" && infantStage
      ? infantStage.selectedFloorId
      : selectedFloorId;

  const floorPatients = stagePatients.filter(
    (p) => p.currentFloorId === currentFloor,
  );

  const actions: Array<{
    label: string;
    cost: number;
    costLabel?: string;
    icon: ReactNode;
    disabled: boolean;
    onClick: () => void;
  }> = [
    {
      label: "상담/격려",
      cost: 0, // 특수 처리: 상담 AP 2 / 격려 AP 1
      costLabel: `AP ${AP_COST.encourage}`,
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

  // 심리검사 버튼 (아동/영유아 센터 + 임상심리사 고용 시)
  const hasPsychologist = (activeStage === "child" && childStage && Object.keys(childStage.psychologists ?? {}).length > 0)
    || (activeStage === "infant" && infantStage && Object.keys(infantStage.psychologists ?? {}).length > 0);
  if (hasPsychologist) {
    actions.splice(1, 0, {
      label: "심리검사",
      cost: 1,
      costLabel: "AP 1",
      icon: <span className="text-lg">🧪</span>,
      disabled: stagePatients.length === 0,
      onClick: () => openModal("treat"), // treat 모달에서 검사 모드도 처리
    });
  }

  return (
    <div className="rounded-lg p-3 glass-card">
      <h3 className="text-sm font-medium text-theme-secondary mb-3">
        행동 <span className="text-green-400">⚡ {ap}</span>
      </h3>
      <div className="space-y-2">
        {actions.map((action) => {
          const canDo = (action.cost === 0 ? ap >= AP_COST.encourage : ap >= action.cost) && !action.disabled;
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
                {action.costLabel ?? `AP ${action.cost}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
