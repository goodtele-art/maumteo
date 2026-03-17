import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { Patient } from "@/types/index.ts";
import { clampEM, getFloorForEM } from "@/lib/engine/em.ts";

export interface PatientSlice {
  patients: Record<string, Patient>;
  addPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  updatePatientEM: (id: string, newEM: number) => void;
  incrementRapport: (id: string, amount: number) => void;
  setPatients: (patients: Record<string, Patient>) => void;
}

export const createPatientSlice: StateCreator<
  GameStore,
  [],
  [],
  PatientSlice
> = (set) => ({
  patients: {},

  addPatient: (patient) =>
    set((s) => ({
      patients: { ...s.patients, [patient.id]: patient },
    })),

  removePatient: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.patients;
      return { patients: rest };
    }),

  updatePatientEM: (id, newEM) =>
    set((s) => {
      const patient = s.patients[id];
      if (!patient) return s;
      const em = clampEM(newEM);
      const currentFloorId = getFloorForEM(em);
      return {
        patients: {
          ...s.patients,
          [id]: { ...patient, em, currentFloorId },
        },
      };
    }),

  incrementRapport: (id, amount) =>
    set((s) => {
      const patient = s.patients[id];
      if (!patient) return s;
      return {
        patients: {
          ...s.patients,
          [id]: { ...patient, rapport: Math.min(100, patient.rapport + amount) },
        },
      };
    }),

  setPatients: (patients) => set({ patients }),
});
