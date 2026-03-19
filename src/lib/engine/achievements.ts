import type { AchievementDef } from "@/types/index.ts";
import type { GameState } from "@/types/index.ts";
import { CHILD_ACHIEVEMENTS } from "./childAchievements.ts";
import { INFANT_ACHIEVEMENTS } from "./infantAchievements.ts";

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_discharge",
    title: "첫 상담 종결",
    description: "내담자 1명의 상담을 성공적으로 종결했습니다",
    reward: { type: "gold", value: 50 },
  },
  {
    id: "skilled_counselor",
    title: "숙련 상담사",
    description: "누적 상담 20회를 달성했습니다",
    reward: { type: "gold", value: 100 },
  },
  {
    id: "expansion",
    title: "확장 개시",
    description: "시설 3개를 건설했습니다",
    reward: { type: "ap_permanent", value: 1 },
  },
  {
    id: "crisis_manager",
    title: "위기 관리자",
    description: "사고 없이 5턴을 버텼습니다",
    reward: { type: "reputation", value: 5 },
  },
  {
    id: "full_house",
    title: "풀 하우스",
    description: "동시에 10명 이상의 내담자를 관리합니다",
    reward: { type: "gold", value: 200 },
  },
  {
    id: "team_builder",
    title: "팀 빌더",
    description: "상담사 3명을 고용했습니다",
    reward: { type: "gold", value: 80 },
  },
  {
    id: "survivor",
    title: "생존자",
    description: "턴 10까지 도달했습니다",
    reward: { type: "gold", value: 150 },
  },
  {
    id: "healer",
    title: "치유의 손길",
    description: "내담자 5명의 상담을 종결했습니다",
    reward: { type: "reputation", value: 5 },
  },
  {
    id: "master_match",
    title: "최적 매칭",
    description: "누적 상담 50회를 달성했습니다",
    reward: { type: "gold", value: 200 },
  },
  {
    id: "endurance",
    title: "장기 운영",
    description: "턴 20까지 도달했습니다",
    reward: { type: "ap_permanent", value: 1 },
  },
];

interface CheckContext {
  state: GameState;
  totalDischarges: number;
  totalTreatments: number;
  incidentFreeTurns: number;
}

type Checker = (ctx: CheckContext) => boolean;

const CHECKERS: Record<string, Checker> = {
  first_discharge: (ctx) => ctx.totalDischarges >= 1,
  skilled_counselor: (ctx) => ctx.totalTreatments >= 20,
  expansion: (ctx) => Object.keys(ctx.state.facilities).length >= 3,
  crisis_manager: (ctx) => ctx.incidentFreeTurns >= 5,
  full_house: (ctx) => Object.keys(ctx.state.patients).length >= 10,
  team_builder: (ctx) => Object.keys(ctx.state.counselors).length >= 3,
  survivor: (ctx) => ctx.state.currentTurn >= 10,
  healer: (ctx) => ctx.totalDischarges >= 5,
  master_match: (ctx) => ctx.totalTreatments >= 50,
  endurance: (ctx) => ctx.state.currentTurn >= 20,
};

/** 아직 달성하지 않은 업적 중 조건을 충족한 것들 반환 */
export function checkAchievements(
  state: GameState & { childStage?: unknown; infantStage?: unknown },
  unlockedIds: string[],
): AchievementDef[] {
  const unlocked = new Set(unlockedIds);

  // turnLog에서 통계 추출
  let totalDischarges = 0;
  let totalTreatments = 0;
  let incidentFreeTurns = 0;
  let consecutiveNoIncident = 0;

  for (const entry of state.turnLog) {
    let hasIncident = false;
    for (const ev of entry.events) {
      if (ev.type === "discharge") totalDischarges++;
      if (ev.type === "treatment") totalTreatments++;
      if (ev.type === "incident") hasIncident = true;
    }
    if (!hasIncident) {
      consecutiveNoIncident++;
      incidentFreeTurns = Math.max(incidentFreeTurns, consecutiveNoIncident);
    } else {
      consecutiveNoIncident = 0;
    }
  }

  // 상담사 치료횟수 합산
  for (const c of Object.values(state.counselors)) {
    totalTreatments += c.treatmentCount ?? 0;
  }

  const ctx: CheckContext = { state, totalDischarges, totalTreatments, incidentFreeTurns };

  // 기본 업적 + Stage 2-3 업적 결합
  const allAchievements = [...ACHIEVEMENTS];
  if (state.childStage) {
    allAchievements.push(...CHILD_ACHIEVEMENTS);
  }
  if (state.infantStage) {
    allAchievements.push(...INFANT_ACHIEVEMENTS);
  }

  const newlyUnlocked: AchievementDef[] = [];
  for (const achievement of allAchievements) {
    if (unlocked.has(achievement.id)) continue;
    const checker = CHECKERS[achievement.id];
    if (checker && checker(ctx)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
