import type { ChildPatient, ChildIssue } from "@/types/child/index.ts";
import { CHILD_ISSUE_CONFIG } from "@/lib/constants/childConstants.ts";
import { getChildFloorForEM } from "./childEngine.ts";

// ── 이름 생성 ──
const SURNAMES = [
  "김", "이", "박", "최", "정", "강", "윤", "임", "한", "오",
  "송", "조", "장", "권", "유", "백", "나", "문", "서", "허",
];

const GIVEN_NAMES = [
  "서준", "하은", "도윤", "지유", "시우", "서아", "예준", "수아",
  "하준", "지아", "지호", "하린", "민준", "소율", "주원", "지윤",
  "건우", "채원", "현우", "예서", "태양", "시연", "은우", "다인",
  "지한", "소윤", "윤서", "하율", "준서", "나은", "시윤", "도연",
];

function generateChildName(seed: number): string {
  const s = SURNAMES[seed % SURNAMES.length]!;
  const g = GIVEN_NAMES[Math.floor(seed / SURNAMES.length) % GIVEN_NAMES.length]!;
  return `${s}${g}`;
}

// ── 문제영역 라벨 ──
export const CHILD_ISSUE_LABELS: Record<ChildIssue, string> = Object.fromEntries(
  Object.entries(CHILD_ISSUE_CONFIG).map(([k, v]) => [k, v.label]),
) as Record<ChildIssue, string>;

// ── 사연 (보호자 시점) ──
const CHILD_BACKSTORIES: Record<ChildIssue, string[]> = {
  child_anxiety: [
    "엄마가 걱정하며 데려왔습니다. 학교만 가면 배가 아프다고 해요.",
    "아빠가 상담을 신청했습니다. 아이가 친구들 앞에서 발표를 못 해요.",
    "할머니가 손잡고 왔습니다. 혼자 자는 것을 무서워해요.",
    "부모님이 함께 오셨습니다. 시험 기간만 되면 잠을 못 자요.",
  ],
  child_depression: [
    "엄마가 걱정하며 데려왔습니다. 방에만 있으려 하고 밥도 잘 안 먹어요.",
    "담임선생님 권유로 왔습니다. 수업 시간에 멍하니 앉아 있대요.",
    "아빠가 데려왔습니다. 예전에 좋아하던 게임도 안 하고 무기력해요.",
    "부모님이 오셨습니다. 아이가 '태어나지 말걸' 하고 말해서 놀랐어요.",
  ],
  adhd: [
    "엄마가 지치신 표정으로 데려왔습니다. 5분도 가만히 못 앉아 있어요.",
    "담임선생님이 추천해서 왔습니다. 수업 중에 계속 돌아다닌대요.",
    "아빠가 걱정하며 왔습니다. 숙제를 시작하면 10분 만에 다른 걸 해요.",
    "부모님이 함께 오셨습니다. 친구들과 놀다가 충동적으로 행동해서 문제가 생겨요.",
  ],
  behavior_regulation: [
    "엄마가 눈물을 글썽이며 데려왔습니다. 화가 나면 물건을 던지고 소리를 질러요.",
    "학교에서 연락이 와서 왔습니다. 친구를 때린 적이 여러 번 있대요.",
    "아빠가 답답해하며 데려왔습니다. 하지 말라는 것만 골라서 해요.",
    "보호관찰관이 의뢰했습니다. 규칙을 따르는 것이 어렵고 반항이 심해요.",
  ],
  child_trauma: [
    "엄마가 조심스럽게 데려왔습니다. 사고 이후로 악몽을 꾸고 있어요.",
    "보호자가 눈물을 참으며 왔습니다. 아이가 갑자기 소리에 깜짝 놀라요.",
    "위탁 부모님이 데려왔습니다. 새 환경에 적응하지 못하고 있어요.",
    "학교 상담사가 의뢰했습니다. 아이가 그림에 자꾸 무서운 장면을 그려요.",
  ],
  child_ocd: [
    "엄마가 안타까워하며 데려왔습니다. 손을 하루에 수십 번 씻어요.",
    "아빠가 걱정하며 왔습니다. 문단속을 반복적으로 확인해요.",
    "부모님이 함께 오셨습니다. 물건을 정확하게 정리하지 않으면 울어요.",
    "학교 선생님 권유로 왔습니다. 특정 숫자에 집착해서 수업에 집중을 못 해요.",
  ],
  eating_disorder: [
    "엄마가 걱정하며 데려왔습니다. 밥을 거의 먹지 않고 살이 너무 빠졌어요.",
    "아빠가 조심스럽게 왔습니다. 식사 후에 화장실에 오래 있더라고요.",
    "부모님이 함께 오셨습니다. SNS를 보고 나서 다이어트에 집착해요.",
    "학교 보건교사가 의뢰했습니다. 점심을 거르고 어지러워하는 일이 잦아요.",
  ],
  emotion_crisis: [
    "엄마가 급히 데려왔습니다. 심한 정서적 위기 상황이에요.",
    "아빠가 밤새 응급실에 있다가 왔습니다. 감정 폭발이 심해졌어요.",
    "Wee센터에서 의뢰했습니다. 학교에서 정서적 어려움을 호소하고 있대요.",
    "부모님이 함께 오셨습니다. 감정 기복이 심해서 일상이 힘들어요.",
  ],
};

// ── 종결 메시지 ──
const CHILD_DISCHARGE_MESSAGES: Record<ChildIssue, string[]> = {
  child_anxiety: [
    "이제 학교 가는 길이 덜 무서워졌어요. 친구들이 기다려요!",
    "발표할 때 떨리지만, 할 수 있다는 걸 알게 됐어요.",
    "걱정이 오면 '안녕, 걱정아' 하고 인사해요. 선생님이 알려준 거예요.",
  ],
  child_depression: [
    "다시 웃을 수 있어서 기뻐요. 좋아하는 만화 다시 그리기 시작했어요.",
    "아침에 일어나는 게 조금 쉬워졌어요. 엄마가 많이 기뻐하세요.",
    "친구랑 놀러 가고 싶다는 마음이 다시 생겼어요.",
  ],
  adhd: [
    "집중하는 방법을 배웠어요. 타이머 쓰는 게 제일 좋아요!",
    "선생님이 요즘 수업 시간에 잘한다고 칭찬해 주셨어요.",
    "엄마가 '요즘 많이 달라졌다'고 해서 기분 좋았어요.",
  ],
  behavior_regulation: [
    "화가 나면 깊은 숨을 쉬어요. 주먹 대신 말로 해요.",
    "규칙을 지키면 기분이 좋다는 걸 알게 됐어요.",
    "친구들이 다시 같이 놀자고 해서 정말 기뻐요.",
  ],
  child_trauma: [
    "무서운 꿈이 줄었어요. 밤이 덜 무서워요.",
    "그때 일은 내 잘못이 아니라는 걸 알게 됐어요.",
    "안전한 곳이 있다는 게 얼마나 좋은 건지 알아요.",
  ],
  child_ocd: [
    "손을 한 번만 씻어도 괜찮아졌어요. 자유로워진 기분이에요.",
    "완벽하지 않아도 되는 거였어요. 마음이 가벼워요.",
    "강박이 올 때 '그냥 지나가' 하고 말할 수 있게 됐어요.",
  ],
  eating_disorder: [
    "밥이 맛있다는 걸 다시 느끼게 됐어요. 가족이랑 저녁 먹는 게 좋아요.",
    "내 몸을 미워하지 않게 되었어요. 있는 그대로도 괜찮아요.",
    "건강하게 먹는 게 행복한 거라는 걸 알았어요.",
  ],
  emotion_crisis: [
    "감정이 폭풍 같을 때도 가라앉힐 수 있게 됐어요.",
    "힘들 때 도움을 요청할 수 있어요. 혼자가 아니에요.",
    "살아 있는 게 좋은 거라는 걸 느끼기 시작했어요.",
  ],
};

// ── 해금된 문제영역 필터 ──
function getAvailableChildIssues(turn: number): ChildIssue[] {
  return (
    Object.entries(CHILD_ISSUE_CONFIG) as Array<[ChildIssue, typeof CHILD_ISSUE_CONFIG[ChildIssue]]>
  )
    .filter(([, cfg]) => cfg.unlockTurn <= turn)
    .map(([id]) => id);
}

// ── 나이 생성 (7~17) ──
function generateAge(seed: number): number {
  return 7 + (seed % 11);
}

// ── 환자 생성 ──
export function generateChildPatient(turn: number, idSeed: number): ChildPatient {
  const available = getAvailableChildIssues(turn);
  const issue = available[idSeed % available.length]!;
  const config = CHILD_ISSUE_CONFIG[issue];

  const nameSeed = turn * 97 + idSeed * 13;
  const name = generateChildName(nameSeed);
  const age = generateAge(nameSeed + idSeed * 7);

  const backstories = CHILD_BACKSTORIES[issue];
  const backstory = backstories[idSeed % backstories.length]!;

  const em = config.emStartMin +
    Math.floor(Math.random() * (config.emStartMax - config.emStartMin + 1));

  return {
    id: `cp_${turn}_${idSeed}`,
    name,
    age,
    em,
    dominantIssue: issue,
    currentFloorId: getChildFloorForEM(em),
    rapport: 0,
    backstory,
    turnAdmitted: turn,
    treatmentCount: 0,
    parentInvolvement: config.initialParentInvolvement,
    schoolConsulted: false,
    assessed: false,
    referralSource: "walk_in",
    parentBurnoutCounter: 0,
  };
}

// ── 종결 메시지 ──
export function getChildDischargeMessage(patient: ChildPatient): string {
  const messages = CHILD_DISCHARGE_MESSAGES[patient.dominantIssue];
  const idx = Math.abs(patient.id.length) % messages.length;
  return messages[idx]!;
}
