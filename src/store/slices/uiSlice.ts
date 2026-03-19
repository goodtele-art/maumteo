import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { FloorId, ModalType, Notification } from "@/types/index.ts";
import type { ViceDirector } from "@/types/staff/index.ts";
import type { DelegationReport } from "@/types/delegation.ts";

export interface UiSlice {
  selectedFloorId: FloorId;
  activeModal: ModalType | null;
  notifications: Notification[];
  viceDirector: ViceDirector | null; // 성인센터 부센터장
  delegationReport: DelegationReport | null;
  selectFloor: (floorId: FloorId) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
  setDelegationReport: (report: DelegationReport | null) => void;
}

export const createUiSlice: StateCreator<
  GameStore,
  [],
  [],
  UiSlice
> = (set) => ({
  selectedFloorId: "counseling",
  activeModal: null,
  notifications: [],
  viceDirector: null,
  delegationReport: null,

  selectFloor: (floorId) => set({ selectedFloorId: floorId }),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  addNotification: (message, type) =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        { id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, message, type },
      ],
    })),

  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

  setDelegationReport: (report) => set({ delegationReport: report }),
});
