import { useMemo } from "react";
import Modal from "@/components/shared/Modal.tsx";
import { useGameStore } from "@/store/gameStore.ts";
import { AP_COST, SPECIALTY_CONFIG } from "@/lib/constants.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";

interface HireActionProps {
  open: boolean;
  onClose: () => void;
  onHire: (name: string, specialty: CounselorSpecialty, skill: number, salary: number) => void;
}

const SURNAMES = ["박", "김", "이", "최", "정", "강", "윤", "한", "오", "장"];
const GIVEN_NAMES = [
  "상담", "치유", "회복", "공감", "성장", "희망", "평화", "온기",
  "빛나", "다솜", "보람", "세움", "이룸", "나래", "가온",
];
const SPECIALTIES: CounselorSpecialty[] = [
  "cbt", "psychodynamic", "interpersonal", "dbt", "trauma_focused", "family_systemic",
];

function generateCandidates(turn: number, hiredNames: Set<string>) {
  const candidates = [];
  let seed = turn * 7 + 13;

  for (let i = 0; i < 10 && candidates.length < 3; i++) {
    seed = (seed * 31 + i) & 0x7fffffff;
    const surname = SURNAMES[seed % SURNAMES.length]!;
    const given = GIVEN_NAMES[(seed >> 4) % GIVEN_NAMES.length]!;
    const name = `${surname}${given}`;
    if (hiredNames.has(name)) continue;

    const specialty = SPECIALTIES[(seed >> 8) % SPECIALTIES.length]!;
    const skill = 2 + (seed % 4);
    const salary = 20 + skill * 8;

    candidates.push({ name, specialty, skill, salary });
  }
  return candidates;
}

export default function HireAction({ open, onClose, onHire }: HireActionProps) {
  const gold = useGameStore((s) => s.gold);
  const ap = useGameStore((s) => s.ap);
  const counselors = useGameStore((s) => s.counselors);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const hiredNames = useMemo(
    () => new Set(Object.values(counselors).map((c) => c.name)),
    [counselors],
  );

  const candidates = useMemo(
    () => generateCandidates(currentTurn, hiredNames),
    [currentTurn, hiredNames],
  );

  return (
    <Modal open={open} onClose={onClose} title="상담사 고용">
      {candidates.length === 0 ? (
        <p className="text-sm text-theme-disabled">이번 턴에 지원자가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => {
            const config = SPECIALTY_CONFIG[c.specialty];
            const hireCost = c.salary * 2;
            const affordable = gold >= hireCost && ap >= AP_COST.hire;
            return (
              <button
                key={c.name}
                onClick={() => {
                  if (affordable) {
                    onHire(c.name, c.specialty, c.skill, c.salary);
                    onClose();
                  }
                }}
                disabled={!affordable}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  affordable
                    ? "bg-surface-card hover:bg-surface-card-hover text-theme-primary"
                    : "bg-surface-disabled text-theme-disabled cursor-not-allowed"
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-theme-primary">{c.name}</div>
                  <div className="text-xs text-sky-400">{config.label}</div>
                  <div className="text-xs text-theme-disabled mt-0.5">
                    실력 {c.skill} · 급여 {c.salary}/턴 · 최적: {config.optimal.map((issue) => ISSUE_LABELS[issue]).join(", ")}
                  </div>
                </div>
                <span className={`text-sm ${affordable ? "text-yellow-400" : "text-theme-disabled"}`}>
                  🪙 {hireCost}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-theme-faint mt-3">매 턴 새로운 지원자가 나타납니다</p>
    </Modal>
  );
}
