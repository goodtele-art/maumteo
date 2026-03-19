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
        case "parent_involvement": {
          // 아동/영유아 내담자의 부모참여도 변경
          // childStage나 infantStage에서 랜덤 대상 선택
          const childStage = (s as GameStore).childStage;
          const infantStage = (s as GameStore).infantStage;
          const childPatients = childStage ? { ...childStage.patients } : {};
          const infantPatients = infantStage ? { ...infantStage.patients } : {};
          const allParentIds = [...Object.keys(childPatients), ...Object.keys(infantPatients)];
          if (allParentIds.length > 0) {
            const targetPid = targetPatientId ?? allParentIds[Math.floor(Math.random() * allParentIds.length)]!;
            if (childPatients[targetPid]) {
              const cp = childPatients[targetPid]!;
              childPatients[targetPid] = {
                ...cp,
                parentInvolvement: Math.max(0, Math.min(100, cp.parentInvolvement + effect.value)),
              };
              if (childStage) {
                set({ childStage: { ...childStage, patients: childPatients } } as Partial<GameStore>);
              }
            } else if (infantPatients[targetPid]) {
              const ip = infantPatients[targetPid]!;
              infantPatients[targetPid] = {
                ...ip,
                parentInvolvement: Math.max(0, Math.min(100, ip.parentInvolvement + effect.value)),
              };
              if (infantStage) {
                set({ infantStage: { ...infantStage, patients: infantPatients } } as Partial<GameStore>);
              }
            }
          }
          break;
        }
        case "patient_limit": {
          // 내담자 한도 변경 (현재는 로그만)
          console.log(`[Event] patient_limit effect: ${effect.value}`);
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
