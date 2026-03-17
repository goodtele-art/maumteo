import { useState } from "react";
import { getFacilityAsset } from "@/lib/assetMap.ts";
import { FACILITY_TEMPLATES } from "@/lib/constants.ts";
import FacilityIcon from "./FacilityIcon.tsx";
import type { FacilityType } from "@/types/index.ts";

const FACILITY_COLORS: Record<FacilityType, string> = {
  individual_room: "bg-sky-900/30 border-sky-700/30",
  group_room: "bg-violet-900/30 border-violet-700/30",
  exposure_lab: "bg-amber-900/30 border-amber-700/30",
  mindfulness_room: "bg-teal-900/30 border-teal-700/30",
  family_room: "bg-pink-900/30 border-pink-700/30",
  activity_room: "bg-green-900/30 border-green-700/30",
};

interface FacilityIllustrationProps {
  type: FacilityType;
  size?: "sm" | "md" | "lg";
}

export default function FacilityIllustration({ type, size = "sm" }: FacilityIllustrationProps) {
  const src = getFacilityAsset(type);
  const [imgError, setImgError] = useState(false);
  const template = FACILITY_TEMPLATES[type];

  // md/lg 사이즈: 부모 컨테이너에 맞춤 (w-full h-full)
  const fillParent = size === "md" || size === "lg";
  const iconSize = size === "sm" ? 20 : size === "md" ? 32 : 48;

  if (!imgError) {
    return (
      <img
        src={src}
        alt={template.label}
        className={fillParent ? "w-full h-full object-cover" : "w-12 h-12 rounded-lg object-cover"}
        onError={() => setImgError(true)}
      />
    );
  }

  // 플레이스홀더: 컬러 배경 + SVG 아이콘
  return (
    <div
      className={`flex flex-col items-center justify-center border ${FACILITY_COLORS[type]} ${
        fillParent ? "w-full h-full" : "w-12 h-12 rounded-lg"
      }`}
    >
      <FacilityIcon type={type} size={iconSize} className="opacity-60" />
      {size !== "sm" && (
        <span className="text-[10px] text-theme-disabled mt-0.5 truncate max-w-full px-1">
          {template.label}
        </span>
      )}
    </div>
  );
}
