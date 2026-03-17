import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import type { AchievementDef } from "@/types/index.ts";

interface AchievementToastProps {
  achievement: AchievementDef | null;
  onDone: () => void;
}

export default function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [achievement, onDone]);

  return (
    <AnimatePresence>
      {visible && achievement && (
        <m.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 glass-card-strong rounded-xl px-5 py-3 shadow-lg border border-yellow-500/30"
        >
          <div className="text-center">
            <div className="text-yellow-400 text-xs font-medium mb-1">🏆 업적 달성!</div>
            <div className="text-sm font-medium">{achievement.title}</div>
            <div className="text-xs text-theme-tertiary mt-0.5">{achievement.description}</div>
            <div className="text-xs text-green-400 mt-1">
              보상: {achievement.reward.type === "gold" && `골드 +${achievement.reward.value}`}
              {achievement.reward.type === "reputation" && `평판 +${achievement.reward.value}`}
              {achievement.reward.type === "ap_permanent" && `AP +${achievement.reward.value} (영구)`}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
