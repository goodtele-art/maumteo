import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import {
  calcTreatmentEffect,
  applyVariance,
  clampEM,
  getFloorForEM,
} from "@/lib/engine/index.ts";

import {
  AP_COST,
  RAPPORT_PER_TREATMENT,
  FACILITY_TEMPLATES,
  FLOORS,
  ISSUE_CONFIG,
  getMatchMultiplier,
} from "@/lib/constants.ts";
import type { Facility, FacilityType, DominantIssue } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

// ── 헬퍼 ──
function getFloorFacilities(facilities: Record<string, Facility>, floorId: string) {
  return Object.values(facilities).filter((f) => f.floorId === floorId);
}

function getFloorEffects(facilities: Record<string, Facility>, floorId: string): Set<string> {
  const effects = new Set<string>();
  for (const f of getFloorFacilities(facilities, floorId)) {
    const t = FACILITY_TEMPLATES[f.type];
    if (t.effect !== "none") effects.add(t.effect);
  }
  return effects;
}

function nextId(prefix: string, records: Record<string, unknown>): string {
  let max = 0;
  for (const id of Object.keys(records)) {
    const n = parseInt(id.replace(`${prefix}_`, ""), 10);
    if (n > max) max = n;
  }
  return `${prefix}_${max + 1}`;
}

/** 단일 시설의 효과로 치료 효과를 계산 */
function calcFacilityTreatEffect(
  facility: Facility | null,
  skill: number,
  rapport: number,
  specialty: CounselorSpecialty | undefined,
  issue: DominantIssue,
): { finalEffect: number; varianceEffect: number; matchMult: number; issueBonus: number; synergy: number } {
  const template = facility ? FACILITY_TEMPLATES[facility.type] : null;
  const baseReduction = facility ? facility.emReduction : 8;

  // 전공 매칭 배율
  let matchMult = specialty ? getMatchMultiplier(specialty, issue) : 0.85;
  // 활동치료실: 불일치 페널티 제거
  if (matchMult < 1.0 && template?.effect === "remove_mismatch_penalty") {
    matchMult = 1.0;
  }

  // 시설 문제영역 보너스 (노출치료실, 가족상담실)
  const issueBonus = (template?.effect === "issue_bonus" && template.bonusIssues.includes(issue)) ? 1.5 : 1.0;

  // 시너지 보너스 (상담사 전공 + 치료실 시너지)
  const synergy = (specialty && template?.synergySpecialties.includes(specialty)) ? 1.2 : 1.0;

  const rawEffect = calcTreatmentEffect(baseReduction, skill, rapport);
  // 마음챙김실: 분산 ±10%, 그 외 ±25%
  const varianceEffect = template?.effect === "reduce_variance"
    ? Math.max(1, rawEffect * (1 + (Math.random() * 2 - 1) * 0.1))
    : applyVariance(rawEffect);
  const finalEffect = varianceEffect * matchMult * issueBonus * synergy;

  return { finalEffect, varianceEffect, matchMult, issueBonus, synergy };
}

export interface TreatResult {
  success: boolean;
  actionType: "treat" | "encourage";
  emBefore: number;
  emAfter: number;
  emDelta: number;
  floorChanged: boolean;
  patientName: string;
  newFloorLabel?: string;
  facilityLabel?: string;
  counselorName?: string;
  groupResults?: Array<{ name: string; emBefore: number; emAfter: number }>;
}

export function useGameActions() {
  /**
   * 시설 기반 치료
   * @param patientId 주 내담자 ID
   * @param counselorId 상담사 ID (없으면 자동 배정)
   * @param facilityId 치료시설 ID (없으면 기본 상담 EM -8)
   * @param groupPatientIds 집단상담실에서 함께 치료할 추가 내담자 ID 배열
   */
  const treat = useCallback((
    patientId: string,
    counselorId?: string,
    facilityId?: string,
    groupPatientIds?: string[],
  ): TreatResult | false => {
    const s = useGameStore.getState();
    if (s.ap < AP_COST.treat) return false;

    const patient = s.patients[patientId];
    if (!patient) return false;

    // 시설 조회
    const facility = facilityId ? s.facilities[facilityId] ?? null : null;
    const template = facility ? FACILITY_TEMPLATES[facility.type] : null;

    // 상담사 선택
    let counselor: typeof s.counselors[string] | undefined;
    if (counselorId && s.counselors[counselorId]) {
      counselor = s.counselors[counselorId];
    } else {
      const counselorList = Object.values(s.counselors).filter((c) => !c.onLeave);
      if (counselorList.length === 0) {
        useGameStore.getState().addNotification("상담사가 없어 기본 효과만 적용됩니다", "warning");
      }
      const scored = counselorList.map((c) => ({
        counselor: c,
        mult: getMatchMultiplier(c.specialty, patient.dominantIssue),
      }));
      scored.sort((a, b) => b.mult - a.mult);
      counselor = scored[0]?.counselor;
    }

    const skill = counselor?.skill ?? 1;
    const specialty = counselor?.specialty;

    // 라포 난이도
    const issueConfig = ISSUE_CONFIG[patient.dominantIssue];
    const rapportGain = Math.round(RAPPORT_PER_TREATMENT / issueConfig.rapportDifficulty);

    // 주 내담자 치료 효과 계산
    const { finalEffect } = calcFacilityTreatEffect(facility, skill, patient.rapport, specialty, patient.dominantIssue);

    const emBefore = patient.em;
    const emAfter = clampEM(patient.em - finalEffect);
    const newFloorId = getFloorForEM(emAfter);
    const floorChanged = newFloorId !== patient.currentFloorId;

    // 주 내담자 상태 업데이트
    useGameStore.setState((prev) => {
      const p = prev.patients[patientId];
      if (!p) return prev;
      const updatedCounselors = counselor
        ? {
            ...prev.counselors,
            [counselor.id]: {
              ...prev.counselors[counselor.id]!,
              treatmentCount: (prev.counselors[counselor.id]?.treatmentCount ?? 0) + 1,
            },
          }
        : prev.counselors;
      return {
        ap: prev.ap - AP_COST.treat,
        patients: {
          ...prev.patients,
          [patientId]: {
            ...p,
            em: emAfter,
            currentFloorId: newFloorId,
            rapport: Math.min(100, p.rapport + rapportGain),
            treatmentCount: p.treatmentCount + 1,
          },
        },
        counselors: updatedCounselors,
      };
    });

    // 층 이동 알림은 App.tsx에서 치료 결과 메시지 이후에 표시

    // 집단상담실: 플레이어가 선택한 추가 내담자 치료 (각 70%)
    const groupResults: Array<{ name: string; emBefore: number; emAfter: number }> = [];
    if (facility?.type === "group_room" && groupPatientIds && groupPatientIds.length > 0) {
      for (const gpId of groupPatientIds) {
        const currentState = useGameStore.getState();
        const gp = currentState.patients[gpId];
        if (!gp) continue;

        const groupEffect = finalEffect * 0.7;
        const gpEmAfter = clampEM(gp.em - groupEffect);
        const gpNewFloor = getFloorForEM(gpEmAfter);

        groupResults.push({ name: gp.name, emBefore: gp.em, emAfter: gpEmAfter });

        useGameStore.setState((prev) => {
          const g = prev.patients[gpId];
          if (!g) return prev;
          return {
            patients: {
              ...prev.patients,
              [gpId]: {
                ...g,
                em: gpEmAfter,
                currentFloorId: gpNewFloor,
                rapport: Math.min(100, g.rapport + Math.round(rapportGain * 0.5)),
                treatmentCount: g.treatmentCount + 1,
              },
            },
          };
        });
      }
    }

    return {
      success: true,
      actionType: "treat" as const,
      emBefore,
      emAfter,
      emDelta: emBefore - emAfter,
      floorChanged,
      patientName: patient.name,
      newFloorLabel: floorChanged ? (FLOORS.find((f) => f.id === newFloorId)?.label ?? newFloorId) : undefined,
      facilityLabel: template?.label,
      counselorName: counselor?.name,
      groupResults,
    };
  }, []);

  const encourage = useCallback((patientId: string): TreatResult | false => {
    const s = useGameStore.getState();
    if (s.ap < AP_COST.encourage) return false;

    const patient = s.patients[patientId];
    if (!patient) return false;

    const effects = getFloorEffects(s.facilities, patient.currentFloorId);
    const boostMult = effects.has("boost_encourage") ? 2 : 1;
    const rapportGain = effects.has("boost_encourage") ? 4 : 2;

    const baseEffect = (3 + patient.rapport * 0.05) * boostMult;
    const emBefore = patient.em;
    const emAfter = clampEM(patient.em - baseEffect);
    const newFloorId = getFloorForEM(emAfter);
    const floorChanged = newFloorId !== patient.currentFloorId;

    useGameStore.setState((prev) => {
      const p = prev.patients[patientId];
      if (!p) return prev;
      return {
        ap: prev.ap - AP_COST.encourage,
        patients: {
          ...prev.patients,
          [patientId]: {
            ...p,
            em: emAfter,
            currentFloorId: newFloorId,
            rapport: Math.min(100, p.rapport + rapportGain),
          },
        },
      };
    });

    if (floorChanged) {
      const floorLabel = FLOORS.find((f) => f.id === newFloorId)?.label ?? newFloorId;
      useGameStore.getState().addNotification(
        `${patient.name}이(가) ${floorLabel}(으)로 이동합니다`,
        "info",
      );
    }

    return {
      success: true,
      actionType: "encourage" as const,
      emBefore,
      emAfter,
      emDelta: emBefore - emAfter,
      floorChanged,
      patientName: patient.name,
    };
  }, []);

  const build = useCallback((type: FacilityType, slotIndex: number) => {
    const s = useGameStore.getState();
    const template = FACILITY_TEMPLATES[type];

    if (s.ap < AP_COST.build) return false;
    if (s.gold < template.buildCost) return false;

    const existing = Object.values(s.facilities).find(
      (f) => f.floorId === s.selectedFloorId && f.slotIndex === slotIndex,
    );
    if (existing) return false;

    const facilityId = nextId("f", s.facilities);
    const facility: Facility = {
      id: facilityId,
      type,
      floorId: s.selectedFloorId,
      slotIndex,
      level: 1,
      buildCost: template.buildCost,
      upkeepPerTurn: template.upkeepPerTurn,
      emReduction: template.emReduction,
    };

    useGameStore.setState((prev) => ({
      ap: prev.ap - AP_COST.build,
      gold: prev.gold - template.buildCost,
      facilities: { ...prev.facilities, [facilityId]: facility },
    }));

    useGameStore.getState().addNotification(`${template.label} 건설 완료!`, "success");
    return true;
  }, []);

  const hire = useCallback(
    (name: string, specialty: CounselorSpecialty, skill: number, salary: number) => {
      const s = useGameStore.getState();
      const hireCost = salary * 2;

      if (s.ap < AP_COST.hire) return false;
      if (s.gold < hireCost) return false;

      const counselorId = nextId("c", s.counselors);

      useGameStore.setState((prev) => ({
        ap: prev.ap - AP_COST.hire,
        gold: prev.gold - hireCost,
        counselors: {
          ...prev.counselors,
          [counselorId]: {
            id: counselorId,
            name,
            specialty,
            skill,
            salary,
            assignedPatientId: null,
            treatmentCount: 0,
          },
        },
      }));

      useGameStore.getState().addNotification(`${name} 상담사 합류!`, "success");
      return true;
    },
    [],
  );

  const upgrade = useCallback((facilityId: string) => {
    const s = useGameStore.getState();
    const facility = s.facilities[facilityId];
    if (!facility) return false;
    if (facility.level >= 3) return false;
    if (s.ap < AP_COST.upgrade) return false;

    const upgradeCost = Math.ceil(facility.buildCost * 0.5 * facility.level);
    if (s.gold < upgradeCost) return false;

    useGameStore.setState((prev) => {
      const f = prev.facilities[facilityId];
      if (!f) return prev;
      return {
        ap: prev.ap - AP_COST.upgrade,
        gold: prev.gold - upgradeCost,
        facilities: {
          ...prev.facilities,
          [facilityId]: {
            ...f,
            level: f.level + 1,
            emReduction: Math.round(f.emReduction * 1.3),
            upkeepPerTurn: Math.round(f.upkeepPerTurn * 1.2),
          },
        },
      };
    });

    const template = FACILITY_TEMPLATES[facility.type];
    useGameStore.getState().addNotification(
      `${template.label} Lv.${facility.level + 1} 업그레이드!`,
      "success",
    );
    return true;
  }, []);

  const fire = useCallback((counselorId: string) => {
    const s = useGameStore.getState();
    const counselor = s.counselors[counselorId];
    if (!counselor) return false;

    const ok = s.fireCounselor(counselorId);
    if (ok) {
      useGameStore.getState().addNotification(
        `${counselor.name} 상담사가 퇴직했습니다`,
        "info",
      );
    }
    return ok;
  }, []);

  return { treat, build, hire, encourage, upgrade, fire };
}
