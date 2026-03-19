import { useGameStore } from "@/store/gameStore.ts";
import type { StageId } from "@/types/stage.ts";
import {
  CHILD_STAGE_OPEN_TURN,
  INFANT_STAGE_OPEN_TURN,
} from "@/lib/constants/crossStageConstants.ts";
import { CHILD_INCOME_PER_PATIENT } from "@/lib/constants/childConstants.ts";
import {
  INFANT_INCOME_PER_SESSION,
  INFANT_GOVERNMENT_SUPPORT,
} from "@/lib/constants/infantConstants.ts";

interface CenterInfo {
  id: StageId;
  label: string;
  unlockTurn: number;
}

const CENTERS: CenterInfo[] = [
  { id: "adult", label: "성인센터", unlockTurn: 1 },
  { id: "child", label: "아동센터", unlockTurn: CHILD_STAGE_OPEN_TURN },
  { id: "infant", label: "영유아", unlockTurn: INFANT_STAGE_OPEN_TURN },
];

interface StageStats {
  patientCount: number;
  income: number;
  ap: number;
  maxAp: number;
  alertCount: number;
}

function useStageStats(stageId: StageId): StageStats | null {
  const patients = useGameStore((s) => s.patients);
  const ap = useGameStore((s) => s.ap);
  const maxAp = useGameStore((s) => s.maxAp);
  const reputation = useGameStore((s) => s.reputation);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const currentTurn = useGameStore((s) => s.currentTurn);

  if (stageId === "adult") {
    const patientList = Object.values(patients);
    const alertCount = patientList.filter((p) => p.em >= 80).length;
    const income = patientList.length * 25 + Math.floor(reputation / 10);
    return { patientCount: patientList.length, income, ap, maxAp, alertCount };
  }

  if (stageId === "child") {
    if (currentTurn < CHILD_STAGE_OPEN_TURN || !childStage) return null;
    const patientList = Object.values(childStage.patients);
    const alertCount = patientList.filter((p) => p.em >= 80).length;
    const income = patientList.length * CHILD_INCOME_PER_PATIENT;
    return {
      patientCount: patientList.length,
      income,
      ap: childStage.ap,
      maxAp: childStage.maxAp,
      alertCount,
    };
  }

  if (stageId === "infant") {
    if (currentTurn < INFANT_STAGE_OPEN_TURN || !infantStage) return null;
    const patientList = Object.values(infantStage.patients);
    const alertCount = patientList.filter((p) => p.em >= 80).length;
    const sessionCount = patientList.filter((p) => p.treatmentCount > 0).length;
    const income = sessionCount * INFANT_INCOME_PER_SESSION + INFANT_GOVERNMENT_SUPPORT;
    return {
      patientCount: patientList.length,
      income,
      ap: infantStage.ap,
      maxAp: infantStage.maxAp,
      alertCount,
    };
  }

  return null;
}

function CenterCard({ center }: { center: CenterInfo }) {
  const switchStage = useGameStore((s) => s.switchStage);
  const activeStage = useGameStore((s) => s.activeStage);
  const stats = useStageStats(center.id);
  const isActive = activeStage === center.id;
  const locked = stats === null;

  return (
    <button
      onClick={() => !locked && switchStage(center.id)}
      disabled={locked}
      className={`flex-1 min-w-0 rounded-lg p-3 border transition-colors text-left ${
        locked
          ? "bg-surface-card border-theme-default opacity-50 cursor-not-allowed"
          : isActive
            ? "bg-surface-card border-theme-default shadow-glow-sm"
            : "bg-surface-card border-theme-default hover:bg-surface-card-hover cursor-pointer"
      }`}
    >
      <h3 className="text-sm font-medium text-theme-primary mb-2 whitespace-nowrap">{center.label}</h3>
      {locked ? (
        <p className="text-xs text-theme-tertiary">미개방</p>
      ) : (
        <div className="space-y-1 text-xs text-theme-secondary whitespace-nowrap">
          <div className="flex justify-between gap-2">
            <span>내담자</span>
            <span>{stats.patientCount}명</span>
          </div>
          <div className="flex justify-between">
            <span>수입</span>
            <span className="text-theme-primary">{stats.income}G</span>
          </div>
          <div className="flex justify-between">
            <span>AP</span>
            <span>{stats.ap}/{stats.maxAp}</span>
          </div>
          <div className={`flex justify-between ${stats.alertCount > 0 ? "text-red-400" : "text-theme-tertiary"}`}>
            <span>위기</span>
            <span>{stats.alertCount}건</span>
          </div>
        </div>
      )}
    </button>
  );
}

export default function StageDashboard() {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const unlockedCenters = CENTERS.filter((c) => currentTurn >= c.unlockTurn);

  return (
    <section className="p-3">
      <h2 className="text-sm font-medium text-theme-primary mb-2">센터 현황</h2>
      <div className="flex gap-2">
        {unlockedCenters.map((center) => (
          <CenterCard key={center.id} center={center} />
        ))}
      </div>
    </section>
  );
}
