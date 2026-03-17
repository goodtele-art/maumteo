export interface EventChoice {
  label: string;
  effects: EventEffect[];
}

export interface EventEffect {
  type: "gold" | "reputation" | "ap" | "em_patient" | "counselor_skill" | "counselor_leave";
  value: number;
  /** em_patient: 랜덤 환자 1명, counselor_skill: 랜덤 상담사 1명 */
  targetRandom?: boolean;
  targetId?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface PendingEvent {
  event: GameEvent;
  turn: number;
  /** 이벤트 발생 시 결정된 컨텍스트 (대상 상담사/내담자 등) */
  context?: {
    targetCounselorId?: string;
    targetCounselorName?: string;
    targetPatientId?: string;
    targetPatientName?: string;
  };
}
