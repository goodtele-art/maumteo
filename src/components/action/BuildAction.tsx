import Modal from "@/components/shared/Modal.tsx";
import FacilityIcon from "@/components/shared/FacilityIcon.tsx";
import { FACILITY_TEMPLATES, AP_COST, isFacilityUnlocked } from "@/lib/constants.ts";
import { CHILD_FACILITY_TEMPLATES, CHILD_AP_COST } from "@/lib/constants/childConstants.ts";
import { INFANT_FACILITY_TEMPLATES, INFANT_AP_COST } from "@/lib/constants/infantConstants.ts";
import { useGameStore } from "@/store/gameStore.ts";
import type { FacilityType } from "@/types/index.ts";

interface FacilityEntry {
  type: string;
  label: string;
  buildCost: number;
  upkeepPerTurn: number;
  emReduction: number;
  description: string;
  unlockTurn: number;
}

function getEntries(stage: string, currentTurn: number): FacilityEntry[] {
  if (stage === "child") {
    return (Object.entries(CHILD_FACILITY_TEMPLATES) as Array<[string, typeof CHILD_FACILITY_TEMPLATES[keyof typeof CHILD_FACILITY_TEMPLATES]]>)
      .filter(([, t]) => t.unlockTurn <= currentTurn)
      .map(([type, t]) => ({
        type, label: t.label, buildCost: t.buildCost, upkeepPerTurn: t.upkeepPerTurn,
        emReduction: t.emReduction, description: t.effect, unlockTurn: t.unlockTurn,
      }));
  }
  if (stage === "infant") {
    return (Object.entries(INFANT_FACILITY_TEMPLATES) as Array<[string, typeof INFANT_FACILITY_TEMPLATES[keyof typeof INFANT_FACILITY_TEMPLATES]]>)
      .filter(([, t]) => t.unlockTurn <= currentTurn)
      .map(([type, t]) => ({
        type, label: t.label, buildCost: t.buildCost, upkeepPerTurn: t.upkeepPerTurn,
        emReduction: t.emReduction, description: t.effect, unlockTurn: t.unlockTurn,
      }));
  }
  // 성인
  return (Object.entries(FACILITY_TEMPLATES) as Array<[FacilityType, typeof FACILITY_TEMPLATES[FacilityType]]>)
    .filter(([type]) => isFacilityUnlocked(type, currentTurn))
    .map(([type, t]) => ({
      type, label: t.label, buildCost: t.buildCost, upkeepPerTurn: t.upkeepPerTurn,
      emReduction: t.emReduction, description: t.description, unlockTurn: t.unlockTurn,
    }));
}

interface BuildActionProps {
  open: boolean;
  onClose: () => void;
  onBuild: (type: FacilityType) => void;
}

export default function BuildAction({ open, onClose, onBuild }: BuildActionProps) {
  const gold = useGameStore((s) => s.gold);
  const activeStage = useGameStore((s) => s.activeStage);
  const adultAp = useGameStore((s) => s.ap);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const currentTurn = useGameStore((s) => s.currentTurn);

  const ap = activeStage === "child" && childStage ? childStage.ap
    : activeStage === "infant" && infantStage ? infantStage.ap
    : adultAp;

  const buildCostAp = activeStage === "child" ? CHILD_AP_COST.build
    : activeStage === "infant" ? INFANT_AP_COST.build
    : AP_COST.build;

  const entries = getEntries(activeStage, currentTurn);
  const stageLabel = activeStage === "child" ? "아동" : activeStage === "infant" ? "영유아" : "";

  return (
    <Modal open={open} onClose={onClose} title={`${stageLabel} 시설 건설`}>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-sm text-theme-tertiary text-center py-3">건설 가능한 시설이 없습니다</p>
        ) : entries.map((entry) => {
          const affordable = gold >= entry.buildCost && ap >= buildCostAp;
          return (
            <button
              key={entry.type}
              onClick={() => {
                if (affordable) {
                  onBuild(entry.type as FacilityType);
                  onClose();
                }
              }}
              disabled={!affordable}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                affordable
                  ? "bg-surface-card hover:bg-surface-card-hover text-theme-primary"
                  : "bg-surface-card text-theme-tertiary cursor-not-allowed opacity-60"
              }`}
            >
              <FacilityIcon type={entry.type as FacilityType} size={28} className="text-theme-secondary shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-theme-primary">{entry.label}</div>
                <div className="text-xs text-theme-tertiary">
                  EM -{entry.emReduction} · 유지비 {entry.upkeepPerTurn}/턴
                </div>
                <div className="text-xs text-sky-400/70 mt-0.5">{entry.description}</div>
              </div>
              <span className={`text-sm ${affordable ? "text-theme-primary" : "text-theme-tertiary"}`}>
                🪙 {entry.buildCost}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
