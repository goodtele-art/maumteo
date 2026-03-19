import type { StageId } from "./stage.ts";

/** 위임 시 수행된 개별 행동 */
export interface DelegationAction {
  type: "treat" | "encourage";
  patientId: string;
  patientName: string;
  counselorId?: string;
  counselorName?: string;
  facilityId?: string;
  facilityLabel?: string;
  emBefore: number;
  emAfter: number;
  emDelta: number;
}

/** 부센터장이 올리는 결재 요청 */
export interface ApprovalRequest {
  id: string;
  type: "build" | "hire";
  reason: string; // e.g., "상담사 부족: 내담자 5명 대비 상담사 2명"
  suggestion?: string; // e.g., 추천 전공/시설 타입
  status: "pending" | "approved" | "dismissed";
}

/** 위임 실행 결과 보고서 */
export interface DelegationReport {
  turn: number;
  stageId: StageId;
  actions: DelegationAction[];
  apUsed: number;
  apRemaining: number;
  approvalRequests: ApprovalRequest[];
  summary: string; // e.g., "3명 치료, 1명 격려, AP 7/8 사용"
}
