/**
 * 골든타임 표시 배지 (영유아 내담자용)
 * 조기개입 남은 턴 카운트다운 또는 확보 완료 표시
 */
import {
  GOLDEN_TIME_TURNS,
  GOLDEN_TIME_EM_TARGET,
} from "@/lib/constants/infantConstants.ts";

interface GoldenTimeIndicatorProps {
  interventionStartTurn: number;
  currentTurn: number;
  em: number;
  goldenTimeTurns?: number;
  emTarget?: number;
}

export default function GoldenTimeIndicator({
  interventionStartTurn,
  currentTurn,
  em,
  goldenTimeTurns = GOLDEN_TIME_TURNS,
  emTarget = GOLDEN_TIME_EM_TARGET,
}: GoldenTimeIndicatorProps) {
  if (em <= emTarget) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
        골든타임 확보!
      </span>
    );
  }

  const deadline = interventionStartTurn + goldenTimeTurns;
  const remaining = Math.max(0, deadline - currentTurn);

  const colorClass =
    remaining <= 3
      ? "bg-red-600/20 text-red-400"
      : "bg-amber-600/20 text-amber-400";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClass}`}
    >
      조기개입 남은 턴: {remaining}
    </span>
  );
}
