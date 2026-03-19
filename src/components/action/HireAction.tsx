import { useMemo } from "react";
import Modal from "@/components/shared/Modal.tsx";
import { useGameStore } from "@/store/gameStore.ts";
import { AP_COST, SPECIALTY_CONFIG } from "@/lib/constants.ts";
import { CHILD_SPECIALTY_CONFIG, CHILD_AP_COST } from "@/lib/constants/childConstants.ts";
import { INFANT_SPECIALTY_CONFIG, INFANT_AP_COST } from "@/lib/constants/infantConstants.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";
import { CHILD_ISSUE_LABELS } from "@/lib/engine/childPatient.ts";
import { INFANT_ISSUE_LABELS } from "@/lib/engine/infantPatient.ts";

type AnySpecialty = CounselorSpecialty | ChildSpecialty | InfantSpecialty;

interface HireActionProps {
  open: boolean;
  onClose: () => void;
  onHire: (name: string, specialty: AnySpecialty, skill: number, salary: number) => void;
}

const SURNAMES = ["박", "김", "이", "최", "정", "강", "윤", "한", "오", "장"];
const GIVEN_NAMES = [
  "상담", "치유", "회복", "공감", "성장", "희망", "평화", "온기",
  "빛나", "다솜", "보람", "세움", "이룸", "나래", "가온",
];

const ADULT_SPECIALTIES: CounselorSpecialty[] = [
  "cbt", "psychodynamic", "interpersonal", "dbt", "trauma_focused", "family_systemic",
];
const CHILD_SPECIALTIES: ChildSpecialty[] = [
  "child_cbt", "play_therapy", "parent_training", "dbt_a", "tf_cbt", "family_therapy",
];
const INFANT_SPECIALTIES: InfantSpecialty[] = [
  "aba", "developmental", "attachment_therapy", "sensory_integration", "speech_language",
];

function getSpecialtyLabel(specialty: AnySpecialty): string {
  if (specialty in SPECIALTY_CONFIG) return SPECIALTY_CONFIG[specialty as CounselorSpecialty].label;
  if (specialty in CHILD_SPECIALTY_CONFIG) return CHILD_SPECIALTY_CONFIG[specialty as ChildSpecialty].label;
  if (specialty in INFANT_SPECIALTY_CONFIG) return INFANT_SPECIALTY_CONFIG[specialty as InfantSpecialty].label;
  return specialty;
}

function getOptimalLabels(specialty: AnySpecialty): string {
  if (specialty in SPECIALTY_CONFIG) {
    const cfg = SPECIALTY_CONFIG[specialty as CounselorSpecialty];
    return cfg.optimal.map((i) => ISSUE_LABELS[i]).join(", ");
  }
  if (specialty in CHILD_SPECIALTY_CONFIG) {
    const cfg = CHILD_SPECIALTY_CONFIG[specialty as ChildSpecialty];
    return cfg.optimalIssues.length > 0
      ? cfg.optimalIssues.map((i) => CHILD_ISSUE_LABELS[i]).join(", ")
      : "라포 ×1.3 (범용)";
  }
  if (specialty in INFANT_SPECIALTY_CONFIG) {
    const cfg = INFANT_SPECIALTY_CONFIG[specialty as InfantSpecialty];
    return cfg.optimalIssues.map((i) => INFANT_ISSUE_LABELS[i]).join(", ");
  }
  return "";
}

function generateCandidates(
  turn: number,
  hiredNames: Set<string>,
  specialties: AnySpecialty[],
) {
  const candidates = [];
  let seed = turn * 7 + 13;

  for (let i = 0; i < 10 && candidates.length < 3; i++) {
    seed = (seed * 31 + i) & 0x7fffffff;
    const surname = SURNAMES[seed % SURNAMES.length]!;
    const given = GIVEN_NAMES[(seed >> 4) % GIVEN_NAMES.length]!;
    const name = `${surname}${given}`;
    if (hiredNames.has(name)) continue;

    const specialty = specialties[(seed >> 8) % specialties.length]!;
    const skill = 2 + (seed % 4);
    const salary = 20 + skill * 8;

    candidates.push({ name, specialty, skill, salary });
  }
  return candidates;
}

export default function HireAction({ open, onClose, onHire }: HireActionProps) {
  const gold = useGameStore((s) => s.gold);
  const ap = useGameStore((s) => s.ap);
  const activeStage = useGameStore((s) => s.activeStage);
  const counselors = useGameStore((s) => s.counselors);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const currentTurn = useGameStore((s) => s.currentTurn);

  const { specialties, hireCostAp, hiredNames } = useMemo(() => {
    if (activeStage === "child" && childStage) {
      return {
        specialties: CHILD_SPECIALTIES as AnySpecialty[],
        hireCostAp: CHILD_AP_COST.hire,
        hiredNames: new Set(Object.values(childStage.counselors).map((c) => c.name)),
      };
    }
    if (activeStage === "infant" && infantStage) {
      return {
        specialties: INFANT_SPECIALTIES as AnySpecialty[],
        hireCostAp: INFANT_AP_COST.hire,
        hiredNames: new Set(Object.values(infantStage.counselors).map((c) => c.name)),
      };
    }
    return {
      specialties: ADULT_SPECIALTIES as AnySpecialty[],
      hireCostAp: AP_COST.hire,
      hiredNames: new Set(Object.values(counselors).map((c) => c.name)),
    };
  }, [activeStage, counselors, childStage, infantStage]);

  const stageAp = activeStage === "child" && childStage
    ? childStage.ap
    : activeStage === "infant" && infantStage
      ? infantStage.ap
      : ap;

  const candidates = useMemo(
    () => generateCandidates(currentTurn, hiredNames, specialties),
    [currentTurn, hiredNames, specialties],
  );

  const stageLabel = activeStage === "child" ? "아동" : activeStage === "infant" ? "영유아" : "성인";

  return (
    <Modal open={open} onClose={onClose} title={`${stageLabel} 상담사 고용`}>
      {candidates.length === 0 ? (
        <p className="text-sm text-theme-tertiary">이번 턴에 지원자가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => {
            const hireCost = c.salary * 2;
            const affordable = gold >= hireCost && stageAp >= hireCostAp;
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
                    : "bg-surface-card text-theme-tertiary cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-theme-primary">{c.name}</div>
                  <div className="text-xs text-sky-400">{getSpecialtyLabel(c.specialty)}</div>
                  <div className="text-xs text-theme-tertiary mt-0.5">
                    실력 {c.skill} · 급여 {c.salary}/턴 · 최적: {getOptimalLabels(c.specialty)}
                  </div>
                </div>
                <span className={`text-sm ${affordable ? "text-theme-primary" : "text-theme-tertiary"}`}>
                  🪙 {hireCost}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-theme-tertiary mt-3">매 턴 새로운 지원자가 나타납니다</p>
    </Modal>
  );
}
