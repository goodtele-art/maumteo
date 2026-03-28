import { m } from "motion/react";

interface EMBarProps {
  em: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

/** EM 수치에 따라 신호등 색상 반환: 낮으면 초록, 중간 노랑, 높으면 빨강 */
function getEmColor(em: number): string {
  if (em <= 30) return "#22c55e";       // green-500
  if (em <= 60) return "#eab308";       // yellow-500
  if (em <= 80) return "#f97316";       // orange-500
  return "#ef4444";                      // red-500
}

export default function EMBar({ em, size = "md", showValue = true }: EMBarProps) {
  const ratio = em / 100;
  const height = size === "sm" ? "h-2" : "h-3";
  const barColor = getEmColor(em);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${height} rounded-full bg-surface-badge overflow-hidden`}>
        <m.div
          className={`${height} rounded-full`}
          initial={false}
          animate={{ width: `${ratio * 100}%`, backgroundColor: barColor }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showValue && (
        <span
          className={`${size === "sm" ? "text-xs" : "text-sm"} tabular-nums font-mono min-w-[3ch] text-right`}
          style={{ color: barColor }}
        >
          {em}
        </span>
      )}
    </div>
  );
}
