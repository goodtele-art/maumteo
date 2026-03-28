import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { FloorId, ModalType, Notification } from "@/types/index.ts";
import type { DelegationReport } from "@/types/delegation.ts";

export type DisplayMode = "beginner" | "expert";

export interface CollectedLetter {
  id: string;
  issue: string;
  patientName: string;
  letter: string;
  turn: number;
}

export interface UiSlice {
  selectedFloorId: FloorId;
  activeModal: ModalType | null;
  notifications: Notification[];
  delegationReport: DelegationReport | null;
  displayMode: DisplayMode;
  specialLetters: CollectedLetter[];
  pendingSpecialLetter: CollectedLetter | null;
  selectFloor: (floorId: FloorId) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
  setDelegationReport: (report: DelegationReport | null) => void;
  toggleDisplayMode: () => void;
  setPendingSpecialLetter: (letter: CollectedLetter | null) => void;
  collectSpecialLetter: (letter: CollectedLetter) => void;
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
  delegationReport: null,
  displayMode: "beginner" as DisplayMode,
  specialLetters: [],
  pendingSpecialLetter: null,

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

  toggleDisplayMode: () =>
    set((s) => ({ displayMode: s.displayMode === "beginner" ? "expert" : "beginner" })),

  setPendingSpecialLetter: (letter) => set({ pendingSpecialLetter: letter }),

  collectSpecialLetter: (letter) =>
    set((s) => ({
      specialLetters: [...s.specialLetters, letter],
      pendingSpecialLetter: null,
    })),
});
