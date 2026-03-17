import { useState } from "react";
import { getCounselorAsset } from "@/lib/assetMap.ts";
import { SPECIALTY_CONFIG } from "@/lib/constants.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

const SPECIALTY_EMOJI: Record<CounselorSpecialty, string> = {
  cbt: "🧠",
  psychodynamic: "💭",
  interpersonal: "🤝",
  dbt: "⚖️",
  trauma_focused: "🛡️",
  family_systemic: "👨‍👩‍👧",
};

interface CounselorAvatarProps {
  specialty: CounselorSpecialty;
  size?: number;
}

export default function CounselorAvatar({ specialty, size = 32 }: CounselorAvatarProps) {
  const src = getCounselorAsset(specialty);
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src={src}
        alt={SPECIALTY_CONFIG[specialty].label}
        width={size}
        height={size}
        className="rounded-lg object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-lg bg-sky-800/30 border border-sky-600/20"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      title={SPECIALTY_CONFIG[specialty].label}
    >
      {SPECIALTY_EMOJI[specialty]}
    </div>
  );
}
