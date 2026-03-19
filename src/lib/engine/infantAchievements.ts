import type { AchievementDef } from "@/types/achievement.ts";

/** Stage 3 영유아센터 업적 8종 (plan 정렬) */
export const INFANT_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "infant_first_milestone",
    title: "첫 이정표",
    description: "발달이정표 1개를 달성했습니다",
    reward: { type: "gold", value: 50 },
  },
  {
    id: "infant_golden_time",
    title: "골든타임 수호자",
    description: "골든타임 내에 EM 목표를 달성한 영유아가 5명입니다",
    reward: { type: "reputation", value: 5 },
  },
  {
    id: "infant_miracle",
    title: "발달의 기적",
    description: "모든 이정표를 달성한 영유아 1명을 종결했습니다",
    reward: { type: "ap_permanent", value: 1 },
  },
  {
    id: "infant_parent_coach",
    title: "부모 코치",
    description: "부모매개 중재 50회를 실시했습니다",
    reward: { type: "gold", value: 200 },
  },
  {
    id: "infant_integrated_master",
    title: "통합 마스터",
    description: "3개 센터를 동시에 운영하며 각 센터 내담자 5명 이상을 유지합니다",
    reward: { type: "reputation", value: 15 },
  },
  {
    id: "infant_voucher_expert",
    title: "바우처 전문가",
    description: "바우처 연계 영유아 30명을 종결했습니다",
    reward: { type: "gold", value: 300 },
  },
  {
    id: "infant_stress_resolver",
    title: "양육 스트레스 해결사",
    description: "상담실장이 부모 지지 20건을 자동 해결했습니다",
    reward: { type: "reputation", value: 5 },
  },
  {
    id: "infant_no_conflict",
    title: "무분쟁 센터",
    description: "바우처 사업 10턴 연속 법적 분쟁 0건을 달성했습니다",
    reward: { type: "gold", value: 200 },
  },
];
