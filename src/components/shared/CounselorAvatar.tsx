import { useState } from "react";
import { getCounselorAsset } from "@/lib/assetMap.ts";
import { SPECIALTY_CONFIG } from "@/lib/constants.ts";
import { CHILD_SPECIALTY_CONFIG } from "@/lib/constants/childConstants.ts";
import { INFANT_SPECIALTY_CONFIG } from "@/lib/constants/infantConstants.ts";

const SPECIALTY_EMOJI: Record<string, string> = {
  // 성인
  cbt: "🧠", psychodynamic: "💭", interpersonal: "🤝",
  dbt: "⚖️", trauma_focused: "🛡️", family_systemic: "👨‍👩‍👧",
  // 아동
  child_cbt: "🧒🧠", play_therapy: "🧸", parent_training: "👨‍👧",
  dbt_a: "⚖️🧒", tf_cbt: "🛡️🧒", family_therapy: "👨‍👩‍👧‍👦",
  // 영유아
  aba: "📊", developmental: "🌱", attachment_therapy: "🤗",
  sensory_integration: "🖐️", speech_language: "💬",
};

function getSpecialtyLabel(specialty: string): string {
  if (specialty in SPECIALTY_CONFIG) return (SPECIALTY_CONFIG as Record<string, { label: string }>)[specialty]!.label;
  if (specialty in CHILD_SPECIALTY_CONFIG) return (CHILD_SPECIALTY_CONFIG as Record<string, { label: string }>)[specialty]!.label;
  if (specialty in INFANT_SPECIALTY_CONFIG) return (INFANT_SPECIALTY_CONFIG as Record<string, { label: string }>)[specialty]!.label;
  return specialty;
}

interface CounselorAvatarProps {
  specialty: string;
  size?: number;
}

export default function CounselorAvatar({ specialty, size = 32 }: CounselorAvatarProps) {
  const src = getCounselorAsset(specialty as Parameters<typeof getCounselorAsset>[0]);
  const [imgError, setImgError] = useState(false);
  const label = getSpecialtyLabel(specialty);

  if (!imgError) {
    return (
      <img
        src={src}
        alt={label}
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
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      title={label}
    >
      {SPECIALTY_EMOJI[specialty] ?? "👤"}
    </div>
  );
}
