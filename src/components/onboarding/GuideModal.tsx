import { m, AnimatePresence } from "motion/react";
import type { GuideEntry } from "@/lib/guideData.ts";

interface GuideModalProps {
  guide: GuideEntry | null;
  onDismiss: () => void;
}

export default function GuideModal({ guide, onDismiss }: GuideModalProps) {
  return (
    <AnimatePresence>
      {guide && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onDismiss}
          />
          <m.div
            className="relative glass-card-strong rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl bg-surface-card border border-floor-counseling/30"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-3">
              <span className="text-3xl">{guide.icon}</span>
            </div>
            <h2 className="text-base font-bold text-floor-counseling text-center mb-3">
              {guide.title}
            </h2>
            <p className="text-sm text-theme-secondary leading-relaxed whitespace-pre-line mb-5">
              {guide.body}
            </p>
            <button
              onClick={onDismiss}
              className="w-full py-2 bg-floor-counseling hover:bg-sky-600 text-white text-sm rounded-lg transition-colors"
            >
              확인
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
