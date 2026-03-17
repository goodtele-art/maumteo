import { create } from "zustand";
import { createResourceSlice } from "./slices/resourceSlice.ts";
import { createPatientSlice } from "./slices/patientSlice.ts";
import { createFacilitySlice } from "./slices/facilitySlice.ts";
import { createCounselorSlice } from "./slices/counselorSlice.ts";
import { createTurnSlice } from "./slices/turnSlice.ts";
import { createUiSlice } from "./slices/uiSlice.ts";
import { createEventSlice } from "./slices/eventSlice.ts";
import { createAchievementSlice } from "./slices/achievementSlice.ts";
import type { ResourceSlice } from "./slices/resourceSlice.ts";
import type { PatientSlice } from "./slices/patientSlice.ts";
import type { FacilitySlice } from "./slices/facilitySlice.ts";
import type { CounselorSlice } from "./slices/counselorSlice.ts";
import type { TurnSlice } from "./slices/turnSlice.ts";
import type { UiSlice } from "./slices/uiSlice.ts";
import type { EventSlice } from "./slices/eventSlice.ts";
import type { AchievementSlice } from "./slices/achievementSlice.ts";

export type GameStore = ResourceSlice &
  PatientSlice &
  FacilitySlice &
  CounselorSlice &
  TurnSlice &
  UiSlice &
  EventSlice &
  AchievementSlice;

export const useGameStore = create<GameStore>()((...a) => ({
  ...createResourceSlice(...a),
  ...createPatientSlice(...a),
  ...createFacilitySlice(...a),
  ...createCounselorSlice(...a),
  ...createTurnSlice(...a),
  ...createUiSlice(...a),
  ...createEventSlice(...a),
  ...createAchievementSlice(...a),
}));
