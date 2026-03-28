import { AnimatePresence, m } from "motion/react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 모바일(<768px)에서 바텀시트 스타일로 표시 */
  bottomSheet?: boolean;
}

export default function Modal({ open, onClose, title, children, bottomSheet }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          className={`fixed inset-0 z-50 flex ${
            bottomSheet ? "items-end md:items-center" : "items-center"
          } justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "var(--overlay-bg)" }}
            onClick={onClose}
          />
          <m.div
            className={`relative glass-card-strong p-6 w-full shadow-2xl bg-surface-card ${
              bottomSheet
                ? "rounded-t-2xl md:rounded-xl max-h-[85vh] overflow-y-auto md:max-w-md md:mx-4"
                : "rounded-xl max-w-md mx-4"
            }`}
            initial={bottomSheet ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
            animate={bottomSheet ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={bottomSheet ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-theme-primary">{title}</h2>
              <button
                onClick={onClose}
                className="text-theme-tertiary hover:text-theme-primary text-xl leading-none"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
