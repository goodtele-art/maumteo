import { useState } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import Modal from "@/components/shared/Modal.tsx";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";
import { CHILD_ISSUE_LABELS } from "@/lib/engine/childPatient.ts";
import { INFANT_ISSUE_LABELS } from "@/lib/engine/infantPatient.ts";

const ALL_ISSUE_LABELS: Record<string, string> = { ...ISSUE_LABELS, ...CHILD_ISSUE_LABELS, ...INFANT_ISSUE_LABELS };
import { AP_COST, SPECIALTY_CONFIG, FACILITY_TEMPLATES, getMatchMultiplier } from "@/lib/constants.ts";
import { CHILD_FACILITY_TEMPLATES, CHILD_SPECIALTY_CONFIG, getChildMatchMultiplier } from "@/lib/constants/childConstants.ts";
import { INFANT_FACILITY_TEMPLATES, INFANT_SPECIALTY_CONFIG, getInfantMatchMultiplier } from "@/lib/constants/infantConstants.ts";
import type { Counselor, Facility, Patient } from "@/types/index.ts";
import type { DominantIssue } from "@/types/patient.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { ChildIssue } from "@/types/child/patient.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";
import type { InfantIssue } from "@/types/infant/patient.ts";

interface TreatActionProps {
  open: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  onTreat: (patientId: string, counselorId?: string, facilityId?: string, groupPatientIds?: string[]) => void;
}

function getMatchLabel(mult: number): { text: string; color: string } {
  if (mult >= 1.4) return { text: "최적", color: "bg-green-900/60 text-green-300" };
  if (mult >= 1.15) return { text: "보조", color: "bg-sky-900/60 text-sky-300" };
  return { text: "불일치", color: "bg-surface-card-hover/60 text-theme-tertiary" };
}

type Step = "counselor" | "facility" | "group";

const ALL_FACILITY_TEMPLATES: Record<string, { label: string; description: string; effect: string }> = {
  ...FACILITY_TEMPLATES,
  ...CHILD_FACILITY_TEMPLATES as unknown as Record<string, { label: string; description: string; effect: string }>,
  ...INFANT_FACILITY_TEMPLATES as unknown as Record<string, { label: string; description: string; effect: string }>,
};

function getStageMatchMultiplier(stage: string, specialty: string, issue: string): number {
  if (stage === "child") return getChildMatchMultiplier(specialty as ChildSpecialty, issue as ChildIssue);
  if (stage === "infant") return getInfantMatchMultiplier(specialty as InfantSpecialty, issue as InfantIssue);
  return getMatchMultiplier(specialty as import("@/types/counselor.ts").CounselorSpecialty, issue as DominantIssue);
}

function getStageSpecialtyLabel(stage: string, specialty: string): string {
  if (stage === "child") {
    const config = CHILD_SPECIALTY_CONFIG[specialty as ChildSpecialty];
    return config?.label ?? specialty;
  }
  if (stage === "infant") {
    const config = INFANT_SPECIALTY_CONFIG[specialty as InfantSpecialty];
    return config?.label ?? specialty;
  }
  const config = SPECIALTY_CONFIG[specialty as import("@/types/counselor.ts").CounselorSpecialty];
  return config?.label ?? specialty;
}

export default function TreatAction({ open, onClose, preselectedPatientId, onTreat }: TreatActionProps) {
  const activeStage = useGameStore((s) => s.activeStage);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const adultPatients = useGameStore((s) => s.patients);
  const adultCounselors = useGameStore((s) => s.counselors);
  const adultFacilities = useGameStore((s) => s.facilities);
  const adultSelectedFloorId = useGameStore((s) => s.selectedFloorId);
  const adultAp = useGameStore((s) => s.ap);

  // Stage-aware data
  const patients: Record<string, Patient> =
    activeStage === "child" && childStage ? childStage.patients as unknown as Record<string, Patient>
    : activeStage === "infant" && infantStage ? infantStage.patients as unknown as Record<string, Patient>
    : adultPatients;
  const counselors =
    activeStage === "child" && childStage ? childStage.counselors as unknown as Record<string, Counselor>
    : activeStage === "infant" && infantStage ? infantStage.counselors as unknown as Record<string, Counselor>
    : adultCounselors;
  const facilities: Record<string, Facility> =
    activeStage === "child" && childStage ? childStage.facilities as unknown as Record<string, Facility>
    : activeStage === "infant" && infantStage ? infantStage.facilities as unknown as Record<string, Facility>
    : adultFacilities;
  const selectedFloorId =
    activeStage === "child" && childStage ? childStage.selectedFloorId
    : activeStage === "infant" && infantStage ? infantStage.selectedFloorId
    : adultSelectedFloorId;
  const ap =
    activeStage === "child" && childStage ? childStage.ap
    : activeStage === "infant" && infantStage ? infantStage.ap
    : adultAp;

  const [selectedCounselorId, setSelectedCounselorId] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [groupSelection, setGroupSelection] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<Step>("counselor");

  const patient = preselectedPatientId ? patients[preselectedPatientId] : null;
  const counselorList = Object.values(counselors).filter((c) => !c.onLeave);
  // 치료 시설 선택: 센터의 모든 시설 표시 (현재 층에 국한하지 않음)
  const floorFacilities = Object.values(facilities);
  const canTreat = ap >= AP_COST.treat;

  const selectedCounselor = selectedCounselorId ? counselors[selectedCounselorId] : null;
  const selectedFacility = selectedFacilityId ? facilities[selectedFacilityId] : null;

  const handleClose = () => {
    setSelectedCounselorId(null);
    setSelectedFacilityId(null);
    setGroupSelection(new Set());
    setStep("counselor");
    onClose();
  };

  const handleSelectCounselor = (counselorId: string) => {
    setSelectedCounselorId(counselorId);
    if (floorFacilities.length === 0) {
      // 시설 없으면 바로 기본 상담 실행
      if (preselectedPatientId) {
        onTreat(preselectedPatientId, counselorId);
        handleClose();
      }
    } else {
      setStep("facility");
    }
  };

  const handleSelectFacility = (facilityId: string | null) => {
    if (facilityId) {
      const fac = facilities[facilityId];
      const GROUP_FACILITY_TYPES = ["group_room", "group_activity"];
      if (fac && GROUP_FACILITY_TYPES.includes(fac.type)) {
        setSelectedFacilityId(facilityId);
        setStep("group");
        return;
      }
    }
    // 일반 시설 또는 기본 상담 → 즉시 치료
    if (preselectedPatientId) {
      onTreat(preselectedPatientId, selectedCounselorId ?? undefined, facilityId ?? undefined);
      handleClose();
    }
  };

  const handleGroupTreat = () => {
    if (preselectedPatientId) {
      onTreat(
        preselectedPatientId,
        selectedCounselorId ?? undefined,
        selectedFacilityId ?? undefined,
        [...groupSelection],
      );
      handleClose();
    }
  };

  const toggleGroupPatient = (id: string) => {
    setGroupSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!patient) return null;

  // ── Step 1: 상담사 선택 ──
  if (step === "counselor") {
    return (
      <Modal open={open} onClose={handleClose} title="치료받을 상담사를 선택해주세요" bottomSheet>
        <div className="mb-3 p-2 rounded bg-surface-card/50 text-sm">
          <span className="font-medium">{patient.name}</span>{" "}
          <span className="text-xs text-theme-tertiary">
            ({ALL_ISSUE_LABELS[patient.dominantIssue]}, EM {patient.em})
          </span>
        </div>

        {counselorList.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-theme-tertiary mb-3">고용된 상담사가 없습니다</p>
            <button
              onClick={() => handleSelectCounselor("")}
              disabled={!canTreat}
              className={`w-full py-2 text-sm rounded-lg transition-colors ${
                canTreat
                  ? "bg-floor-counseling text-white hover:bg-sky-600"
                  : "bg-surface-disabled text-theme-disabled cursor-not-allowed"
              }`}
            >
              기본 상담 진행 (AP {AP_COST.treat})
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {counselorList.map((c) => (
              <CounselorOption
                key={c.id}
                counselor={c}
                issue={patient.dominantIssue}
                disabled={!canTreat}
                onSelect={() => handleSelectCounselor(c.id)}
                stage={activeStage}
              />
            ))}
          </div>
        )}
      </Modal>
    );
  }

  // ── Step 2: 치료시설 선택 ──
  if (step === "facility") {
    return (
      <Modal open={open} onClose={handleClose} title="치료실을 선택해주세요" bottomSheet>
        <div className="mb-3 p-2 rounded bg-surface-card/50 text-sm">
          <span className="font-medium">{patient.name}</span>
          {selectedCounselor && (
            <span className="text-theme-secondary font-medium"> → {selectedCounselor.name} 상담사</span>
          )}
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {floorFacilities.map((fac) => {
            const template = ALL_FACILITY_TEMPLATES[fac.type] ?? FACILITY_TEMPLATES[fac.type as import("@/types/index.ts").FacilityType];
            const isGroup = fac.type === "group_room" || (fac.type as string) === "group_activity";
            return (
              <button
                key={fac.id}
                onClick={() => handleSelectFacility(fac.id)}
                className="w-full p-3 rounded-lg bg-surface-card hover:bg-surface-card-hover text-left transition-colors border border-theme-subtle text-theme-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{template.label} Lv.{fac.level}</span>
                  <span className="text-xs text-theme-tertiary">EM -{fac.emReduction}</span>
                </div>
                <div className="text-xs text-sky-400/80 mt-0.5">
                  {template.description}
                </div>
                {isGroup && (
                  <div className="text-xs text-teal-400 mt-0.5">
                    추가 {fac.level}명까지 함께 치료 가능
                  </div>
                )}
              </button>
            );
          })}

          {/* 기본 상담 옵션 */}
          <button
            onClick={() => handleSelectFacility(null)}
            className="w-full p-3 rounded-lg bg-surface-card/50 hover:bg-surface-card text-left transition-colors border border-theme-default border-dashed text-theme-secondary"
          >
            <div className="text-sm font-medium">기본 상담</div>
            <div className="text-xs text-theme-tertiary mt-0.5">시설 없이 상담 (EM -8)</div>
          </button>
        </div>

        <button
          onClick={() => { setStep("counselor"); setSelectedCounselorId(null); }}
          className="w-full mt-3 py-1.5 text-xs rounded bg-surface-card-hover/50 text-theme-tertiary hover:bg-surface-card-hover transition-colors"
        >
          ← 상담사 다시 선택
        </button>
      </Modal>
    );
  }

  // ── Step 3: 집단상담실 추가 내담자 선택 ──
  if (step === "group" && selectedFacility) {
    const maxExtra = selectedFacility.level;
    const sameFloorPatients = Object.values(patients).filter(
      (p) => p.currentFloorId === selectedFloorId && p.id !== preselectedPatientId,
    );

    return (
      <Modal open={open} onClose={handleClose} title="같이 치료받을 내담자를 선택해주세요" bottomSheet>
        <div className="mb-3 p-2 rounded bg-surface-card/50 text-sm">
          <span className="text-theme-tertiary">주 내담자:</span>{" "}
          <span className="font-medium">{patient.name}</span>{" "}
          <span className="text-xs text-theme-tertiary">
            ({ALL_ISSUE_LABELS[patient.dominantIssue]}, EM {patient.em})
          </span>
        </div>

        <div className="text-xs text-theme-tertiary mb-2">
          {(ALL_FACILITY_TEMPLATES[selectedFacility.type]?.label ?? selectedFacility.type)} Lv.{selectedFacility.level} — 추가 {maxExtra}명까지
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {sameFloorPatients.map((p) => {
            const selected = groupSelection.has(p.id);
            const disabled = !selected && groupSelection.size >= maxExtra;
            return (
              <button
                key={p.id}
                onClick={() => !disabled && toggleGroupPatient(p.id)}
                disabled={disabled}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors border ${
                  selected
                    ? "bg-teal-900/30 border-teal-600/50 text-theme-primary"
                    : disabled
                      ? "bg-surface-disabled/30 border-theme-default text-theme-disabled cursor-not-allowed"
                      : "bg-surface-card border-theme-subtle text-theme-primary hover:bg-surface-card-hover"
                }`}
              >
                <span className="text-sm">{selected ? "☑" : "☐"}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{p.name}</span>{" "}
                  <span className="text-xs text-theme-tertiary">
                    {ALL_ISSUE_LABELS[p.dominantIssue]}
                  </span>
                </div>
                <span className="text-xs text-theme-tertiary">EM {p.em}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-theme-tertiary mt-2 text-center">
          추가 선택: {groupSelection.size}/{maxExtra}명
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { setStep("facility"); setSelectedFacilityId(null); setGroupSelection(new Set()); }}
            className="flex-1 py-1.5 text-xs rounded bg-surface-card-hover/50 text-theme-tertiary hover:bg-surface-card-hover transition-colors"
          >
            ← 돌아가기
          </button>
          <button
            onClick={handleGroupTreat}
            className="flex-1 py-1.5 text-sm rounded-lg bg-floor-counseling text-white font-medium hover:bg-sky-600 transition-colors"
          >
            치료 시작
          </button>
        </div>
      </Modal>
    );
  }

  return null;
}

function getStarRating(mult: number): string {
  if (mult >= 1.4) return "★★★";
  if (mult >= 1.15) return "★★";
  return "★";
}

function CounselorOption({
  counselor,
  issue,
  disabled,
  onSelect,
  stage,
}: {
  counselor: Counselor;
  issue: DominantIssue;
  disabled: boolean;
  onSelect: () => void;
  stage: string;
}) {
  const displayMode = useGameStore((s) => s.displayMode);
  const isBeginner = displayMode === "beginner";
  const mult = getStageMatchMultiplier(stage, counselor.specialty, issue);
  const match = getMatchLabel(mult);
  const specialtyLabel = getStageSpecialtyLabel(stage, counselor.specialty);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors border ${
        disabled
          ? "bg-surface-disabled text-theme-disabled border-theme-default cursor-not-allowed"
          : "bg-surface-card/80 hover:bg-surface-card-hover border-theme-subtle text-theme-primary"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{counselor.name}</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${match.color}`}>
            {isBeginner ? getStarRating(mult) : match.text}
          </span>
          {!isBeginner && <span className="text-xs text-theme-secondary">x{mult.toFixed(2)}</span>}
        </div>
        <div className="text-xs text-sky-400 mt-0.5">{specialtyLabel}{!isBeginner && ` · 실력 ${counselor.skill}`}</div>
      </div>
      {!isBeginner && (
        <div className="text-xs text-theme-secondary shrink-0">
          상담 {counselor.treatmentCount ?? 0}회
        </div>
      )}
    </button>
  );
}
