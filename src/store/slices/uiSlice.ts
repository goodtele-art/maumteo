import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { FloorId, ModalType, Notification } from "@/types/index.ts";

export interface UiSlice {
  selectedFloorId: FloorId;
  activeModal: ModalType | null;
  notifications: Notification[];
  selectFloor: (floorId: FloorId) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
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
});
