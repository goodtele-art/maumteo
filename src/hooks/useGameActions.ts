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
  SPECIALTY_CONFIG,
  getMatchMultiplier,
} from "@/lib/constants.ts";
import type { Facility, FacilityType, DominantIssue, Patient } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";
import type { GameStore } from "@/store/gameStore.ts";
import { CHILD_FACILITY_TEMPLATES, getChildMatchMultiplier } from "@/lib/constants/childConstants.ts";
import { INFANT_FACILITY_TEMPLATES, getInfantMatchMultiplier } from "@/lib/constants/infantConstants.ts";
import { getChildFloorForEM } from "@/lib/engine/childEngine.ts";
import { getInfantFloorForEM } from "@/lib/engine/infantEngine.ts";

// ── 스테이지 인식 헬퍼 ──

function getStagePatient(s: GameStore, patientId: string): Patient | undefined {
  if (s.activeStage === "child" && s.childStage)
    return s.childStage.patients[patientId] as unknown as Patient;
  if (s.activeStage === "infant" && s.infantStage)
    return s.infantStage.patients[patientId] as unknown as Patient;
  return s.patients[patientId];
}

function getStageCounselor(s: GameStore, counselorId: string) {
  if (s.activeStage === "child" && s.childStage) return s.childStage.counselors[counselorId];
  if (s.activeStage === "infant" && s.infantStage) return s.infantStage.counselors[counselorId];
  return s.counselors[counselorId];
}

function getStageFacility(s: GameStore, facilityId: string) {
  if (s.activeStage === "child" && s.childStage)
    return s.childStage.facilities[facilityId] as unknown as Facility;
  if (s.activeStage === "infant" && s.infantStage)
    return s.infantStage.facilities[facilityId] as unknown as Facility;
  return s.facilities[facilityId];
}

function getStageAp(s: GameStore): number {
  if (s.activeStage === "child" && s.childStage) return s.childStage.ap;
  if (s.activeStage === "infant" && s.infantStage) return s.infantStage.ap;
  return s.ap;
}

function getStageFloorForEM(stage: string, em: number) {
  if (stage === "child") return getChildFloorForEM(em);
  if (stage === "infant") return getInfantFloorForEM(em);
  return getFloorForEM(em);
}

function setStagePatient(prev: GameStore, patientId: string, updates: Partial<Patient>): Partial<GameStore> {
  if (prev.activeStage === "child" && prev.childStage) {
    const p = prev.childStage.patients[patientId];
    if (!p) return {};
    return {
      childStage: {
        ...prev.childStage,
        patients: { ...prev.childStage.patients, [patientId]: { ...p, ...updates } as typeof p },
      },
    };
  }
  if (prev.activeStage === "infant" && prev.infantStage) {
    const p = prev.infantStage.patients[patientId];
    if (!p) return {};
    return {
      infantStage: {
        ...prev.infantStage,
        patients: { ...prev.infantStage.patients, [patientId]: { ...p, ...updates } as typeof p },
      },
    };
  }
  const p = prev.patients[patientId];
  if (!p) return {};
  return { patients: { ...prev.patients, [patientId]: { ...p, ...updates } } };
}


function getStageCounselors(s: GameStore): Record<string, { id: string; name: string; specialty: string; skill: number; treatmentCount: number; onLeave?: boolean }> {
  if (s.activeStage === "child" && s.childStage) return s.childStage.counselors;
  if (s.activeStage === "infant" && s.infantStage) return s.infantStage.counselors;
  return s.counselors;
}


// ── 헬퍼 ──
export function getCenterEffects(facilities: Record<string, Facility>): Set<string> {
  const effects = new Set<string>();
  for (const f of Object.values(facilities)) {
    const t = FACILITY_TEMPLATES[f.type];
    if (t?.effect && t.effect !== "none") effects.add(t.effect);
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
  stage?: string,
): { finalEffect: number; varianceEffect: number; matchMult: number; issueBonus: number; synergy: number } {
  // 통합 템플릿 조회
  const allTemplates: Record<string, typeof FACILITY_TEMPLATES[FacilityType]> = {
    ...FACILITY_TEMPLATES,
    ...CHILD_FACILITY_TEMPLATES as unknown as Record<string, typeof FACILITY_TEMPLATES[FacilityType]>,
    ...INFANT_FACILITY_TEMPLATES as unknown as Record<string, typeof FACILITY_TEMPLATES[FacilityType]>,
  };
  const template = facility ? (allTemplates[facility.type] ?? null) : null;
  const baseReduction = facility ? facility.emReduction : 8;

  // 전공 매칭 배율 (스테이지 인식)
  let matchMult = 0.85;
  if (specialty) {
    if (stage === "child") {
      matchMult = getChildMatchMultiplier(specialty as import("@/types/child/counselor.ts").ChildSpecialty, issue as import("@/types/child/patient.ts").ChildIssue);
    } else if (stage === "infant") {
      matchMult = getInfantMatchMultiplier(specialty as import("@/types/infant/counselor.ts").InfantSpecialty, issue as import("@/types/infant/patient.ts").InfantIssue);
    } else if (specialty in SPECIALTY_CONFIG) {
      matchMult = getMatchMultiplier(specialty as CounselorSpecialty, issue as DominantIssue);
    }
  }
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
    const stage = s.activeStage;
    if (getStageAp(s) < AP_COST.treat) return false;

    const patient = getStagePatient(s, patientId);
    if (!patient) return false;

    // 시설 조회 (스테이지 인식)
    const facility = facilityId ? getStageFacility(s, facilityId) ?? null : null;
    const allTemplates: Record<string, typeof FACILITY_TEMPLATES[FacilityType]> = {
      ...FACILITY_TEMPLATES,
      ...CHILD_FACILITY_TEMPLATES as unknown as Record<string, typeof FACILITY_TEMPLATES[FacilityType]>,
      ...INFANT_FACILITY_TEMPLATES as unknown as Record<string, typeof FACILITY_TEMPLATES[FacilityType]>,
    };
    const template = facility ? (allTemplates[facility.type] ?? FACILITY_TEMPLATES[facility.type as FacilityType]) : null;

    // 상담사 선택 (스테이지 인식)
    const stageCounselors = getStageCounselors(s);
    let counselor: { id: string; name: string; specialty: string; skill: number; treatmentCount: number; onLeave?: boolean } | undefined;
    if (counselorId && stageCounselors[counselorId]) {
      counselor = stageCounselors[counselorId];
    } else {
      const counselorList = Object.values(stageCounselors).filter((c) => !c.onLeave);
      if (counselorList.length === 0) {
        useGameStore.getState().addNotification("상담사가 없어 기본 효과만 적용됩니다", "warning");
      }
      // For child/infant stages, use 1.0 as default match (detailed matching is in engine)
      const scored = counselorList.map((c) => ({
        counselor: c,
        mult: stage === "adult"
          ? getMatchMultiplier(c.specialty as CounselorSpecialty, patient.dominantIssue)
          : 1.0,
      }));
      scored.sort((a, b) => b.mult - a.mult);
      counselor = scored[0]?.counselor;
    }

    const skill = counselor?.skill ?? 1;
    const specialty = counselor?.specialty as CounselorSpecialty | undefined;

    // 라포 난이도
    const issueConfig = ISSUE_CONFIG[patient.dominantIssue];
    const rapportGain = issueConfig
      ? Math.round(RAPPORT_PER_TREATMENT / issueConfig.rapportDifficulty)
      : RAPPORT_PER_TREATMENT;

    // 주 내담자 치료 효과 계산
    const { finalEffect } = calcFacilityTreatEffect(facility, skill, patient.rapport, specialty, patient.dominantIssue, stage);

    const emBefore = patient.em;
    const emAfter = clampEM(patient.em - finalEffect);
    const newFloorId = getStageFloorForEM(stage, emAfter) as string;
    const floorChanged = newFloorId !== patient.currentFloorId;

    // 주 내담자 상태 업데이트 (스테이지 인식 — deep merge로 childStage/infantStage 충돌 방지)
    useGameStore.setState((prev) => {
      const stageKey = prev.activeStage === "child" ? "childStage" : prev.activeStage === "infant" ? "infantStage" : null;
      if (stageKey && prev[stageKey]) {
        const stageData = prev[stageKey] as unknown as Record<string, unknown>;
        const patients = stageData.patients as Record<string, Record<string, unknown>>;
        const p = patients[patientId];
        const updatedPatients = { ...patients, [patientId]: { ...p, em: emAfter, currentFloorId: newFloorId, rapport: Math.min(100, patient.rapport + rapportGain), treatmentCount: patient.treatmentCount + 1 } };
        const counselors = stageData.counselors as Record<string, Record<string, unknown>>;
        const updatedCounselors = counselor && counselors[counselor.id]
          ? { ...counselors, [counselor.id]: { ...counselors[counselor.id], treatmentCount: (counselor.treatmentCount ?? 0) + 1, lastTreatmentTurn: prev.currentTurn, treatmentsThisTurn: ((counselors[counselor.id].treatmentsThisTurn as number) ?? 0) + 1 } }
          : counselors;
        return {
          [stageKey]: {
            ...stageData,
            ap: (stageData.ap as number) - AP_COST.treat,
            patients: updatedPatients,
            counselors: updatedCounselors,
          },
        };
      }
      // 성인 센터
      const patientData = prev.patients[patientId];
      const counselorUpdate = counselor
        ? { counselors: { ...prev.counselors, [counselor.id]: { ...prev.counselors[counselor.id], treatmentCount: (counselor.treatmentCount ?? 0) + 1, lastTreatmentTurn: prev.currentTurn, treatmentsThisTurn: (prev.counselors[counselor.id]?.treatmentsThisTurn ?? 0) + 1 } } }
        : {};
      return {
        ap: prev.ap - AP_COST.treat,
        patients: { ...prev.patients, [patientId]: { ...patientData, em: emAfter, currentFloorId: newFloorId as Patient["currentFloorId"], rapport: Math.min(100, patient.rapport + rapportGain), treatmentCount: patient.treatmentCount + 1 } },
        ...counselorUpdate,
      };
    });

    // 층 이동 알림은 App.tsx에서 치료 결과 메시지 이후에 표시

    // 집단상담실: 플레이어가 선택한 추가 내담자 치료 (각 70%)
    const groupResults: Array<{ name: string; emBefore: number; emAfter: number }> = [];
    if (facility?.type === "group_room" && groupPatientIds && groupPatientIds.length > 0) {
      for (const gpId of groupPatientIds) {
        const currentState = useGameStore.getState();
        const gp = getStagePatient(currentState, gpId);
        if (!gp) continue;

        const groupEffect = finalEffect * 0.7;
        const gpEmAfter = clampEM(gp.em - groupEffect);
        const gpNewFloor = getStageFloorForEM(stage, gpEmAfter) as string;

        groupResults.push({ name: gp.name, emBefore: gp.em, emAfter: gpEmAfter });

        useGameStore.setState((prev) => {
          return {
            ...setStagePatient(prev, gpId, {
              em: gpEmAfter,
              currentFloorId: gpNewFloor as Patient["currentFloorId"],
              rapport: Math.min(100, gp.rapport + Math.round(rapportGain * 0.5)),
              treatmentCount: gp.treatmentCount + 1,
            }),
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
    const stage = s.activeStage;

    // 활성 센터에서 환자와 AP 찾기
    const stageAp = stage === "child" && s.childStage ? s.childStage.ap
      : stage === "infant" && s.infantStage ? s.infantStage.ap
      : s.ap;
    if (stageAp < AP_COST.encourage) return false;

    const patient = stage === "child" && s.childStage ? s.childStage.patients[patientId] as unknown as import("@/types/index.ts").Patient
      : stage === "infant" && s.infantStage ? s.infantStage.patients[patientId] as unknown as import("@/types/index.ts").Patient
      : s.patients[patientId];
    if (!patient) return false;

    const boostMult = 1; // 아동/영유아는 기본 배율
    const rapportGain = 2;

    const baseEffect = (3 + patient.rapport * 0.05) * boostMult;
    const emBefore = patient.em;
    const emAfter = clampEM(patient.em - baseEffect);

    if (stage === "child" && s.childStage) {
      const newFloorId = getChildFloorForEM(emAfter);
      useGameStore.setState((prev) => {
        if (!prev.childStage) return {};
        const p = prev.childStage.patients[patientId];
        if (!p) return {};
        return {
          childStage: {
            ...prev.childStage,
            ap: prev.childStage.ap - AP_COST.encourage,
            patients: {
              ...prev.childStage.patients,
              [patientId]: { ...p, em: emAfter, currentFloorId: newFloorId, rapport: Math.min(100, p.rapport + rapportGain) },
            },
          },
        };
      });
    } else if (stage === "infant" && s.infantStage) {
      const newFloorId = getInfantFloorForEM(emAfter);
      useGameStore.setState((prev) => {
        if (!prev.infantStage) return {};
        const p = prev.infantStage.patients[patientId];
        if (!p) return {};
        return {
          infantStage: {
            ...prev.infantStage,
            ap: prev.infantStage.ap - AP_COST.encourage,
            patients: {
              ...prev.infantStage.patients,
              [patientId]: { ...p, em: emAfter, currentFloorId: newFloorId, rapport: Math.min(100, p.rapport + rapportGain) },
            },
          },
        };
      });
    } else {
      const newFloorId = getFloorForEM(emAfter);
      const floorChanged = newFloorId !== patient.currentFloorId;
      useGameStore.setState((prev) => {
        const p = prev.patients[patientId];
        if (!p) return prev;
        return {
          ap: prev.ap - AP_COST.encourage,
          patients: {
            ...prev.patients,
            [patientId]: { ...p, em: emAfter, currentFloorId: newFloorId, rapport: Math.min(100, p.rapport + rapportGain) },
          },
        };
      });
      if (floorChanged) {
        const floorLabel = FLOORS.find((f) => f.id === newFloorId)?.label ?? newFloorId;
        useGameStore.getState().addNotification(`${patient.name}이(가) ${floorLabel}(으)로 이동합니다`, "info");
      }
    }

    return {
      success: true,
      actionType: "encourage" as const,
      emBefore,
      emAfter,
      emDelta: emBefore - emAfter,
      floorChanged: false,
      patientName: patient.name,
    };
  }, []);

  const build = useCallback((type: FacilityType, slotIndex: number) => {
    const s = useGameStore.getState();
    const stage = s.activeStage;

    // 스테이지별 시설 템플릿 조회
    const allTemplates: Record<string, { label: string; buildCost: number; upkeepPerTurn: number; emReduction: number }> = {
      ...FACILITY_TEMPLATES,
      ...CHILD_FACILITY_TEMPLATES,
      ...INFANT_FACILITY_TEMPLATES,
    };
    const template = allTemplates[type];
    if (!template) return false;

    // 활성 센터의 AP/시설 확인 (층 무관, 슬롯 인덱스로만 중복 체크)
    if (stage === "child" && s.childStage) {
      if (s.childStage.ap < AP_COST.build || s.gold < template.buildCost) return false;
      const existing = Object.values(s.childStage.facilities).find((f) => f.slotIndex === slotIndex);
      if (existing) return false;
      const facilityId = `cf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      useGameStore.setState((prev) => ({
        gold: prev.gold - template.buildCost,
        childStage: prev.childStage ? {
          ...prev.childStage,
          ap: prev.childStage.ap - AP_COST.build,
          facilities: {
            ...prev.childStage.facilities,
            [facilityId]: {
              id: facilityId, type: type as import("@/types/child/facility.ts").ChildFacilityType,
              slotIndex, level: 1,
              buildCost: template.buildCost, upkeepPerTurn: template.upkeepPerTurn, emReduction: template.emReduction,
            },
          },
        } : null,
      }));
    } else if (stage === "infant" && s.infantStage) {
      if (s.infantStage.ap < AP_COST.build || s.gold < template.buildCost) return false;
      const existing = Object.values(s.infantStage.facilities).find((f) => f.slotIndex === slotIndex);
      if (existing) return false;
      const facilityId = `if_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      useGameStore.setState((prev) => ({
        gold: prev.gold - template.buildCost,
        infantStage: prev.infantStage ? {
          ...prev.infantStage,
          ap: prev.infantStage.ap - AP_COST.build,
          facilities: {
            ...prev.infantStage.facilities,
            [facilityId]: {
              id: facilityId, type: type as import("@/types/infant/facility.ts").InfantFacilityType,
              slotIndex, level: 1,
              buildCost: template.buildCost, upkeepPerTurn: template.upkeepPerTurn, emReduction: template.emReduction,
            },
          },
        } : null,
      }));
    } else {
      // 성인센터
      if (s.ap < AP_COST.build || s.gold < template.buildCost) return false;
      const existing = Object.values(s.facilities).find((f) => f.slotIndex === slotIndex);
      if (existing) return false;
      const facilityId = nextId("f", s.facilities);
      const facility: Facility = {
        id: facilityId, type, slotIndex, level: 1,
        buildCost: template.buildCost, upkeepPerTurn: template.upkeepPerTurn, emReduction: template.emReduction,
      };
      useGameStore.setState((prev) => ({
        ap: prev.ap - AP_COST.build,
        gold: prev.gold - template.buildCost,
        facilities: { ...prev.facilities, [facilityId]: facility },
      }));
    }

    useGameStore.getState().addNotification(`${template.label} 건설 완료!`, "success");
    return true;
  }, []);

  const hire = useCallback(
    (name: string, specialty: CounselorSpecialty, skill: number, salary: number) => {
      const s = useGameStore.getState();
      const hireCost = salary * 2;
      const stage = s.activeStage;

      // 활성 센터의 AP 확인
      const stageAp = stage === "child" && s.childStage ? s.childStage.ap
        : stage === "infant" && s.infantStage ? s.infantStage.ap
        : s.ap;

      if (stageAp < AP_COST.hire) return false;
      if (s.gold < hireCost) return false;

      if (stage === "child" && s.childStage) {
        const counselorId = `cc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        useGameStore.setState((prev) => ({
          gold: prev.gold - hireCost,
          childStage: prev.childStage ? {
            ...prev.childStage,
            ap: prev.childStage.ap - AP_COST.hire,
            counselors: {
              ...prev.childStage.counselors,
              [counselorId]: {
                id: counselorId, name, specialty: specialty as unknown as import("@/types/child/counselor.ts").ChildSpecialty,
                skill, salary, assignedPatientId: null, treatmentCount: 0,
              },
            },
          } : null,
        }));
      } else if (stage === "infant" && s.infantStage) {
        const counselorId = `ic_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        useGameStore.setState((prev) => ({
          gold: prev.gold - hireCost,
          infantStage: prev.infantStage ? {
            ...prev.infantStage,
            ap: prev.infantStage.ap - AP_COST.hire,
            counselors: {
              ...prev.infantStage.counselors,
              [counselorId]: {
                id: counselorId, name, specialty: specialty as unknown as import("@/types/infant/counselor.ts").InfantSpecialty,
                skill, salary, assignedPatientId: null, treatmentCount: 0,
              },
            },
          } : null,
        }));
      } else {
        const counselorId = nextId("c", s.counselors);
        useGameStore.setState((prev) => ({
          ap: prev.ap - AP_COST.hire,
          gold: prev.gold - hireCost,
          counselors: {
            ...prev.counselors,
            [counselorId]: {
              id: counselorId, name, specialty, skill, salary,
              assignedPatientId: null, treatmentCount: 0,
            },
          },
        }));
      }

      useGameStore.getState().addNotification(`${name} 상담사 합류!`, "success");
      return true;
    },
    [],
  );

  const upgrade = useCallback((facilityId: string) => {
    const s = useGameStore.getState();
    const facility = getStageFacility(s, facilityId);
    if (!facility) return false;
    if (facility.level >= 3) return false;
    if (getStageAp(s) < AP_COST.upgrade) return false;

    const upgradeCost = Math.ceil(facility.buildCost * 0.5 * facility.level);
    if (s.gold < upgradeCost) return false;

    useGameStore.setState((prev) => {
      // Stage-aware facility update
      const facilityUpdate: Partial<Facility> = {
        level: facility.level + 1,
        emReduction: Math.round(facility.emReduction * 1.3),
        upkeepPerTurn: Math.round(facility.upkeepPerTurn * 1.2),
      };

      if (prev.activeStage === "child" && prev.childStage) {
        const f = prev.childStage.facilities[facilityId];
        if (!f) return prev;
        return {
          gold: prev.gold - upgradeCost,
          childStage: {
            ...prev.childStage,
            ap: prev.childStage.ap - AP_COST.upgrade,
            facilities: {
              ...prev.childStage.facilities,
              [facilityId]: { ...f, ...facilityUpdate } as typeof f,
            },
          },
        };
      }
      if (prev.activeStage === "infant" && prev.infantStage) {
        const f = prev.infantStage.facilities[facilityId];
        if (!f) return prev;
        return {
          gold: prev.gold - upgradeCost,
          infantStage: {
            ...prev.infantStage,
            ap: prev.infantStage.ap - AP_COST.upgrade,
            facilities: {
              ...prev.infantStage.facilities,
              [facilityId]: { ...f, ...facilityUpdate } as typeof f,
            },
          },
        };
      }
      // Adult
      const f = prev.facilities[facilityId];
      if (!f) return prev;
      return {
        ap: prev.ap - AP_COST.upgrade,
        gold: prev.gold - upgradeCost,
        facilities: {
          ...prev.facilities,
          [facilityId]: { ...f, ...facilityUpdate },
        },
      };
    });

    // Look up template from all stages
    const allTemplates: Record<string, { label: string }> = {
      ...FACILITY_TEMPLATES,
      ...CHILD_FACILITY_TEMPLATES as unknown as Record<string, { label: string }>,
      ...INFANT_FACILITY_TEMPLATES as unknown as Record<string, { label: string }>,
    };
    const template = allTemplates[facility.type];
    useGameStore.getState().addNotification(
      `${template?.label ?? facility.type} Lv.${facility.level + 1} 업그레이드!`,
      "success",
    );
    return true;
  }, []);

  const fire = useCallback((counselorId: string) => {
    const s = useGameStore.getState();
    const stage = s.activeStage;
    const counselor = getStageCounselor(s, counselorId);
    if (!counselor) return false;

    if (stage === "child" && s.childStage) {
      useGameStore.setState((prev) => {
        if (!prev.childStage) return {};
        const { [counselorId]: _, ...rest } = prev.childStage.counselors;
        return {
          childStage: { ...prev.childStage, counselors: rest },
        };
      });
    } else if (stage === "infant" && s.infantStage) {
      useGameStore.setState((prev) => {
        if (!prev.infantStage) return {};
        const { [counselorId]: _, ...rest } = prev.infantStage.counselors;
        return {
          infantStage: { ...prev.infantStage, counselors: rest },
        };
      });
    } else {
      const ok = s.fireCounselor(counselorId);
      if (!ok) return false;
    }

    useGameStore.getState().addNotification(
      `${counselor.name} 상담사가 퇴직했습니다`,
      "info",
    );
    return true;
  }, []);

  return { treat, build, hire, encourage, upgrade, fire };
}
