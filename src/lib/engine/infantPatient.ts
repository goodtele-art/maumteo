import type { InfantPatient, InfantIssue } from "@/types/infant/index.ts";
import { INFANT_ISSUE_CONFIG } from "@/lib/constants/infantConstants.ts";
import { createMilestones } from "@/lib/engine/milestone.ts";
import { getInfantFloorForEM } from "./infantEngine.ts";

// ── 이름 생성 ──
const SURNAMES = [
  "김", "이", "박", "최", "정", "강", "윤", "임", "한", "오",
  "송", "조", "장", "권", "유", "백", "나", "문", "서", "허",
];

const GIVEN_NAMES = [
  "하람", "별", "이슬", "봄", "한울", "나래", "보람", "다솜",
  "시온", "아라", "하늘", "누리", "사랑", "온유", "가온", "다온",
  "예담", "소담", "한결", "이든", "나윤", "도담", "하솔", "지담",
  "아인", "시아", "루다", "소은", "다울", "하민", "라온", "채아",
];

function generateInfantName(seed: number): string {
  const s = SURNAMES[seed % SURNAMES.length]!;
  const g = GIVEN_NAMES[Math.floor(seed / SURNAMES.length) % GIVEN_NAMES.length]!;
  return `${s}${g}`;
}

// ── 문제영역 라벨 ──
export const INFANT_ISSUE_LABELS: Record<InfantIssue, string> = Object.fromEntries(
  Object.entries(INFANT_ISSUE_CONFIG).map(([k, v]) => [k, v.label]),
) as Record<InfantIssue, string>;

// ── 사연 (보호자 시점) ──
const INFANT_BACKSTORIES: Record<InfantIssue, string[]> = {
  asd_early: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 눈맞춤이 잘 안 되고 이름을 불러도 반응이 없어요.",
    "엄마가 걱정하며 오셨습니다. 또래 아이들과 달리 혼자 놀기만 해요.",
    "소아과에서 의뢰받아 왔습니다. 반복적인 행동이 늘고 있어요.",
    "어린이집에서 권유받아 왔습니다. 다른 아이들과 어울리지 못해요.",
  ],
  dev_delay: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 또래보다 걷기가 늦어요.",
    "엄마가 오셨습니다. 같은 나이 아이들보다 전반적으로 느린 것 같아 걱정돼요.",
    "소아과 검진에서 발달 지연 소견을 받고 왔습니다.",
    "어린이집 선생님이 발달 검사를 권유해서 왔습니다.",
  ],
  attachment: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 엄마와 떨어지면 심하게 울어요.",
    "위탁 가정에서 데려왔습니다. 새로운 양육자에게 다가가지 않아요.",
    "엄마가 힘들어하며 왔습니다. 안아줘도 밀어내고 다가오지도 않아요.",
    "보육원에서 의뢰했습니다. 아무에게나 매달리고 낯가림이 전혀 없어요.",
  ],
  sensory: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 특정 소리에 귀를 막고 울어요.",
    "엄마가 오셨습니다. 새로운 음식 질감을 싫어해서 먹는 게 어려워요.",
    "어린이집에서 권유받아 왔습니다. 모래놀이, 물놀이를 심하게 거부해요.",
    "아빠가 걱정하며 왔습니다. 옷 태그가 닿으면 울면서 벗으려 해요.",
  ],
  speech_delay: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 또래보다 말이 많이 늦어요.",
    "엄마가 걱정하며 오셨습니다. 24개월인데 아직 단어가 몇 개 안 돼요.",
    "소아과에서 언어 평가를 권유받아 왔습니다.",
    "어린이집에서 또래보다 언어 발달이 느리다고 해서 왔습니다.",
  ],
  behavioral_infant: [
    "부모님이 발달 상담을 위해 방문하셨습니다. 뜻대로 안 되면 바닥에 드러눕고 울어요.",
    "엄마가 지쳐서 오셨습니다. 물건을 던지고 동생을 때려요.",
    "어린이집에서 연락이 와서 왔습니다. 다른 아이를 자꾸 밀어요.",
    "아빠가 걱정하며 왔습니다. 안 된다고 하면 30분 넘게 울어요.",
  ],
};

// ── 종결 메시지 (후일담 포함) ──
const INFANT_DISCHARGE_MESSAGES: Record<InfantIssue, string[]> = {
  asd_early: [
    "처음으로 엄마 눈을 바라보며 웃었습니다. 엄마가 눈물을 흘렸어요. 이후 어린이집에서도 친구 이름을 부르기 시작했대요.",
    "장난감을 '같이 봐!'하며 보여주었습니다. 작은 한 걸음이지만 커다란 변화예요. 6개월 뒤 또래 놀이에 참여하기 시작했어요.",
    "엄마의 행동을 따라 하며 까꿍 놀이를 했습니다. 부모님이 '기적 같다'고 하셨어요.",
  ],
  dev_delay: [
    "혼자 걸음마를 시작했습니다! 온 가족이 박수를 쳤어요. 한 달 뒤에는 뛰어다니고 있대요.",
    "블록을 쌓아 탑을 만들었습니다. 소근육이 부쩍 발달했어요. 이제 숟가락도 잘 잡아요.",
    "인형에게 밥을 먹이는 상징놀이를 했습니다. 인지 발달의 큰 도약이에요.",
  ],
  attachment: [
    "엄마에게 안겨 평화롭게 잠들었습니다. 안전한 품이 되어준 거예요. 이후 분리불안이 많이 줄었대요.",
    "어린이집에서 돌아오면 엄마에게 달려가 안기기 시작했어요. 안정 애착의 시작입니다.",
    "양육자와 눈을 맞추고 미소 짓는 시간이 늘었습니다. 마음의 다리가 놓였어요.",
  ],
  sensory: [
    "새로운 질감의 음식을 처음으로 만져보았습니다! 표정이 밝았어요. 이제 편식이 많이 줄었대요.",
    "모래놀이에 손을 넣어보았습니다. 세상을 향한 용기가 자라고 있어요.",
    "음악 소리를 들으며 몸을 흔들었습니다. 소리가 더 이상 적이 아니에요.",
  ],
  speech_delay: [
    "'엄마'라고 처음 말했습니다. 엄마가 감동으로 울었어요. 석 달 뒤에는 두 단어 조합도 해요.",
    "'주세요'와 '싫어'를 구분해서 말합니다. 의사소통의 세계가 열렸어요.",
    "동물 이름을 다섯 개나 말할 수 있게 되었습니다. 매일 새 단어가 늘고 있어요.",
  ],
  behavioral_infant: [
    "화가 나면 발을 구르고 심호흡하는 것을 배웠습니다. 엄마가 '기적 같다'고 하셨어요.",
    "'기다려'라는 말에 잠시 멈출 수 있게 되었습니다. 작은 성공이 모여 큰 변화가 돼요.",
    "동생에게 장난감을 건네며 '같이'라고 말했습니다. 가족 모두 감동받았어요.",
  ],
};

// ── 해금된 문제영역 필터 ──
function getAvailableInfantIssues(turn: number): InfantIssue[] {
  return (
    Object.entries(INFANT_ISSUE_CONFIG) as Array<[InfantIssue, typeof INFANT_ISSUE_CONFIG[InfantIssue]]>
  )
    .filter(([, cfg]) => cfg.unlockTurn <= turn)
    .map(([id]) => id);
}

// ── 개월 수 생성 (12~72) ──
function generateAgeMonths(seed: number): number {
  return 12 + (seed % 61);
}

// ── 환자 생성 ──
export function generateInfantPatient(turn: number, idSeed: number): InfantPatient {
  const available = getAvailableInfantIssues(turn);
  const issue = available[idSeed % available.length]!;
  const config = INFANT_ISSUE_CONFIG[issue];

  const nameSeed = turn * 97 + idSeed * 13;
  const name = generateInfantName(nameSeed);
  const age = generateAgeMonths(nameSeed + idSeed * 7);

  const backstories = INFANT_BACKSTORIES[issue];
  const backstory = backstories[idSeed % backstories.length]!;

  const em = config.emStartMin +
    Math.floor(Math.random() * (config.emStartMax - config.emStartMin + 1));

  return {
    id: `ip_${turn}_${idSeed}`,
    name,
    age,
    em,
    dominantIssue: issue,
    currentFloorId: getInfantFloorForEM(em),
    rapport: 0,
    backstory,
    turnAdmitted: turn,
    treatmentCount: 0,
    parentInvolvement: config.initialParentInvolvement,
    assessed: false,
    milestones: createMilestones(issue),
    interventionStartTurn: turn,
    referralSource: "walk_in",
  };
}

// ── 종결 메시지 ──
export function getInfantDischargeMessage(patient: InfantPatient): string {
  const messages = INFANT_DISCHARGE_MESSAGES[patient.dominantIssue];
  const idx = Math.abs(patient.id.length) % messages.length;
  return messages[idx]!;
}
