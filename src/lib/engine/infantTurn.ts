/**
 * 영유아발달센터 턴 처리 (순수 함수)
 * processInfantTurn: 매 턴 종료 시 영유아센터 상태 업데이트
 */
import type { InfantPatient } from "@/types/infant/patient.ts";
import type { InfantStageState } from "@/types/stage.ts";
import type { ParentStress } from "@/types/referral.ts";
import { clampEM } from "./em.ts";
import { getInfantFloorForEM } from "./infantEngine.ts";
import {
  decayInfantParentInvolvement,
  calcInfantEmIncrease,
  checkInfantDischarge,
} from "./infantEngine.ts";
import { checkMilestones } from "./milestone.ts";
import {
  shouldStressOccur,
  createParentStress,
} from "./parentStress.ts";
import {
  selectCaseConferenceTargets,
  tryAutoResolveStress,
} from "./supervision.ts";
import {
  CONFLICT_COST_PER_TURN,
  CONFLICT_RESOLUTION_TURNS,
} from "@/lib/constants/crossStageConstants.ts";
import { generateInfantPatient } from "./infantPatient.ts";
import { INFANT_ISSUE_CONFIG } from "@/lib/constants/infantConstants.ts";

export interface InfantTurnEvent {
  type: "incident" | "discharge" | "milestone" | "stress" | "conflict_resolved" | "em_change";
  patientId: string;
  patientName: string;
  message: string;
}

export interface InfantTurnResult {
  updatedPatients: Record<string, InfantPatient>;
  updatedStresses: ParentStress[];
  events: InfantTurnEvent[];
  dischargedIds: string[];
  goldCost: number;
  caseConferenceTargetIds: string[];
}

/**
 * 영유아센터 턴 처리 순수 함수
 * @param state - 영유아센터 상태
 * @param currentTurn - 현재 턴
 * @param gold - 현재 골드 (분쟁 비용 계산용)
 */
export function processInfantTurn(
  state: InfantStageState,
  currentTurn: number,
  _gold: number,
): InfantTurnResult {
  const events: InfantTurnEvent[] = [];
  const dischargedIds: string[] = [];
  let goldCost = 0;
  const updatedPatients: Record<string, InfantPatient> = {};

  const hasDirector = state.director !== null;
  const hasParentCoaching = Object.values(state.facilities).some(
    f => f.type === "parent_coaching",
  );

  // ── 내담자 처리 ──
  for (const [id, patient] of Object.entries(state.patients)) {
    let p = { ...patient, milestones: patient.milestones.map(m => ({ ...m })) };

    // 1. 부모참여도 자연 감소
    p.parentInvolvement = decayInfantParentInvolvement(
      p.parentInvolvement,
      hasDirector,
      hasParentCoaching,
    );

    // 2. EM 자연 증가
    const emIncrease = calcInfantEmIncrease(p);
    p.em = clampEM(p.em + emIncrease);

    // 3. 이정표 체크
    const milestoneResult = checkMilestones(p.milestones, p.em, currentTurn);
    p.milestones = milestoneResult.updated;
    for (const ms of milestoneResult.newlyAchieved) {
      events.push({
        type: "milestone",
        patientId: id,
        patientName: p.name,
        message: `${p.name} 발달이정표 달성: ${ms.label}`,
      });
    }

    // 4. 종결 판정
    if (checkInfantDischarge(p)) {
      dischargedIds.push(id);
      events.push({
        type: "discharge",
        patientId: id,
        patientName: p.name,
        message: `${p.name} 상담 종결 — 축하합니다!`,
      });
    }

    // 5. 층 업데이트
    p.currentFloorId = getInfantFloorForEM(p.em);

    updatedPatients[id] = p;
  }

  // ── 신규 영유아 내담자 생성 (턴당 1~2명) ──
  const activePatientCount = Object.keys(updatedPatients).length - dischargedIds.length;
  const maxInfantPatients = 10;
  if (activePatientCount < maxInfantPatients) {
    const newCount = 1 + (Math.random() < 0.3 ? 1 : 0);
    for (let i = 0; i < newCount && activePatientCount + i < maxInfantPatients; i++) {
      const newPatient = generateInfantPatient(currentTurn, Date.now() + i);
      const issueConfig = INFANT_ISSUE_CONFIG[newPatient.dominantIssue];
      if (issueConfig.unlockTurn <= currentTurn) {
        updatedPatients[newPatient.id] = newPatient;
        events.push({
          type: "em_change",
          patientId: newPatient.id,
          patientName: newPatient.name,
          message: `새 영유아 내담자 ${newPatient.name}이(가) 입소했습니다`,
        });
      }
    }
  }

  // ── 양육 스트레스 처리 ──
  let updatedStresses = [...state.parentStresses.map(s => ({ ...s }))];

  // 바우처 내담자: 새 스트레스 발생
  const voucherPatients = Object.values(updatedPatients).filter(
    p => p.referralSource === "voucher",
  );
  for (const vp of voucherPatients) {
    if (shouldStressOccur()) {
      const newStress = createParentStress(vp.id, currentTurn, hasDirector);
      // 법적 분쟁이면 conflictTurnsRemaining 설정
      if (newStress.severity === "conflict") {
        newStress.conflictTurnsRemaining = CONFLICT_RESOLUTION_TURNS;
      }
      updatedStresses.push(newStress);
      events.push({
        type: "stress",
        patientId: vp.id,
        patientName: vp.name,
        message: `${vp.name} 보호자 ${newStress.description}`,
      });
    }
  }

  // 기존 분쟁: 턴 차감 + 비용 차감
  for (const stress of updatedStresses) {
    if (
      stress.severity === "conflict" &&
      !stress.resolved &&
      stress.conflictTurnsRemaining !== undefined &&
      stress.conflictTurnsRemaining > 0
    ) {
      stress.conflictTurnsRemaining--;
      goldCost += CONFLICT_COST_PER_TURN;

      if (stress.conflictTurnsRemaining <= 0) {
        stress.resolved = true;
        stress.resolvedBy = "unresolved"; // 시간 경과로 해결
        events.push({
          type: "conflict_resolved",
          patientId: stress.patientId,
          patientName:
            updatedPatients[stress.patientId]?.name ?? "알 수 없음",
          message: "법적 분쟁이 해결되었습니다",
        });
      }
    }
  }

  // 상담실장 자동 해결
  if (state.director) {
    for (const stress of updatedStresses) {
      if (!stress.resolved && stress.severity !== "conflict") {
        if (tryAutoResolveStress(state.director)) {
          stress.resolved = true;
          stress.resolvedBy = "director";
        }
      }
    }
  }

  // ── 사례회의: 가장 EM 높은 1~2명에 플래그 ──
  const patientList = Object.values(updatedPatients).filter(
    p => !dischargedIds.includes(p.id),
  );
  const caseConferenceTargetIds = hasDirector
    ? selectCaseConferenceTargets(patientList)
    : [];

  return {
    updatedPatients,
    updatedStresses,
    events,
    dischargedIds,
    goldCost,
    caseConferenceTargetIds,
  };
}
