import { AnimatePresence, m } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import type { Patient } from "@/types/index.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";

const AUTO_DISMISS_KEY = "maumteo_discharge_auto";

function getAutoDismiss(): boolean {
  return localStorage.getItem(AUTO_DISMISS_KEY) === "true";
}
function setAutoDismissPref(v: boolean): void {
  localStorage.setItem(AUTO_DISMISS_KEY, v ? "true" : "false");
}

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
  const [autoDismiss, setAutoDismiss] = useState(getAutoDismiss);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [currentIndex, items.length, onComplete]);

  // 자동 사라짐 ON일 때만 3초 후 자동 진행
  useEffect(() => {
    if (items.length === 0) {
      onComplete();
      return;
    }
    if (!autoDismiss) return; // 수동 모드: 타이머 없음
    const timer = setTimeout(goNext, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, items.length, onComplete, goNext, autoDismiss]);

  const handleToggleAuto = () => {
    const next = !autoDismiss;
    setAutoDismiss(next);
    setAutoDismissPref(next);
  };

  if (items.length === 0) return null;
  const item = items[currentIndex]!;
  const remaining = items.length - currentIndex;
  const isLast = remaining <= 1;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/70">
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
            {ISSUE_LABELS[item.patient.dominantIssue]} · {item.patient.treatmentCount}회 상담
          </p>
          <p className="text-base text-theme-primary italic leading-relaxed">
            &ldquo;{item.message}&rdquo;
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

      {/* 하단 버튼 영역 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <button
            onClick={goNext}
            className="px-5 py-2.5 text-sm bg-floor-garden/90 hover:bg-floor-garden text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            {isLast ? "확인" : `확인 (${remaining - 1}명 남음)`}
          </button>
          {remaining > 2 && (
            <button
              onClick={onComplete}
              className="px-4 py-2.5 text-sm bg-surface-card/80 hover:bg-surface-card-hover text-theme-tertiary rounded-lg transition-colors backdrop-blur-sm"
            >
              전체 건너뛰기
            </button>
          )}
        </div>
        {/* 자동 사라짐 옵션 */}
        <label className="flex items-center gap-2 text-xs text-theme-tertiary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoDismiss}
            onChange={handleToggleAuto}
            className="w-3.5 h-3.5 rounded accent-floor-garden"
          />
          앞으로 자동 사라짐 (3초)
        </label>
      </div>
    </div>
  );
}
