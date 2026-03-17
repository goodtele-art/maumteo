import type { ThemeMode } from "@/hooks/useTheme.ts";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isLight = theme === "light";

  return (
    <button
      onClick={onToggle}
      className="px-2 py-1.5 rounded-lg text-xs font-medium transition-colors bg-surface-card hover:bg-surface-card-hover text-theme-tertiary hover:text-theme-primary"
      title={isLight ? "등대센터 (다크 모드)" : "햇살센터 (브라이트 모드)"}
      aria-label={isLight ? "다크 모드로 전환" : "브라이트 모드로 전환"}
    >
      {isLight ? "🌙" : "☀️"}
    </button>
  );
}
