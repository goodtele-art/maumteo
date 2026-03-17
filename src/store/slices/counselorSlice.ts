import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { Counselor } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

export interface CounselorSlice {
  counselors: Record<string, Counselor>;
  hireCounselor: (name: string, specialty: CounselorSpecialty, skill: number, salary: number) => string;
  fireCounselor: (counselorId: string) => boolean;
  assignCounselor: (counselorId: string, patientId: string) => void;
  unassignCounselor: (counselorId: string) => void;
  setCounselors: (counselors: Record<string, Counselor>) => void;
}

function nextCounselorId(counselors: Record<string, Counselor>): string {
  let max = 0;
  for (const id of Object.keys(counselors)) {
    const n = parseInt(id.replace("c_", ""), 10);
    if (n > max) max = n;
  }
  return `c_${max + 1}`;
}

export const createCounselorSlice: StateCreator<
  GameStore,
  [],
  [],
  CounselorSlice
> = (set, get) => ({
  counselors: {},

  hireCounselor: (name, specialty, skill, salary) => {
    const id = nextCounselorId(get().counselors);
    const counselor: Counselor = {
      id,
      name,
      specialty,
      skill,
      salary,
      assignedPatientId: null,
      treatmentCount: 0,
    };
    set((s) => ({
      counselors: { ...s.counselors, [id]: counselor },
    }));
    return id;
  },

  fireCounselor: (counselorId) => {
    const counselor = get().counselors[counselorId];
    if (!counselor) return false;
    set((s) => {
      const { [counselorId]: _, ...rest } = s.counselors;
      return { counselors: rest };
    });
    return true;
  },

  assignCounselor: (counselorId, patientId) =>
    set((s) => {
      const counselor = s.counselors[counselorId];
      if (!counselor) return s;
      return {
        counselors: {
          ...s.counselors,
          [counselorId]: { ...counselor, assignedPatientId: patientId },
        },
      };
    }),

  unassignCounselor: (counselorId) =>
    set((s) => {
      const counselor = s.counselors[counselorId];
      if (!counselor) return s;
      return {
        counselors: {
          ...s.counselors,
          [counselorId]: { ...counselor, assignedPatientId: null },
        },
      };
    }),

  setCounselors: (counselors) => set({ counselors }),
});
