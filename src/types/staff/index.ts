export interface ClinicalPsychologist {
  id: string;
  name: string;
  skill: number; // 1~10
  salary: number; // 기본 35
  assessmentsThisTurn: number;
  maxAssessments: number; // skill별 1~3
}

export interface CenterDirector {
  id: string;
  name: string;
  communicationSkill: number; // 1~10
  supervisionSkill: number; // 1~10
  salary: number; // 기본 50
  disputesResolved: number;
}

export interface ViceDirector {
  id: string;
  name: string;
  managementSkill: number; // 1~10 (의사결정 정확도)
  salary: number; // 기본 40
}

/** 임상심리사 skill에 따른 턴당 최대 검사 인원 */
export function getMaxAssessments(skill: number): number {
  if (skill >= 8) return 3;
  if (skill >= 4) return 2;
  return 1;
}

/** 상담실장 소통 skill에 따른 양육 스트레스 자동 해결 성공률 */
export function getDirectorResolveRate(communicationSkill: number): number {
  if (communicationSkill >= 10) return 0.95;
  if (communicationSkill >= 7) return 0.9;
  if (communicationSkill >= 4) return 0.8;
  return 0.7;
}
