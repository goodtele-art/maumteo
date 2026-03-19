import { useState } from "react";
import { getFacilityAsset, FACILITY_EMOJI } from "@/lib/assetMap.ts";
import type { AnyFacilityType } from "@/lib/assetMap.ts";
import FacilityIcon from "./FacilityIcon.tsx";
import type { FacilityType } from "@/types/index.ts";

const FACILITY_COLORS: Record<string, string> = {
  // 성인
  individual_room: "bg-sky-900/30 border-sky-700/30",
  group_room: "bg-violet-900/30 border-violet-700/30",
  exposure_lab: "bg-amber-900/30 border-amber-700/30",
  mindfulness_room: "bg-teal-900/30 border-teal-700/30",
  family_room: "bg-pink-900/30 border-pink-700/30",
  activity_room: "bg-green-900/30 border-green-700/30",
  // 아동
  play_room: "bg-yellow-900/30 border-yellow-700/30",
  parent_room: "bg-orange-900/30 border-orange-700/30",
  group_activity: "bg-indigo-900/30 border-indigo-700/30",
  exposure_child: "bg-amber-900/30 border-amber-700/30",
  nutrition_clinic: "bg-lime-900/30 border-lime-700/30",
  crisis_room: "bg-red-900/30 border-red-700/30",
  // 영유아
  infant_play: "bg-pink-900/30 border-pink-700/30",
  sensory_room: "bg-purple-900/30 border-purple-700/30",
  parent_coaching: "bg-orange-900/30 border-orange-700/30",
  language_lab: "bg-cyan-900/30 border-cyan-700/30",
  structured_teaching: "bg-blue-900/30 border-blue-700/30",
};

// 성인 시설 타입인지 확인 (FacilityIcon은 성인 전용)
const ADULT_FACILITY_TYPES = new Set<string>([
  "individual_room", "group_room", "exposure_lab",
  "mindfulness_room", "family_room", "activity_room",
]);

interface FacilityIllustrationProps {
  type: AnyFacilityType;
  level?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function FacilityIllustration({
  type,
  level,
  label,
  size = "sm",
}: FacilityIllustrationProps) {
  const src = getFacilityAsset(type, level);
  const [imgError, setImgError] = useState(false);

  const fillParent = size === "md" || size === "lg";
  const iconSize = size === "sm" ? 20 : size === "md" ? 32 : 48;

  if (!imgError) {
    return (
      <img
        src={src}
        alt={label ?? type}
        className={fillParent ? "w-full h-full object-cover" : "w-12 h-12 rounded-lg object-cover"}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  const colorClass = FACILITY_COLORS[type] ?? "bg-gray-900/30 border-gray-700/30";
  const isAdult = ADULT_FACILITY_TYPES.has(type);

  return (
    <div
      className={`flex flex-col items-center justify-center border ${colorClass} ${
        fillParent ? "w-full h-full" : "w-12 h-12 rounded-lg"
      }`}
    >
      {isAdult ? (
        <FacilityIcon type={type as FacilityType} size={iconSize} className="opacity-60" />
      ) : (
        <span style={{ fontSize: iconSize }}>{FACILITY_EMOJI[type] ?? "🏥"}</span>
      )}
      {size !== "sm" && label && (
        <span className="text-[10px] text-theme-disabled mt-0.5 truncate max-w-full px-1">
          {label}
        </span>
      )}
    </div>
  );
}
