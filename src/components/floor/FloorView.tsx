import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import FloorHeader from "./FloorHeader.tsx";
import FloorBackground from "./FloorBackground.tsx";
import FacilitySlot from "./FacilitySlot.tsx";
import PatientList from "@/components/patient/PatientList.tsx";
import ActionPanel from "@/components/action/ActionPanel.tsx";
import CounselorPanel from "@/components/counselor/CounselorPanel.tsx";
import type { Patient } from "@/types/index.ts";

interface FloorViewProps {
  onTreat: (patientId: string) => void;
  onEncourage: (patientId: string) => void;
  onBuild: (slotIndex: number) => void;
  onUpgrade: (facilityId: string) => void;
  onDemolish: (facilityId: string) => void;
  onFire: (counselorId: string) => void;
}

/** 센터당 최대 시설 슬롯 (성인/아동 6, 영유아 5) */
function getMaxSlots(stage: string): number {
  if (stage === "infant") return 5;
  return 6;
}

type SortMode = "default" | "em_high" | "neglected";

function sortPatients(patients: Patient[], mode: SortMode, currentTurn: number): Patient[] {
  if (mode === "default") return patients;
  return [...patients].sort((a, b) => {
    if (mode === "em_high") return b.em - a.em;
    const aNeglect = currentTurn - a.turnAdmitted - a.treatmentCount;
    const bNeglect = currentTurn - b.turnAdmitted - b.treatmentCount;
    return bNeglect - aNeglect;
  });
}

const SORT_LABELS: Record<SortMode, string> = {
  default: "기본",
  em_high: "EM 높은순",
  neglected: "방치순",
};

/** 스테이지에 따라 적절한 내담자/시설/층 데이터를 반환 */
function useStageData() {
  const activeStage = useGameStore((s) => s.activeStage);
  const adultFloor = useGameStore((s) => s.selectedFloorId);
  const adultFacilities = useGameStore((s) => s.facilities);
  const adultPatients = useGameStore((s) => s.patients);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);

  if (activeStage === "child" && childStage) {
    return {
      stage: "child" as const,
      selectedFloorId: childStage.selectedFloorId as string,
      facilities: childStage.facilities as unknown as Record<string, import("@/types/index.ts").Facility>,
      patients: childStage.patients as unknown as Record<string, Patient>,
    };
  }
  if (activeStage === "infant" && infantStage) {
    return {
      stage: "infant" as const,
      selectedFloorId: infantStage.selectedFloorId as string,
      facilities: infantStage.facilities as unknown as Record<string, import("@/types/index.ts").Facility>,
      patients: infantStage.patients as unknown as Record<string, Patient>,
    };
  }
  return {
    stage: "adult" as const,
    selectedFloorId: adultFloor,
    facilities: adultFacilities,
    patients: adultPatients,
  };
}

export default function FloorView({ onTreat, onEncourage, onBuild, onUpgrade, onDemolish, onFire }: FloorViewProps) {
  const { stage, selectedFloorId, facilities, patients } = useStageData();
  const currentTurn = useGameStore((s) => s.currentTurn);
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const maxSlots = getMaxSlots(stage);

  // 시설: 센터 전체 (층 무관)
  const allFacilities = Object.values(facilities);

  // 내담자: 현재 층의 환자만 표시
  const floorPatients = Object.values(patients).filter(
    (p) => p.currentFloorId === selectedFloorId,
  );

  const sortedPatients = useMemo(
    () => sortPatients(floorPatients, sortMode, currentTurn),
    [floorPatients, sortMode, currentTurn],
  );

  // 시설 슬롯: 기존 시설 + 빈 슬롯 1개(추가 버튼)만 표시 (모바일 최적화)
  const occupiedSlots = allFacilities.map((f) => f.slotIndex);
  const nextEmptySlot = Array.from({ length: maxSlots }, (_, i) => i).find(
    (i) => !occupiedSlots.includes(i),
  );

  const cycleSortMode = () => {
    const modes: SortMode[] = ["default", "em_high", "neglected"];
    const idx = modes.indexOf(sortMode);
    setSortMode(modes[(idx + 1) % modes.length]!);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <FloorBackground floorId={selectedFloorId as import("@/types/index.ts").FloorId}>
          <div className="p-3">
            <FloorHeader floorId={selectedFloorId as import("@/types/index.ts").FloorId} />

            <div className="mb-4">
              <h3 className="text-sm text-theme-tertiary mb-2">시설</h3>
              <div className="grid grid-cols-2 gap-2">
                {allFacilities.map((facility) => (
                  <FacilitySlot
                    key={facility.id}
                    facility={facility}
                    slotIndex={facility.slotIndex}
                    onBuild={onBuild}
                    onUpgrade={onUpgrade}
                    onDemolish={onDemolish}
                  />
                ))}
                {nextEmptySlot !== undefined && (
                  <FacilitySlot
                    key={`empty-${nextEmptySlot}`}
                    facility={null}
                    slotIndex={nextEmptySlot}
                    onBuild={onBuild}
                    onUpgrade={onUpgrade}
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-theme-tertiary">
                  내담자 ({floorPatients.length}명)
                </h3>
                {floorPatients.length > 1 && (
                  <button
                    onClick={cycleSortMode}
                    className="text-xs px-3 py-1.5 rounded-lg bg-surface-card/60 text-theme-tertiary hover:text-theme-primary transition-colors"
                    title="정렬 기준 변경"
                  >
                    ↕ {SORT_LABELS[sortMode]}
                  </button>
                )}
              </div>
              <PatientList patients={sortedPatients} onTreat={onTreat} onEncourage={onEncourage} />
            </div>
          </div>
        </FloorBackground>
      </div>

      <div className="w-full lg:w-64 shrink-0">
        <ActionPanel />
        <CounselorPanel onFire={onFire} />
      </div>
    </div>
  );
}
