/**
 * EndingScreen — 4페이지 리치 엔딩 슬라이드쇼
 * IntroScreen 멀티페이지 패턴 참고.
 */
import { useState, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import type { EndingData, EndingTier } from "@/lib/engine/endingEngine.ts";
import EndingTitlePage from "./ending/EndingTitlePage.tsx";
import EndingStatsPage from "./ending/EndingStatsPage.tsx";
import EndingNarrativePage from "./ending/EndingNarrativePage.tsx";
import EndingFinalPage from "./ending/EndingFinalPage.tsx";
import { sfxEndingFanfare } from "@/lib/audio.ts";
import { useEffect } from "react";

interface EndingScreenProps {
  endingData: EndingData;
  onContinue: () => void;
  onNewGame: () => void;
}

const PAGE_COUNT = 4;

const TIER_GRADIENTS: Record<EndingTier, string> = {
  S: "from-amber-900/95 to-rose-900/95",
  A: "from-violet-900/95 to-indigo-900/95",
  B: "from-sky-900/95 to-blue-900/95",
  C: "from-teal-900/95 to-emerald-900/95",
  D: "from-slate-800/95 to-zinc-800/95",
};

export default function EndingScreen({
  endingData,
  onContinue,
  onNewGame,
}: EndingScreenProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    sfxEndingFanfare();
  }, []);

  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(PAGE_COUNT - 1, p + 1)),
    [],
  );

  const isFirst = page === 0;
  const isLast = page === PAGE_COUNT - 1;

  return (
    <m.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${TIER_GRADIENTS[endingData.tier]} overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-4 w-full max-w-lg">
        {/* 페이지 콘텐츠 */}
        <AnimatePresence mode="wait">
          <m.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="max-h-[75vh] overflow-y-auto"
          >
            {page === 0 && (
              <EndingTitlePage
                tier={endingData.tier}
                tierTitle={endingData.tierTitle}
                tierIcon={endingData.tierIcon}
                totalDischarges={endingData.summary.totalDischarges}
              />
            )}
            {page === 1 && (
              <EndingStatsPage
                cmsScore={endingData.cmsScore}
                cmsGrade={endingData.cmsGrade}
                categoryScores={endingData.categoryScores}
                centerReports={endingData.centerReports}
              />
            )}
            {page === 2 && (
              <EndingNarrativePage
                narrative={endingData.narrative}
                dna={endingData.dna}
              />
            )}
            {page === 3 && (
              <EndingFinalPage
                dna={endingData.dna}
                tier={endingData.tier}
                tierTitle={endingData.tierTitle}
                totalDischarges={endingData.summary.totalDischarges}
                cmsScore={endingData.cmsScore}
                onContinue={onContinue}
                onNewGame={onNewGame}
              />
            )}
          </m.div>
        </AnimatePresence>

        {/* 페이지 인디케이터 */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: PAGE_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === page ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`페이지 ${i + 1}`}
            />
          ))}
        </div>

        {/* 내비게이션 버튼 */}
        <div className="mt-3 flex gap-3">
          {!isFirst && (
            <button
              onClick={goPrev}
              className="flex-1 rounded-lg bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/20"
            >
              이전
            </button>
          )}
          {!isLast && (
            <button
              onClick={goNext}
              className="flex-1 rounded-lg bg-white/20 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/30"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </m.div>
  );
}
