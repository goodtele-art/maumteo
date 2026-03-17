import { clampEM } from "./em.ts";
import type { GameState, SaveData } from "@/types/index.ts";
import type { Patient } from "@/types/patient.ts";
import type { Facility } from "@/types/facility.ts";
import type { Counselor } from "@/types/counselor.ts";

export function serialize(state: GameState): string {
  const data: SaveData = {
    version: 1,
    timestamp: Date.now(),
    currentTurn: state.currentTurn,
    gold: state.gold,
    reputation: state.reputation,
    ap: state.ap,
    maxAp: state.maxAp,
    patients: state.patients,
    facilities: state.facilities,
    counselors: state.counselors,
    turnLog: state.turnLog,
  };
  return JSON.stringify(data);
}

export function deserialize(raw: string): SaveData | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (validateSaveData(data)) {
      repairSaveData(data);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function validateSaveData(data: unknown): data is SaveData {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    obj.version === 1 &&
    typeof obj.timestamp === "number" &&
    typeof obj.currentTurn === "number" &&
    typeof obj.gold === "number" &&
    typeof obj.reputation === "number" &&
    typeof obj.ap === "number" &&
    typeof obj.maxAp === "number" &&
    typeof obj.patients === "object" &&
    obj.patients !== null &&
    typeof obj.facilities === "object" &&
    obj.facilities !== null &&
    typeof obj.counselors === "object" &&
    obj.counselors !== null &&
    Array.isArray(obj.turnLog)
  );
}

/** 범위 밖 값을 clamp하여 안전하게 복구 */
function repairSaveData(data: SaveData): void {
  // 기본 수치 범위 보정
  data.currentTurn = Math.max(1, Math.round(data.currentTurn));
  data.gold = Math.max(0, Math.round(data.gold));
  data.reputation = Math.max(0, Math.min(100, Math.round(data.reputation)));
  data.maxAp = Math.max(1, Math.round(data.maxAp));
  data.ap = Math.max(0, Math.min(data.maxAp, Math.round(data.ap)));

  // 환자 보정
  for (const [id, p] of Object.entries(data.patients)) {
    const patient = p as Patient;
    if (!patient || typeof patient.em !== "number") {
      delete data.patients[id];
      continue;
    }
    patient.em = clampEM(patient.em);
    patient.rapport = Math.max(0, Math.min(100, Math.round(patient.rapport ?? 0)));
    patient.treatmentCount = Math.max(0, Math.round(patient.treatmentCount ?? 0));
  }

  // 시설 보정
  for (const [id, f] of Object.entries(data.facilities)) {
    const facility = f as Facility;
    if (!facility || typeof facility.level !== "number") {
      delete data.facilities[id];
      continue;
    }
    facility.level = Math.max(1, Math.min(3, Math.round(facility.level)));
    facility.upkeepPerTurn = Math.max(0, Math.round(facility.upkeepPerTurn ?? 0));
    facility.emReduction = Math.max(0, Math.round(facility.emReduction ?? 0));
  }

  // 상담사 보정
  for (const [id, c] of Object.entries(data.counselors)) {
    const counselor = c as Counselor;
    if (!counselor || typeof counselor.skill !== "number") {
      delete data.counselors[id];
      continue;
    }
    counselor.skill = Math.max(1, Math.min(10, Math.round(counselor.skill)));
    counselor.salary = Math.max(1, Math.round(counselor.salary ?? 20));
    counselor.treatmentCount = Math.max(0, Math.round(counselor.treatmentCount ?? 0));
  }
}
