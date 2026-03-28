/**
 * EndingStatsPage (2/4) — CMS 점수 + 6카테고리 바 + 센터별 리포트
 */
import { motion } from "motion/react";
import type { CategoryScore, CenterReport } from "@/lib/engine/endingEngine.ts";

interface Props {
  cmsScore: number;
  cmsGrade: string;
  categoryScores: CategoryScore[];
  centerReports: CenterReport[];
}

const STAGE_EMOJI: Record<string, string> = {
  adult: "🏥",
  child: "🧒",
  infant: "👶",
};

function CategoryBar({ cat, index }: { cat: CategoryScore; index: number }) {
  const pct = cat.max > 0 ? (cat.score / cat.max) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
    >
      <div className="mb-0.5 flex items-center justify-between text-xs">
        <span className="text-theme-secondary">{cat.label}</span>
        <span className="font-bold text-theme-primary">
          {cat.score}/{cat.max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-card-hover">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function CenterCard({ report }: { report: CenterReport }) {
  return (
    <div className="rounded-lg border border-theme-default bg-surface-card p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{STAGE_EMOJI[report.stage] ?? "🏢"}</span>
        <span className="font-bold text-theme-primary">{report.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="font-bold text-theme-primary">{report.discharges}</div>
          <div className="text-theme-tertiary">종결</div>
        </div>
        <div>
          <div className="font-bold text-theme-primary">{report.counselorCount}</div>
          <div className="text-theme-tertiary">상담사</div>
        </div>
        <div>
          <div className="font-bold text-theme-primary">{report.facilityCount}</div>
          <div className="text-theme-tertiary">시설</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-theme-secondary">{report.highlight}</p>
    </div>
  );
}

export default function EndingStatsPage({
  cmsScore,
  cmsGrade,
  categoryScores,
  centerReports,
}: Props) {
  return (
    <div className="min-h-[420px] space-y-4 rounded-xl bg-surface-card p-5">
      {/* CMS 점수 헤더 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xs text-theme-tertiary">종합 관리 점수 (CMS)</div>
        <div className="mt-1 text-4xl font-black text-theme-primary">{cmsScore}</div>
        <div className="mt-0.5 inline-block rounded-full bg-violet-600/20 px-3 py-0.5 text-sm font-bold text-violet-400">
          {cmsGrade}
        </div>
      </motion.div>

      {/* 6카테고리 바 */}
      <div className="space-y-2">
        {categoryScores.map((cat, i) => (
          <CategoryBar key={cat.label} cat={cat} index={i} />
        ))}
      </div>

      {/* 센터별 리포트 */}
      {centerReports.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-theme-secondary">
            센터별 성과
          </h3>
          {centerReports.map((r) => (
            <CenterCard key={r.stage} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
