import type { DominantIssue, FacilityType, FloorId } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";

/**
 * 에셋 경로 레지스트리
 * import.meta.env.BASE_URL을 사용하여 배포 환경(base path)에 자동 대응
 */

const BASE = import.meta.env.BASE_URL;

type EmotionState = "calm" | "neutral" | "distress";

export function getPatientAsset(issue: DominantIssue, emotion: EmotionState): string {
  return `${BASE}assets/characters/patient/${issue}_${emotion}.webp`;
}

export function getCounselorAsset(specialty: CounselorSpecialty): string {
  return `${BASE}assets/characters/counselor/${specialty}.webp`;
}

export function getFacilityAsset(type: FacilityType): string {
  return `${BASE}assets/facilities/${type}.webp`;
}

export function getFloorBackground(floorId: FloorId): string {
  return `${BASE}assets/floors/${floorId}.webp`;
}

/** EM 값 → 감정 상태 매핑 */
export function emToEmotion(em: number): EmotionState {
  if (em <= 35) return "calm";
  if (em <= 65) return "neutral";
  return "distress";
}
