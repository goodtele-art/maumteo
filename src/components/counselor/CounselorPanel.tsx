import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { SPECIALTY_CONFIG } from "@/lib/constants.ts";
import { ISSUE_LABELS } from "@/lib/engine/patient.ts";
import { IconHire } from "@/components/shared/GameIcons.tsx";
import CounselorAvatar from "@/components/shared/CounselorAvatar.tsx";
import type { Counselor } from "@/types/index.ts";

interface CounselorPanelProps {
  onFire: (counselorId: string) => void;
}

export default function CounselorPanel({ onFire }: CounselorPanelProps) {
  const counselors = useGameStore((s) => s.counselors);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const list = Object.values(counselors);

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
            {list.map((c) => (
              <CounselorRow
                key={c.id}
                counselor={c}
                isConfirming={confirmId === c.id}
                onConfirmToggle={() => setConfirmId(confirmId === c.id ? null : c.id)}
                onFire={() => { onFire(c.id); setConfirmId(null); }}
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
  counselor: Counselor;
  isConfirming: boolean;
  onConfirmToggle: () => void;
  onFire: () => void;
}

function CounselorRow({ counselor, isConfirming, onConfirmToggle, onFire }: CounselorRowProps) {
  const config = SPECIALTY_CONFIG[counselor.specialty];

  return (
    <m.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, scale: 0.95 }}
      className="bg-surface-card/40 rounded-lg p-2"
    >
      <div className={`flex gap-3 ${counselor.onLeave ? "opacity-50" : ""}`}>
        {/* 큰 아바타 */}
        <div className="shrink-0 flex items-start pt-0.5">
          <CounselorAvatar specialty={counselor.specialty} size={52} />
        </div>
        {/* 정보 영역 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">
              {counselor.name}
              {counselor.onLeave && <span className="text-xs text-amber-400 ml-1">🌴 휴가 중</span>}
            </div>
            <div className="text-xs text-theme-tertiary shrink-0">실력 {counselor.skill}</div>
          </div>
          <div className="text-xs text-sky-400/80">{config.label}</div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-theme-tertiary">
            <span className="text-yellow-400">{counselor.salary}/턴</span>
            <span>상담 {counselor.treatmentCount ?? 0}회</span>
          </div>
          <div className="text-xs text-theme-tertiary mt-0.5 truncate">
            최적: {config.optimal.map((i) => ISSUE_LABELS[i]).join(", ")}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-1.5">
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
    </m.div>
  );
}
