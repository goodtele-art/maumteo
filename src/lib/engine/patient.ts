import type { Patient, DominantIssue, FloorId } from "@/types/index.ts";
import { getFloorForEM } from "./em.ts";
import { ISSUE_CONFIG } from "@/lib/constants.ts";
import { getBackstory, getStoryLevel, getRecoveryStory } from "@/lib/stories.ts";

// ── 이름 생성 ──
const SURNAMES = [
  "김", "이", "박", "최", "정", "강", "윤", "임", "한", "오",
  "송", "조", "장", "권", "유", "백", "나", "문", "서", "허",
];
const GIVEN_NAMES = [
  "서연", "지우", "민준", "예은", "하윤", "지호", "서현", "도윤",
  "소율", "준서", "지안", "하은", "시우", "민서", "채원", "현우",
  "은채", "태양", "유나", "다은", "시윤", "예린", "준혁", "은비",
  "도현", "수빈", "하람", "지민", "성호", "다연", "은서", "하율",
];

function generateName(seed: number): string {
  const s = SURNAMES[seed % SURNAMES.length]!;
  const g = GIVEN_NAMES[Math.floor(seed / SURNAMES.length) % GIVEN_NAMES.length]!;
  return `${s}${g}`;
}

// ── 문제영역 라벨 (ISSUE_CONFIG에서 파생) ──
export const ISSUE_LABELS: Record<DominantIssue, string> = Object.fromEntries(
  Object.entries(ISSUE_CONFIG).map(([k, v]) => [k, v.label]),
) as Record<DominantIssue, string>;

// ── 사연 ──
const BACKSTORIES: Record<DominantIssue, string[]> = {
  depression: [
    "아무것도 하고 싶지 않은 날이 계속됩니다. 일어나는 것조차 힘들어요.",
    "예전에 좋아하던 것들이 이제는 아무 의미가 없게 느껴져요.",
    "웃고 있는 사람들을 보면 나만 다른 세상에 있는 것 같아요.",
    "매일 같은 하루가 반복되는 느낌이에요. 끝이 보이지 않아요.",
  ],
  anxiety: [
    "매일 밤 내일이 두렵습니다. 작은 실수도 끔찍한 결과로 이어질 것 같아요.",
    "사람들 앞에서 말을 할 때마다 심장이 터질 것 같습니다.",
    "시험 전날이면 잠을 못 자요. 머릿속이 최악의 시나리오로 가득 차요.",
    "전화벨만 울려도 가슴이 두근거려요. 무슨 나쁜 소식일 것 같아서.",
  ],
  trauma: [
    "그날의 기억이 자꾸 떠올라요. 밤마다 악몽을 꿉니다.",
    "큰 소리만 들어도 몸이 얼어붙어요. 일상이 전쟁터 같아요.",
    "어떤 냄새나 장소가 그때로 돌아가게 만들어요. 숨이 막혀요.",
    "사람들에게 괜찮다고 말하지만 밤이 되면 혼자 떨고 있어요.",
  ],
  obsession: [
    "손을 씻어도 씻어도 깨끗하지 않은 느낌이 들어요.",
    "문을 잠갔는지 수십 번 확인하는데도 불안이 가시지 않아요.",
    "나쁜 생각이 머릿속에서 떠나지 않아요. 내가 미쳐가는 것 같아요.",
    "모든 것이 정확히 맞아야 해요. 조금만 어긋나면 견딜 수 없어요.",
  ],
  personality: [
    "감정이 롤러코스터처럼 요동쳐요. 좋다가도 갑자기 바닥으로 떨어져요.",
    "사람들이 날 버릴 것 같아서 매달리다가, 화가 나서 밀어내게 돼요.",
    "나 자신을 통제할 수 없는 느낌이 들 때가 많아요. 충동적으로 행동해요.",
    "공허함이 끝없이 밀려와요. 무엇을 해도 채워지지 않아요.",
  ],
  addiction: [
    "멈추고 싶은데 몸이 말을 듣지 않아요. 의지가 없는 건 아닌데.",
    "스트레스를 받으면 결국 그것에 손이 가요. 반복되는 악순환.",
    "하지 않겠다고 매일 다짐하지만, 저녁이 되면 어김없이 무너져요.",
    "처음에는 기분 전환이었는데, 이제는 그게 없으면 살 수 없어요.",
  ],
  relationship: [
    "가까운 사람일수록 상처를 주고받게 되는 것 같아요.",
    "사람들이 저를 진심으로 좋아하는지 항상 의심이 들어요.",
    "혼자 있으면 외롭고, 함께 있으면 불안해요. 어디에도 편하지 않아요.",
    "누군가에게 속마음을 말하는 게 무서워요. 거절당할까 봐.",
  ],
  psychosis: [
    "주변 사람들이 저를 감시하는 것 같은 느낌이 떠나지 않아요.",
    "내 머릿속에서 들리는 목소리가 점점 커지고 있어요.",
    "현실과 상상의 경계가 흐려져요. 무엇이 진짜인지 모르겠어요.",
    "갑자기 에너지가 넘치다가 바닥으로 추락하는 기분의 파도 속에 있어요.",
  ],
};

// ── 퇴원 메시지 ──
const DISCHARGE_MESSAGES: Record<DominantIssue, string[]> = {
  depression: [
    "오늘 아침, 처음으로 햇살이 따뜻하게 느껴졌어요.",
    "다시 웃을 수 있다는 것이 기적 같아요.",
    "작은 것에 감사할 수 있는 마음이 돌아왔어요.",
  ],
  anxiety: [
    "이제 내일이 덜 무섭습니다. 감사합니다.",
    "두근거림 대신 설렘을 느낄 수 있게 되었어요.",
    "불안은 사라지지 않았지만, 함께 걸어가는 법을 배웠어요.",
  ],
  trauma: [
    "그 기억은 여전히 있지만, 더 이상 저를 지배하지 않아요.",
    "안전하다는 것을 온몸으로 느낄 수 있게 되었습니다.",
    "과거는 과거일 뿐, 오늘의 나는 더 강해졌어요.",
  ],
  obsession: [
    "완벽하지 않아도 괜찮다는 것을 받아들이기 시작했어요.",
    "강박적인 생각이 올 때 흘려보내는 법을 배웠어요.",
    "불확실함과 함께 살아가는 용기를 얻었습니다.",
  ],
  personality: [
    "감정의 폭풍 속에서도 중심을 잡을 수 있게 되었어요.",
    "나를 있는 그대로 받아들이는 첫걸음을 내딛었습니다.",
    "관계 속에서 나를 잃지 않는 법을 배웠어요.",
  ],
  addiction: [
    "하루하루가 승리입니다. 오늘도 이겨냈어요.",
    "나를 파괴하던 것 대신, 나를 살리는 것을 선택하게 되었어요.",
    "도움을 요청하는 것이 약함이 아니라는 걸 알게 되었어요.",
  ],
  relationship: [
    "사람을 다시 믿어보기로 했어요. 첫걸음을 내딛습니다.",
    "혼자가 아니라는 것을 진심으로 느끼게 되었어요.",
    "건강한 관계가 어떤 것인지 이제 알 것 같아요.",
  ],
  psychosis: [
    "세상이 조금씩 선명해지고 있어요. 안개가 걷히는 느낌.",
    "나만의 현실과 평화롭게 공존하는 법을 찾았습니다.",
    "약과 치료의 힘으로 다시 일상을 살아갈 수 있게 되었어요.",
  ],
};

// ── 환자 생성 ──
function getAvailableIssues(turn: number): DominantIssue[] {
  return (Object.entries(ISSUE_CONFIG) as Array<[DominantIssue, typeof ISSUE_CONFIG[DominantIssue]]>)
    .filter(([, cfg]) => cfg.unlockTurn <= turn)
    .map(([id]) => id);
}

export function generatePatient(turn: number, idSeed: number, forceIssue?: DominantIssue): Patient {
  const issue = forceIssue ?? (() => {
    const available = getAvailableIssues(turn);
    return available[idSeed % available.length]!;
  })();
  const config = ISSUE_CONFIG[issue];

  const nameSeed = turn * 97 + idSeed * 13;
  const name = generateName(nameSeed);
  const em = config.emStartMin +
    Math.floor(Math.random() * (config.emStartMax - config.emStartMin + 1));

  // 새 스토리 시스템 우선, 데이터 미생성 시 기존 BACKSTORIES 폴백
  let backstory = getBackstory(issue, getStoryLevel(em), idSeed);
  if (!backstory) {
    const fallback = BACKSTORIES[issue];
    backstory = fallback[idSeed % fallback.length]!;
  }

  return {
    id: `p_${turn}_${idSeed}`,
    name,
    em,
    dominantIssue: issue,
    currentFloorId: getFloorForEM(em),
    rapport: 0,
    backstory,
    turnAdmitted: turn,
    treatmentCount: 0,
  };
}

export function checkDischarge(patient: Patient): boolean {
  return patient.em <= 15;
}

export function getDischargeMessage(patient: Patient): string {
  // backstory 길이로 level 추정 (종결 시 EM이 이미 낮아 getStoryLevel 부정확)
  const level = patient.backstory.length >= 80 ? "level3"
    : patient.backstory.length >= 40 ? "level2" : "level1";
  const recovery = getRecoveryStory(patient.dominantIssue, level, patient.treatmentCount);
  if (recovery) return recovery;

  const messages = DISCHARGE_MESSAGES[patient.dominantIssue];
  const idx = Math.abs(patient.id.length) % messages.length;
  return messages[idx]!;
}

export function shouldMoveFloor(
  patient: Patient,
): { should: boolean; targetFloor: FloorId } {
  const targetFloor = getFloorForEM(patient.em);
  return {
    should: targetFloor !== patient.currentFloorId,
    targetFloor,
  };
}
