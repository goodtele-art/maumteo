import type { ReactNode } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { AP_COST, FACILITY_TEMPLATES } from "@/lib/constants.ts";
import { IconTreat, IconBuild, IconHire } from "@/components/shared/GameIcons.tsx";
import { getTutorialConfig } from "@/lib/tutorialConfig.ts";

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

  const currentTurn = useGameStore((s) => s.currentTurn);
  const tutConfig = getTutorialConfig(currentTurn);

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
      cost: 0, // 특수 처리
      costLabel: `AP ${AP_COST.treat}/${AP_COST.encourage}`,
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
  // 임상심리사 고용 여부 (안전한 접근)
  let hasPsychologist = false;
  try {
    if (activeStage === "child" && childStage) {
      const psy = (childStage as unknown as { psychologists?: Record<string, unknown> }).psychologists;
      hasPsychologist = !!psy && Object.keys(psy).length > 0;
    } else if (activeStage === "infant" && infantStage) {
      const psy = (infantStage as unknown as { psychologists?: Record<string, unknown> }).psychologists;
      hasPsychologist = !!psy && Object.keys(psy).length > 0;
    }
  } catch { /* ignore */ }
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

  // 튜토리얼 설정에 따라 버튼 필터링
  const visibleActions = actions.filter((action) => {
    if (action.label === "상담/격려") {
      // 상담 또는 격려 중 하나라도 보여야 함
      return tutConfig.showTreatButton || tutConfig.showEncourageButton;
    }
    if (action.label === "시설 건설") return tutConfig.showBuildButton;
    if (action.label === "상담사 고용") return tutConfig.showHireButton;
    if (action.label === "심리검사") return true; // 심리검사는 해금 조건 별도
    return true;
  });

  const isLargeUI = tutConfig.uiScale > 1;
  const newFeats = tutConfig.newFeatures as string[];
  const FEATURE_MAP: Record<string, string> = { "\uC0C1\uB2F4/\uACA9\uB824": "treat", "\uC2DC\uC124 \uAC74\uC124": "build", "\uC0C1\uB2F4\uC0AC \uACE0\uC6A9": "hire" };
  // 이번 턴에 새 시설이 해금되면 건설 버튼 깜박임
  const hasFacilityUnlock = Object.values(FACILITY_TEMPLATES).some((t) => t.unlockTurn === currentTurn);

  return (
    <div className="rounded-lg p-3 glass-card">
      <h3 className="text-sm font-medium text-theme-secondary mb-3">
        행동 <span className="text-green-400">⚡ {ap}</span>
      </h3>
      <div className="space-y-2">
        {visibleActions.map((action) => {
          const canDo = (action.cost === 0 ? ap >= AP_COST.encourage : ap >= action.cost) && !action.disabled;
          const fk = FEATURE_MAP[action.label] ?? "";
          const isNew = (fk !== "" && newFeats.includes(fk)) || (fk === "build" && hasFacilityUnlock);
          const btnClass = [
            "w-full flex items-center gap-2 px-3 rounded-lg text-left transition-colors",
            isLargeUI ? "py-3 text-lg" : "py-2 text-sm",
            canDo ? "bg-surface-card hover:bg-surface-card-hover text-theme-primary" : "bg-surface-disabled text-theme-disabled cursor-not-allowed",
            isNew ? "new-feature-glow" : "",
          ].join(" ");
          return (
            <button key={action.label} onClick={action.onClick} disabled={!canDo} className={btnClass}>
              <span>{action.icon}</span>
              <span className="flex-1">{action.label}</span>
              <span className={`text-xs ${canDo ? "text-green-400" : "text-theme-disabled"}`}>
                {action.costLabel ?? `AP ${action.cost}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
