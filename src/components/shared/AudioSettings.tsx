import { useState, useCallback } from "react";
import {
  getAudioSettings,
  setBgmVolume,
  setSfxVolume,
  setAmbientVolume,
  toggleBgm,
  toggleSfx,
  toggleAmbient,
  saveAudioSettings,
  sfxClick,
} from "@/lib/audio.ts";

interface SliderRowProps {
  label: string;
  enabled: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (v: number) => void;
}

function SliderRow({ label, enabled, volume, onToggle, onVolume }: SliderRowProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <button
        onClick={onToggle}
        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors ${
          enabled ? "bg-teal-600/30 text-teal-400" : "bg-surface-card text-theme-tertiary"
        }`}
        aria-label={`${label} ${enabled ? "끄기" : "켜기"}`}
      >
        {enabled ? "🔊" : "🔇"}
      </button>
      <span className="text-sm text-theme-secondary w-16">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => onVolume(Number(e.target.value) / 100)}
        disabled={!enabled}
        className="flex-1 h-1.5 accent-teal-500 disabled:opacity-30"
      />
      <span className="text-xs text-theme-tertiary w-8 text-right">
        {enabled ? `${Math.round(volume * 100)}%` : "OFF"}
      </span>
    </div>
  );
}

export default function AudioSettings() {
  const [settings, setSettings] = useState(getAudioSettings);

  const refresh = useCallback(() => {
    setSettings({ ...getAudioSettings() });
    saveAudioSettings();
  }, []);

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-theme-primary mb-2">사운드 설정</h3>
      <SliderRow
        label="배경음악"
        enabled={settings.bgmEnabled}
        volume={settings.bgmVolume}
        onToggle={() => { toggleBgm(); refresh(); }}
        onVolume={(v) => { setBgmVolume(v); refresh(); }}
      />
      <SliderRow
        label="효과음"
        enabled={settings.sfxEnabled}
        volume={settings.sfxVolume}
        onToggle={() => { toggleSfx(); refresh(); }}
        onVolume={(v) => { setSfxVolume(v); refresh(); sfxClick(); }}
      />
      <SliderRow
        label="환경음"
        enabled={settings.ambientEnabled}
        volume={settings.ambientVolume}
        onToggle={() => { toggleAmbient(); refresh(); }}
        onVolume={(v) => { setAmbientVolume(v); refresh(); }}
      />
    </div>
  );
}
