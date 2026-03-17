import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";

interface TreatFeedbackProps {
  emDelta: number;
  patientName: string;
  actionType: "treat" | "encourage";
  id: string;
}

export default function TreatFeedback({ emDelta, patientName, actionType, id }: TreatFeedbackProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const label = actionType === "treat" ? "상담 완료" : "격려 완료";
  const colorClass = actionType === "treat"
    ? (emDelta >= 10 ? "text-green-400" : "text-blue-400")
    : "text-teal-400";

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key={id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -30 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="text-center">
            <div className={`text-2xl font-bold ${colorClass}`}>
              EM -{Math.round(emDelta)}
            </div>
            <div className="text-sm text-theme-secondary mt-1">
              {patientName} {label}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
