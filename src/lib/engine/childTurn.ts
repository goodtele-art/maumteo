/**
 * 아동청소년센터 턴 처리 (순수 함수)
 * processChildTurn: 매 턴 종료 시 아동센터 상태 업데이트
 */
import type { ChildPatient } from "@/types/child/patient.ts";
import type { ChildStageState } from "@/types/stage.ts";
import { clampEM } from "./em.ts";
import { getChildFloorForEM } from "./childEngine.ts";
import {
  decayParentInvolvement,
  updateParentBurnout,
  getBurnoutDecay,
  calcChildEmIncrease,
  checkChildIncident,
  checkChildDischarge,
} from "./childEngine.ts";
import { generateChildPatient } from "./childPatient.ts";
import { CHILD_ISSUE_CONFIG } from "@/lib/constants/childConstants.ts";

export interface ChildTurnEvent {
  type: "incident" | "discharge" | "burnout" | "em_change";
  patientId: string;
  patientName: string;
  message: string;
}

export interface ChildTurnResult {
  updatedPatients: Record<string, ChildPatient>;
  events: ChildTurnEvent[];
  dischargedIds: string[];
  incidentCount: number;
}

/**
 * 아동센터 턴 처리 순수 함수
 * @param state - 아동센터 상태
 * @param currentTurn - 현재 턴
 * @param hasDirector - 상담실장 존재 여부
 */
export function processChildTurn(
  state: ChildStageState,
  _currentTurn: number,
  hasDirector: boolean,
): ChildTurnResult {
  const events: ChildTurnEvent[] = [];
  const dischargedIds: string[] = [];
  let incidentCount = 0;
  const updatedPatients: Record<string, ChildPatient> = {};

  for (const [id, patient] of Object.entries(state.patients)) {
    let p = { ...patient };

    // 1. 부모참여도 자연 감소
    p.parentInvolvement = decayParentInvolvement(
      p.parentInvolvement,
      hasDirector,
    );

    // 2. 부모 번아웃 체크
    const burnout = updateParentBurnout(p);
    p.parentBurnoutCounter = burnout.newCounter;
    if (burnout.isBurnout) {
      // 번아웃 시 추가 감소
      p.parentInvolvement = Math.max(
        0,
        p.parentInvolvement - getBurnoutDecay(),
      );
      p.parentBurnoutCounter = 0; // 리셋
      events.push({
        type: "burnout",
        patientId: id,
        patientName: p.name,
        message: `${p.name} 보호자 번아웃 — 참여도 급감`,
      });
    }

    // 3. EM 자연 증가
    const emIncrease = calcChildEmIncrease(p);
    p.em = clampEM(p.em + emIncrease);

    // 4. 위기 판정 (EM >= 90)
    if (checkChildIncident(p.em)) {
      incidentCount++;
      p.em = clampEM(85); // 위기 후 약간 리셋
      events.push({
        type: "incident",
        patientId: id,
        patientName: p.name,
        message: `${p.name} 위기 상황 발생! (EM ≥ 90)`,
      });
    }

    // 5. 종결 판정
    if (checkChildDischarge(p.em, p.parentInvolvement)) {
      dischargedIds.push(id);
      events.push({
        type: "discharge",
        patientId: id,
        patientName: p.name,
        message: `${p.name} 상담 종결 — 축하합니다!`,
      });
    }

    // 6. 학교자문 리셋
    p.schoolConsulted = false;

    // 7. 사례회의 부스트 리셋 (이미 적용된 후)
    if (p.caseConferenceBoost) {
      p.caseConferenceBoost = false;
    }

    // 8. 층 업데이트
    p.currentFloorId = getChildFloorForEM(p.em);

    updatedPatients[id] = p;
  }

  // 9. 신규 아동 내담자 생성 (턴당 1~2명)
  const patientCount = Object.keys(updatedPatients).length - dischargedIds.length;
  const maxChildPatients = 12;
  if (patientCount < maxChildPatients) {
    const newCount = 1 + (Math.random() < 0.3 ? 1 : 0);
    for (let i = 0; i < newCount && patientCount + i < maxChildPatients; i++) {
      const newPatient = generateChildPatient(_currentTurn, Date.now() + i);
      // 해금 턴 확인: 해당 문제영역이 현재 턴에서 해금되었는지
      const issueConfig = CHILD_ISSUE_CONFIG[newPatient.dominantIssue];
      if (issueConfig.unlockTurn <= _currentTurn) {
        updatedPatients[newPatient.id] = newPatient;
        events.push({
          type: "em_change",
          patientId: newPatient.id,
          patientName: newPatient.name,
          message: `새 아동 내담자 ${newPatient.name}(${newPatient.age}세)이(가) 입소했습니다`,
        });
      }
    }
  }

  return {
    updatedPatients,
    events,
    dischargedIds,
    incidentCount,
  };
}
