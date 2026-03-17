import type { Patient, Facility, Counselor } from "@/types/index.ts";
import {
  INCOME_PER_PATIENT,
  REPUTATION_INCOME_BONUS,
} from "@/lib/constants.ts";

const MIN_INCOME = 10;

export function calcIncome(
  patients: Record<string, Patient>,
  reputation: number,
): number {
  const patientCount = Object.keys(patients).length;
  const base = patientCount * INCOME_PER_PATIENT;
  const bonus = Math.floor(Math.max(0, reputation) * REPUTATION_INCOME_BONUS);
  return Math.max(MIN_INCOME, base + bonus);
}

export function calcUpkeep(
  facilities: Record<string, Facility>,
  counselors: Record<string, Counselor>,
): number {
  let total = 0;
  for (const f of Object.values(facilities)) {
    total += f.upkeepPerTurn;
  }
  for (const c of Object.values(counselors)) {
    total += c.salary;
  }
  return total;
}

export function canAfford(gold: number, cost: number): boolean {
  return gold >= cost;
}
