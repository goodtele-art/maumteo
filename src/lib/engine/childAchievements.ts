import type { AchievementDef } from "@/types/achievement.ts";

/** Stage 2 아동센터 업적 8종 (plan 정렬) */
export const CHILD_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "child_first_discharge",
    title: "첫 아동 종결",
    description: "아동 내담자 1명의 상담을 성공적으로 종결했습니다",
    reward: { type: "gold", value: 100 },
  },
  {
    id: "child_play_power",
    title: "놀이의 힘",
    description: "놀이치료실에서 10회 치료를 진행했습니다",
    reward: { type: "reputation", value: 5 },
  },
  {
    id: "child_parent_partner",
    title: "부모 파트너",
    description: "부모참여 적극 상태인 내담자 5명을 종결했습니다",
    reward: { type: "ap_permanent", value: 1 },
  },
  {
    id: "child_school_expert",
    title: "학교 연계 전문가",
    description: "학교자문을 10회 실시했습니다",
    reward: { type: "reputation", value: 3 },
  },
  {
    id: "child_specialist_center",
    title: "아동 전문센터",
    description: "아동센터에서 30명을 종결했습니다",
    reward: { type: "gold", value: 300 },
  },
  {
    id: "child_crisis_guardian",
    title: "위기의 파수꾼",
    description: "Wee센터 연계 내담자 20명을 종결했습니다",
    reward: { type: "reputation", value: 10 },
  },
  {
    id: "child_rehabilitation",
    title: "갱생의 길",
    description: "보호관찰소 연계 내담자 10명을 종결했습니다",
    reward: { type: "gold", value: 200 },
  },
  {
    id: "child_precise_diagnostician",
    title: "정밀 진단가",
    description: "임상심리사로 심리검사 30회 실시했습니다",
    reward: { type: "gold", value: 100 },
  },
];
