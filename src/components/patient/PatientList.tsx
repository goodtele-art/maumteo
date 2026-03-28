import { AnimatePresence, m } from "motion/react";
import PatientCard from "./PatientCard.tsx";
import { useGameStore } from "@/store/gameStore.ts";
import { getTutorialConfig } from "@/lib/tutorialConfig.ts";
import type { Patient } from "@/types/index.ts";

interface PatientListProps {
  patients: Patient[];
  onTreat: (patientId: string) => void;
  onEncourage: (patientId: string) => void;
}

/** uiScale에 따른 카드 너비 클래스 */
function getCardWidthClass(uiScale: number): string {
  if (uiScale >= 2.0) return "max-w-xl";
  if (uiScale >= 1.5) return "max-w-lg";
  if (uiScale > 1.0) return "max-w-md";
  return "";
}

export default function PatientList({ patients, onTreat, onEncourage }: PatientListProps) {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const tutConfig = getTutorialConfig(currentTurn);
  const isLargeUI = tutConfig.uiScale > 1;
  const cardWidthClass = getCardWidthClass(tutConfig.uiScale);

  if (patients.length === 0) {
    return (
      <div className="text-sm text-theme-faint text-center py-8">
        이 층에 내담자가 없습니다
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${isLargeUI ? "flex flex-col items-center" : ""}`}>
      <AnimatePresence mode="popLayout">
        {patients.map((p, i) => (
          <m.div
            key={p.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: i * 0.05,
            }}
            className={isLargeUI ? `w-full ${cardWidthClass}` : ""}
          >
            <PatientCard patient={p} onTreat={onTreat} onEncourage={onEncourage} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
