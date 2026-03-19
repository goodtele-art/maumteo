import { m } from "motion/react";
import { CRISIS_HELP_INFO } from "@/lib/constants/crossStageConstants.ts";

interface CrisisHelpPopupProps {
  onClose: () => void;
}

export default function CrisisHelpPopup({ onClose }: CrisisHelpPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-surface-card border border-theme-default rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-theme-primary mb-4 text-center">
          위기 상담 안내
        </h2>

        <div className="space-y-3 mb-5">
          <a
            href="tel:1393"
            className="flex items-center gap-3 p-3 rounded-lg bg-red-900/20 border border-red-800/30 hover:bg-red-900/30 transition-colors"
          >
            <span className="text-2xl" aria-hidden="true">&#9742;</span>
            <div>
              <p className="text-sm font-medium text-red-300">
                {CRISIS_HELP_INFO.suicidePrevention}
              </p>
              <p className="text-xs text-theme-tertiary">24시간 운영</p>
            </div>
          </a>

          <a
            href="tel:1577-0199"
            className="flex items-center gap-3 p-3 rounded-lg bg-amber-900/20 border border-amber-800/30 hover:bg-amber-900/30 transition-colors"
          >
            <span className="text-2xl" aria-hidden="true">&#9742;</span>
            <div>
              <p className="text-sm font-medium text-amber-300">
                {CRISIS_HELP_INFO.mentalHealthCrisis}
              </p>
              <p className="text-xs text-theme-tertiary">24시간 운영</p>
            </div>
          </a>
        </div>

        <p className="text-sm text-theme-secondary text-center mb-5">
          {CRISIS_HELP_INFO.message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-surface-card-hover text-theme-primary text-sm font-medium hover:bg-surface-card transition-colors border border-theme-default"
        >
          닫기
        </button>
      </m.div>
    </div>
  );
}
