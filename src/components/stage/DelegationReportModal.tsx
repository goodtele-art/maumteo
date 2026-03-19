/**
 * 부센터장 위임 결과 보고서 모달
 * 수행 내역 + 결재 요청 표시
 */
import Modal from "@/components/shared/Modal.tsx";
import { useGameStore } from "@/store/gameStore.ts";

export default function DelegationReportModal() {
  const report = useGameStore((s) => s.delegationReport);
  const closeModal = useGameStore((s) => s.closeModal);
  const activeModal = useGameStore((s) => s.activeModal);

  const open = activeModal === "delegation_report" && report !== null;

  const handleClose = () => {
    closeModal();
    useGameStore.getState().setDelegationReport(null);
  };

  if (!report) return null;

  const stageLabel = report.stageId === "adult" ? "성인센터" : "아동센터";

  return (
    <Modal open={open} onClose={handleClose} title={`${stageLabel} 위임 보고서`}>
      {/* 요약 */}
      <div className="mb-4 p-3 rounded-lg bg-surface-card text-sm text-theme-primary">
        <div className="font-medium mb-1">턴 {report.turn} 위임 결과</div>
        <div className="text-theme-secondary">{report.summary}</div>
        <div className="text-xs text-theme-tertiary mt-1">
          AP 사용: {report.apUsed} / 잔여: {report.apRemaining}
        </div>
      </div>

      {/* 수행 내역 */}
      {report.actions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-theme-tertiary mb-2">수행 내역</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {report.actions.map((action, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-surface-card/60 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-theme-primary">{action.patientName}</span>
                  <span className="text-theme-tertiary mx-1">
                    {action.type === "treat" ? "상담" : "격려"}
                  </span>
                  {action.counselorName && (
                    <span className="text-sky-400">← {action.counselorName}</span>
                  )}
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-teal-400">
                    EM {action.emBefore} → {action.emAfter}
                  </span>
                  <span className="text-theme-tertiary ml-1">(-{action.emDelta})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 결재 요청 */}
      {report.approvalRequests.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-amber-400 mb-2">결재 요청</h4>
          <div className="space-y-2">
            {report.approvalRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5"
              >
                <div className="text-sm text-theme-primary mb-1">{req.reason}</div>
                {req.suggestion && (
                  <div className="text-xs text-theme-secondary mb-2">{req.suggestion}</div>
                )}
                <div className="text-xs text-theme-tertiary">
                  {req.type === "hire" ? "상담사 고용" : "시설 건설"} 메뉴에서 직접 진행해주세요
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 닫기 */}
      <button
        onClick={handleClose}
        className="w-full mt-2 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
      >
        확인
      </button>
    </Modal>
  );
}
