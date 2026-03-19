/**
 * 자동 운영 토글 — 센터별 자동/수동 운영 전환
 */
import type { StageId } from "@/types/stage.ts";

interface AutoManageToggleProps {
  stageId: StageId;
  enabled: boolean;
  onToggle: () => void;
}

export default function AutoManageToggle({
  stageId: _stageId,
  enabled,
  onToggle,
}: AutoManageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-3 py-1.5 text-sm transition-colors hover:bg-surface-card-hover"
      title={enabled ? "수동 운영으로 전환" : "자동 운영으로 전환"}
    >
      <span className="text-theme-secondary">
        {enabled ? "자동 운영" : "수동 운영"}
      </span>
      <span
        className={`inline-block h-5 w-9 rounded-full p-0.5 transition-colors ${
          enabled ? "bg-emerald-500" : "bg-gray-600"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
