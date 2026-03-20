/**
 * 디버그용 시나리오: ?debug=30 또는 ?debug=60 으로 접속하면
 * 해당 턴 상태로 게임 시작 (개발/테스트 전용)
 */
import { useGameStore } from "@/store/gameStore.ts";
import { generatePatient } from "@/lib/engine/patient.ts";
import { generateChildPatient } from "@/lib/engine/childPatient.ts";

/** URL에서 debug 파라미터 읽기 */
export function getDebugTurn(): number | null {
  const params = new URLSearchParams(window.location.search);
  const val = params.get("debug");
  if (!val) return null;
  const turn = parseInt(val, 10);
  if (turn === 30 || turn === 60) return turn;
  return null;
}

/** 턴 30 시나리오: 성인센터 안정 운영 + 아동센터 직전 */
function initTurn30() {
  const s = useGameStore.getState();

  // 성인센터 — 풍부한 자원
  s.setResources({ gold: 5000, reputation: 65, ap: 9, maxAp: 9 });
  s.setTurnState({ currentTurn: 30, turnLog: [] });
  s.selectFloor("counseling");

  // 성인 상담사 4명
  s.hireCounselor("최보람", "trauma_focused", 5, 44);
  s.hireCounselor("정은기", "family_systemic", 4, 52);
  s.hireCounselor("김희망", "dbt", 5, 60);
  s.hireCounselor("한상담", "cbt", 5, 60);

  // 성인 시설
  s.buildFacility("individual_room", 0);
  s.buildFacility("group_room", 1);
  s.buildFacility("exposure_lab", 2);
  s.buildFacility("family_room", 3);

  // 성인 내담자 8명 (다양한 문제, 다양한 EM)
  s.setPatients({});
  for (let i = 0; i < 8; i++) {
    s.addPatient(generatePatient(30, i + 1));
  }

  // Stage 초기화 (이전 세이브의 잔존 데이터 정리)
  useGameStore.setState({
    activeStage: "adult",
    childStage: null,
    infantStage: null,
    viceDirector: null,
  });
}

/** 턴 60 시나리오: 성인+아동 운영 중 + 영유아센터 직전 */
function initTurn60() {
  const s = useGameStore.getState();

  // 풍부한 자원
  s.setResources({ gold: 8000, reputation: 75, ap: 9, maxAp: 9 });
  s.setTurnState({ currentTurn: 60, turnLog: [] });
  s.selectFloor("counseling");

  // 성인 상담사 4명
  s.hireCounselor("최보람", "trauma_focused", 6, 44);
  s.hireCounselor("정은기", "family_systemic", 5, 52);
  s.hireCounselor("김희망", "dbt", 5, 60);
  s.hireCounselor("한상담", "cbt", 6, 60);

  // 성인 시설
  s.buildFacility("individual_room", 0);
  s.buildFacility("group_room", 1);
  s.buildFacility("exposure_lab", 2);
  s.buildFacility("family_room", 3);
  s.buildFacility("mindfulness_room", 4);

  // 성인 내담자 6명
  s.setPatients({});
  for (let i = 0; i < 6; i++) {
    s.addPatient(generatePatient(60, i + 1));
  }

  // ── 아동센터 ──
  s.initChildStage();

  const childState = useGameStore.getState().childStage;
  if (childState) {
    // 아동 상담사 3명
    const childCounselors = {
      cc_1: { id: "cc_1", name: "이놀이", specialty: "play_therapy" as const, skill: 4, salary: 40, assignedPatientId: null, treatmentCount: 12, onLeave: false },
      cc_2: { id: "cc_2", name: "박부모", specialty: "parent_training" as const, skill: 5, salary: 50, assignedPatientId: null, treatmentCount: 8, onLeave: false },
      cc_3: { id: "cc_3", name: "김아동", specialty: "child_cbt" as const, skill: 5, salary: 55, assignedPatientId: null, treatmentCount: 15, onLeave: false },
    };

    // 아동 시설
    const childFacilities = {
      cf_1: { id: "cf_1", type: "play_room" as const, slotIndex: 0, level: 2, buildCost: 120, upkeepPerTurn: 10, emReduction: 10 },
      cf_2: { id: "cf_2", type: "parent_room" as const, slotIndex: 1, level: 1, buildCost: 100, upkeepPerTurn: 8, emReduction: 5 },
      cf_3: { id: "cf_3", type: "group_activity" as const, slotIndex: 2, level: 1, buildCost: 160, upkeepPerTurn: 14, emReduction: 7 },
    };

    // 아동 내담자 5명
    const childPatients: Record<string, ReturnType<typeof generateChildPatient>> = {};
    for (let i = 0; i < 5; i++) {
      const p = generateChildPatient(60, i + 100);
      childPatients[p.id] = p;
    }

    useGameStore.setState({
      childStage: {
        ...childState,
        ap: 8,
        maxAp: 8,
        counselors: childCounselors,
        facilities: childFacilities,
        patients: childPatients,
        specialization: null,
        referral: null,
      },
    });
  }

  // 영유아센터 미오픈, 이전 잔존 데이터 정리
  useGameStore.setState({ infantStage: null, activeStage: "adult", viceDirector: null });
}

/** 디버그 시나리오 적용 */
export function applyDebugScenario(turn: number): boolean {
  if (turn === 30) {
    initTurn30();
    return true;
  }
  if (turn === 60) {
    initTurn60();
    return true;
  }
  return false;
}
