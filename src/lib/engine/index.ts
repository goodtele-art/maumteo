export { clampEM, calcTreatmentEffect, applyVariance, getFloorForEM } from "./em.ts";
export {
  generatePatient,
  checkDischarge,
  getDischargeMessage,
  shouldMoveFloor,
  ISSUE_LABELS,
} from "./patient.ts";
export { processTurn } from "./turn.ts";
export type { TurnResult } from "./turn.ts";
export { calcIncome, calcUpkeep, canAfford } from "./economy.ts";
export { getUnlockedFloors, isFloorUnlocked } from "./unlock.ts";
export {
  serialize,
  deserialize,
  validateSaveData,
} from "./save.ts";
