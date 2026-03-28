/**
 * EndingTitlePage (1/4) — 풀스크린 등급 타이틀 + 치유 인원 카운팅
 */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { EndingTier } from "@/lib/engine/endingEngine.ts";
import { getBuildingAsset } from "@/lib/assetMap.ts";

interface Props {
  tier: EndingTier;
  tierTitle: string;
  tierIcon: string;
  totalDischarges: number;
}

const TIER_GRADIENTS: Record<EndingTier, string> = {
  S: "from-amber-900/90 via-yellow-800/80 to-rose-900/90",
  A: "from-violet-900/90 via-indigo-800/80 to-purple-900/90",
  B: "from-sky-900/90 via-cyan-800/80 to-blue-900/90",
  C: "from-teal-900/90 via-emerald-800/80 to-green-900/90",
  D: "from-slate-800/90 via-gray-700/80 to-zinc-800/90",
};

const TIER_SUBTITLES: Record<EndingTier, string> = {
  S: "모든 세대의 마음을 비추는 전설의 등대",
  A: "지역사회가 신뢰하는 빛나는 센터",
  B: "꾸준히 성장하는 든든한 상담소",
  C: "작지만 따뜻한 마음의 안식처",
  D: "포기하지 않는 용기가 빛나는 시작",
};

/** 숫자 카운트업 애니메이션 */
function useCountUp(target: number, duration = 1500, delay = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return value;
}

export default function EndingTitlePage({
  tier,
  tierTitle,
  tierIcon,
  totalDischarges,
}: Props) {
  const count = useCountUp(totalDischarges);

  return (
    <div
      className={`flex min-h-[420px] flex-col items-center justify-center rounded-xl bg-gradient-to-b ${TIER_GRADIENTS[tier]} p-8`}
    >
      {/* 센터 건물 이미지 (크게) */}
      <motion.div
        className="relative mb-2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 14, delay: 0.2 }}
      >
        <img
          src={getBuildingAsset(tier === "S" ? "A" : tier)}
          alt={`${tier}등급 센터`}
          className="w-56 h-56 object-contain drop-shadow-2xl"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* 등급 배지 (건물 우하단) */}
        <motion.span
          className="absolute -bottom-2 -right-2 text-4xl drop-shadow-lg"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 }}
        >
          {tierIcon}
        </motion.span>
      </motion.div>

      {/* 등급명 */}
      <motion.h1
        className="mb-2 text-3xl font-black text-white drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {tierTitle}
      </motion.h1>

      {/* 부제 */}
      <motion.p
        className="mb-8 text-center text-sm text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {TIER_SUBTITLES[tier]}
      </motion.p>

      {/* 치유 인원 카운팅 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span className="text-5xl font-black tabular-nums text-white">
          {count}
        </span>
        <p className="mt-2 text-lg font-semibold text-white/80">
          명의 마음을 치유했습니다
        </p>
      </motion.div>
    </div>
  );
}
