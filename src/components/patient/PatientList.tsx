import { AnimatePresence, m } from "motion/react";
import PatientCard from "./PatientCard.tsx";
import type { Patient } from "@/types/index.ts";

interface PatientListProps {
  patients: Patient[];
  onTreat: (patientId: string) => void;
  onEncourage: (patientId: string) => void;
}

export default function PatientList({ patients, onTreat, onEncourage }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-sm text-theme-faint text-center py-8">
        이 층에 내담자가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2">
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
          >
            <PatientCard patient={p} onTreat={onTreat} onEncourage={onEncourage} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
