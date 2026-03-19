/**
 * 에셋 프리로딩 시스템
 * - 현재 뷰포트의 에셋만 선로드
 * - 다음 턴 예상 에셋 백그라운드 프리페치
 * - 로딩 실패 시 기존 이모지 폴백 유지 (graceful degradation)
 */

const loaded = new Set<string>();
const failed = new Set<string>();

/** 단일 이미지 프리로드 (Promise) */
function preloadImage(src: string): Promise<void> {
  if (loaded.has(src) || failed.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      loaded.add(src);
      resolve();
    };
    img.onerror = () => {
      failed.add(src);
      resolve(); // 실패해도 reject 하지 않음 (폴백 사용)
    };
    img.src = src;
  });
}

/** 여러 이미지를 병렬 프리로드 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/** 이미지가 이미 로드되었는지 확인 */
export function isImageLoaded(src: string): boolean {
  return loaded.has(src);
}

/** 이미지 로드가 실패했는지 확인 */
export function isImageFailed(src: string): boolean {
  return failed.has(src);
}

/** 로드 캐시 초기화 (새 게임 시) */
export function clearPreloadCache(): void {
  loaded.clear();
  failed.clear();
}

/**
 * requestIdleCallback 기반 백그라운드 프리페치
 * 브라우저가 여유로울 때 이미지를 미리 로드
 */
export function prefetchInIdle(srcs: string[]): void {
  const cb = typeof requestIdleCallback !== "undefined" ? requestIdleCallback : setTimeout;
  cb(() => {
    srcs.forEach((src) => preloadImage(src));
  });
}
