/**
 * 내담자 스토리 데이터 로딩 — 사연/회복/스페셜 편지
 * JSON 데이터에서 issue + level + seed로 다양한 텍스트를 결정론적으로 선택
 */

// JSON 데이터 import (Vite는 JSON import를 자동 처리)
import storiesAdult1 from "@/data/stories-adult-1.json";
import storiesAdult2 from "@/data/stories-adult-2.json";
import storiesChild1 from "@/data/stories-child-1.json";
import storiesChild2 from "@/data/stories-child-2.json";
import storiesInfant from "@/data/stories-infant.json";

export type StoryLevel = "level1" | "level2" | "level3";

interface IssueStories {
  issue: string;
  stage: string;
  issueLabel: string;
  backstories: Record<StoryLevel, string[]>;
  recoveryStories: Record<StoryLevel, string[]>;
  specialLetters: string[];
}

/** 전체 데이터를 issue 코드로 인덱싱 */
const ALL_STORIES: Record<string, IssueStories> = {};

function loadStories(data: IssueStories[]) {
  for (const entry of data) {
    ALL_STORIES[entry.issue] = entry;
  }
}

// 초기 로딩
loadStories(storiesAdult1 as IssueStories[]);
loadStories(storiesAdult2 as IssueStories[]);
loadStories(storiesChild1 as IssueStories[]);
loadStories(storiesChild2 as IssueStories[]);
loadStories(storiesInfant as IssueStories[]);

/** EM 값으로 사연 레벨 결정 */
export function getStoryLevel(em: number): StoryLevel {
  if (em <= 55) return "level1";
  if (em <= 75) return "level2";
  return "level3";
}

/** 사연 가져오기 (5종 중 seed%5로 선택) */
export function getBackstory(issue: string, level: StoryLevel, seed: number): string {
  const stories = ALL_STORIES[issue];
  if (!stories) return "";
  const arr = stories.backstories[level];
  if (!arr || arr.length === 0) return "";
  return arr[Math.abs(seed) % arr.length] ?? arr[0]!;
}

/** 회복 스토리 가져오기 */
export function getRecoveryStory(issue: string, level: StoryLevel, seed: number): string {
  const stories = ALL_STORIES[issue];
  if (!stories) return "";
  const arr = stories.recoveryStories[level];
  if (!arr || arr.length === 0) return "";
  return arr[Math.abs(seed) % arr.length] ?? arr[0]!;
}

/** 스페셜 감사편지 가져오기 */
export function getSpecialLetter(issue: string, seed: number): string {
  const stories = ALL_STORIES[issue];
  if (!stories) return "";
  const arr = stories.specialLetters;
  if (!arr || arr.length === 0) return "";
  return arr[Math.abs(seed) % arr.length] ?? arr[0]!;
}

/** 해당 issue가 스페셜 편지를 지원하는지 */
export function hasSpecialLetter(issue: string): boolean {
  const stories = ALL_STORIES[issue];
  return !!stories && stories.specialLetters.length > 0;
}

/** issue 라벨 가져오기 */
export function getIssueLabel(issue: string): string {
  return ALL_STORIES[issue]?.issueLabel ?? issue;
}
