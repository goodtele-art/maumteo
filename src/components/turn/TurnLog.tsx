import { useState } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import type { TurnEvent } from "@/types/index.ts";

function formatEvent(event: TurnEvent): string {
  switch (event.type) {
    case "income": return `수입 +${event.amount} 🪙`;
    case "upkeep": return `유지비 -${event.amount} 🪙`;
    case "admission": return `신규 상담 시작`;
    case "discharge": return `상담 종결: "${event.message}"`;
    case "treatment": return `상담 (EM ${event.emBefore}→${event.emAfter})`;
    case "floor_move": return `층 이동 ${event.from}→${event.to}`;
    case "em_increase": return `EM 악화 ${event.emBefore}→${event.emAfter}`;
    case "incident": return `⚠ 사고: ${event.message} (평판 -${event.reputationLoss})`;
  }
}

function eventColor(type: TurnEvent["type"]): string {
  switch (type) {
    case "income": return "text-green-500";
    case "upkeep": return "text-red-400";
    case "admission": return "text-blue-400";
    case "discharge": return "text-teal-400";
    case "treatment": return "text-sky-400";
    case "floor_move": return "text-violet-400";
    case "em_increase": return "text-orange-400";
    case "incident": return "text-red-500 font-medium";
  }
}

export default function TurnLog() {
  const turnLog = useGameStore((s) => s.turnLog);
  const [expanded, setExpanded] = useState(false);

  if (turnLog.length === 0) return null;

  const recent = turnLog.slice(-5).reverse();

  return (
    <div className="border border-theme-default rounded-lg p-3 bg-surface-disabled/30 mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-theme-tertiary hover:text-theme-primary w-full text-left"
      >
        턴 기록 {expanded ? "▲" : "▼"}
      </button>
      {expanded && (
        <div className="mt-2 space-y-3 text-xs max-h-48 overflow-y-auto">
          {recent.map((entry) => (
            <div key={entry.turn} className="border-t border-theme-default pt-2">
              <div className="text-theme-tertiary font-medium mb-1">턴 {entry.turn}</div>
              <div className="space-y-0.5 pl-2">
                {entry.events.map((ev, i) => (
                  <div key={i} className={eventColor(ev.type)}>
                    {formatEvent(ev)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
