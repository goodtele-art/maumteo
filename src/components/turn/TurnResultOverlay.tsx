import { m, AnimatePresence } from "motion/react";
import type { TurnEvent } from "@/types/index.ts";

interface TurnResultOverlayProps {
  open: boolean;
  turn: number;
  events: TurnEvent[];
  onClose: () => void;
}

export default function TurnResultOverlay({
  open,
  turn,
  events,
  onClose,
}: TurnResultOverlayProps) {
  const income = events.find((e) => e.type === "income");
  const upkeep = events.find((e) => e.type === "upkeep");
  const admissions = events.filter((e) => e.type === "admission");
  const discharges = events.filter((e) => e.type === "discharge");
  const incidents = events.filter((e) => e.type === "incident");
  const emIncreases = events.filter((e) => e.type === "em_increase");

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "var(--overlay-bg)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.div
            className="border rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl glass-card-strong bg-surface-card border-theme-subtle"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-bold mb-4 text-theme-primary">턴 {turn} 결과</h2>

            <div className="space-y-2.5 text-sm">
              {income && income.type === "income" && (
                <div className="flex justify-between">
                  <span className="text-theme-secondary">수입</span>
                  <span className="text-green-400 font-medium">+{income.amount} 🪙</span>
                </div>
              )}
              {upkeep && upkeep.type === "upkeep" && (
                <div className="flex justify-between">
                  <span className="text-theme-secondary">유지비</span>
                  <span className="text-red-400 font-medium">-{upkeep.amount} 🪙</span>
                </div>
              )}
              {admissions.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-theme-secondary">신규 내담자</span>
                  <span className="text-blue-400 font-medium">+{admissions.length}명</span>
                </div>
              )}
              {emIncreases.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-theme-secondary">EM 악화</span>
                  <span className="text-orange-400 font-medium">{emIncreases.length}명</span>
                </div>
              )}
              {incidents.length > 0 && (
                <div className="border-t border-red-800/50 pt-2 mt-2">
                  {incidents.map((e, i) => (
                    e.type === "incident" && (
                      <div key={i} className="text-xs text-red-400 mb-1">
                        ⚠ {e.message} (평판 -{e.reputationLoss})
                      </div>
                    )
                  ))}
                </div>
              )}
              {discharges.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-theme-secondary">상담 종결</span>
                  <span className="text-floor-garden">{discharges.length}명</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2 bg-floor-counseling hover:bg-sky-600 text-white text-sm rounded-lg transition-colors"
            >
              확인
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
