import { m } from "motion/react";

interface EMBarProps {
  em: number;
  size?: "sm" | "md";
}

export default function EMBar({ em, size = "md" }: EMBarProps) {
  const ratio = em / 100;
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${height} rounded-full bg-surface-badge overflow-hidden`}>
        <m.div
          className={`${height} rounded-full`}
          style={{
            background: `linear-gradient(to right, var(--color-em-low), var(--color-em-high))`,
          }}
          initial={false}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className={`${size === "sm" ? "text-xs" : "text-sm"} tabular-nums font-mono min-w-[3ch] text-right`}>
        {em}
      </span>
    </div>
  );
}
