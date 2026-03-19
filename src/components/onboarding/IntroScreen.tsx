import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

interface IntroScreenProps {
  onStart: () => void;
}

const PAGES = [
  {
    icon: "🌍",
    title: "마음의 중력 세계",
    body: `모든 사람의 마음에는 보이지 않는 '감정 질량(EM)'이 있습니다.

슬픔, 불안, 트라우마 — 이런 감정의 무게가 쌓이면 EM이 높아지고, 사람은 점점 더 깊은 곳으로 가라앉게 됩니다.

하지만 마음의 짐이 가벼워지면, 사람은 다시 높은 곳으로 올라갈 수 있습니다.`,
  },
  {
    icon: "🏥",
    title: "당신은 상담센터의 원장입니다",
    body: `마음터는 EM이 많아 마음이 무거운 내담자들이 찾아오는 심리상담센터입니다.

센터는 5개의 층으로 이루어져 있습니다. 마음이 가장 무거운 내담자는 가장 아래층(거주치료센터)에, 치료가 진행되어 마음이 가벼워지면 위층으로 올라갑니다.

옥상하늘정원에 도달하면 — 마음의 짐을 내려놓고 상담을 종결할 수 있습니다.`,
  },
  {
    icon: "📚",
    title: "근거기반 심리치료",
    body: `이 게임의 치료 시스템은 실제 근거기반 심리치료(Evidence-Based Practice)에 기초합니다.

인지행동치료(CBT), 정신역동치료, 변증법적행동치료(DBT), 트라우마초점치료 등 — 각 상담사는 고유한 전공을 가지고 있으며, 내담자의 문제 영역에 따라 효과가 달라집니다.

최적의 상담사와 내담자를 매칭하는 것이 치료의 핵심입니다.`,
  },
  {
    icon: "⭐",
    title: "센터를 성장시켜 주세요",
    body: `매 턴마다 행동력(AP)을 사용하여 상담, 시설 건설, 상담사 고용을 할 수 있습니다.

좋은 상담사를 고용하고, 전문 치료실을 건설하며, 내담자를 성공적으로 종결시키면 센터의 평판이 올라갑니다.

평판이 높아지면 더 많은 내담자가 찾아오고, 우수한 상담사도 지원합니다. 지역사회에서 신뢰받는 '마음의 등대'를 만들어 주세요!`,
  },
];

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [page, setPage] = useState(0);
  const isLast = page === PAGES.length - 1;
  const current = PAGES[page]!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-base">
      <div className="w-full max-w-lg mx-4">
        {/* 제목 */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-floor-counseling mb-1">마음터</h1>
          <p className="text-sm text-theme-tertiary">Psychological Gravity World</p>
        </m.div>

        {/* 페이지 컨텐츠 */}
        <AnimatePresence mode="wait">
          <m.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card-strong rounded-xl p-6 bg-surface-card min-h-[320px] flex flex-col"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">{current.icon}</span>
            </div>
            <h2 className="text-lg font-bold text-theme-primary text-center mb-4">
              {current.title}
            </h2>
            <p className="text-sm text-theme-secondary leading-relaxed whitespace-pre-line flex-1">
              {current.body}
            </p>
          </m.div>
        </AnimatePresence>

        {/* 페이지 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === page ? "bg-floor-counseling" : "bg-surface-card-hover"
              }`}
              aria-label={`페이지 ${i + 1}`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-5">
          {page > 0 && (
            <button
              onClick={() => setPage(page - 1)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-surface-card hover:bg-surface-card-hover text-theme-secondary transition-colors"
            >
              ← 이전
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setPage(page + 1)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-floor-counseling hover:bg-sky-600 text-white transition-colors"
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-floor-counseling hover:bg-sky-600 text-white transition-colors"
            >
              센터 운영 시작하기
            </button>
          )}
        </div>

        {/* 건너뛰기 */}
        {!isLast && (
          <button
            onClick={onStart}
            className="w-full text-center mt-3 text-xs text-theme-faint hover:text-theme-tertiary transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
}
