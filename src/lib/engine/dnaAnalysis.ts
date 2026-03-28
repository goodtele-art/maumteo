/**
 * 센터장 DNA 리포트 — 순수 함수 분석 엔진
 * 90턴 플레이 데이터 → 4축 16유형 센터장 DNA
 */

import type { ActionStats } from "@/store/slices/turnSlice.ts";
import type { EventChoiceRecord } from "@/store/slices/eventSlice.ts";

/** 4축 각각의 결과 */
export interface DnaAxis {
  label: string;
  left: string;
  right: string;
  /** 0~1 범위. 0=왼쪽 극단, 1=오른쪽 극단, 0.5=균형 */
  score: number;
  /** 결정된 쪽 코드 (왼쪽 or 오른쪽) */
  code: string;
}

export interface DnaResult {
  /** 4글자 코드 (예: "EVGX") */
  typeCode: string;
  /** 한글 유형명 */
  typeName: string;
  /** 유형 설명 */
  description: string;
  /** 4축 상세 */
  axes: [DnaAxis, DnaAxis, DnaAxis, DnaAxis];
  /** 상위 퍼센트 (1~100, 낮을수록 상위) */
  percentile: number;
}

/** 위기 관련 이벤트 ID (수호자/도전자 판정) */
const CRISIS_EVENT_IDS = new Set([
  "counselor_burnout", "patient_conflict", "sns_criticism",
  "abuse_suspicion", "crisis_protocol", "parent_burnout",
  "waitlist_complaint", "legal_dispute",
]);

/** 보수적 선택 = choiceIndex 0, 도전적 선택 = choiceIndex 1+ */
function calcGuardianScore(history: EventChoiceRecord[]): number {
  const crisisEvents = history.filter((h) => CRISIS_EVENT_IDS.has(h.eventId));
  if (crisisEvents.length === 0) return 0.5;
  const conservativeCount = crisisEvents.filter((h) => h.choiceIndex === 0).length;
  return conservativeCount / crisisEvents.length;
}

export function analyzeDna(
  stats: ActionStats,
  eventHistory: EventChoiceRecord[],
  totalDischarges: number,
  totalIncidents: number,
  reputation: number,
): DnaResult {
  // ── 축 1: 공감(E) vs 효율(F) ──
  const totalActions = stats.treatCount + stats.encourageCount;
  const encourageRatio = totalActions > 0 ? stats.encourageCount / totalActions : 0.5;
  // 격려 비율 높으면 공감형
  const axis1Score = encourageRatio;
  const axis1Code = axis1Score >= 0.5 ? "E" : "F";

  // ── 축 2: 근거주의(V) vs 다양추구(D) ──
  const totalTreats = stats.treatOptimalCount + stats.treatSubCount + stats.treatMismatchCount;
  const optimalRatio = totalTreats > 0 ? stats.treatOptimalCount / totalTreats : 0.5;
  // 최적 매칭 비율 높으면 근거주의
  const axis2Score = optimalRatio;
  const axis2Code = axis2Score >= 0.5 ? "V" : "D";

  // ── 축 3: 수호자(G) vs 도전자(C) ──
  const guardianScore = calcGuardianScore(eventHistory);
  // 보수적 선택 비율 높으면 수호자
  const axis3Score = guardianScore;
  const axis3Code = axis3Score >= 0.5 ? "G" : "C";

  // ── 축 4: 확장형(X) vs 심화형(S) ──
  const totalBuildUp = stats.buildCount + stats.upgradeCount;
  const buildRatio = totalBuildUp > 0 ? stats.buildCount / totalBuildUp : 0.5;
  // 건설 비율 높으면 확장형
  const axis4Score = buildRatio;
  const axis4Code = axis4Score >= 0.5 ? "X" : "S";

  const typeCode = `${axis1Code}${axis2Code}${axis3Code}${axis4Code}`;

  const axes: [DnaAxis, DnaAxis, DnaAxis, DnaAxis] = [
    { label: "경영 스타일", left: "공감형 (E)", right: "효율형 (F)", score: axis1Score, code: axis1Code },
    { label: "치료 철학", left: "근거주의 (V)", right: "다양추구 (D)", score: axis2Score, code: axis2Code },
    { label: "위기 대응", left: "수호자 (G)", right: "도전자 (C)", score: axis3Score, code: axis3Code },
    { label: "성장 전략", left: "확장형 (X)", right: "심화형 (S)", score: axis4Score, code: axis4Code },
  ];

  // 간단한 상위 퍼센트 추정 (종결수+평판 기반)
  const performanceScore = totalDischarges * 3 + reputation - totalIncidents * 5;
  const percentile = Math.max(1, Math.min(99, Math.round(100 - performanceScore / 2)));

  const { typeName, description } = getTypeInfo(typeCode);

  return { typeCode, typeName, description, axes, percentile };
}

/** 16유형 정보 */
function getTypeInfo(code: string): { typeName: string; description: string } {
  const typeMap: Record<string, { typeName: string; description: string }> = {
    EVGX: { typeName: "따뜻한 확장가", description: "공감으로 내담자를 감싸면서 근거기반 치료를 고수하는 수호자형 센터장. 센터를 빠르게 키우면서도 위기 상황에서는 절대 타협하지 않습니다." },
    EVGS: { typeName: "깊이 있는 치유자", description: "한 명 한 명을 깊이 돌보며 근거 있는 치료로 신뢰를 쌓는 정통파. 소규모지만 최고의 치료 품질을 자랑합니다." },
    EVCX: { typeName: "모험하는 공감가", description: "따뜻한 마음으로 내담자를 대하되, 새로운 시도를 두려워하지 않는 혁신가. 빠른 확장과 높은 공감을 동시에 추구합니다." },
    EVCS: { typeName: "신중한 따뜻함", description: "근거기반 치료를 바탕으로 한 걸음씩 깊이 파고들며, 도전적 상황에서도 공감을 잃지 않는 꼼꼼한 센터장." },
    EDGX: { typeName: "다재다능한 수호자", description: "다양한 치료법을 시도하면서도 위기 상황에서는 원칙을 지키는 든든한 리더. 빠르게 센터를 키우며 폭넓은 경험을 제공합니다." },
    EDGS: { typeName: "탐구하는 보호자", description: "다양한 접근법을 연구하면서 내담자를 안전하게 보호하는 학자형 센터장. 깊이와 다양성을 동시에 추구합니다." },
    EDCX: { typeName: "자유로운 개척자", description: "공감 능력과 도전 정신을 겸비한 자유로운 영혼. 새로운 치료법과 대담한 경영으로 센터의 지평을 넓힙니다." },
    EDCS: { typeName: "직관적 치유사", description: "따뜻한 직관으로 내담자를 이끌며, 정해진 틀에 얽매이지 않고 각자에게 맞는 길을 찾아주는 유연한 센터장." },
    FVGX: { typeName: "전략적 확장가", description: "데이터와 근거로 무장한 냉철한 전략가. 효율적 자원 배분으로 센터를 빠르게 성장시키며, 위기에도 흔들리지 않습니다." },
    FVGS: { typeName: "정밀한 전문가", description: "최적의 매칭, 최고의 효율. 근거기반 치료에 대한 확고한 신념으로 깊이 있는 전문 센터를 운영합니다." },
    FVCX: { typeName: "대담한 분석가", description: "근거에 기반하되 과감한 결단을 내리는 전략가. 계산된 위험을 감수하며 빠르게 성장하는 도전형 리더." },
    FVCS: { typeName: "냉철한 장인", description: "효율과 근거의 완벽한 조화. 하나하나 정밀하게 다듬어가며 최고 품질의 치료 서비스를 구축합니다." },
    FDGX: { typeName: "실험적 리더", description: "다양한 시도와 효율적 확장을 동시에 추구하는 실험적 리더. 안정적 기반 위에서 끊임없이 혁신합니다." },
    FDGS: { typeName: "분석적 탐험가", description: "효율적이면서도 다양한 접근을 시도하는 분석적 탐험가. 깊이 있게 파고들며 새로운 가능성을 발견합니다." },
    FDCX: { typeName: "파격적 혁신가", description: "효율과 도전, 확장과 다양성을 모두 추구하는 대담한 혁신가. 틀을 깨는 경영으로 새로운 길을 열어갑니다." },
    FDCS: { typeName: "효율적 실험가", description: "냉철한 분석력으로 다양한 실험을 하되, 깊이 있게 파고드는 집중력의 소유자." },
  };

  return typeMap[code] ?? { typeName: "균형잡힌 센터장", description: "모든 영역에서 고른 역량을 보여주는 균형형 센터장입니다." };
}
