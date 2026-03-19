/**
 * 양육 스트레스 관리 엔진 (순수 함수)
 * 바우처 사업 내담자에 대한 부모 지지 시스템
 */
import type { ParentStress, ParentStressSeverity } from "@/types/referral.ts";
import { PARENT_STRESS_SEVERITY_WEIGHTS } from "@/types/referral.ts";
import { VOUCHER_REFERRAL } from "@/lib/constants/infantConstants.ts";

/** 양육 스트레스 발생 확률 체크 (내담자 1명당) */
export function shouldStressOccur(): boolean {
  return Math.random() < VOUCHER_REFERRAL.stressChancePerPatient;
}

/** 스트레스 심각도 결정 (가중 확률) */
export function pickStressSeverity(
  hasDirector: boolean,
): ParentStressSeverity {
  const rand = Math.random();
  let cumulative = 0;

  // 상담실장 있으면 conflict 발생 80% 감소
  const weights = { ...PARENT_STRESS_SEVERITY_WEIGHTS };
  if (hasDirector) {
    weights.conflict *= 0.2;
    // 나머지에 재분배
    const total = weights.concern + weights.distress + weights.conflict;
    weights.concern /= total;
    weights.distress /= total;
    weights.conflict /= total;
  }

  for (const [severity, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand <= cumulative) return severity as ParentStressSeverity;
  }
  return "concern";
}

/** 스트레스 설명 생성 */
export function getStressDescription(severity: ParentStressSeverity): string {
  switch (severity) {
    case "concern":
      return "치료가 효과 있는지 불안해하십니다";
    case "distress":
      return "양육 스트레스로 지쳐있습니다";
    case "conflict":
      return "치료 과실을 주장하고 있습니다";
  }
}

/** 새 양육 스트레스 생성 */
export function createParentStress(
  patientId: string,
  turn: number,
  hasDirector: boolean,
): ParentStress {
  const severity = pickStressSeverity(hasDirector);
  return {
    id: `stress_${turn}_${patientId}`,
    patientId,
    severity,
    description: getStressDescription(severity),
    turnOccurred: turn,
    resolved: false,
  };
}

/** 미해결 스트레스 단계 상승 */
export function escalateStress(stress: ParentStress): ParentStress {
  const nextSeverity: Record<ParentStressSeverity, ParentStressSeverity> = {
    concern: "distress",
    distress: "conflict",
    conflict: "conflict", // 이미 최고 단계
  };
  return {
    ...stress,
    severity: nextSeverity[stress.severity],
    description: getStressDescription(nextSeverity[stress.severity]),
  };
}

/** 법적 분쟁 골드 손실 계산 (현재 골드의 15~25%) */
export function calcConflictGoldLoss(currentGold: number): number {
  const rate = 0.15 + Math.random() * 0.10;
  return Math.round(currentGold * rate);
}

/** 법적 분쟁 누적 체크 → 바우처 자격 박탈 (해결 여부 무관, 총 누적) */
export function checkVoucherRevocation(stresses: ParentStress[]): boolean {
  const totalConflicts = stresses.filter(s => s.severity === "conflict").length;
  return totalConflicts >= 3;
}
