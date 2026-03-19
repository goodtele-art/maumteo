import type { GameEvent } from "@/types/index.ts";
import { CHILD_EVENTS } from "./childEvents.ts";
import { INFANT_EVENTS } from "./infantEvents.ts";

/** 이벤트 정의 5종 */
const EVENT_POOL: GameEvent[] = [
  {
    id: "guardian_visit",
    title: "보호자 면담 요청",
    description: "한 내담자의 보호자가 면담을 요청했습니다. 시간을 내어 대응하시겠습니까?",
    choices: [
      { label: "수락 (평판+2, AP-1)", effects: [{ type: "reputation", value: 2 }, { type: "ap", value: -1 }] },
      { label: "거절 (평판-1)", effects: [{ type: "reputation", value: -1 }] },
    ],
  },
  {
    id: "media_interview",
    title: "지역 언론 취재",
    description: "지역 신문에서 센터를 취재하고 싶다고 합니다. 좋은 홍보가 될 수 있지만 리스크도 있습니다.",
    choices: [
      { label: "인터뷰 수락 (평판+5, 골드-30)", effects: [{ type: "reputation", value: 5 }, { type: "gold", value: -30 }] },
      { label: "정중히 거절", effects: [] },
    ],
  },
  {
    id: "counselor_burnout",
    title: "상담사 번아웃 징후",
    description: "",
    choices: [
      { label: "특별 휴가 (골드-50, 실력+1, 다음 턴 휴가)", effects: [{ type: "gold", value: -50 }, { type: "counselor_skill", value: 1, targetRandom: true }, { type: "counselor_leave", value: 1, targetRandom: true }] },
      { label: "무시 (평판-2)", effects: [{ type: "reputation", value: -2 }] },
    ],
  },
  {
    id: "patient_conflict",
    title: "내담자 간 갈등",
    description: "두 내담자 사이에 갈등이 발생했습니다. 직접 중재하시겠습니까?",
    choices: [
      { label: "중재 (AP-2, 내담자 EM-5)", effects: [{ type: "ap", value: -2 }, { type: "em_patient", value: -5, targetRandom: true }] },
      { label: "방관 (내담자 EM+10)", effects: [{ type: "em_patient", value: 10, targetRandom: true }] },
    ],
  },
  {
    id: "donation_offer",
    title: "후원금 제안",
    description: "지역 기업에서 센터에 후원금을 제안했습니다.",
    choices: [
      { label: "수락 (골드+100)", effects: [{ type: "gold", value: 100 }] },
      { label: "감사히 거절 (평판+3)", effects: [{ type: "reputation", value: 3 }] },
    ],
  },
];

/** 특별 이벤트 ID (롤 대상에서 제외) */
const SPECIAL_EVENT_IDS = new Set(["center_specialization", "crisis_protocol"]);

/** 해당 턴에 이벤트가 발생하는지 판정 (턴 2부터, 확률 ~30%) */
export function rollForEvent(
  turn: number,
  seed?: number,
  hasChildStage?: boolean,
  hasInfantStage?: boolean,
): GameEvent | null {
  if (turn < 2) return null;

  const rand = seed !== undefined
    ? ((seed * 9301 + 49297) % 233280) / 233280
    : Math.random();

  if (rand > 0.30) return null;

  // 현재 턴에 맞는 이벤트 풀 구성
  let pool: GameEvent[] = [...EVENT_POOL];
  if (hasChildStage) {
    pool = pool.concat(
      CHILD_EVENTS.filter((e) => !SPECIAL_EVENT_IDS.has(e.id)),
    );
  }
  if (hasInfantStage) {
    pool = pool.concat(INFANT_EVENTS);
  }

  const idx = Math.floor(
    (seed !== undefined ? ((seed * 7 + turn * 13) % pool.length + pool.length) % pool.length : Math.random() * pool.length),
  );
  return pool[idx]!;
}

/** 특수 이벤트를 ID로 가져오기 */
export function getSpecialEvent(eventId: string): GameEvent | null {
  const all = [...CHILD_EVENTS, ...INFANT_EVENTS];
  return all.find((e) => e.id === eventId) ?? null;
}

/** 이벤트 목록 반환 (테스트/표시용) */
export function getEventPool(): readonly GameEvent[] {
  return EVENT_POOL;
}
