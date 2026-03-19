/**
 * 부센터장 위임 엔진 (순수 함수)
 * 주어진 상태에서 최적의 치료/격려 행동 계획을 수립합니다.
 */
import type { ApprovalRequest } from "@/types/delegation.ts";
import type { ViceDirector } from "@/types/staff/index.ts";
import { AP_COST } from "@/lib/constants.ts";

/** 내담자 정보 (스테이지 무관 공통 인터페이스) */
interface DelegationPatient {
  id: string;
  name: string;
  em: number;
  dominantIssue: string;
  rapport: number;
  treatmentCount: number;
}

/** 상담사 정보 */
interface DelegationCounselor {
  id: string;
  name: string;
  specialty: string;
  skill: number;
  onLeave?: boolean;
}

/** 시설 정보 */
interface DelegationFacility {
  id: string;
  type: string;
  emReduction: number;
  level: number;
}

/** 매칭 배율 계산 함수 타입 */
type MatchMultiplierFn = (specialty: string, issue: string) => number;

/** 위임 계획 입력 */
export interface DelegationInput {
  patients: DelegationPatient[];
  counselors: DelegationCounselor[];
  facilities: DelegationFacility[];
  ap: number;
  viceDirector: ViceDirector;
  getMatchMultiplier: MatchMultiplierFn;
}

/** 위임에서 수행할 개별 행동 */
export interface PlannedAction {
  type: "treat" | "encourage";
  patientId: string;
  patientName: string;
  counselorId?: string;
  counselorName?: string;
  facilityId?: string;
  facilityLabel?: string;
  /** 예상 EM 감소량 (실제 적용은 treat/encourage 함수가 수행) */
  estimatedEmReduction: number;
}

/** 위임 계획 결과 */
export interface DelegationPlan {
  actions: PlannedAction[];
  approvalRequests: ApprovalRequest[];
  totalApCost: number;
}

/**
 * 부센터장 관리 스킬에 따라 최적/차선/랜덤 선택
 * @param sortedOptions 점수 내림차순 정렬된 옵션 배열
 * @param managementSkill 1~10
 * @returns 선택된 인덱스
 */
function pickBySkill<T>(sortedOptions: T[], managementSkill: number): number {
  if (sortedOptions.length === 0) return -1;
  if (sortedOptions.length === 1) return 0;

  const rand = Math.random();

  if (managementSkill >= 8) {
    // 100% 최적
    return 0;
  }
  if (managementSkill >= 5) {
    // 80% 최적, 20% 차선
    return rand < 0.8 ? 0 : 1;
  }
  // skill 1~4: 60% 최적, 30% 차선, 10% 랜덤
  if (rand < 0.6) return 0;
  if (rand < 0.9) return Math.min(1, sortedOptions.length - 1);
  return Math.floor(Math.random() * sortedOptions.length);
}

/**
 * 최적 상담사-시설 페어 선택
 */
function selectBestPair(
  patient: DelegationPatient,
  availableCounselors: DelegationCounselor[],
  facilities: DelegationFacility[],
  getMatchMult: MatchMultiplierFn,
  managementSkill: number,
): { counselorId: string; counselorName: string; facilityId?: string; facilityLabel?: string } | null {
  if (availableCounselors.length === 0) return null;

  // 모든 (상담사, 시설) 조합 점수 계산
  const pairs: Array<{
    counselor: DelegationCounselor;
    facility: DelegationFacility | null;
    score: number;
  }> = [];

  for (const c of availableCounselors) {
    const matchMult = getMatchMult(c.specialty, patient.dominantIssue);
    // 시설 없이 기본 상담
    pairs.push({ counselor: c, facility: null, score: matchMult * c.skill });
    // 각 시설과 조합
    for (const f of facilities) {
      const facilityBonus = f.emReduction / 8; // 기본 8 대비 비율
      pairs.push({ counselor: c, facility: f, score: matchMult * c.skill * facilityBonus });
    }
  }

  // 점수 내림차순 정렬
  pairs.sort((a, b) => b.score - a.score);

  const idx = pickBySkill(pairs, managementSkill);
  if (idx < 0) return null;

  const selected = pairs[idx]!;
  return {
    counselorId: selected.counselor.id,
    counselorName: selected.counselor.name,
    facilityId: selected.facility?.id,
    facilityLabel: selected.facility ? `${selected.facility.type} Lv.${selected.facility.level}` : undefined,
  };
}

/**
 * 위임 행동 계획 수립 (순수 함수)
 * 실제 상태 변경은 하지 않습니다. 호출자가 각 action을 실행합니다.
 */
export function planDelegation(input: DelegationInput): DelegationPlan {
  const { patients, counselors, facilities, ap, viceDirector, getMatchMultiplier: getMatchMult } = input;
  const actions: PlannedAction[] = [];
  let remainingAp = ap;

  // 내담자를 EM 내림차순 정렬 (위기 환자 우선)
  const sortedPatients = [...patients].sort((a, b) => b.em - a.em);

  // 사용 가능 상담사 (onLeave 제외)
  const availableCounselors = counselors.filter(c => !c.onLeave);
  const usedCounselorIds = new Set<string>();

  for (const patient of sortedPatients) {
    if (remainingAp < AP_COST.encourage) break;

    // EM이 매우 낮은 환자는 스킵 (곧 종결)
    if (patient.em <= 20) continue;

    if (remainingAp >= AP_COST.treat) {
      // 아직 사용하지 않은 상담사 중 최적 선택
      const unusedCounselors = availableCounselors.filter(c => !usedCounselorIds.has(c.id));

      if (unusedCounselors.length > 0) {
        const pair = selectBestPair(patient, unusedCounselors, facilities, getMatchMult, viceDirector.managementSkill);
        if (pair) {
          usedCounselorIds.add(pair.counselorId);
          actions.push({
            type: "treat",
            patientId: patient.id,
            patientName: patient.name,
            counselorId: pair.counselorId,
            counselorName: pair.counselorName,
            facilityId: pair.facilityId,
            facilityLabel: pair.facilityLabel,
            estimatedEmReduction: 10, // 실제 값은 treat()이 계산
          });
          remainingAp -= AP_COST.treat;
          continue;
        }
      }
    }

    // AP가 부족하거나 상담사 없음 → 격려
    if (remainingAp >= AP_COST.encourage) {
      actions.push({
        type: "encourage",
        patientId: patient.id,
        patientName: patient.name,
        estimatedEmReduction: 3,
      });
      remainingAp -= AP_COST.encourage;
    }
  }

  // ── 결재 요청 생성 ──
  const approvalRequests: ApprovalRequest[] = [];
  const patientCount = patients.length;
  const counselorCount = availableCounselors.length;
  const facilityCount = facilities.length;

  // 상담사 부족
  if (counselorCount > 0 && patientCount > counselorCount * 3) {
    approvalRequests.push({
      id: `ar_hire_${Date.now()}`,
      type: "hire",
      reason: `상담사 부족: 내담자 ${patientCount}명 대비 상담사 ${counselorCount}명`,
      suggestion: "상담사 추가 고용을 권합니다",
      status: "pending",
    });
  } else if (counselorCount === 0) {
    approvalRequests.push({
      id: `ar_hire_${Date.now()}`,
      type: "hire",
      reason: "고용된 상담사가 없어 격려만 수행했습니다",
      suggestion: "상담사를 시급히 고용해주세요",
      status: "pending",
    });
  }

  // 시설 부족
  if (facilityCount === 0 && patientCount > 0) {
    approvalRequests.push({
      id: `ar_build_${Date.now()}`,
      type: "build",
      reason: "설치된 시설이 없어 기본 상담만 수행했습니다",
      suggestion: "치료 시설 건설을 권합니다",
      status: "pending",
    });
  }

  // 위기 환자 다수
  const crisisCount = patients.filter(p => p.em >= 80).length;
  if (crisisCount >= 3) {
    approvalRequests.push({
      id: `ar_crisis_${Date.now()}`,
      type: "build",
      reason: `EM 80 이상 위기 내담자가 ${crisisCount}명입니다`,
      suggestion: "시설 업그레이드 또는 추가 건설을 검토해주세요",
      status: "pending",
    });
  }

  return {
    actions,
    approvalRequests,
    totalApCost: ap - remainingAp,
  };
}
