import { m } from "motion/react";
import type { Facility } from "@/types/index.ts";
import { FACILITY_TEMPLATES } from "@/lib/constants.ts";
import { CHILD_FACILITY_TEMPLATES } from "@/lib/constants/childConstants.ts";
import { INFANT_FACILITY_TEMPLATES } from "@/lib/constants/infantConstants.ts";
import FacilityIllustration from "@/components/shared/FacilityIllustration.tsx";

/** 모든 스테이지 시설 템플릿 통합 조회 */
function getTemplate(type: string): { label: string; effect: string; description?: string } | null {
  if (type in FACILITY_TEMPLATES) return (FACILITY_TEMPLATES as Record<string, typeof FACILITY_TEMPLATES[keyof typeof FACILITY_TEMPLATES]>)[type]!;
  if (type in CHILD_FACILITY_TEMPLATES) {
    const t = (CHILD_FACILITY_TEMPLATES as Record<string, typeof CHILD_FACILITY_TEMPLATES[keyof typeof CHILD_FACILITY_TEMPLATES]>)[type]!;
    return { label: t.label, effect: t.effect, description: t.effect };
  }
  if (type in INFANT_FACILITY_TEMPLATES) {
    const t = (INFANT_FACILITY_TEMPLATES as Record<string, typeof INFANT_FACILITY_TEMPLATES[keyof typeof INFANT_FACILITY_TEMPLATES]>)[type]!;
    return { label: t.label, effect: t.effect, description: t.effect };
  }
  return null;
}

interface FacilitySlotProps {
  facility: Facility | null;
  slotIndex: number;
  onBuild: (slotIndex: number) => void;
  onUpgrade?: (facilityId: string) => void;
}

export default function FacilitySlot({
  facility,
  slotIndex,
  onBuild,
  onUpgrade,
}: FacilitySlotProps) {
  if (!facility) {
    return (
      <button
        onClick={() => onBuild(slotIndex)}
        className="flex items-center justify-center w-full h-24 border-2 border-dashed border-theme-subtle rounded-lg text-theme-tertiary hover:border-theme-default hover:text-theme-secondary transition-colors slot-empty"
      >
        <span className="text-2xl">+</span>
      </button>
    );
  }

  const template = getTemplate(facility.type);
  if (!template) return null;
  const canUpgrade = facility.level < 3;

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-full glass-card rounded-lg overflow-hidden card-hover"
    >
      <div className="flex h-24">
        <div className="shrink-0 w-24 h-full">
          <FacilityIllustration type={facility.type} level={facility.level} label={template.label} size="md" />
        </div>
        <div className="flex-1 min-w-0 p-2.5 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">{template.label}</div>
            {canUpgrade && onUpgrade && (
              <button
                onClick={() => onUpgrade(facility.id)}
                className="shrink-0 text-xs px-3 py-1.5 bg-amber-900/30 text-amber-400 rounded-lg hover:bg-amber-900/50 transition-colors"
                title={`업그레이드 비용: ${Math.ceil(facility.buildCost * 0.5 * facility.level)}골드`}
              >
                ⬆
              </button>
            )}
          </div>
          <div className="text-xs text-theme-tertiary mt-0.5">
            Lv.{facility.level} · EM -{facility.emReduction} · 유지비 {facility.upkeepPerTurn}
          </div>
          {template.effect !== "none" && template.description && (
            <div className="text-xs text-sky-400/70 mt-0.5 truncate" title={template.description}>
              {template.description}
            </div>
          )}
        </div>
      </div>
    </m.div>
  );
}
