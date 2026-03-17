import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";

const TYPE_STYLES = {
  info: "bg-blue-900/90 border-blue-700",
  success: "bg-green-900/90 border-green-700",
  warning: "bg-amber-900/90 border-amber-700",
};

function NotificationItem({ id, message, type }: { id: string; message: string; type: "info" | "success" | "warning" }) {
  const dismiss = useGameStore((s) => s.dismissNotification);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => dismiss(id), 3000);
    return () => clearTimeout(timerRef.current);
  }, [id, dismiss]);

  return (
    <m.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className={`px-4 py-2 rounded-lg border text-sm text-theme-primary shadow-lg pointer-events-auto ${TYPE_STYLES[type]}`}
    >
      {message}
    </m.div>
  );
}

export default function NotificationToast() {
  const notifications = useGameStore((s) => s.notifications);

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationItem key={n.id} id={n.id} message={n.message} type={n.type} />
        ))}
      </AnimatePresence>
    </div>
  );
}
