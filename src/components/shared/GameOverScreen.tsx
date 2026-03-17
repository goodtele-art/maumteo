import { m } from "motion/react";

interface GameOverScreenProps {
  reason: string;
  turn: number;
  onNewGame: () => void;
}

export default function GameOverScreen({ reason, turn, onNewGame }: GameOverScreenProps) {
  return (
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        className="bg-surface-disabled border border-red-800 rounded-xl p-8 w-full max-w-md mx-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl mb-4">🏚️</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">센터 폐업</h2>
        <p className="text-sm text-theme-tertiary mb-1">턴 {turn}에서 게임이 종료되었습니다</p>
        <p className="text-sm text-theme-secondary mb-6">{reason}</p>
        <button
          onClick={onNewGame}
          className="w-full py-2.5 bg-floor-counseling hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          새 게임 시작
        </button>
      </m.div>
    </m.div>
  );
}
