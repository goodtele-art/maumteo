import type { Patient } from "./patient.ts";
import type { Facility } from "./facility.ts";
import type { Counselor } from "./counselor.ts";
import type { ChildPatient } from "./child/patient.ts";
import type { ChildFacility } from "./child/facility.ts";
import type { ChildCounselor } from "./child/counselor.ts";
import type { InfantPatient } from "./infant/patient.ts";
import type { InfantFacility } from "./infant/facility.ts";
import type { InfantCounselor } from "./infant/counselor.ts";
import type { ClinicalPsychologist, CenterDirector, ViceDirector } from "./staff/index.ts";
import type { CommunityReferral, ParentStress } from "./referral.ts";
import type { TurnLogEntry, Notification } from "./game.ts";
import type { FloorId } from "./floor.ts";
import type { ChildFloorId } from "./child/floor.ts";
import type { InfantFloorId } from "./infant/floor.ts";

export type StageId = "adult" | "child" | "infant";

/** 성인센터 상태 (기존 GameState와 거의 동일) */
export interface AdultStageState {
  ap: number;
  maxAp: number;
  patients: Record<string, Patient>;
  facilities: Record<string, Facility>;
  counselors: Record<string, Counselor>;
  viceDirector: ViceDirector | null;
  selectedFloorId: FloorId;
}

/** 아동청소년센터 상태 */
export interface ChildStageState {
  ap: number;
  maxAp: number;
  patients: Record<string, ChildPatient>;
  facilities: Record<string, ChildFacility>;
  counselors: Record<string, ChildCounselor>;
  psychologists: Record<string, ClinicalPsychologist>;
  director: CenterDirector | null;
  viceDirector: ViceDirector | null;
  referral: CommunityReferral | null;
  specialization: "trauma_focused" | "general" | null;
  selectedFloorId: ChildFloorId;
}

/** 영유아발달센터 상태 */
export interface InfantStageState {
  ap: number;
  maxAp: number;
  patients: Record<string, InfantPatient>;
  facilities: Record<string, InfantFacility>;
  counselors: Record<string, InfantCounselor>;
  psychologists: Record<string, ClinicalPsychologist>;
  director: CenterDirector | null;
  voucherReferral: CommunityReferral | null;
  parentStresses: ParentStress[];
  selectedFloorId: InfantFloorId;
}

/** 멀티 스테이지 전체 상태 */
export interface MultiStageState {
  activeStage: StageId;
  currentTurn: number;
  gold: number;
  reputation: number;
  adult: AdultStageState;
  child: ChildStageState | null;
  infant: InfantStageState | null;
  turnLog: TurnLogEntry[];
  notifications: Notification[];
}
