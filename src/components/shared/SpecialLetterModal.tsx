/**
 * 스페셜 감사편지 모달 — 편지지 배경에 500자 편지 표시
 */
import { motion } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { getIssueLabel } from "@/lib/stories.ts";

export default function SpecialLetterModal() {
  const pending = useGameStore((s) => s.pendingSpecialLetter);
  const letterCount = useGameStore((s) => s.specialLetters.length);
  const collectLetter = useGameStore((s) => s.collectSpecialLetter);
  const addNotification = useGameStore((s) => s.addNotification);
  const dismiss = useGameStore((s) => s.setPendingSpecialLetter);

  if (!pending) return null;

  const issueLabel = getIssueLabel(pending.issue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={() => dismiss(null)}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #fef9ef 0%, #fdf6e3 50%, #fef3cd 100%)",
          border: "2px solid #d4a574",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 편지지 헤더 */}
        <div className="px-6 pt-6 pb-2 text-center border-b border-amber-200/50">
          <div className="text-amber-800/60 text-xs mb-1">스페셜 감사편지</div>
          <div className="text-amber-900 font-bold text-lg">{pending.patientName}</div>
          <div className="text-amber-700/70 text-sm">{issueLabel} · 턴 {pending.turn}</div>
        </div>

        {/* 편지 본문 */}
        <div className="px-6 py-5">
          <p
            className="text-amber-900/90 leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: "13px", lineHeight: "1.9" }}
          >
            {pending.letter}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 pb-5 flex gap-2">
          <button
            onClick={() => {
              const isFirst = letterCount === 0;
              collectLetter(pending);
              if (isFirst) {
                addNotification("📜 스페셜 편지가 상단 편지함에 저장되었습니다! 언제든 다시 읽을 수 있어요.", "success");
              }
            }}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white transition-colors"
            style={{ background: "#b8860b" }}
          >
            소장하기
          </button>
          <button
            onClick={() => dismiss(null)}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm text-amber-800 border border-amber-300 transition-colors hover:bg-amber-50"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
