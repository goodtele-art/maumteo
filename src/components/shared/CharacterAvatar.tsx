import { useState } from "react";
import { getPatientAsset, emToEmotion } from "@/lib/assetMap.ts";
import type { DominantIssue } from "@/types/index.ts";

const ISSUE_EMOJI: Record<string, string> = {
  depression: "😢",
  anxiety: "😰",
  relationship: "😔",
  obsession: "😣",
  trauma: "😨",
  addiction: "😵",
  personality: "😤",
  psychosis: "🌀",
};

const EMOTION_COLORS: Record<string, string> = {
  calm: "bg-teal-800/40 border-teal-600/30",
  neutral: "bg-sky-800/40 border-sky-600/30",
  distress: "bg-red-800/40 border-red-600/30",
};

interface CharacterAvatarProps {
  issue: DominantIssue;
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
        onError={() => setImgError(true)}
      />
    );
  }

  // 플레이스홀더: 감정 컬러 배경 + 이모지
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
