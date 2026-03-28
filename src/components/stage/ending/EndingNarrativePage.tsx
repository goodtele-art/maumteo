/**
 * EndingNarrativePage (3/4) — 후일담 서사 + DNA 유형 축 표시
 */
import { motion } from "motion/react";
import type { EndingNarrative } from "@/lib/engine/endingEngine.ts";
import type { DnaResult } from "@/lib/engine/dnaAnalysis.ts";

interface Props {
  narrative: EndingNarrative;
  dna: DnaResult;
}

/** 축 코드별 색상 */
const AXIS_COLORS: Record<string, string> = {
  E: "#4ade80",
  F: "#60a5fa",
  V: "#a78bfa",
  D: "#f472b6",
  G: "#2dd4bf",
  C: "#fb923c",
  X: "#facc15",
  S: "#e879f9",
};

function NarrativeParagraph({
  text,
  delay,
}: {
  text: string;
  delay: number;
}) {
  return (
    <motion.p
      className="text-sm leading-relaxed text-theme-secondary"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7 }}
    >
      {text}
    </motion.p>
  );
}

export default function EndingNarrativePage({ narrative, dna }: Props) {
  return (
    <div className="min-h-[420px] space-y-5 rounded-xl bg-surface-card p-5">
      {/* 후일담 서사 */}
      <div className="space-y-4">
        <NarrativeParagraph text={narrative.opening} delay={0.2} />
        <NarrativeParagraph text={narrative.reflection} delay={0.8} />
        <NarrativeParagraph text={narrative.closing} delay={1.4} />
      </div>

      {/* DNA 유형 코드 + 이름 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <div className="text-xs text-theme-tertiary">나의 센터장 DNA</div>
        <div className="mt-1 text-3xl font-black tracking-widest">
          {dna.typeCode.split("").map((c, i) => (
            <span key={i} style={{ color: AXIS_COLORS[c] }}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-1 font-bold text-theme-primary">{dna.typeName}</div>
        <div className="mt-0.5 text-xs text-theme-tertiary">
          전국 플레이어 중 상위 {dna.percentile}%
        </div>
      </motion.div>

      {/* 4축 바 */}
      <div className="space-y-2">
        {dna.axes.map((axis, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.0 + i * 0.15 }}
          >
            <div className="mb-0.5 flex justify-between text-[10px] text-theme-tertiary">
              <span>{axis.left}</span>
              <span className="font-medium text-theme-secondary">
                {axis.label}
              </span>
              <span>{axis.right}</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-surface-card-hover">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ background: AXIS_COLORS[axis.code], opacity: 0.8 }}
                initial={{ width: "5%" }}
                animate={{ width: `${Math.max(5, axis.score * 100)}%` }}
                transition={{ delay: 2.2 + i * 0.15, duration: 0.7 }}
              />
              <div className="absolute left-1/2 top-0 h-full w-px bg-theme-tertiary/30" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
