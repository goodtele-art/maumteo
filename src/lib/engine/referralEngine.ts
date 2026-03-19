/**
 * 지역사회 연계 의뢰 엔진 (순수 함수)
 */
import type { CommunityReferral } from "@/types/referral.ts";
import { WEE_CENTER_REFERRAL, PROBATION_REFERRAL } from "@/lib/constants/childConstants.ts";
import { VOUCHER_REFERRAL } from "@/lib/constants/infantConstants.ts";

/** Wee센터 연계 초기 설정 생성 */
export function createWeeReferral(acceptedTurn: number): CommunityReferral {
  return {
    id: "wee_center",
    type: "wee_center",
    active: true,
    acceptedTurn,
    patientsPerTurn: WEE_CENTER_REFERRAL.patientsPerTurn,
    maxPatientsPerTurn: WEE_CENTER_REFERRAL.maxPatientsPerTurn,
    incidentCount: 0,
    paused: false,
    issueDistribution: { ...WEE_CENTER_REFERRAL.issueDistribution },
  };
}

/** 보호관찰소 연계 초기 설정 생성 */
export function createProbationReferral(acceptedTurn: number): CommunityReferral {
  return {
    id: "probation",
    type: "probation",
    active: true,
    acceptedTurn,
    patientsPerTurn: PROBATION_REFERRAL.patientsPerTurn,
    maxPatientsPerTurn: PROBATION_REFERRAL.maxPatientsPerTurn,
    incidentCount: 0,
    paused: false,
    issueDistribution: { ...PROBATION_REFERRAL.issueDistribution },
  };
}

/** 바우처 사업 연계 초기 설정 생성 */
export function createVoucherReferral(acceptedTurn: number): CommunityReferral {
  return {
    id: "voucher",
    type: "voucher",
    active: true,
    acceptedTurn,
    patientsPerTurn: VOUCHER_REFERRAL.patientsPerTurn,
    maxPatientsPerTurn: VOUCHER_REFERRAL.maxPatientsPerTurn,
    incidentCount: 0,
    paused: false,
    issueDistribution: { ...VOUCHER_REFERRAL.issueDistribution },
  };
}

/** 확률 분포에 따라 문제영역 선택 */
export function pickIssueFromDistribution<T extends string>(
  distribution: Record<string, number>,
): T {
  const rand = Math.random();
  let cumulative = 0;
  for (const [issue, weight] of Object.entries(distribution)) {
    cumulative += weight;
    if (rand <= cumulative) return issue as T;
  }
  // fallback: 첫 번째 항목
  return Object.keys(distribution)[0] as T;
}

/** 연계 위기 누적 → 중단 판정 */
export function checkReferralTermination(referral: CommunityReferral): boolean {
  if (referral.type === "wee_center") {
    return referral.incidentCount >= (WEE_CENTER_REFERRAL.maxIncidents);
  }
  if (referral.type === "probation") {
    return referral.incidentCount >= (PROBATION_REFERRAL.maxIncidents);
  }
  return false;
}

/** 위기 발생 시 카운트 증가 */
export function incrementReferralIncident(
  referral: CommunityReferral,
): CommunityReferral {
  return {
    ...referral,
    incidentCount: referral.incidentCount + 1,
  };
}
