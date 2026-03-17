import Modal from "@/components/shared/Modal.tsx";
import FacilityIcon from "@/components/shared/FacilityIcon.tsx";
import { FACILITY_TEMPLATES, AP_COST, isFacilityUnlocked } from "@/lib/constants.ts";
import { useGameStore } from "@/store/gameStore.ts";
import type { FacilityType } from "@/types/index.ts";

interface BuildActionProps {
  open: boolean;
  onClose: () => void;
  onBuild: (type: FacilityType) => void;
}

export default function BuildAction({ open, onClose, onBuild }: BuildActionProps) {
  const gold = useGameStore((s) => s.gold);
  const ap = useGameStore((s) => s.ap);
  const currentTurn = useGameStore((s) => s.currentTurn);

  const entries = (Object.entries(FACILITY_TEMPLATES) as Array<
    [FacilityType, (typeof FACILITY_TEMPLATES)[FacilityType]]
  >).filter(([type]) => isFacilityUnlocked(type, currentTurn));

  return (
    <Modal open={open} onClose={onClose} title="시설 건설">
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {entries.map(([type, template]) => {
          const affordable = gold >= template.buildCost && ap >= AP_COST.build;
          return (
            <button
              key={type}
              onClick={() => {
                if (affordable) {
                  onBuild(type);
                  onClose();
                }
              }}
              disabled={!affordable}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                affordable
                  ? "bg-surface-card hover:bg-surface-card-hover text-theme-primary"
                  : "bg-surface-disabled text-theme-disabled cursor-not-allowed"
              }`}
            >
              <FacilityIcon type={type} size={28} className="text-theme-secondary shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-theme-primary">{template.label}</div>
                <div className="text-xs text-theme-tertiary">
                  EM -{template.emReduction} · 유지비 {template.upkeepPerTurn}/턴
                </div>
                <div className="text-xs text-sky-400/70 mt-0.5">
                  {template.description}
                </div>
              </div>
              <span className={`text-sm ${affordable ? "text-yellow-400" : "text-theme-disabled"}`}>
                🪙 {template.buildCost}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
