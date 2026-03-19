import type { GameEvent } from "@/types/event.ts";

/** Stage 3 영유아센터 이벤트 6종 (plan 정렬) */
export const INFANT_EVENTS: GameEvent[] = [
  {
    id: "government_early_support",
    title: "정부 조기개입 지원금",
    description: "보건복지부에서 조기개입 프로그램 지원금을 제안했습니다. 보고서 작성이 필요합니다.",
    choices: [
      {
        label: "수락 (골드+150, AP-3)",
        effects: [
          { type: "gold", value: 150 },
          { type: "ap", value: -3 },
        ],
      },
      {
        label: "행정 부담으로 거절",
        effects: [],
      },
    ],
  },
  {
    id: "parent_burnout",
    title: "부모 번아웃",
    description: "영유아 부모님이 양육 스트레스로 지쳐 치료 참여가 어려워졌습니다.",
    choices: [
      {
        label: "휴식 권유 (부모참여도-20, 다음 턴 회복)",
        effects: [
          { type: "parent_involvement", value: -20, targetRandom: true },
        ],
      },
      {
        label: "현행 유지 (부모참여도-10)",
        effects: [
          { type: "parent_involvement", value: -10, targetRandom: true },
        ],
      },
    ],
  },
  {
    id: "developmental_assessment",
    title: "발달검사 의뢰",
    description: "대학병원에서 공동 발달검사 연구를 제안했습니다. 내담자 치료에도 도움이 됩니다.",
    choices: [
      {
        label: "수락 (치료효과 +20% 3턴)",
        effects: [
          { type: "reputation", value: 3 },
        ],
      },
      {
        label: "거절",
        effects: [],
      },
    ],
  },
  {
    id: "sibling_jealousy",
    title: "형제 시기",
    description: "형제가 치료 중인 영유아에게 시기를 느끼며 가정 내 갈등이 심화되고 있습니다.",
    choices: [
      {
        label: "형제 프로그램 개설 (골드-60, 부모참여도+15)",
        effects: [
          { type: "gold", value: -60 },
          { type: "parent_involvement", value: 15, targetRandom: true },
        ],
      },
      {
        label: "가정 내 해결 권유 (부모참여도-10)",
        effects: [
          { type: "parent_involvement", value: -10, targetRandom: true },
        ],
      },
    ],
  },
  {
    id: "milestone_celebration",
    title: "이정표 달성 축하",
    description: "영유아 내담자가 발달 이정표를 달성했습니다! 축하 행사를 열어 사기를 높일 수 있습니다.",
    choices: [
      {
        label: "축하 행사 개최 (골드-30, 전체 부모참여도+5)",
        effects: [
          { type: "gold", value: -30 },
          { type: "parent_involvement", value: 5 },
        ],
      },
      {
        label: "간소하게 축하",
        effects: [
          { type: "parent_involvement", value: 2 },
        ],
      },
    ],
  },
  {
    id: "waiting_list_complaint",
    title: "대기 아동 민원",
    description: "바우처 서비스를 대기 중인 보호자들이 빠른 수용을 요청하고 있습니다.",
    choices: [
      {
        label: "수용 확대 (AP-2, 내담자 한도+3)",
        effects: [
          { type: "ap", value: -2 },
          { type: "patient_limit", value: 3 },
        ],
      },
      {
        label: "현행 유지 (평판-3)",
        effects: [{ type: "reputation", value: -3 }],
      },
    ],
  },
];
