import { AnimatePresence, m } from "motion/react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center"
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
            className="relative glass-card-strong rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl bg-surface-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
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
