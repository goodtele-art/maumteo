import { useState } from "react";
import { getPatientAsset, emToEmotion, ISSUE_EMOJI } from "@/lib/assetMap.ts";
import type { AnyIssue, EmotionState } from "@/lib/assetMap.ts";

const EMOTION_COLORS: Record<EmotionState, string> = {
  calm: "bg-teal-800/40 border-teal-600/30",
  neutral: "bg-sky-800/40 border-sky-600/30",
  distress: "bg-red-800/40 border-red-600/30",
};

interface CharacterAvatarProps {
  issue: AnyIssue;
  em: number;
  size?: number;
}

export default function CharacterAvatar({ issue, em, size = 36 }: CharacterAvatarProps) {
  const emotion = emToEmotion(em);
  const src = getPatientAsset(issue, emotion);
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src={src}
        alt={`${issue} ${emotion}`}
        width={size}
        height={size}
        className="rounded-lg object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg border ${EMOTION_COLORS[emotion]}`}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      title={`${issue} (${emotion})`}
    >
      {ISSUE_EMOJI[issue] ?? "😐"}
    </div>
  );
}
