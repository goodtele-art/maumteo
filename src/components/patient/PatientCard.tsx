import { useState } from "react";
import { m } from "motion/react";
import EMBar from "@/components/shared/EMBar.tsx";
import CharacterAvatar from "@/components/shared/CharacterAvatar.tsx";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";
import type { Patient } from "@/types/index.ts";

const ISSUE_COLORS: Record<string, string> = {
  depression: "bg-blue-900/50 text-blue-300",
  anxiety: "bg-amber-900/50 text-amber-300",
  relationship: "bg-pink-900/50 text-pink-300",
  obsession: "bg-indigo-900/50 text-indigo-300",
  trauma: "bg-red-900/50 text-red-300",
  addiction: "bg-orange-900/50 text-orange-300",
  personality: "bg-rose-900/50 text-rose-300",
  psychosis: "bg-violet-900/50 text-violet-300",
};

function getCardBorderColor(em: number): string {
  if (em >= 80) return "border-red-700/60";
  if (em >= 60) return "border-amber-700/60";
  if (em >= 40) return "border-sky-700/60";
  if (em >= 20) return "border-violet-700/60";
  return "border-teal-700/60";
}

interface PatientCardProps {
  patient: Patient;
  onTreat: (patientId: string) => void;
  onEncourage: (patientId: string) => void;
}

export default function PatientCard({ patient, onTreat, onEncourage }: PatientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = getCardBorderColor(patient.em);
  const isCrisis = patient.em >= 80;

  return (
    <m.div
      layout
      className={`border ${borderColor} rounded-lg glass-card card-hover ${isCrisis ? "crisis-pulse" : ""}`}
    >
      <div className="flex">
        {/* 왼쪽: 큰 아이콘 */}
        <div className="shrink-0 flex items-center justify-center p-3">
          <CharacterAvatar issue={patient.dominantIssue} em={patient.em} size={64} />
        </div>

        {/* 오른쪽: 정보 + 버튼 */}
        <div className="flex-1 min-w-0 py-2.5 pr-3">
          {/* 이름 + 문제영역 + 버튼 */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-sm truncate">{patient.name}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${ISSUE_COLORS[patient.dominantIssue] ?? ""}`}
              >
                {ISSUE_LABELS[patient.dominantIssue]}
              </span>
            </div>
            <div className="flex gap-1.5 shrink-0 ml-2">
              <button
                onClick={() => onEncourage(patient.id)}
                className="text-xs px-2.5 py-1.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                title="격려하여 EM을 약간 줄입니다 (AP 1)"
              >
                격려하기
              </button>
              <button
                onClick={() => onTreat(patient.id)}
                className="text-sm px-3 py-1.5 bg-floor-counseling text-white font-medium rounded-lg hover:bg-sky-600 transition-colors shadow-sm"
                title="상담사와 치료실을 선택하여 상담합니다 (AP 2)"
              >
                상담하기
              </button>
            </div>
          </div>

          {/* EM 바 */}
          <EMBar em={patient.em} size="sm" />

          {/* 라포, 상담 횟수, 사연 */}
          <div className="flex items-center gap-3 mt-1 text-xs text-theme-tertiary">
            <span>라포 {patient.rapport}</span>
            <span>상담 {patient.treatmentCount}회</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-theme-tertiary hover:text-theme-primary"
            >
              {expanded ? "접기" : "사연"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <m.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 pb-3 text-xs text-theme-tertiary italic border-t border-theme-default pt-2 mx-3"
        >
          "{patient.backstory}"
        </m.p>
      )}
    </m.div>
  );
}
