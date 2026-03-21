import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { SPECIALTY_CONFIG } from "@/lib/constants.ts";
import { CHILD_SPECIALTY_CONFIG } from "@/lib/constants/childConstants.ts";
import { INFANT_SPECIALTY_CONFIG } from "@/lib/constants/infantConstants.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";
import { CHILD_ISSUE_LABELS } from "@/lib/engine/childPatient.ts";
import { INFANT_ISSUE_LABELS } from "@/lib/engine/infantPatient.ts";
import { IconHire } from "@/components/shared/GameIcons.tsx";
import CounselorAvatar from "@/components/shared/CounselorAvatar.tsx";
import type { CounselorSpecialty } from "@/types/counselor.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";

interface CounselorPanelProps {
  onFire: (counselorId: string) => void;
}

type AnyCounselor = {
  id: string;
  name: string;
  specialty: string;
  skill: number;
  salary: number;
  treatmentCount: number;
  onLeave?: boolean;
};

function getSpecialtyInfo(specialty: string): { label: string; optimalLabels: string } {
  if (specialty in SPECIALTY_CONFIG) {
    const cfg = SPECIALTY_CONFIG[specialty as CounselorSpecialty];
    return { label: cfg.label, optimalLabels: cfg.optimal.map((i) => ISSUE_LABELS[i]).join(", ") };
  }
  if (specialty in CHILD_SPECIALTY_CONFIG) {
    const cfg = CHILD_SPECIALTY_CONFIG[specialty as ChildSpecialty];
    const labels = cfg.optimalIssues.length > 0
      ? cfg.optimalIssues.map((i) => CHILD_ISSUE_LABELS[i]).join(", ")
      : "라포 ×1.3 (범용)";
    return { label: cfg.label, optimalLabels: labels };
  }
  if (specialty in INFANT_SPECIALTY_CONFIG) {
    const cfg = INFANT_SPECIALTY_CONFIG[specialty as InfantSpecialty];
    return { label: cfg.label, optimalLabels: cfg.optimalIssues.map((i) => INFANT_ISSUE_LABELS[i]).join(", ") };
  }
  return { label: specialty, optimalLabels: "" };
}

const ORDER_KEY = "maumteo_counselor_order";

function getSavedOrder(stageId: string): string[] {
  try {
    const raw = localStorage.getItem(`${ORDER_KEY}_${stageId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOrder(stageId: string, ids: string[]) {
  localStorage.setItem(`${ORDER_KEY}_${stageId}`, JSON.stringify(ids));
}

function sortByOrder(list: AnyCounselor[], order: string[]): AnyCounselor[] {
  if (order.length === 0) return list;
  const orderMap = new Map(order.map((id, i) => [id, i]));
  return [...list].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
}

export default function CounselorPanel({ onFire }: CounselorPanelProps) {
  const activeStage = useGameStore((s) => s.activeStage);
  const adultCounselors = useGameStore((s) => s.counselors);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [, setOrderKey] = useState(0); // force re-render on reorder

  const rawList: AnyCounselor[] = activeStage === "child" && childStage
    ? Object.values(childStage.counselors)
    : activeStage === "infant" && infantStage
      ? Object.values(infantStage.counselors)
      : Object.values(adultCounselors);
  const list = sortByOrder(rawList, getSavedOrder(activeStage));

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const ids = list.map(c => c.id);
    [ids[idx - 1], ids[idx]] = [ids[idx]!, ids[idx - 1]!];
    saveOrder(activeStage, ids);
    setOrderKey(k => k + 1);
  };
  const moveDown = (idx: number) => {
    if (idx >= list.length - 1) return;
    const ids = list.map(c => c.id);
    [ids[idx], ids[idx + 1]] = [ids[idx + 1]!, ids[idx]!];
    saveOrder(activeStage, ids);
    setOrderKey(k => k + 1);
  };

  return (
    <div className="glass-card rounded-lg p-3 mt-3">
      <h3 className="text-sm font-medium text-theme-secondary mb-3 flex items-center gap-1.5">
        <IconHire size={16} />
        상담사 ({list.length}명)
      </h3>

      {list.length === 0 ? (
        <p className="text-xs text-theme-tertiary text-center py-3">
          고용된 상담사가 없습니다
        </p>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {list.map((c, idx) => (
              <CounselorRow
                key={c.id}
                counselor={c}
                isConfirming={confirmId === c.id}
                onConfirmToggle={() => setConfirmId(confirmId === c.id ? null : c.id)}
                onFire={() => { onFire(c.id); setConfirmId(null); }}
                onMoveUp={idx > 0 ? () => moveUp(idx) : undefined}
                onMoveDown={idx < list.length - 1 ? () => moveDown(idx) : undefined}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="text-xs text-theme-tertiary mt-2">
        총 급여: {list.reduce((sum, c) => sum + c.salary, 0)}/턴
      </div>
    </div>
  );
}

interface CounselorRowProps {
  counselor: AnyCounselor;
  isConfirming: boolean;
  onConfirmToggle: () => void;
  onFire: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function CounselorRow({ counselor, isConfirming, onConfirmToggle, onFire, onMoveUp, onMoveDown }: CounselorRowProps) {
  const info = getSpecialtyInfo(counselor.specialty);

  return (
    <m.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, scale: 0.95 }}
      className="bg-surface-card/40 rounded-lg p-2"
    >
      <div className={`flex gap-3 ${counselor.onLeave ? "opacity-50" : ""}`}>
        <div className="shrink-0 flex items-start pt-0.5">
          <CounselorAvatar specialty={counselor.specialty as CounselorSpecialty} size={52} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">
              {counselor.name}
              {counselor.onLeave && <span className="text-xs text-amber-400 ml-1">🌴 휴가 중</span>}
            </div>
            <div className="text-xs text-theme-tertiary shrink-0">실력 {counselor.skill}</div>
          </div>
          <div className="text-xs text-sky-400/80">{info.label}</div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-theme-tertiary">
            <span className="text-theme-primary">{counselor.salary}/턴</span>
            <span>상담 {counselor.treatmentCount ?? 0}회</span>
          </div>
          <div className="text-xs text-theme-tertiary mt-0.5 truncate">
            최적: {info.optimalLabels}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex gap-1">
          {onMoveUp && (
            <button onClick={onMoveUp} className="text-xs px-1.5 py-0.5 text-theme-tertiary hover:text-theme-primary transition-colors" title="위로">▲</button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="text-xs px-1.5 py-0.5 text-theme-tertiary hover:text-theme-primary transition-colors" title="아래로">▼</button>
          )}
        </div>
        <div className="flex gap-1.5">
        {isConfirming ? (
          <div className="flex gap-1.5">
            <button
              onClick={onFire}
              className="text-xs px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors"
            >
              확인
            </button>
            <button
              onClick={onConfirmToggle}
              className="text-xs px-3 py-1.5 bg-surface-card-hover/50 text-theme-tertiary rounded-lg hover:bg-surface-card-hover transition-colors"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={onConfirmToggle}
            className="text-xs px-3 py-1.5 text-theme-tertiary hover:text-red-400 transition-colors"
          >
            해고
          </button>
        )}
        </div>
      </div>
    </m.div>
  );
}
