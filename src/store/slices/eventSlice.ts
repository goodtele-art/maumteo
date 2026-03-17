import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { PendingEvent, EventChoice } from "@/types/index.ts";
import { clampEM, getFloorForEM } from "@/lib/engine/em.ts";

export interface EventSlice {
  pendingEvent: PendingEvent | null;
  setPendingEvent: (event: PendingEvent | null) => void;
  resolveEvent: (choiceIndex: number) => void;
}

export const createEventSlice: StateCreator<
  GameStore,
  [],
  [],
  EventSlice
> = (set, get) => ({
  pendingEvent: null,

  setPendingEvent: (event) => set({ pendingEvent: event }),

  resolveEvent: (choiceIndex) => {
    const s = get();
    const pending = s.pendingEvent;
    if (!pending) return;

    const choice: EventChoice | undefined = pending.event.choices[choiceIndex];
    if (!choice) return;

    let gold = s.gold;
    let reputation = s.reputation;
    let ap = s.ap;
    const patients = { ...s.patients };
    const counselors = { ...s.counselors };

    // context에서 미리 결정된 대상 가져오기
    const targetCounselorId = pending.context?.targetCounselorId;
    const targetPatientId = pending.context?.targetPatientId;

    for (const effect of choice.effects) {
      switch (effect.type) {
        case "gold":
          gold = Math.max(0, gold + effect.value);
          break;
        case "reputation":
          reputation = Math.max(0, Math.min(100, reputation + effect.value));
          break;
        case "ap":
          ap = Math.max(0, ap + effect.value);
          break;
        case "em_patient": {
          // context에 지정된 대상 우선, 없으면 랜덤
          const pid = targetPatientId ?? (() => {
            const ids = Object.keys(patients);
            return ids.length > 0 ? ids[Math.floor(Math.random() * ids.length)]! : null;
          })();
          if (pid && patients[pid]) {
            const p = patients[pid]!;
            const newEm = clampEM(p.em + effect.value);
            patients[pid] = { ...p, em: newEm, currentFloorId: getFloorForEM(newEm) };
          }
          break;
        }
        case "counselor_skill": {
          // context에 지정된 대상 우선, 없으면 랜덤
          const cid = targetCounselorId ?? (() => {
            const ids = Object.keys(counselors);
            return ids.length > 0 ? ids[Math.floor(Math.random() * ids.length)]! : null;
          })();
          if (cid && counselors[cid]) {
            const c = counselors[cid]!;
            counselors[cid] = { ...c, skill: Math.min(10, c.skill + effect.value) };
          }
          break;
        }
        case "counselor_leave": {
          // 대상 상담사를 휴가 상태로 전환
          const cid = targetCounselorId ?? (() => {
            const ids = Object.keys(counselors);
            return ids.length > 0 ? ids[Math.floor(Math.random() * ids.length)]! : null;
          })();
          if (cid && counselors[cid]) {
            counselors[cid] = { ...counselors[cid]!, onLeave: true };
          }
          break;
        }
      }
    }

    set({
      gold,
      reputation,
      ap,
      patients,
      counselors,
      pendingEvent: null,
    });
  },
});
