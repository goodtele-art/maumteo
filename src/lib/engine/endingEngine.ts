/**
 * 엔딩 엔진 — 순수 함수. side-effect 없음, IO 없음.
 * 엔딩 A (턴 60) / 엔딩 S (턴 90) 데이터 산출.
 */

import type { DnaResult } from "./dnaAnalysis.ts";
import type { LifetimeStats } from "@/store/slices/lifetimeStatsSlice.ts";
import type { ActionStats } from "@/store/slices/turnSlice.ts";
import type { EventChoiceRecord } from "@/store/slices/eventSlice.ts";
import type { Patient } from "@/types/patient.ts";
import type { Facility } from "@/types/facility.ts";
import type { Counselor } from "@/types/counselor.ts";
import type { ChildStageState, InfantStageState } from "@/types/stage.ts";
import { analyzeDna } from "./dnaAnalysis.ts";
import { ISSUE_LABELS } from "./patient.ts";
import { CHILD_ISSUE_LABELS } from "./childPatient.ts";
import { INFANT_ISSUE_LABELS } from "./infantPatient.ts";

// ════════════════════════════════════════
// 타입 정의
// ════════════════════════════════════════

export type EndingTier = "S" | "A" | "B" | "C" | "D";

export interface CategoryScore {
  label: string;
  score: number;
  max: number;
}

export interface CenterReport {
  stage: "adult" | "child" | "infant";
  label: string;
  discharges: number;
  counselorCount: number;
  facilityCount: number;
  highlight: string;
}

export interface EndingSummary {
  totalDischarges: number;
  avgTreatmentTurns: number;
  totalIncidents: number;
  totalGoldEarned: number;
  peakReputation: number;
  topIssue: { issue: string; label: string; count: number };
  topCounselor: { name: string; treatments: number };
}

export interface EndingNarrative {
  opening: string;
  reflection: string;
  closing: string;
}

export interface EndingData {
  endingType: "A" | "S";
  tier: EndingTier;
  tierTitle: string;
  tierIcon: string;
  cmsScore: number;
  cmsGrade: string;
  categoryScores: CategoryScore[];
  dna: DnaResult;
  summary: EndingSummary;
  narrative: EndingNarrative;
  centerReports: CenterReport[];
}

// ════════════════════════════════════════
// 서사 상수 (한국어)
// ════════════════════════════════════════

const TIER_OPENINGS: Record<EndingTier, string> = {
  S: "당신은 전설이 되었습니다. 성인부터 영유아까지, 모든 세대의 마음을 비추는 등대가 되었습니다. 근거기반 치료의 힘을 세상에 알린 센터장으로 역사에 남을 것입니다.",
  A: "당신의 센터는 지역의 자랑이 되었습니다. 과학적 근거에 기반한 치료로 수많은 내담자의 삶을 변화시켰습니다.",
  B: "시행착오도 있었지만, 당신의 센터는 꾸준히 성장했습니다. 내담자들의 감사 편지가 사무실 벽을 가득 채웠습니다.",
  C: "작지만 따뜻한 상담소. 규모는 크지 않았지만, 찾아오는 모든 이에게 진심을 다했습니다.",
  D: "험난한 여정이었습니다. 하지만 포기하지 않았다는 것 자체가 의미 있는 시작입니다. 다음 도전에서는 더 나은 결과를 만들 수 있을 것입니다.",
};

const ENDING_CLOSINGS: Record<"A" | "S", string> = {
  A: "아동청소년의 마음을 밝히는 빛이 되었습니다. 하지만 여정은 여기서 끝이 아닙니다. 영유아발달센터가 당신을 기다리고 있습니다.",
  S: "영유아부터 성인까지, 모든 세대의 마음을 치유하는 통합발달치유원이 완성되었습니다. 당신이 만든 센터는 많은 이들의 인생을 바꾸었습니다.",
};

const TIER_TITLES: Record<EndingTier, string> = {
  S: "전설의 치유자",
  A: "빛나는 센터장",
  B: "성장하는 리더",
  C: "따뜻한 상담사",
  D: "도전하는 초심자",
};

const TIER_ICONS: Record<EndingTier, string> = {
  S: "👑",
  A: "⭐",
  B: "🌟",
  C: "🌱",
  D: "🔰",
};

const CMS_GRADES: Array<{ min: number; grade: string }> = [
  { min: 900, grade: "S+" },
  { min: 850, grade: "S" },
  { min: 750, grade: "A+" },
  { min: 700, grade: "A" },
  { min: 600, grade: "B+" },
  { min: 550, grade: "B" },
  { min: 450, grade: "C+" },
  { min: 400, grade: "C" },
  { min: 300, grade: "D+" },
  { min: 0, grade: "D" },
];

/** 전체 이슈 라벨 맵 (성인 + 아동 + 영유아) */
const ALL_ISSUE_LABELS: Record<string, string> = {
  ...ISSUE_LABELS,
  ...CHILD_ISSUE_LABELS,
  ...INFANT_ISSUE_LABELS,
};

// ════════════════════════════════════════
// 함수 구현
// ════════════════════════════════════════

/**
 * 1. 엔딩 등급 산출
 */
export function calculateEndingTier(
  endingType: "A" | "S",
  reputation: number,
  cmsScore: number,
): EndingTier {
  // S: 엔딩S + CMS 850+ + 평판 90+
  if (endingType === "S" && cmsScore >= 850 && reputation >= 90) {
    return "S";
  }
  // A: CMS 700+ + (엔딩S: 평판75+, 엔딩A: 평판80+)
  if (cmsScore >= 700) {
    const repThreshold = endingType === "S" ? 75 : 80;
    if (reputation >= repThreshold) return "A";
  }
  // B: CMS 550+ + (엔딩S: 평판55+, 엔딩A: 평판60+)
  if (cmsScore >= 550) {
    const repThreshold = endingType === "S" ? 55 : 60;
    if (reputation >= repThreshold) return "B";
  }
  // C: CMS 400+ + (엔딩S: 평판35+, 엔딩A: 평판40+)
  if (cmsScore >= 400) {
    const repThreshold = endingType === "S" ? 35 : 40;
    if (reputation >= repThreshold) return "C";
  }
  // D: 나머지
  return "D";
}

/**
 * 2. CMS 점수 산출 (6카테고리, 최대 1000점)
 */
export function calculateCmsScore(
  lifetimeStats: LifetimeStats,
  reputation: number,
  achievementCount: number,
): { score: number; grade: string; categories: CategoryScore[] } {
  const totalDischarges =
    lifetimeStats.adultDischarges +
    lifetimeStats.childDischarges +
    lifetimeStats.infantDischarges;
  const totalIncidents =
    lifetimeStats.adultIncidents +
    lifetimeStats.childIncidents +
    lifetimeStats.infantIncidents;
  const issueVariety = Object.keys(lifetimeStats.issueDischarges).length;

  // 치료 성과 (300점): totalDischarges × 6, cap 300
  const treatmentScore = Math.min(300, totalDischarges * 6);

  // 경영 효율 (200점): totalGoldEarned / 50, cap 200
  const economyScore = Math.min(200, Math.floor(lifetimeStats.totalGoldEarned / 50));

  // 평판 (150점): reputation × 1.5
  const reputationScore = Math.min(150, Math.floor(reputation * 1.5));

  // 다양성 (150점): issueDischarges에서 종류 수 × 15, cap 150
  const diversityScore = Math.min(150, issueVariety * 15);

  // 윤리 (100점): 100 - totalIncidents × 10, min 0
  const ethicsScore = Math.max(0, 100 - totalIncidents * 10);

  // 성장 (100점): achievements 달성 수 × 4, cap 100
  const growthScore = Math.min(100, achievementCount * 4);

  const categories: CategoryScore[] = [
    { label: "치료 성과", score: treatmentScore, max: 300 },
    { label: "경영 효율", score: economyScore, max: 200 },
    { label: "평판", score: reputationScore, max: 150 },
    { label: "다양성", score: diversityScore, max: 150 },
    { label: "윤리", score: ethicsScore, max: 100 },
    { label: "성장", score: growthScore, max: 100 },
  ];

  const score =
    treatmentScore +
    economyScore +
    reputationScore +
    diversityScore +
    ethicsScore +
    growthScore;

  const grade = CMS_GRADES.find((g) => score >= g.min)?.grade ?? "D";

  return { score, grade, categories };
}

/** 게임 상태에서 센터 보고서 생성에 필요한 데이터 */
interface CenterReportInput {
  counselors: Record<string, { treatmentCount: number }>;
  facilities: Record<string, unknown>;
  patients: Record<string, { dominantIssue: string }>;
}

/**
 * 3. 센터별 보고서 생성
 */
export function buildCenterReports(
  lifetimeStats: LifetimeStats,
  adultState: CenterReportInput,
  childStage: (CenterReportInput & { stage: "child" }) | null,
  infantStage: (CenterReportInput & { stage: "infant" }) | null,
): CenterReport[] {
  const reports: CenterReport[] = [];

  // 성인센터
  reports.push(
    buildSingleReport(
      "adult",
      "성인상담센터",
      lifetimeStats.adultDischarges,
      Object.keys(adultState.counselors).length,
      Object.keys(adultState.facilities).length,
      lifetimeStats.issueDischarges,
      new Set(Object.keys(ISSUE_LABELS)),
    ),
  );

  // 아동센터
  if (childStage) {
    reports.push(
      buildSingleReport(
        "child",
        "아동청소년상담센터",
        lifetimeStats.childDischarges,
        Object.keys(childStage.counselors).length,
        Object.keys(childStage.facilities).length,
        lifetimeStats.issueDischarges,
        new Set(Object.keys(CHILD_ISSUE_LABELS)),
      ),
    );
  }

  // 영유아센터
  if (infantStage) {
    reports.push(
      buildSingleReport(
        "infant",
        "영유아발달센터",
        lifetimeStats.infantDischarges,
        Object.keys(infantStage.counselors).length,
        Object.keys(infantStage.facilities).length,
        lifetimeStats.issueDischarges,
        new Set(Object.keys(INFANT_ISSUE_LABELS)),
      ),
    );
  }

  return reports;
}

/** 단일 센터 보고서 헬퍼 */
function buildSingleReport(
  stage: "adult" | "child" | "infant",
  label: string,
  discharges: number,
  counselorCount: number,
  facilityCount: number,
  issueDischarges: Record<string, number>,
  stageIssueKeys: Set<string>,
): CenterReport {
  // 해당 스테이지 이슈 중 가장 많이 종결한 문제
  let topIssue = "";
  let topCount = 0;
  for (const [issue, count] of Object.entries(issueDischarges)) {
    if (stageIssueKeys.has(issue) && count > topCount) {
      topIssue = issue;
      topCount = count;
    }
  }

  const highlight =
    topIssue && topCount > 0
      ? `가장 많이 치료한 문제: ${ALL_ISSUE_LABELS[topIssue] ?? topIssue} (${topCount}명)`
      : discharges > 0
        ? `총 ${discharges}명 종결`
        : "아직 종결된 내담자가 없습니다";

  return { stage, label, discharges, counselorCount, facilityCount, highlight };
}

/**
 * 4. 서사 텍스트 생성
 */
export function generateNarrative(
  tier: EndingTier,
  dna: DnaResult,
  endingType: "A" | "S",
): EndingNarrative {
  const opening = TIER_OPENINGS[tier];

  // DNA 유형별 리플렉션: getTypeInfo() description 재사용
  const reflection = `당신의 센터장 DNA는 '${dna.typeName}' — ${dna.description}`;

  const closing = ENDING_CLOSINGS[endingType];

  return { opening, reflection, closing };
}

/**
 * 5. 엔딩 데이터 종합 산출
 */
export function calculateEndingData(
  endingType: "A" | "S",
  gameState: {
    reputation: number;
    gold: number;
    counselors: Record<string, Counselor>;
    facilities: Record<string, Facility>;
    patients: Record<string, Patient>;
    childStage: ChildStageState | null;
    infantStage: InfantStageState | null;
  },
  lifetimeStats: LifetimeStats,
  actionStats: ActionStats,
  eventHistory: EventChoiceRecord[],
  achievementCount: number,
): EndingData {
  // CMS 점수 산출
  const cms = calculateCmsScore(
    lifetimeStats,
    gameState.reputation,
    achievementCount,
  );

  // 엔딩 등급
  const tier = calculateEndingTier(endingType, gameState.reputation, cms.score);

  // 총계
  const totalDischarges =
    lifetimeStats.adultDischarges +
    lifetimeStats.childDischarges +
    lifetimeStats.infantDischarges;
  const totalIncidents =
    lifetimeStats.adultIncidents +
    lifetimeStats.childIncidents +
    lifetimeStats.infantIncidents;

  // 평균 치료 턴
  const avgTreatmentTurns =
    lifetimeStats.treatmentTurnCount > 0
      ? Math.round(
          (lifetimeStats.treatmentTurnSum / lifetimeStats.treatmentTurnCount) * 10,
        ) / 10
      : 0;

  // 가장 많이 종결한 문제
  const topIssue = findTopIssue(lifetimeStats.issueDischarges);

  // 가장 많이 치료한 상담사 (전 센터 통합)
  const topCounselor = findTopCounselor(
    gameState.counselors,
    gameState.childStage?.counselors ?? {},
    gameState.infantStage?.counselors ?? {},
  );

  const summary: EndingSummary = {
    totalDischarges,
    avgTreatmentTurns,
    totalIncidents,
    totalGoldEarned: lifetimeStats.totalGoldEarned,
    peakReputation: lifetimeStats.peakReputation,
    topIssue,
    topCounselor,
  };

  // DNA 분석
  const dna = analyzeDna(
    actionStats,
    eventHistory,
    totalDischarges,
    totalIncidents,
    gameState.reputation,
  );

  // 서사
  const narrative = generateNarrative(tier, dna, endingType);

  // 센터별 보고서
  const centerReports = buildCenterReports(
    lifetimeStats,
    {
      counselors: gameState.counselors,
      facilities: gameState.facilities,
      patients: gameState.patients,
    },
    gameState.childStage
      ? {
          stage: "child" as const,
          counselors: gameState.childStage.counselors,
          facilities: gameState.childStage.facilities,
          patients: gameState.childStage.patients,
        }
      : null,
    gameState.infantStage
      ? {
          stage: "infant" as const,
          counselors: gameState.infantStage.counselors,
          facilities: gameState.infantStage.facilities,
          patients: gameState.infantStage.patients,
        }
      : null,
  );

  return {
    endingType,
    tier,
    tierTitle: TIER_TITLES[tier],
    tierIcon: TIER_ICONS[tier],
    cmsScore: cms.score,
    cmsGrade: cms.grade,
    categoryScores: cms.categories,
    dna,
    summary,
    narrative,
    centerReports,
  };
}

// ════════════════════════════════════════
// 내부 헬퍼
// ════════════════════════════════════════

/** issueDischarges에서 가장 많이 종결한 문제 찾기 */
function findTopIssue(
  issueDischarges: Record<string, number>,
): { issue: string; label: string; count: number } {
  let topIssue = "";
  let topCount = 0;
  for (const [issue, count] of Object.entries(issueDischarges)) {
    if (count > topCount) {
      topIssue = issue;
      topCount = count;
    }
  }
  return {
    issue: topIssue,
    label: ALL_ISSUE_LABELS[topIssue] ?? topIssue,
    count: topCount,
  };
}

/** 전 센터 상담사 중 가장 많이 치료한 상담사 찾기 */
function findTopCounselor(
  adultCounselors: Record<string, { name: string; treatmentCount: number }>,
  childCounselors: Record<string, { name: string; treatmentCount: number }>,
  infantCounselors: Record<string, { name: string; treatmentCount: number }>,
): { name: string; treatments: number } {
  let topName = "없음";
  let topTreatments = 0;

  const allCounselors = [
    ...Object.values(adultCounselors),
    ...Object.values(childCounselors),
    ...Object.values(infantCounselors),
  ];

  for (const c of allCounselors) {
    if (c.treatmentCount > topTreatments) {
      topName = c.name;
      topTreatments = c.treatmentCount;
    }
  }

  return { name: topName, treatments: topTreatments };
}
