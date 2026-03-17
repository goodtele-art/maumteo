import { useGameStore } from "@/store/gameStore.ts";
import Modal from "@/components/shared/Modal.tsx";

export default function EventModal() {
  const pendingEvent = useGameStore((s) => s.pendingEvent);
  const resolveEvent = useGameStore((s) => s.resolveEvent);

  if (!pendingEvent) return null;

  const { event } = pendingEvent;

  return (
    <Modal open onClose={() => {}} title={`📋 ${event.title}`}>
      <p className="text-sm text-theme-primary mb-4 leading-relaxed">
        {event.description}
      </p>
      <div className="space-y-2">
        {event.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => resolveEvent(i)}
            className="w-full p-3 rounded-lg bg-surface-card hover:bg-surface-card-hover text-left transition-colors border border-theme-subtle text-theme-primary"
          >
            <span className="text-sm font-medium">{choice.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-theme-tertiary mt-3 text-center">
        턴 {pendingEvent.turn} 이벤트 — 선택지를 골라주세요
      </p>
    </Modal>
  );
}
