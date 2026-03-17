import type { DominantIssue, FacilityType, FloorId } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

/**
 * 에셋 경로 레지스트리
 * 이미지가 없으면 null 반환 → 컴포넌트에서 플레이스홀더 표시
 */

type EmotionState = "calm" | "neutral" | "distress";

export function getPatientAsset(issue: DominantIssue, emotion: EmotionState): string {
  return `/assets/characters/patient/${issue}_${emotion}.webp`;
}

export function getCounselorAsset(specialty: CounselorSpecialty): string {
  return `/assets/characters/counselor/${specialty}.webp`;
}

export function getFacilityAsset(type: FacilityType): string {
  return `/assets/facilities/${type}.webp`;
}

export function getFloorBackground(floorId: FloorId): string {
  return `/assets/floors/${floorId}.webp`;
}

/** EM 값 → 감정 상태 매핑 */
export function emToEmotion(em: number): EmotionState {
  if (em <= 35) return "calm";
  if (em <= 65) return "neutral";
  return "distress";
}
