import type { FloorId } from "./floor.ts";
import type { Patient } from "./patient.ts";
import type { Facility } from "./facility.ts";
import type { Counselor } from "./counselor.ts";

export type ModalType =
  | "build"
  | "hire"
  | "treat"
  | "patient_detail"
  | "turn_result"
  | "tutorial";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
}

export type TurnEvent =
  | {
      type: "treatment";
      patientId: string;
      emBefore: number;
      emAfter: number;
      floorBefore: FloorId;
      floorAfter: FloorId;
    }
  | { type: "discharge"; patientId: string; message: string }
  | { type: "admission"; patientId: string }
  | { type: "income"; amount: number }
  | { type: "upkeep"; amount: number }
  | {
      type: "floor_move";
      patientId: string;
      from: FloorId;
      to: FloorId;
    }
  | {
      type: "em_increase";
      patientId: string;
      emBefore: number;
      emAfter: number;
    }
  | {
      type: "incident";
      patientId: string;
      reputationLoss: number;
      message: string;
    };

export interface TurnLogEntry {
  turn: number;
  events: TurnEvent[];
}

export interface GameState {
  currentTurn: number;
  gold: number;
  reputation: number;
  ap: number;
  maxAp: number;
  patients: Record<string, Patient>;
  facilities: Record<string, Facility>;
  counselors: Record<string, Counselor>;
  turnLog: TurnLogEntry[];
  selectedFloorId: FloorId;
  activeModal: ModalType | null;
  notifications: Notification[];
}

import type { StageId, ChildStageState, InfantStageState } from "./stage.ts";

export interface SaveData {
  version: 1 | 2;
  timestamp: number;
  currentTurn: number;
  gold: number;
  reputation: number;
  ap: number;
  maxAp: number;
  patients: Record<string, Patient>;
  facilities: Record<string, Facility>;
  counselors: Record<string, Counselor>;
  turnLog: TurnLogEntry[];
  // Stage 2-3 확장 (v2)
  activeStage?: StageId;
  childStage?: ChildStageState | null;
  infantStage?: InfantStageState | null;
}
