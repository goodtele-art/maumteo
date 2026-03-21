import { useEffect, useRef, useState } from "react";
import { IconGold } from "@/components/shared/GameIcons.tsx";

function useAnimatedNumber(target: number, duration = 400): { value: number; changed: boolean } {
  const [display, setDisplay] = useState(target);
  const [changed, setChanged] = useState(false);
  const prevRef = useRef(target);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === target) return;
    prevRef.current = target;
    setChanged(true);

    const start = performance.now();
    const diff = target - prev;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(prev + diff * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setChanged(false);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return { value: display, changed };
}

interface ResourceDisplayProps {
  gold: number;
  reputation: number;
  ap: number;
  maxAp: number;
}

export default function ResourceDisplay({
  gold,
  reputation,
  ap,
  maxAp,
}: ResourceDisplayProps) {
  const animGold = useAnimatedNumber(gold);
  const animRep = useAnimatedNumber(reputation);
  const animAp = useAnimatedNumber(ap, 200);

  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-1.5" title="골드">
        <IconGold size={16} className="text-yellow-400" />
        <span className={`tabular-nums font-mono transition-colors duration-300 ${animGold.changed ? "text-yellow-300" : ""}`}>
          {animGold.value}
        </span>
      </div>
      <div className="flex items-center gap-1.5" title="평판">
        <span className="text-amber-400">★</span>
        <span className={`tabular-nums font-mono text-amber-300 transition-colors duration-300 ${animRep.changed ? "text-amber-200" : ""}`}>
          {animRep.value}
        </span>
      </div>
      <div className="flex items-center gap-1.5" title="행동력">
        <span className="text-green-400 text-base">⚡</span>
        <span className={`tabular-nums font-mono text-green-300 transition-colors duration-300 ${animAp.changed ? "text-green-200" : ""}`}>
          {animAp.value}/{maxAp}
        </span>
      </div>
    </div>
  );
}
