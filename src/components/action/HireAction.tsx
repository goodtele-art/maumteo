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
import { VICE_DIRECTOR_UNLOCK_ADULT, VICE_DIRECTOR_UNLOCK_CHILD } from "@/lib/constants/crossStageConstants.ts";
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

      {/* 임상심리사 고용 */}
      <PsychologistHireSection stageAp={stageAp} />

      {/* 부센터장 고용 */}
      <ViceDirectorHireSection stageAp={stageAp} />
    </Modal>
  );
}

function PsychologistHireSection({ stageAp }: { stageAp: number }) {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const activeStage = useGameStore((s) => s.activeStage);
  const gold = useGameStore((s) => s.gold);
  const childPsy = useGameStore((s) => s.childStage?.psychologists ?? {});
  const infantPsy = useGameStore((s) => s.infantStage?.psychologists ?? {});
  const hirePsychologist = useGameStore((s) => s.hirePsychologist);

  // 아동(턴 33+), 영유아(턴 63+)만 가능
  if (activeStage === "adult") return null;
  const unlockTurn = activeStage === "child" ? 33 : 63;
  if (currentTurn < unlockTurn) return null;

  const psychologists = activeStage === "child" ? childPsy : infantPsy;
  const psyCount = Object.keys(psychologists).length;

  // 이미 고용됨
  if (psyCount > 0) {
    const psy = Object.values(psychologists)[0]!;
    return (
      <div className="mt-4 pt-3 border-t border-theme-default">
        <div className="text-xs text-purple-400 mb-1">임상심리사</div>
        <div className="text-sm text-theme-primary">
          {psy.name} (실력 {psy.skill}) · 급여 {psy.salary}/턴 · 턴당 검사 {psy.maxAssessments}명
        </div>
      </div>
    );
  }

  // 후보 생성
  const seed = currentTurn * 17 + 3;
  const surname = SURNAMES[seed % SURNAMES.length]!;
  const given = GIVEN_NAMES[(seed >> 5) % GIVEN_NAMES.length]!;
  const name = `${surname}${given}`;
  const skill = 3 + (seed % 5); // 3~7
  const salary = 25 + skill * 5; // 40~60
  const hireCost = salary * 2;
  const affordable = gold >= hireCost && stageAp >= AP_COST.hire;

  return (
    <div className="mt-4 pt-3 border-t border-theme-default">
      <div className="text-xs text-purple-400 mb-2">임상심리사 고용 (심리검사 가능)</div>
      <button
        onClick={() => {
          if (affordable) {
            hirePsychologist(activeStage as "child" | "infant", name, skill, salary);
            useGameStore.getState().addNotification(`${name} 임상심리사 고용 완료!`, "success");
          }
        }}
        disabled={!affordable}
        className={`w-full p-3 rounded-lg text-left transition-colors ${
          affordable
            ? "bg-purple-600/20 hover:bg-purple-600/30 text-theme-primary border border-purple-500/30"
            : "bg-surface-card text-theme-tertiary cursor-not-allowed opacity-60"
        }`}
      >
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-purple-400 mt-0.5">실력 {skill} · 급여 {salary}/턴 · 턴당 검사 {skill >= 8 ? 3 : skill >= 4 ? 2 : 1}명</div>
        <div className="text-xs text-theme-tertiary mt-0.5">고용비 {hireCost}G · 심리검사 시 치료효과 ×1.5</div>
      </button>
    </div>
  );
}

function ViceDirectorHireSection({ stageAp }: { stageAp: number }) {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const activeStage = useGameStore((s) => s.activeStage);
  const gold = useGameStore((s) => s.gold);
  const adultVD = useGameStore((s) => s.viceDirector);
  const childVD = useGameStore((s) => s.childStage?.viceDirector ?? null);
  const hireViceDirector = useGameStore((s) => s.hireViceDirector);

  // 해금 조건 확인
  const unlockTurn = activeStage === "adult" ? VICE_DIRECTOR_UNLOCK_ADULT : activeStage === "child" ? VICE_DIRECTOR_UNLOCK_CHILD : Infinity;
  if (currentTurn < unlockTurn) return null;
  if (activeStage === "infant") return null;

  const fireViceDirector = useGameStore((s) => s.fireViceDirector);

  // 이미 고용됨
  const hasVD = activeStage === "adult" ? adultVD !== null : childVD !== null;
  if (hasVD) {
    const vd = activeStage === "adult" ? adultVD : childVD;
    return (
      <div className="mt-4 pt-3 border-t border-theme-default">
        <div className="text-xs text-theme-tertiary mb-1">부센터장</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-theme-primary">
            {vd!.name} (관리 실력 {vd!.managementSkill}) · 급여 {vd!.salary}/턴
          </div>
          <button
            onClick={() => {
              fireViceDirector(activeStage as "adult" | "child");
              useGameStore.getState().addNotification(`${vd!.name} 부센터장 해고`, "info");
            }}
            className="text-xs text-red-400 hover:text-red-300 ml-2"
          >
            해고
          </button>
        </div>
      </div>
    );
  }

  // 부센터장 후보 생성
  const seed = currentTurn * 13 + 7;
  const surname = SURNAMES[seed % SURNAMES.length]!;
  const given = GIVEN_NAMES[(seed >> 3) % GIVEN_NAMES.length]!;
  const name = `${surname}${given}`;
  const managementSkill = 3 + (seed % 6); // 3~8
  const salary = 30 + managementSkill * 5; // 45~70
  const hireCost = salary * 2;
  const affordable = gold >= hireCost && stageAp >= AP_COST.hire;

  return (
    <div className="mt-4 pt-3 border-t border-theme-default">
      <div className="text-xs text-amber-400 mb-2">부센터장 고용 (위임 운영 가능)</div>
      <button
        onClick={() => {
          if (affordable) {
            hireViceDirector(activeStage as "adult" | "child", name, managementSkill, salary);
            useGameStore.getState().addNotification(`${name} 부센터장 고용 완료!`, "success");
          }
        }}
        disabled={!affordable}
        className={`w-full p-3 rounded-lg text-left transition-colors ${
          affordable
            ? "bg-amber-600/20 hover:bg-amber-600/30 text-theme-primary border border-amber-500/30"
            : "bg-surface-card text-theme-tertiary cursor-not-allowed opacity-60"
        }`}
      >
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-amber-400 mt-0.5">관리 실력 {managementSkill} · 급여 {salary}/턴</div>
        <div className="text-xs text-theme-tertiary mt-0.5">고용비 {hireCost}G · 위임하기로 자동 치료 운영</div>
      </button>
    </div>
  );
}
