/**
 * 수집한 스페셜 편지 목록 모달
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { getIssueLabel } from "@/lib/stories.ts";
import type { CollectedLetter } from "@/store/slices/uiSlice.ts";

interface LetterCollectionProps {
  onClose: () => void;
}

export default function LetterCollection({ onClose }: LetterCollectionProps) {
  const letters = useGameStore((s) => s.specialLetters);
  const [selected, setSelected] = useState<CollectedLetter | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-surface-card rounded-xl p-4 max-w-md w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-theme-primary font-bold text-lg">
            내 스페셜 편지 ({letters.length}통)
          </h2>
          <button onClick={onClose} className="text-theme-tertiary hover:text-theme-primary text-xl">✕</button>
        </div>

        {letters.length === 0 ? (
          <p className="text-theme-tertiary text-sm text-center py-8">
            아직 수집한 스페셜 편지가 없습니다.<br/>
            세 문장 사연의 내담자를 종결시키면 가끔 특별한 편지가 도착합니다.
          </p>
        ) : (
          <div className="space-y-2">
            {letters.map((lt) => (
              <button
                key={lt.id}
                onClick={() => setSelected(lt)}
                className="w-full text-left p-3 rounded-lg bg-surface-card-hover hover:bg-surface-card transition-colors border border-theme-default"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-theme-primary">{lt.patientName}</span>
                  <span className="text-theme-tertiary text-xs">턴 {lt.turn}</span>
                </div>
                <div className="text-theme-secondary text-sm mt-0.5">{getIssueLabel(lt.issue)}</div>
                <div className="text-theme-tertiary text-xs mt-1 truncate">{lt.letter.slice(0, 50)}...</div>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* 편지 상세 보기 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #fef9ef 0%, #fdf6e3 50%, #fef3cd 100%)",
                border: "2px solid #d4a574",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 pt-5 pb-2 text-center border-b border-amber-200/50">
                <div className="text-amber-900 font-bold text-lg">{selected.patientName}</div>
                <div className="text-amber-700/70 text-sm">{getIssueLabel(selected.issue)} · 턴 {selected.turn}</div>
              </div>
              <div className="px-6 py-5">
                <p
                  className="text-amber-900/90 leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: "13px", lineHeight: "1.9" }}
                >
                  {selected.letter}
                </p>
              </div>
              <div className="px-6 pb-5 text-center">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 rounded-lg text-amber-800 border border-amber-300 hover:bg-amber-50 text-sm font-bold"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
