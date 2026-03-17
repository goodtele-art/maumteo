import type { FloorId } from "@/types/index.ts";
import { FLOORS, TREATMENT_VARIANCE } from "@/lib/constants.ts";

export function clampEM(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calcTreatmentEffect(
  baseReduction: number,
  counselorSkill: number,
  rapport: number,
): number {
  const base = Number.isFinite(baseReduction) ? Math.max(0, baseReduction) : 8;
  const skill = Number.isFinite(counselorSkill) ? Math.max(1, counselorSkill) : 1;
  const rap = Number.isFinite(rapport) ? Math.max(0, rapport) : 0;
  const skillMultiplier = 1 + (skill - 1) * 0.1;
  const rapportBonus = rap * 0.005;
  return base * skillMultiplier * (1 + rapportBonus);
}

export function applyVariance(effect: number): number {
  const variance = 1 + (Math.random() * 2 - 1) * TREATMENT_VARIANCE;
  return Math.max(1, effect * variance);
}

export function getFloorForEM(em: number): FloorId {
  const clamped = clampEM(em);
  for (const floor of FLOORS) {
    if (clamped >= floor.emRange[0] && clamped <= floor.emRange[1]) {
      return floor.id;
    }
  }
  return "counseling";
}
