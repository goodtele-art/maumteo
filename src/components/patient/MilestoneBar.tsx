import type { MilestoneStatus } from "@/types/infant/patient.ts";

interface MilestoneBarProps {
  milestones: MilestoneStatus[];
}

export default function MilestoneBar({ milestones }: MilestoneBarProps) {
  const total = milestones.length;
  const achieved = milestones.filter((m) => m.achieved).length;

  if (total === 0) return null;

  const percent = Math.round((achieved / total) * 100);

  return (
    <div className="space-y-1.5">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-surface-card overflow-hidden border border-theme-default">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-theme-secondary shrink-0">
          {achieved}/{total} 달성
        </span>
      </div>

      {/* Milestone labels */}
      <div className="flex gap-1 flex-wrap">
        {milestones.map((milestone) => (
          <span
            key={milestone.id}
            className={`text-[10px] px-1.5 py-0.5 rounded border ${
              milestone.achieved
                ? "border-teal-600/40 bg-teal-900/30 text-teal-300"
                : "border-theme-default bg-surface-card text-theme-tertiary"
            }`}
            title={
              milestone.achieved && milestone.achievedTurn
                ? `턴 ${milestone.achievedTurn}에 달성`
                : `EM ${milestone.emThreshold} 이하 시 달성`
            }
          >
            {milestone.achieved ? "\u2713 " : ""}{milestone.label}
          </span>
        ))}
      </div>
    </div>
  );
}
