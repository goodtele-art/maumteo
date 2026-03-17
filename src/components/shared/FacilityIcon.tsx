import type { FacilityType } from "@/types/index.ts";

interface FacilityIconProps {
  type: FacilityType;
  size?: number;
  className?: string;
}

export default function FacilityIcon({ type, size = 24, className = "" }: FacilityIconProps) {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: `shrink-0 ${className}`,
  };

  switch (type) {
    case "individual_room":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <path d="M12 8a2 2 0 100 4 2 2 0 000-4z" fill="currentColor" opacity="0.8" />
          <path d="M8 17c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 4v-1M17 4v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      );

    case "group_room":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="16" cy="8" r="2" fill="currentColor" opacity="0.7" />
          <path d="M4 16c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M12 16c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M6 20h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      );

    case "exposure_lab":
      return (
        <svg {...common}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" opacity="0.15" />
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );

    case "mindfulness_room":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <path d="M12 6c-1.5 2-3 3.5-3 5.5a3 3 0 006 0c0-2-1.5-3.5-3-5.5z" fill="currentColor" opacity="0.6" />
          <path d="M12 16v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.9" />
        </svg>
      );

    case "family_room":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="17" cy="7" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
          <path d="M7 9v3c0 1 1 2 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M17 9v3c0 1-1 2-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M5 21c0-2 1-3 2-3M19 21c0-2-1-3-2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      );

    case "activity_room":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    default: {
      void (type satisfies never);
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <text x="12" y="14" textAnchor="middle" fontSize="10" fill="currentColor">?</text>
        </svg>
      );
    }
  }
}
