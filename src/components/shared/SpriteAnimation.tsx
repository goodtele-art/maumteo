import { useState } from "react";

interface SpriteAnimationProps {
  /** 스프라이트시트 이미지 경로 */
  src: string;
  /** 프레임 수 (3 또는 4) */
  frames: 3 | 4;
  /** 표시 크기 (px) */
  size?: number;
  /** 정적 이미지 폴백 경로 */
  fallbackSrc?: string;
  /** 이모지 폴백 (이미지 모두 실패 시) */
  fallbackEmoji?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 스프라이트시트 기반 idle 애니메이션 컴포넌트
 * - CSS steps() 타이밍으로 프레임 재생
 * - 스프라이트시트 없으면 정적 이미지 → 이모지 순으로 폴백
 * - prefers-reduced-motion 시 CSS에서 자동 정지
 */
export default function SpriteAnimation({
  src,
  frames,
  size = 64,
  fallbackSrc,
  fallbackEmoji = "😐",
  className = "",
}: SpriteAnimationProps) {
  const [spriteError, setSpriteError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // 스프라이트시트 로드 테스트 (img로 프리로드)
  if (!spriteError) {
    return (
      <>
        {/* 숨겨진 이미지로 로드 성공 여부 확인 */}
        <img
          src={src}
          alt=""
          className="hidden"
          onError={() => setSpriteError(true)}
        />
        <div
          className={`rounded-lg ${frames === 4 ? "sprite-idle-4" : "sprite-idle-3"} ${className}`}
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${src})`,
          }}
          aria-hidden="true"
        />
      </>
    );
  }

  // 정적 이미지 폴백
  if (fallbackSrc && !fallbackError) {
    return (
      <img
        src={fallbackSrc}
        alt=""
        width={size}
        height={size}
        className={`rounded-lg object-cover ${className}`}
        onError={() => setFallbackError(true)}
      />
    );
  }

  // 이모지 폴백
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-surface-card ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      {fallbackEmoji}
    </div>
  );
}
