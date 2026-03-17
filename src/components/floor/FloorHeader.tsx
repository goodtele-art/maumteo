import { FLOORS } from "@/lib/constants.ts";
import type { FloorId } from "@/types/index.ts";

interface FloorHeaderProps {
  floorId: FloorId;
}

export default function FloorHeader({ floorId }: FloorHeaderProps) {
  const floor = FLOORS.find((f) => f.id === floorId);
  if (!floor) return null;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg mb-4 glass-card floor-glow-${floor.id}`}
      style={{ backgroundColor: `color-mix(in srgb, var(--color-${floor.color}) 12%, transparent)` }}
    >
      <span
        className="text-2xl w-10 h-10 flex items-center justify-center rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, var(--color-${floor.color}) 25%, transparent)` }}
      >
        {floor.icon}
      </span>
      <div>
        <h2 className="text-lg font-bold" style={{ color: `var(--color-${floor.color})` }}>
          {floor.label}
        </h2>
        <span className="text-xs text-theme-tertiary">
          EM {floor.emRange[0]}~{floor.emRange[1]}
        </span>
      </div>
    </div>
  );
}
