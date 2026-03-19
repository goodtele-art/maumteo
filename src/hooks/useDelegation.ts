/**
 * 부센터장 위임 실행 훅
 * planDelegation()으로 계획 수립 → treat/encourage 실행 → 보고서 생성
 */
import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore.ts";
import { useGameActions } from "./useGameActions.ts";
import { planDelegation } from "@/lib/engine/delegation.ts";
import { getMatchMultiplier, FACILITY_TEMPLATES } from "@/lib/constants.ts";
import { getChildMatchMultiplier, CHILD_FACILITY_TEMPLATES } from "@/lib/constants/childConstants.ts";
import type { DelegationReport, DelegationAction } from "@/types/delegation.ts";
import type { StageId } from "@/types/stage.ts";
import type { Patient } from "@/types/index.ts";

export function useDelegation() {
  const { treat, encourage } = useGameActions();

  const delegate = useCallback((stageId: StageId) => {
    const s = useGameStore.getState();

    // 부센터장 확인
    let viceDirector;
    if (stageId === "adult") {
      viceDirector = s.viceDirector;
    } else if (stageId === "child" && s.childStage) {
      viceDirector = s.childStage.viceDirector;
    }
    if (!viceDirector) {
      s.addNotification("부센터장이 고용되지 않았습니다", "warning");
      return null;
    }

    // 스테이지 데이터 수집
    let patients: Record<string, Patient>;
    let counselors: Record<string, { id: string; name: string; specialty: string; skill: number; onLeave?: boolean }>;
    let facilities: Record<string, { id: string; type: string; emReduction: number; level: number }>;
    let ap: number;
    let matchFn: (specialty: string, issue: string) => number;

    if (stageId === "child" && s.childStage) {
      patients = s.childStage.patients as unknown as Record<string, Patient>;
      counselors = s.childStage.counselors;
      facilities = s.childStage.facilities;
      ap = s.childStage.ap;
      matchFn = (sp, iss) => getChildMatchMultiplier(sp as Parameters<typeof getChildMatchMultiplier>[0], iss as Parameters<typeof getChildMatchMultiplier>[1]);
    } else {
      patients = s.patients;
      counselors = s.counselors;
      facilities = s.facilities;
      ap = s.ap;
      matchFn = (sp, iss) => {
        try {
          return getMatchMultiplier(sp as Parameters<typeof getMatchMultiplier>[0], iss as Parameters<typeof getMatchMultiplier>[1]);
        } catch {
          return 0.85;
        }
      };
    }

    // 시설 라벨 매핑
    const allTemplates: Record<string, { label: string }> = { ...FACILITY_TEMPLATES, ...CHILD_FACILITY_TEMPLATES };
    const facilitiesWithLabel = Object.values(facilities).map(f => ({
      ...f,
      label: allTemplates[f.type]?.label ?? f.type,
    }));

    // 위임 전 activeStage를 해당 센터로 설정
    const prevStage = s.activeStage;
    if (s.activeStage !== stageId) {
      useGameStore.setState({ activeStage: stageId });
    }

    // 시설 ID → 라벨 매핑
    const facilityLabelMap: Record<string, string> = {};
    for (const f of Object.values(facilities)) {
      facilityLabelMap[f.id] = allTemplates[f.type]?.label ?? f.type;
    }

    let plan;
    const executedActions: DelegationAction[] = [];

    try {
      // 계획 수립
      plan = planDelegation({
        patients: Object.values(patients).map(p => ({
          id: p.id,
          name: p.name,
          em: p.em,
          dominantIssue: p.dominantIssue,
          rapport: p.rapport,
          treatmentCount: p.treatmentCount,
        })),
        counselors: Object.values(counselors),
        facilities: facilitiesWithLabel,
        ap,
        viceDirector,
        getMatchMultiplier: matchFn,
      });

      // 계획 실행
      for (const action of plan.actions) {
        if (action.type === "treat") {
          const result = treat(action.patientId, action.counselorId, action.facilityId);
          if (result && result.success) {
            executedActions.push({
              type: "treat",
              patientId: action.patientId,
              patientName: action.patientName,
              counselorId: action.counselorId,
              counselorName: action.counselorName,
              facilityId: action.facilityId,
              facilityLabel: action.facilityId ? facilityLabelMap[action.facilityId] : undefined,
              emBefore: result.emBefore,
              emAfter: result.emAfter,
              emDelta: result.emDelta,
            });
          }
        } else {
          const result = encourage(action.patientId);
          if (result && result.success) {
            executedActions.push({
              type: "encourage",
              patientId: action.patientId,
              patientName: action.patientName,
              emBefore: result.emBefore,
              emAfter: result.emAfter,
              emDelta: result.emDelta,
            });
          }
        }
      }
    } finally {
      // activeStage 복원 (에러 발생해도 반드시 복원)
      if (prevStage !== stageId) {
        useGameStore.setState({ activeStage: prevStage });
      }
    }

    // 보고서 생성
    const treatCount = executedActions.filter(a => a.type === "treat").length;
    const encourageCount = executedActions.filter(a => a.type === "encourage").length;
    const currentState = useGameStore.getState();
    const currentAp = stageId === "child" && currentState.childStage
      ? currentState.childStage.ap
      : currentState.ap;

    const report: DelegationReport = {
      turn: currentState.currentTurn,
      stageId,
      actions: executedActions,
      apUsed: plan.totalApCost,
      apRemaining: currentAp,
      approvalRequests: plan.approvalRequests,
      summary: executedActions.length === 0
        ? "수행할 작업이 없습니다"
        : `${treatCount > 0 ? `${treatCount}명 치료` : ""}${treatCount > 0 && encourageCount > 0 ? ", " : ""}${encourageCount > 0 ? `${encourageCount}명 격려` : ""} (AP ${plan.totalApCost} 사용)`,
    };

    // 보고서 저장 + 모달 열기
    useGameStore.getState().setDelegationReport(report);
    useGameStore.getState().openModal("delegation_report");

    return report;
  }, [treat, encourage]);

  return { delegate };
}
