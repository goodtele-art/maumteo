/**
 * 튜토리얼 턴별 설정 (1~10턴)
 * 11턴 이후에는 모든 제한 해제
 */

import { TUTORIAL_END_TURN } from "@/lib/constants/crossStageConstants.ts";

/** 이번 턴에 새로 해금된 기능 (깜박임+크게 표시) */
export type NewFeature = "encourage" | "treat" | "build" | "hire" | "upgrade" | "sidebar" | "modeToggle" | "reputation" | "letter" | "backstory";

export interface TutorialTurnConfig {
  maxAp: number;
  maxPatients: number;
  showSidebar: boolean;
  showBuildButton: boolean;
  showHireButton: boolean;
  showUpgradeButton: boolean;
  showEncourageButton: boolean;
  showTreatButton: boolean;
  showModeToggle: boolean;
  showReputationGrade: boolean;
  showLetterButton: boolean;
  uiScale: number;            // 1.0 = 현재 크기, 2.0 = 2배
  guideId: string;
  newFeatures: NewFeature[];   // 이번 턴에 새로 해금 → 깜박임
}

const DEFAULTS: TutorialTurnConfig = {
  maxAp: 6,
  maxPatients: 15,
  showSidebar: true,
  showBuildButton: true,
  showHireButton: true,
  showUpgradeButton: true,
  showEncourageButton: true,
  showTreatButton: true,
  showModeToggle: true,
  showReputationGrade: true,
  showLetterButton: true,
  uiScale: 1.0,
  guideId: "",
  newFeatures: [],
};

/** 턴별 오버라이드 (Partial로 필요한 것만 지정, 나머지는 이전 턴 상속) */
const OVERRIDES: Record<number, Partial<TutorialTurnConfig>> = {
  1: {
    maxAp: 1,
    maxPatients: 1,
    showSidebar: false,
    showBuildButton: false,
    showHireButton: false,
    showUpgradeButton: false,
    showTreatButton: false,
    showModeToggle: false,
    showReputationGrade: false,
    showLetterButton: false,
    uiScale: 2.0,
    guideId: "tut_welcome",
    newFeatures: ["encourage"],
  },
  2: {
    maxAp: 2,
    maxPatients: 2,
    showTreatButton: true,
    uiScale: 2.0,
    guideId: "tut_counselor",
    newFeatures: ["treat"],
  },
  3: {
    maxAp: 3,
    maxPatients: 3,
    showSidebar: true,
    uiScale: 1.5,
    guideId: "tut_sidebar",
    newFeatures: ["sidebar"],
  },
  4: {
    maxAp: 4,
    maxPatients: 4,
    showBuildButton: true,
    uiScale: 1.5,
    guideId: "tut_build",
    newFeatures: ["build"],
  },
  5: {
    maxAp: 5,
    maxPatients: 5,
    showHireButton: true,
    uiScale: 1.2,
    guideId: "tut_hire",
    newFeatures: ["hire"],
  },
  6: {
    maxAp: 5,
    maxPatients: 6,
    uiScale: 1.2,
    guideId: "tut_backstory",
    newFeatures: ["backstory"],
  },
  7: {
    maxAp: 6,
    maxPatients: 8,
    showModeToggle: true,
    uiScale: 1.1,
    guideId: "tut_displaymode",
    newFeatures: ["modeToggle"],
  },
  8: {
    showReputationGrade: true,
    showLetterButton: false, // 편지 버튼은 첫 스페셜 편지 수신 시 등장
    uiScale: 1.0,
    guideId: "tut_reputation",
    newFeatures: ["reputation"],
  },
  9: {
    showUpgradeButton: true,
    guideId: "tut_upgrade",
    newFeatures: ["upgrade"],
  },
  10: {
    guideId: "tut_complete",
    newFeatures: [],
  },
};

/** 턴에 해당하는 튜토리얼 설정 반환. 11턴 이후에는 모든 제한 해제. */
export function getTutorialConfig(turn: number): TutorialTurnConfig {
  if (turn > TUTORIAL_END_TURN) return DEFAULTS;

  // 1턴부터 해당 턴까지 오버라이드를 누적 적용
  let config = { ...DEFAULTS };
  // 1턴은 기본값 대신 최소 상태에서 시작
  const turn1Base: TutorialTurnConfig = {
    ...DEFAULTS,
    maxAp: 1, maxPatients: 1,
    showSidebar: false, showBuildButton: false, showHireButton: false,
    showUpgradeButton: false, showTreatButton: false, showModeToggle: false,
    showReputationGrade: false, showLetterButton: false,
    uiScale: 2.0, guideId: "", newFeatures: [],
  };
  config = { ...turn1Base };

  for (let t = 1; t <= turn; t++) {
    const ov = OVERRIDES[t];
    if (ov) {
      // newFeatures는 해당 턴에만 적용 (누적 X)
      const { newFeatures, ...rest } = ov;
      config = { ...config, ...rest, newFeatures: t === turn ? (newFeatures ?? []) : [] };
    }
  }
  return config;
}

/** 튜토리얼 중인지 */
export function isTutorialTurn(turn: number): boolean {
  return turn <= TUTORIAL_END_TURN;
}
