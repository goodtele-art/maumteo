import { useState } from "react";
import Modal from "./Modal.tsx";

interface GameMenuProps {
  onClose: () => void;
  onNewGame: () => void;
  onSave: () => void;
  onShowAchievements: () => void;
  hasSave: boolean;
}

export default function GameMenu({ onClose, onNewGame, onSave, onShowAchievements, hasSave }: GameMenuProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Modal open onClose={onClose} title="메뉴">
      <div className="space-y-2">
        <button
          onClick={onSave}
          className="w-full py-2.5 px-4 bg-surface-card hover:bg-surface-card-hover rounded-lg text-sm text-left transition-colors text-theme-primary"
        >
          💾 저장하기
        </button>
        <button
          onClick={() => { onShowAchievements(); onClose(); }}
          className="w-full py-2.5 px-4 bg-surface-card hover:bg-surface-card-hover rounded-lg text-sm text-left transition-colors text-theme-primary"
        >
          🏆 업적
        </button>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full py-2.5 px-4 bg-surface-card hover:bg-surface-card-hover rounded-lg text-sm text-left transition-colors text-theme-primary"
          >
            🔄 새 게임
          </button>
        ) : (
          <div className="border border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-400 mb-2">
              {hasSave
                ? "저장된 진행 상황이 삭제됩니다. 계속하시겠습니까?"
                : "현재 진행 상황이 초기화됩니다."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onNewGame}
                className="flex-1 py-1.5 bg-red-900 hover:bg-red-800 text-red-200 text-sm rounded transition-colors"
              >
                초기화
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-1.5 bg-surface-card-hover hover:bg-surface-card text-sm rounded transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
