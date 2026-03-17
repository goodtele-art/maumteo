import { AnimatePresence, m } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import type { Patient } from "@/types/index.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";

interface DischargeItem {
  patient: Patient;
  message: string;
}

interface DischargeSequenceProps {
  items: DischargeItem[];
  onComplete: () => void;
}

export default function DischargeSequence({
  items,
  onComplete,
}: DischargeSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [currentIndex, items.length, onComplete]);

  useEffect(() => {
    if (items.length === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(goNext, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, items.length, onComplete, goNext]);

  if (items.length === 0) return null;
  const item = items[currentIndex]!;
  const remaining = items.length - currentIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <AnimatePresence mode="wait">
        <m.div
          key={item.patient.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-sm mx-4"
        >
          <m.div
            className="text-4xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ♥
          </m.div>
          <h3 className="text-xl font-bold text-floor-garden mb-1">
            {item.patient.name} 상담 종결
          </h3>
          <p className="text-sm text-theme-tertiary mb-3">
            {ISSUE_LABELS[item.patient.dominantIssue]} · 상담 시작 {item.patient.treatmentCount}회 상담
          </p>
          <p className="text-base text-theme-primary italic leading-relaxed">
            "{item.message}"
          </p>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-floor-garden"
          >
            평판 +2
          </m.div>
        </m.div>
      </AnimatePresence>

      {/* 하단 버튼 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        <button
          onClick={goNext}
          className="px-4 py-2 text-sm bg-surface-card/80 hover:bg-surface-card-hover text-theme-secondary rounded-lg transition-colors backdrop-blur-sm"
        >
          다음 ({remaining - 1}명 남음)
        </button>
        {remaining > 1 && (
          <button
            onClick={onComplete}
            className="px-4 py-2 text-sm bg-surface-card/80 hover:bg-surface-card-hover text-theme-tertiary rounded-lg transition-colors backdrop-blur-sm"
          >
            전체 건너뛰기
          </button>
        )}
      </div>
    </div>
  );
}
