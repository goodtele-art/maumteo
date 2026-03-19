import type { StateCreator } from "zustand";
import type { GameStore } from "../gameStore.ts";
import type { ClinicalPsychologist, CenterDirector, ViceDirector } from "@/types/staff/index.ts";
import { getMaxAssessments } from "@/types/staff/index.ts";

function generateStaffId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export interface StaffSlice {
  viceDirector: ViceDirector | null; // 성인센터 부센터장 (root level)
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
  hireViceDirector: (
    stage: "adult" | "child",
    name: string,
    managementSkill: number,
    salary: number,
  ) => void;
  fireViceDirector: (stage: "adult" | "child") => void;
}

export const createStaffSlice: StateCreator<GameStore, [], [], StaffSlice> = (
  set,
) => ({
  viceDirector: null,
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

  hireViceDirector: (stage, name, managementSkill, salary) => {
    const id = generateStaffId("vd");
    const viceDirector: ViceDirector = { id, name, managementSkill, salary };
    const hireCost = salary * 2;

    set((state) => {
      if (stage === "adult") {
        return {
          viceDirector,
          gold: state.gold - hireCost,
          ap: state.ap - 2, // AP_COST.hire
        };
      }
      if (stage === "child" && state.childStage) {
        return {
          gold: state.gold - hireCost,
          childStage: {
            ...state.childStage,
            viceDirector,
            ap: state.childStage.ap - 2,
          },
        };
      }
      return {};
    });
  },

  fireViceDirector: (stage) =>
    set((state) => {
      if (stage === "adult") {
        return { viceDirector: null };
      }
      if (stage === "child" && state.childStage) {
        return { childStage: { ...state.childStage, viceDirector: null } };
      }
      return {};
    }),
});
