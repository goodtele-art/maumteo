/**
 * 게임 UI용 SVG 아이콘 (Kenney/game-icons 스타일)
 * CC0 / CC BY 3.0 영감
 */

interface IconProps {
  size?: number;
  className?: string;
}

const S = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" };

/** 상담/대화 */
export function IconTreat({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.4 8.4 0 0112.5 3h.5a8.48 8.48 0 018 8v.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** 건설/해머 */
export function IconBuild({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 고용/사람+ */
export function IconHire({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** 골드/코인 */
export function IconGold({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.5 9.5a2.5 2.5 0 00-5 0c0 2.5 5 1.5 5 4a2.5 2.5 0 01-5 0M12 6v1.5M12 16.5V18"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** 평판/별 */
export function IconReputation({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** 행동력/번개 */
export function IconAP({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** 메뉴/햄버거 */
export function IconMenu({ size = 20, className = "" }: IconProps) {
  return (
    <svg {...S} width={size} height={size} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
