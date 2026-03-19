import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { ClinicalPsychologist, CenterDirector } from "@/types/staff/index.ts";
import { getMaxAssessments } from "@/types/staff/index.ts";

function generateStaffId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export interface StaffSlice {
  hirePsychologist: (
    stage: "child" | "infant",
    name: string,
    skill: number,
    salary: number,
  ) => void;
  hireDirector: (
    stage: "child" | "infant",
    name: string,
    commSkill: number,
    supSkill: number,
    salary: number,
  ) => void;
  fireDirector: (stage: "child" | "infant") => void;
}

export const createStaffSlice: StateCreator<GameStore, [], [], StaffSlice> = (
  set,
) => ({
  hirePsychologist: (stage, name, skill, salary) => {
    const id = generateStaffId("psy");
    const psychologist: ClinicalPsychologist = {
      id,
      name,
      skill,
      salary,
      assessmentsThisTurn: 0,
      maxAssessments: getMaxAssessments(skill),
    };

    set((state) => {
      if (stage === "child" && state.childStage) {
        return {
          childStage: {
            ...state.childStage,
            psychologists: {
              ...state.childStage.psychologists,
              [id]: psychologist,
            },
          },
        };
      }
      if (stage === "infant" && state.infantStage) {
        return {
          infantStage: {
            ...state.infantStage,
            psychologists: {
              ...state.infantStage.psychologists,
              [id]: psychologist,
            },
          },
        };
      }
      return {};
    });
  },

  hireDirector: (stage, name, commSkill, supSkill, salary) => {
    const id = generateStaffId("dir");
    const director: CenterDirector = {
      id,
      name,
      communicationSkill: commSkill,
      supervisionSkill: supSkill,
      salary,
      disputesResolved: 0,
    };

    set((state) => {
      if (stage === "child" && state.childStage) {
        return { childStage: { ...state.childStage, director } };
      }
      if (stage === "infant" && state.infantStage) {
        return { infantStage: { ...state.infantStage, director } };
      }
      return {};
    });
  },

  fireDirector: (stage) =>
    set((state) => {
      if (stage === "child" && state.childStage) {
        return { childStage: { ...state.childStage, director: null } };
      }
      if (stage === "infant" && state.infantStage) {
        return { infantStage: { ...state.infantStage, director: null } };
      }
      return {};
    }),
});
