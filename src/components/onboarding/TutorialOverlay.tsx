import { m } from "motion/react";

interface TutorialOverlayProps {
  turn: number;
  onDismiss: () => void;
}

const TUTORIALS: Record<number, { title: string; body: string }> = {
  1: {
    title: "마음터에 오신 것을 환영합니다",
    body: "이곳은 마음의 짐을 내려놓는 곳입니다. 심리치료실에서 내담자들의 EM(감정 질량)을 줄여주세요. 행동력(AP)을 사용하여 상담, 시설 건설, 상담사 고용을 할 수 있습니다.",
  },
  3: {
    title: "심리평가실이 해금되었습니다",
    body: "EM 61~80 구간의 내담자들이 심리평가실에 배치됩니다. 시설을 건설하여 더 효과적으로 치료하세요.",
  },
  5: {
    title: "거주치료실이 개방됩니다",
    body: "EM 81~100의 중증 내담자들이 거주치료실에 도착합니다. 이들은 더 많은 관심과 전문적인 치료가 필요합니다.",
  },
  8: {
    title: "상담실과 옥상정원이 열립니다",
    body: "EM이 충분히 낮아진 거주자들은 상담실과 옥상정원으로 이동합니다. 옥상정원에 도달한 거주자는 상담 종결할 수 있습니다!",
  },
};

export default function TutorialOverlay({
  turn,
  onDismiss,
}: TutorialOverlayProps) {
  const tutorial = TUTORIALS[turn];
  if (!tutorial) return null;

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <m.div
        className="bg-surface-disabled border border-floor-counseling/50 rounded-xl p-6 w-full max-w-md mx-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-floor-counseling mb-3">
          {tutorial.title}
        </h2>
        <p className="text-sm text-theme-secondary leading-relaxed mb-4">
          {tutorial.body}
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-2 bg-floor-counseling hover:bg-sky-600 text-white text-sm rounded-lg transition-colors"
        >
          시작하기
        </button>
      </m.div>
    </m.div>
  );
}
