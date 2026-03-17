import Modal from "@/components/shared/Modal.tsx";
import { useGameStore } from "@/store/gameStore.ts";
import { ACHIEVEMENTS } from "@/lib/engine/achievements.ts";

interface AchievementListProps {
  open: boolean;
  onClose: () => void;
}

export default function AchievementList({ open, onClose }: AchievementListProps) {
  const unlockedIds = useGameStore((s) => s.unlockedAchievementIds);
  const unlocked = new Set(unlockedIds);

  return (
    <Modal open={open} onClose={onClose} title="🏆 업적">
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {ACHIEVEMENTS.map((a) => {
          const done = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={`p-2.5 rounded-lg border ${
                done
                  ? "bg-yellow-900/10 border-yellow-700/30"
                  : "bg-surface-disabled/30 border-theme-default opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{done ? "🏆" : "🔒"}</span>
                <span className={`text-sm font-medium ${done ? "text-yellow-300" : "text-theme-tertiary"}`}>
                  {a.title}
                </span>
              </div>
              <div className="text-xs text-theme-tertiary mt-0.5 pl-6">{a.description}</div>
              {done && (
                <div className="text-xs text-green-400/70 mt-0.5 pl-6">
                  보상: {a.reward.type === "gold" && `골드 +${a.reward.value}`}
                  {a.reward.type === "reputation" && `평판 +${a.reward.value}`}
                  {a.reward.type === "ap_permanent" && `AP +${a.reward.value}`}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-theme-tertiary mt-3 text-center">
        {unlockedIds.length} / {ACHIEVEMENTS.length} 달성
      </p>
    </Modal>
  );
}
