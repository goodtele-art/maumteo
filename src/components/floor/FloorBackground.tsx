import { useState, useEffect } from "react";
import { getFloorBackground } from "@/lib/assetMap.ts";
import type { FloorId } from "@/types/index.ts";

interface FloorBackgroundProps {
  floorId: FloorId;
  children: React.ReactNode;
}

export default function FloorBackground({ floorId, children }: FloorBackgroundProps) {
  const src = getFloorBackground(floorId);
  const [imgError, setImgError] = useState(false);

  // 층 전환 시 에러 상태 리셋
  useEffect(() => setImgError(false), [floorId]);

  const fallbackGradient = `linear-gradient(to bottom right, color-mix(in srgb, var(--color-floor-${floorId}) 80%, var(--surface-base)), color-mix(in srgb, var(--color-floor-${floorId}) 40%, var(--surface-base)))`;
  const overlayGradient = `linear-gradient(to bottom, color-mix(in srgb, var(--surface-base) 40%, transparent), color-mix(in srgb, var(--surface-base) 70%, transparent))`;

  return (
    <div className="relative rounded-xl overflow-hidden">
      {!imgError ? (
        <>
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0" style={{ background: overlayGradient }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: fallbackGradient }} />
      )}

      {/* 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
