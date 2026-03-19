/**
 * 엔딩 화면 — 엔딩 A (턴 60) / 엔딩 S (턴 90)
 * 성적표 + 계속/새 게임 선택
 */
import { motion } from "motion/react";

interface EndingStats {
  totalDischarges: number;
  avgTreatmentTurns: number;
  incidents: number;
  reputation: number;
  gold: number;
}

interface EndingScreenProps {
  endingType: "A" | "S";
  stats: EndingStats;
  onContinue: () => void;
  onNewGame: () => void;
}

const ENDING_CONFIG = {
  A: {
    title: "엔딩 A — 아동의 벗",
    subtitle: "아동청소년의 마음을 밝히는 빛이 되었습니다",
    gradient: "from-violet-900/90 to-indigo-900/90",
  },
  S: {
    title: "엔딩 S — 통합 치유의 빛",
    subtitle: "영유아부터 성인까지, 모든 세대의 마음을 치유했습니다",
    gradient: "from-amber-900/90 to-rose-900/90",
  },
} as const;

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-theme-default py-2">
      <span className="text-theme-secondary">{label}</span>
      <span className="font-bold text-theme-primary">{value}</span>
    </div>
  );
}

export default function EndingScreen({
  endingType,
  stats,
  onContinue,
  onNewGame,
}: EndingScreenProps) {
  const config = ENDING_CONFIG[endingType];

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${config.gradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="mx-4 w-full max-w-md"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* 제목 */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-theme-primary">
            {config.title}
          </h1>
          <p className="text-theme-secondary">{config.subtitle}</p>
        </div>

        {/* 성적표 카드 */}
        <div className="mb-6 rounded-xl bg-surface-card p-6">
          <h2 className="mb-4 text-center text-lg font-semibold text-theme-primary">
            성적표
          </h2>
          <StatRow label="총 상담 종결" value={`${stats.totalDischarges}명`} />
          <StatRow
            label="평균 치료 기간"
            value={`${stats.avgTreatmentTurns.toFixed(1)}턴`}
          />
          <StatRow label="위기 발생 건수" value={`${stats.incidents}건`} />
          <StatRow label="최종 평판" value={stats.reputation} />
          <StatRow label="보유 골드" value={`${stats.gold}G`} />

          <motion.p
            className="mt-4 text-center text-lg font-semibold text-theme-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            총 {stats.totalDischarges}명의 마음을 치유했습니다
          </motion.p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 rounded-lg bg-surface-card-hover px-4 py-3 font-semibold text-theme-primary transition-colors hover:bg-surface-card"
          >
            계속 플레이
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
          >
            새 게임
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
