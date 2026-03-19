import type { GameEvent } from "@/types/event.ts";

/** Stage 2 아동센터 이벤트 6종 (plan 정렬) */
export const CHILD_EVENTS: GameEvent[] = [
  {
    id: "school_teacher_request",
    title: "학교 교사 상담 요청",
    description: "담임선생님이 아동의 학교생활에 대해 상담을 요청했습니다.",
    choices: [
      {
        label: "학교 방문 상담 수락 (AP-2, 평판+3)",
        effects: [
          { type: "ap", value: -2 },
          { type: "reputation", value: 3 },
        ],
      },
      {
        label: "일정상 어렵다고 안내 (평판-1)",
        effects: [{ type: "reputation", value: -1 }],
      },
    ],
  },
  {
    id: "parent_anxiety",
    title: "부모 불안 표현",
    description: "내담자의 부모님이 치료 경과에 대해 불안을 표현하고 있습니다.",
    choices: [
      {
        label: "경청하며 면담 진행 (AP-1, 부모참여도+10)",
        effects: [
          { type: "ap", value: -1 },
          { type: "parent_involvement", value: 10, targetRandom: true },
        ],
      },
      {
        label: "서면 보고로 대체 (부모참여도-15, 평판-2)",
        effects: [
          { type: "parent_involvement", value: -15, targetRandom: true },
          { type: "reputation", value: -2 },
        ],
      },
    ],
  },
  {
    id: "child_friendship",
    title: "아동 간 우정",
    description: "센터에서 만난 두 아이가 서로 의지하며 친구가 되었습니다. 또래 관계가 치료에 긍정적 영향을 줍니다.",
    choices: [
      {
        label: "따뜻하게 지켜보기 (내담자 2명 EM 각 -5)",
        effects: [
          { type: "em_patient", value: -5, targetRandom: true },
          { type: "em_patient", value: -5, targetRandom: true },
        ],
      },
    ],
  },
  {
    id: "sns_criticism",
    title: "SNS 비난 게시글",
    description: "익명 커뮤니티에 센터를 비난하는 글이 올라왔습니다.",
    choices: [
      {
        label: "공식 해명문 게시 (골드-50, 평판+2)",
        effects: [
          { type: "gold", value: -50 },
          { type: "reputation", value: 2 },
        ],
      },
      {
        label: "무시하고 지나가기 (평판-5)",
        effects: [{ type: "reputation", value: -5 }],
      },
    ],
  },
  {
    id: "academic_presentation",
    title: "학술 발표 초청",
    description: "아동심리학회에서 센터의 사례를 발표해달라는 초청이 왔습니다.",
    choices: [
      {
        label: "발표 수락 (골드-40, 평판+5, 상담사 skill+1)",
        effects: [
          { type: "gold", value: -40 },
          { type: "reputation", value: 5 },
          { type: "counselor_skill", value: 1, targetRandom: true },
        ],
      },
      {
        label: "일정상 불참",
        effects: [],
      },
    ],
  },
  {
    id: "child_abuse_suspicion",
    title: "아동학대 의심",
    description: "상담 중 학대 의심 정황을 발견했습니다. 상담사는 아동학대 신고의무자입니다.",
    choices: [
      {
        label: "즉시 신고 (부모참여도-40, 평판+5)",
        effects: [
          { type: "parent_involvement", value: -40, targetRandom: true },
          { type: "reputation", value: 5 },
        ],
      },
      {
        label: "추가 관찰 후 판단 (법적 리스크)",
        effects: [
          { type: "gold", value: -300 },
        ],
      },
    ],
  },
  {
    id: "center_specialization",
    title: "센터 특화 방향 선택",
    description: "센터의 전문 분야를 정할 시기입니다.",
    choices: [
      {
        label: "외상전문센터 (트라우마/위기 +25%, 기타 -10%)",
        effects: [{ type: "reputation", value: 3 }],
      },
      {
        label: "종합상담센터 (균등, 건설비 -20%)",
        effects: [{ type: "reputation", value: 2 }],
      },
    ],
  },
  {
    id: "crisis_protocol",
    title: "위기 대응 프로토콜",
    description: "내담자에게 위기 상황이 발생했습니다. 긴급 대응이 필요합니다.",
    choices: [
      {
        label: "안전 계획 수립 + 보호자 연락 (AP-2, EM-15)",
        effects: [
          { type: "ap", value: -2 },
          { type: "em_patient", value: -15, targetRandom: true },
        ],
      },
      {
        label: "정신건강의학과 의뢰 (AP-1, 골드-30)",
        effects: [
          { type: "ap", value: -1 },
          { type: "gold", value: -30 },
        ],
      },
      {
        label: "추가 관찰 (평판-10)",
        effects: [{ type: "reputation", value: -10 }],
      },
    ],
  },
];
