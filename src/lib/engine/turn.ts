import type {
  GameState,
  TurnLogEntry,
  TurnEvent,
  Patient,
} from "@/types/index.ts";
import {
  AP_BASE,
  AP_PER_COUNSELOR,
  MAX_HISTORY_TURNS,
  PATIENTS_PER_TURN_BASE,
  MAX_PATIENTS,
  OVERCROWDED_REPUTATION_PENALTY,
  BANKRUPTCY_TURNS,
  FACILITY_TEMPLATES,
  EM_NATURAL_INCREASE_BASE,
  EM_NATURAL_INCREASE_VARIANCE,
  INCIDENT_REPUTATION_LOSS,
  INCIDENT_THRESHOLD,
  ISSUE_CONFIG,
  FLOORS,
} from "@/lib/constants.ts";
import { clampEM, getFloorForEM } from "./em.ts";
import { calcIncome, calcUpkeep } from "./economy.ts";
import { generatePatient, checkDischarge, getDischargeMessage } from "./patient.ts";
import { getTutorialConfig, isTutorialTurn } from "@/lib/tutorialConfig.ts";

const INCIDENT_MESSAGES = [
  "내담자가 극심한 스트레스로 시설을 파손했습니다.",
  "방치된 내담자가 위기 상황에 빠져 응급 이송되었습니다.",
  "내담자 상태 악화로 보호자로부터 항의를 받았습니다.",
  "내담자의 상태가 위독해져 외부 기관에 긴급 의뢰했습니다.",
  "상담을 받지 못한 내담자가 심각한 정서적 위기에 빠졌습니다. 긴급 개입이 필요합니다.",
];

export interface TurnResult {
  gold: number;
  reputation: number;
  ap: number;
  maxAp: number;
  currentTurn: number;
  patients: Record<string, Patient>;
  turnLog: TurnLogEntry[];
  events: TurnEvent[];
  dischargedPatients: Array<{ patient: Patient; message: string }>;
  isGameOver: boolean;
  gameOverReason: string | null;
}

export function processTurn(state: GameState): TurnResult {
  const events: TurnEvent[] = [];
  const dischargedPatients: Array<{ patient: Patient; message: string }> = [];
  const nextTurn = state.currentTurn + 1;
  const tutConfig = getTutorialConfig(nextTurn);

  // 수입/지출
  const income = calcIncome(state.patients, state.reputation);
  events.push({ type: "income", amount: income });

  const upkeep = calcUpkeep(state.facilities, state.counselors);
  events.push({ type: "upkeep", amount: upkeep });

  let gold = state.gold + income - upkeep;
  let reputation = state.reputation;

  const patients: Record<string, Patient> = {};
  for (const [id, p] of Object.entries(state.patients)) {
    patients[id] = { ...p };
  }

  // 마음챙김실 존재 여부 (재발 확률 감소)
  const hasMindfulness = Object.values(state.facilities).some(
    (f) => FACILITY_TEMPLATES[f.type].effect === "boost_encourage",
  );

  // ── EM 자연 증가 + 재발 ──
  for (const p of Object.values(patients)) {
    const issueConfig = ISSUE_CONFIG[p.dominantIssue];
    const emBefore = p.em;

    // 문제영역별 자연 증가율
    const increase =
      EM_NATURAL_INCREASE_BASE +
      issueConfig.emIncreaseRate +
      Math.floor(Math.random() * (EM_NATURAL_INCREASE_VARIANCE + 1));

    // 재발 체크 (강박, 중독, 정서조절, 정신증)
    let relapseIncrease = 0;
    if (issueConfig.relapseChance > 0 && p.treatmentCount > 0) {
      const chance = hasMindfulness
        ? issueConfig.relapseChance * 0.5
        : issueConfig.relapseChance;
      if (Math.random() < chance) {
        relapseIncrease = 8 + Math.floor(Math.random() * 8);
      }
    }

    const emAfter = clampEM(p.em + increase + relapseIncrease);
    p.em = emAfter;
    // 튜토리얼 중: EM이 해금된 층 범위를 넘으면 최대 해금 층에 유지
    if (isTutorialTurn(nextTurn)) {
      const unlockedFloors = FLOORS.filter((f) => f.unlockTurn <= nextTurn);
      if (unlockedFloors.length > 0) {
        const maxEm = Math.max(...unlockedFloors.map((f) => f.emRange[1]));
        p.em = Math.min(p.em, maxEm);
      } else {
        // 해금된 층이 없으면 심리치료센터(36~60) 범위로 고정
        p.em = Math.min(p.em, 60);
      }
      p.currentFloorId = "counseling";
    } else {
      p.currentFloorId = getFloorForEM(emAfter);
    }

    if (emAfter !== emBefore) {
      events.push({
        type: "em_increase",
        patientId: p.id,
        emBefore,
        emAfter,
      });
    }

    // ── 사고 발생: EM이 INCIDENT_THRESHOLD 이상이면 ──
    if (emAfter >= INCIDENT_THRESHOLD) {
      const message =
        INCIDENT_MESSAGES[
          Math.abs(p.id.length + state.currentTurn) % INCIDENT_MESSAGES.length
        ]!;
      events.push({
        type: "incident",
        patientId: p.id,
        reputationLoss: INCIDENT_REPUTATION_LOSS,
        message,
      });
      reputation = Math.max(0, reputation - INCIDENT_REPUTATION_LOSS);
      p.em = clampEM(INCIDENT_THRESHOLD - 5);
      if (isTutorialTurn(nextTurn)) {
        p.em = Math.min(p.em, 60);
      }
      p.currentFloorId = isTutorialTurn(nextTurn) ? "counseling" as typeof p.currentFloorId : getFloorForEM(p.em);
    }
  }

  // ── 퇴원 처리 ──
  const hasEasierDischarge = Object.values(state.facilities).some(
    (f) => f.type === "activity_room",
  );
  const dischargeThreshold = hasEasierDischarge ? 20 : 15;

  const toDischarge: string[] = [];
  for (const p of Object.values(patients)) {
    if (hasEasierDischarge ? p.em <= dischargeThreshold : checkDischarge(p)) {
      toDischarge.push(p.id);
    }
  }
  for (const id of toDischarge) {
    const p = patients[id]!;
    const message = getDischargeMessage(p);
    events.push({ type: "discharge", patientId: id, message });
    dischargedPatients.push({ patient: { ...p }, message });
    reputation += 2;
    delete patients[id];
  }

  // ── 신규 환자 생성 ──
  const currentCount = Object.keys(patients).length;
  const capacity = MAX_PATIENTS + Object.keys(state.facilities).length * 2;

  if (currentCount >= capacity) {
    reputation = Math.max(0, reputation - OVERCROWDED_REPUTATION_PENALTY);
    events.push({
      type: "incident",
      patientId: "",
      reputationLoss: OVERCROWDED_REPUTATION_PENALTY,
      message: `정원 초과(${currentCount}/${capacity})로 평판이 하락했습니다. 💡 상담사를 추가 고용하면 한 턴에 더 많은 내담자를 상담할 수 있고, 시설을 건설하면 정원이 늘어납니다.`,
    });
  } else {
    let newPatientCount = Math.min(
      PATIENTS_PER_TURN_BASE + Math.floor(reputation / 20),
      capacity - currentCount,
    );

    // 튜토리얼 중 신규 환자 수 제한
    if (isTutorialTurn(nextTurn)) {
      const tutMaxPatients = tutConfig.maxPatients;
      const totalAfter = currentCount + newPatientCount;
      if (totalAfter > tutMaxPatients) {
        newPatientCount = Math.max(0, tutMaxPatients - currentCount);
      }
    }

    for (let i = 0; i < newPatientCount; i++) {
      const newPatient = generatePatient(nextTurn, nextTurn * 100 + i);
      patients[newPatient.id] = newPatient;
      events.push({ type: "admission", patientId: newPatient.id });
    }
  }

  // ── 파산 판정 ──
  gold = Math.max(0, gold);
  let isGameOver = false;
  let gameOverReason: string | null = null;

  if (gold === 0 && upkeep > income) {
    const lookback = BANKRUPTCY_TURNS - 1;
    const recentDeficits = state.turnLog
      .slice(-lookback)
      .filter((entry) => {
        const inc = entry.events.find((e) => e.type === "income");
        const upk = entry.events.find((e) => e.type === "upkeep");
        if (!inc || inc.type !== "income" || !upk || upk.type !== "upkeep") return false;
        return upk.amount > inc.amount;
      }).length;

    if (recentDeficits >= lookback) {
      isGameOver = true;
      gameOverReason = `${BANKRUPTCY_TURNS}턴 연속 적자로 센터가 폐업했습니다.`;
    }
  }

  // 평판 0으로 인한 게임오버
  if (reputation <= 0 && Object.keys(patients).length > 0) {
    const incidentCount = events.filter((e) => e.type === "incident").length;
    if (incidentCount >= 2) {
      isGameOver = true;
      gameOverReason = "연이은 사고로 센터의 신뢰를 잃어 폐업했습니다.";
    }
  }

  const counselorCount = Object.keys(state.counselors).length;
  let maxAp = AP_BASE + counselorCount * AP_PER_COUNSELOR;

  // 튜토리얼 AP 제한
  if (isTutorialTurn(nextTurn)) {
    maxAp = Math.min(maxAp, tutConfig.maxAp);
  }

  const entry: TurnLogEntry = { turn: state.currentTurn, events };
  const turnLog = [...state.turnLog, entry].slice(-MAX_HISTORY_TURNS);

  return {
    gold,
    reputation: Math.max(0, Math.min(100, reputation)),
    ap: maxAp,
    maxAp,
    currentTurn: nextTurn,
    patients,
    turnLog,
    events,
    dischargedPatients,
    isGameOver,
    gameOverReason,
  };
}
