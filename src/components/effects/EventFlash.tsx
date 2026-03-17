import { useEffect, useState } from "react";

type FlashType = "heal" | "crisis" | null;

interface EventFlashProps {
  type: FlashType;
  onComplete?: () => void;
}

/**
 * 화면 전체 플래시 효과 (pointer-events: none)
 * - heal: teal 빛 플래시
 * - crisis: red 플래시 + 화면 셰이크
 */
export default function EventFlash({ type, onComplete }: EventFlashProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!type) return;
    setActive(true);

    // crisis: 화면 흔들기
    if (type === "crisis") {
      document.documentElement.classList.add("screen-shake");
    }

    const timer = setTimeout(() => {
      setActive(false);
      document.documentElement.classList.remove("screen-shake");
      onComplete?.();
    }, 500);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("screen-shake");
    };
  }, [type, onComplete]);

  if (!active || !type) return null;

  const bg =
    type === "heal"
      ? "bg-teal-500/10"
      : "bg-red-500/15";

  return (
    <div
      className={`fixed inset-0 z-40 pointer-events-none ${bg} animate-flash`}
      aria-hidden="true"
    />
  );
}
