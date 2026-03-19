import type { DominantIssue, FacilityType, FloorId } from "@/types/index.ts";
import type { CounselorSpecialty } from "@/types/counselor.ts";
import type { ChildIssue } from "@/types/child/patient.ts";
import type { ChildSpecialty } from "@/types/child/counselor.ts";
import type { ChildFacilityType } from "@/types/child/facility.ts";
import type { ChildFloorId } from "@/types/child/floor.ts";
import type { InfantIssue } from "@/types/infant/patient.ts";
import type { InfantSpecialty } from "@/types/infant/counselor.ts";
import type { InfantFacilityType } from "@/types/infant/facility.ts";
import type { InfantFloorId } from "@/types/infant/floor.ts";

/**
 * 에셋 경로 레지스트리 (3스테이지 범용)
 * import.meta.env.BASE_URL을 사용하여 배포 환경(base path)에 자동 대응
 */

const BASE = import.meta.env.BASE_URL;

export type EmotionState = "calm" | "neutral" | "distress";

// ── 모든 스테이지 통합 타입 ──

export type AnyIssue = DominantIssue | ChildIssue | InfantIssue;
export type AnySpecialty = CounselorSpecialty | ChildSpecialty | InfantSpecialty;
export type AnyFacilityType = FacilityType | ChildFacilityType | InfantFacilityType;
export type AnyFloorId = FloorId | ChildFloorId | InfantFloorId;

// ── 스테이지별 에셋 서브디렉토리 매핑 ──

const CHILD_ISSUES: ReadonlySet<string> = new Set<ChildIssue>([
  "child_anxiety", "child_depression", "adhd", "behavior_regulation",
  "child_trauma", "child_ocd", "eating_disorder", "emotion_crisis",
]);
const INFANT_ISSUES: ReadonlySet<string> = new Set<InfantIssue>([
  "asd_early", "dev_delay", "attachment", "sensory", "speech_delay", "behavioral_infant",
]);

const CHILD_SPECIALTIES: ReadonlySet<string> = new Set<ChildSpecialty>([
  "child_cbt", "play_therapy", "parent_training", "dbt_a", "tf_cbt", "family_therapy",
]);
const INFANT_SPECIALTIES: ReadonlySet<string> = new Set<InfantSpecialty>([
  "aba", "developmental", "attachment_therapy", "sensory_integration", "speech_language",
]);

const CHILD_FACILITIES: ReadonlySet<string> = new Set<ChildFacilityType>([
  "play_room", "parent_room", "group_activity", "exposure_child", "nutrition_clinic", "crisis_room",
]);
const INFANT_FACILITIES: ReadonlySet<string> = new Set<InfantFacilityType>([
  "infant_play", "sensory_room", "parent_coaching", "language_lab", "structured_teaching",
]);

const CHILD_FLOORS: ReadonlySet<string> = new Set<ChildFloorId>([
  "child_garden", "child_comfort", "child_care", "child_intensive", "child_shelter",
]);
const INFANT_FLOORS: ReadonlySet<string> = new Set<InfantFloorId>([
  "infant_bloom", "infant_nurture", "infant_care", "infant_cocoon",
]);

// ── 내담자 에셋 ──

function getPatientSubdir(issue: string): string {
  if (CHILD_ISSUES.has(issue)) return "patient-child";
  if (INFANT_ISSUES.has(issue)) return "patient-infant";
  return "patient";
}

export function getPatientAsset(issue: AnyIssue, emotion: EmotionState): string {
  const subdir = getPatientSubdir(issue);
  return `${BASE}assets/characters/${subdir}/${issue}_${emotion}.webp`;
}

/** 스프라이트시트 경로 (idle 애니메이션용) */
export function getPatientSpriteSheet(issue: AnyIssue, emotion: EmotionState): string {
  const subdir = getPatientSubdir(issue);
  return `${BASE}assets/characters/${subdir}/sprites/${issue}_${emotion}_idle.webp`;
}

/** 치료중 포즈 */
export function getPatientTreatPose(issue: AnyIssue): string {
  const subdir = getPatientSubdir(issue);
  return `${BASE}assets/characters/${subdir}/poses/${issue}_treat.webp`;
}

// ── 상담사 에셋 ──

function getCounselorSubdir(specialty: string): string {
  if (CHILD_SPECIALTIES.has(specialty)) return "counselor-child";
  if (INFANT_SPECIALTIES.has(specialty)) return "counselor-infant";
  return "counselor";
}

export function getCounselorAsset(specialty: AnySpecialty): string {
  const subdir = getCounselorSubdir(specialty);
  return `${BASE}assets/characters/${subdir}/${specialty}.webp`;
}

/** 상담사 치료중 포즈 */
export function getCounselorTreatPose(specialty: AnySpecialty): string {
  const subdir = getCounselorSubdir(specialty);
  return `${BASE}assets/characters/${subdir}/poses/${specialty}_treat.webp`;
}

/** 상담사 번아웃 상태 */
export function getCounselorBurnoutAsset(specialty: AnySpecialty): string {
  const subdir = getCounselorSubdir(specialty);
  return `${BASE}assets/characters/${subdir}/poses/${specialty}_burnout.webp`;
}

// ── 시설 에셋 ──

function getFacilitySubdir(type: string): string {
  if (CHILD_FACILITIES.has(type)) return "facilities-child";
  if (INFANT_FACILITIES.has(type)) return "facilities-infant";
  return "facilities";
}

export function getFacilityAsset(type: AnyFacilityType, level?: number): string {
  const subdir = getFacilitySubdir(type);
  if (level && level > 1) {
    return `${BASE}assets/${subdir}/${type}_lv${level}.webp`;
  }
  return `${BASE}assets/${subdir}/${type}.webp`;
}

/** 치료실 내부 일러스트 (lg 사이즈, 상담 모달용) */
export function getFacilityInterior(type: AnyFacilityType): string {
  const subdir = getFacilitySubdir(type);
  return `${BASE}assets/${subdir}/interior/${type}_interior.webp`;
}

// ── 층 배경 에셋 ──

export function getFloorBackground(floorId: AnyFloorId): string {
  let subdir = "floors";
  if (CHILD_FLOORS.has(floorId)) subdir = "floors-child";
  else if (INFANT_FLOORS.has(floorId)) subdir = "floors-infant";
  return `${BASE}assets/${subdir}/${floorId}.webp`;
}

// ── 센터 외관 (평판 등급별) ──

export function getBuildingAsset(grade: "F" | "D" | "C" | "B" | "A" | "S"): string {
  return `${BASE}assets/building/center_${grade.toLowerCase()}.webp`;
}

// ── NPC 에셋 ──

export function getNpcAsset(npcId: string): string {
  return `${BASE}assets/characters/npc/${npcId}.webp`;
}

// ── 이벤트 일러스트 ──

export function getEventIllustration(eventId: string): string {
  return `${BASE}assets/cutscenes/event_${eventId}.webp`;
}

// ── 컷씬 ──

export function getCutsceneAsset(sceneId: string): string {
  return `${BASE}assets/cutscenes/${sceneId}.webp`;
}

// ── 업적 뱃지 ──

export function getAchievementBadge(achievementId: string): string {
  return `${BASE}assets/ui/badge_${achievementId}.webp`;
}

// ── UI 아이콘 ──

export function getUiIcon(iconId: string): string {
  return `${BASE}assets/ui/${iconId}.webp`;
}

// ── EM 값 → 감정 상태 매핑 ──

export function emToEmotion(em: number): EmotionState {
  if (em <= 35) return "calm";
  if (em <= 65) return "neutral";
  return "distress";
}

// ── 이모지 폴백 맵 ──

export const ISSUE_EMOJI: Record<string, string> = {
  // 성인
  depression: "😢", anxiety: "😰", relationship: "😔", obsession: "😣",
  trauma: "😨", addiction: "😵", personality: "😤", psychosis: "🌀",
  // 아동
  child_anxiety: "😰", child_depression: "😢", adhd: "⚡",
  behavior_regulation: "💥", child_trauma: "😨", child_ocd: "🔄",
  eating_disorder: "🍽️", emotion_crisis: "🌊",
  // 영유아
  asd_early: "🧩", dev_delay: "🌱", attachment: "🤱",
  sensory: "🎨", speech_delay: "💬", behavioral_infant: "😤",
};

export const SPECIALTY_EMOJI: Record<string, string> = {
  // 성인
  cbt: "🧠", psychodynamic: "💭", interpersonal: "🤝",
  dbt: "⚖️", trauma_focused: "🛡️", family_systemic: "👨‍👩‍👧",
  // 아동
  child_cbt: "📋", play_therapy: "🎮", parent_training: "👪",
  dbt_a: "⚖️", tf_cbt: "🛡️", family_therapy: "🏠",
  // 영유아
  aba: "📊", developmental: "🌻", attachment_therapy: "💗",
  sensory_integration: "🌈", speech_language: "🗣️",
};

export const FACILITY_EMOJI: Record<string, string> = {
  // 성인
  individual_room: "🪑", group_room: "👥", exposure_lab: "⚡",
  mindfulness_room: "🧘", family_room: "👨‍👩‍👧", activity_room: "🎨",
  // 아동
  play_room: "🎠", parent_room: "☕", group_activity: "🎯",
  exposure_child: "🪜", nutrition_clinic: "🥗", crisis_room: "🆘",
  // 영유아
  infant_play: "🧸", sensory_room: "🫧", parent_coaching: "📺",
  language_lab: "🔤", structured_teaching: "📐",
};
