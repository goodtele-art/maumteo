import { useState, useCallback } from "react";
import { GUIDES, getSeenGuides, markGuideSeen, resetSeenGuides } from "@/lib/guideData.ts";
import type { GuideEntry } from "@/lib/guideData.ts";

/**
 * 컨텍스트 가이드 훅
 * - show(guideId): 아직 안 본 가이드면 모달 표시
 * - dismiss(): 현재 가이드 닫기 + 본 것으로 기록
 * - reset(): 모든 가이드 초기화 (새 게임 시)
 */
export function useGuide() {
  const [current, setCurrent] = useState<GuideEntry | null>(null);
  const [, setQueue] = useState<GuideEntry[]>([]);

  const show = useCallback((guideId: string) => {
    const entry = GUIDES[guideId];
    if (!entry) return;

    const seen = getSeenGuides();
    if (seen.has(guideId)) return;

    // 이미 표시 중이면 큐에 추가
    setCurrent((prev) => {
      if (prev) {
        setQueue((q) => [...q, entry]);
        return prev;
      }
      return entry;
    });
  }, []);

  const dismiss = useCallback(() => {
    if (current) {
      markGuideSeen(current.id);
    }
    // 큐에서 다음 가이드 꺼내기
    setQueue((q) => {
      if (q.length > 0) {
        const [next, ...rest] = q;
        setCurrent(next!);
        return rest;
      }
      setCurrent(null);
      return q;
    });
  }, [current]);

  const reset = useCallback(() => {
    resetSeenGuides();
    setCurrent(null);
    setQueue([]);
  }, []);

  return { currentGuide: current, showGuide: show, dismissGuide: dismiss, resetGuides: reset };
}
