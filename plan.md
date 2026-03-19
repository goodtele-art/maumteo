# MaumTeo 마스터플랜: Stage 2-3 확장 설계 (최종)

## Context

마음터(MaumTeo) Stage 1 (성인상담센터, 턴 1~30)이 완료되었다. 사용자(심리학 전문가)가 아동청소년(Stage 2)과 영유아(Stage 3) 센터로 확장하는 마스터플랜을 요청했다. ECT(effectivechildtherapy.org) Level 1~5 근거기반치료 데이터를 기초자료로 활용한다.

> 임상심리전문가(상담센터 운영 경험) + 타이쿤게임 헤비유저 리뷰를 반영한 최종안.
> 상세 리뷰: `woolly-juggling-bonbon-agent-ac1e2f149209711b6.md`

### 근거기반 연구 조사 요약

- **ADHD**: BPT 효과 확인. 사회기술훈련 ECT Level 5(효과없음) → 게임에서 제외
- **아동 불안**: 아동 장애 중 가장 강한 근거 기반 (CBT 7가지 변형)
- **아동 우울**: Level 1은 청소년만 해당, 아동은 Level 3~4 → 연령 기반 효과 차이 반영
- **품행장애/ODD**: PCIT 효과크기 d=1.65(매우 큼). MST/FFT 청소년용
- **아동 PTSD**: TF-CBT 25개 RCT, PRACTICE 모델, 8~25회기. 국제 1차 치료
- **아동 OCD**: 가족중심 CBT+ERP가 Level 1, 가족 참여가 Level 1/2 구분 핵심
- **ASD**: 포괄적 ABA만 Level 1. 사회기술집단훈련 중간-큰 효과크기
- **섭식장애**: FBT(Maudsley) 39% vs CBT-A 20% 관해율. 가족이 회복 주도
- **정서위기(자해)**: DBT-A만 Level 1. 1,673명 청소년 메타분석 소~중간 효과
- **ESDM(영유아 자폐)**: 언어 효과크기 d=2.52, IQ +17.6점
- **DIR/Floortime**: 비용효과적, 부모주도. 사회정서 발달에 최적
- **애착 중재(ABC)**: 10회기 매뉴얼화 프로그램. 홀딩치료는 유해(경고)
- **부모참여**: 아동치료의 핵심 차별 요인. 메타분석에서 유의미 효과 증가

> 출처: JCCAP 2024, JAMA Psychiatry, JAACAP 2024, NCTSN, Pediatrics 2025, Brain Sciences, PMC 다수

### 설계 원칙

1. **윤리적 표현**: 자해/자살은 "정서위기", 품행/반항은 "행동조절 어려움", 부모 민원은 "양육 스트레스" — 낙인 방지, 공감적 표현
2. **현실적 규모**: 지역사회 연계 의뢰는 3~5명/턴 (실제 현장 수준 반영)
3. **점진적 온보딩**: 새 메커니즘을 한꺼번에 열지 않고 턴 단위로 단계적 소개
4. **전략적 택일**: 정답 루트 없이 의미 있는 선택 (연계 사업 택일, 센터 특화)
5. **90턴 구조**: Stage 1: 30턴, Stage 2: 30턴, Stage 3: 30턴 → 이탈 방지 + 촘촘한 해금
6. **위기 시 실제 도움 정보**: 자살예방상담전화 1393, 정신건강위기상담전화 1577-0199 팝업

---

## Stage 2: 아동청소년상담센터 (턴 31~60)

### 문제영역 (ChildIssue) — 8개

| 코드 | 이름 | 근거 | EM시작 | EM증가 | 라포난이도 | 재발% | 특수 메커니즘 |
|------|------|------|--------|--------|-----------|-------|-------------|
| `child_anxiety` | 아동 불안 | ECT Lv1: CBT 7변형, 노출, 가족기반CBT | 40~65 | +2 | 0.9 | 0% | 부모참여 적극 → 치료효과 ×1.2 |
| `child_depression` | 청소년 우울 | ECT Lv1: CBT·IPT(청소년만). 아동 Lv3~4 | 45~70 | +1 | 1.3 | 5% | 라포 보너스 1.5배. 치료 회기가 길어짐(EM 감소 느림) |
| `adhd` | ADHD | ECT Lv1: BPT·BCM. Lv5: 사회기술훈련(효과없음) | 35~60 | +3 | 0.7 | 10% | EM증가 빠름, 라포 쉬움. 부모참여 비협조 시 ×0.3 |
| `behavior_regulation` | 행동조절 어려움 | ECT Lv1: PCIT(d=1.65), MST·FFT | 50~75 | +2 | 1.4 | 15% | 부모 비협조 시 치료 불가. 위기 시 타 내담자 EM+5 |
| `child_trauma` | 아동 트라우마 | ECT Lv1: TF-CBT(25 RCT, PRACTICE 모델) | 60~85 | +1 | 1.2 | 0% | 고EM 시작. 부모참여가 치료속도 결정. 학대 신고의무 이벤트 |
| `child_ocd` | 아동 강박 | ECT Lv1: 가족중심 CBT+ERP | 45~70 | +1 | 1.0 | 15% | 가족시설 시너지 필수 |
| `eating_disorder` | 섭식장애 | ECT Lv1: FBT/Maudsley(관해율 39%) | 55~80 | +2 | 1.3 | 10% | 부모참여 → EM 자연증가 감소. 영양실 시너지 |
| `emotion_crisis` | 정서위기 | ECT Lv1: DBT-A | 70~95 | +3 | 1.5 | 10% | 최고난도. EM≥90 위기 발생 → 위기 대응 프로토콜 이벤트. 위기개입실 필수 |

### 상담사 전공 (ChildSpecialty) — 6개

| 코드 | 전공명 | 설명 | 최적(×1.4) | 보조(×1.15) |
|------|--------|------|-----------|------------|
| `child_cbt` | 아동 인지행동치료 | CBT-C, 노출치료 | child_anxiety, child_ocd, child_depression | child_trauma, eating_disorder |
| `play_therapy` | 놀이치료 | CCPT, 지시적/비지시적 놀이치료 | — | child_anxiety, child_trauma, adhd |
| `parent_training` | 부모훈련/PCIT | BPT, PCIT, PMTO, Triple P | adhd, behavior_regulation | child_anxiety, child_ocd |
| `dbt_a` | 청소년 DBT | DBT-A, 감정조절 기술훈련 | emotion_crisis, eating_disorder | child_depression, behavior_regulation |
| `tf_cbt` | 트라우마초점 CBT | TF-CBT, 부모참여 외상치료 | child_trauma | child_anxiety, emotion_crisis |
| `family_therapy` | 가족치료/MST | FFT, MST, FBT(Maudsley) | eating_disorder, behavior_regulation | child_ocd, child_depression |

> **놀이치료 특수 규칙**: 근거 수준 Level 3~4이므로 최적 매칭(×1.4) 없음, 보조(×1.15)만 제공. 대신 **고유 효과: 어떤 문제든 라포 쌓기 ×1.3** (관계 형성 강점 반영)
> 게임 내 가이드: "놀이치료는 아동과의 관계 형성에 강점이 있으나, 특정 문제에 대한 연구 근거는 아직 축적 중입니다"

### 치료실 (ChildFacility) — 6개

| 코드 | 이름 | 비용 | 유지비 | EM감소 | 효과 | 시너지 전공 | 해금 |
|------|------|------|--------|--------|------|-----------|------|
| `play_room` | 놀이치료실 | 120 | 10 | 8 | 라포 획득 +50% | play_therapy, child_cbt | 턴32 |
| `parent_room` | 부모상담실 | 100 | 8 | 5 | 부모면담 효과 강화(+8→+15) | parent_training, family_therapy | 턴31 |
| `group_activity` | 사회기술훈련실 | 160 | 14 | 7 | 집단치료(2명 동시, 각70%). ADHD/행동조절 추가EM-3 | parent_training, dbt_a | 턴35 |
| `exposure_child` | 아동노출치료실 | 180 | 15 | 10 | 불안/강박/트라우마 ×1.5 | child_cbt, tf_cbt | 턴40 |
| `nutrition_clinic` | 영양치료실 | 150 | 12 | 6 | 섭식장애 ×1.5. 전체 EM자연증가 -1 | family_therapy, dbt_a | 턴45 |
| `crisis_room` | 위기개입실 | 200 | 18 | 9 | 정서위기 기준 EM 90→95. 위기 시 평판손실 -50% | dbt_a, tf_cbt | 턴48 |

### 해금 순서 (턴 31~60, 점진적 온보딩)

| 턴 | 문제영역 | 시설 | 기타 | 온보딩 미션 |
|----|---------|------|------|-----------|
| 31 | child_anxiety (1명 입소) | parent_room | Stage 2 오픈 (튜토리얼) | "첫 아동 내담자를 상담하세요" |
| 32 | — | play_room | 부모참여도 시스템 활성화 | "부모면담을 실시하세요" |
| 33 | adhd | — | 임상심리사 고용 해금 | "심리검사를 실시하세요" |
| 35 | child_depression, behavior_regulation | group_activity | 학교자문 액션 해금 | — |
| 38 | — | — | **Wee센터 OR 보호관찰소** 택일 이벤트 | — |
| 40 | child_ocd, child_trauma | exposure_child | — | — |
| 43 | — | — | **센터 특화 선택** 이벤트 | — |
| 45 | eating_disorder | nutrition_clinic | — | — |
| 48 | emotion_crisis | crisis_room | — | — |

### 층 구조 (아동센터 전용 5층)

| FloorId | 이름 | 아이콘 | EM 범위 |
|---------|------|--------|---------|
| `child_garden` | 하늘놀이터 | ☀ | 0~20 |
| `child_comfort` | 안심상담실 | ◇ | 21~40 |
| `child_care` | 마음돌봄센터 | ○ | 41~60 |
| `child_intensive` | 집중돌봄센터 | ◈ | 61~80 |
| `child_shelter` | 보호치료센터 | ▽ | 81~100 |

### 부모참여도 시스템 (ParentInvolvement)

```
interface ChildPatient extends Patient {
  parentInvolvement: number;   // 0~100 (내부 수치)
  schoolConsulted: boolean;    // 이번 턴 학교자문 (턴 종료 시 리셋)
  assessed: boolean;           // 심리검사 완료 여부
  referralSource?: "wee_center" | "probation" | "walk_in";
}
```

- **매 턴 자연 감소**: -3 (급격히 떨어지지 않음)
- **부모면담** (AP 2, 치료와 동등한 무게): 부모참여도 +8 (부모상담실 있으면 +15)
  - 내담자 카드에 **원클릭 부모면담 버튼** (별도 모달 없음)
- **UI 표시**: 내부 수치 대신 **3단계 상태 아이콘**으로 표시

| 상태 | 조건 | 효과 | 아이콘 |
|------|------|------|--------|
| 적극 참여 | 참여도 ≥60 | 치료효과 ×1.2 | 💚 |
| 보통 | 참여도 30~59 | ×1.0 | 💛 |
| 비협조 | 참여도 <30 | ×0.7, ADHD/행동조절은 ×0.3 | 🔴 |

- 비협조 내담자만 **빨간 하이라이트** → "어디에 부모면담이 필요한지" 한눈에 파악
- **초기 부모참여도**: child_anxiety 70, adhd 60, child_depression 50, behavior_regulation 40, child_trauma 50, child_ocd 60, eating_disorder 55, emotion_crisis 45

### 학교자문 (SchoolConsultation)

- **AP 2**, 내담자 1명 지정
- 해당 내담자 다음 치료 시 EM 감소 +30% (1회성)
- ADHD: 추가로 EM 자연증가 그 턴 0
- 행동조절: 위기 확률 50% 감소 (그 턴)

### 지역사회 연계 시스템 — **택일 구조**

턴 38에서 Wee센터 연계 OR 보호관찰소 MOU 중 **하나만 선택** (동시 불가).
선택에 따라 센터 특성이 달라져 리플레이 가치 제공.

```
interface CommunityReferral {
  id: string;
  type: "wee_center" | "probation" | "voucher";
  active: boolean;
  acceptedTurn?: number;
  patientsPerTurn: number;        // 3~5
  maxPatientsPerTurn: number;     // 슬라이더 상한
  incidentCount: number;          // 위기 누적 → 3~5회 시 강제 중단
  paused: boolean;
  issueDistribution: Record<string, number>;
}
```

#### 선택지 A: Wee센터 정서행동특성평가 고위험군 연계

- **의뢰 규모**: 매 턴 **3~4명** (수용 인원 슬라이더 조절 가능, 학기초 이벤트 시 1회 8명)
- **문제영역 분포**: child_depression 35%, child_anxiety 35%, emotion_crisis 30%
- **내담자 특성**: EM 70~90 (고위기), 부모참여도 25~40 (낮음)
- **보상 체계**: **평판 중심** — 연계 내담자 종결 시 평판 +3, 교육청 신뢰
- **수입**: 내담자당 15골드 (Wee센터 보조금)
- **핵심 전략**: child_cbt/dbt_a 상담사 + 위기개입실 사전 확보
- **중단 조건**: 위기 3회 누적 → 연계 중단 (평판 -10)
- **거절 시**: 평판 -2, 턴 43에 재제안 1회

#### 선택지 B: 보호관찰소 비행청소년 연계 MOU

- **의뢰 규모**: 매 턴 **3~5명** (슬라이더 조절 가능)
- **문제영역 분포**: behavior_regulation 40%, child_trauma 35%, adhd 25% (외상 비율 상향)
- **내담자 특성**: EM 65~85, 라포 -20 페널티 (비자발적), 부모참여도 15~30
- **보상 체계**: **골드 중심** — 위탁 프로그램 운영비 턴당 고정 80골드
- **특수**: 무단결석 30% 확률 (그 턴 치료 불가), 내담자 간 갈등 → 타 내담자 EM+10 (20%/턴)
- **핵심 전략**: parent_training/family_therapy + 사회기술훈련실. 부모참여도 확보 관건
- **중단 조건**: 위기 5회 누적 → MOU 해지 (평판 -15)
- **거절 시**: 영향 없음

#### 센터 특화 선택 (턴 43 이벤트)

- **"외상전문센터"** → 트라우마/위기 치료효과 +25%, 기타 문제 -10%
- **"종합상담센터"** → 모든 문제 균등, 시설 건설 비용 -20%
- 미선택 시 범용 운영

### 신규 직종: 임상심리사 (ClinicalPsychologist)

상담사와 별도의 **전문 인력**. 종합심리평가 + CBT 보조 참여.

```
interface ClinicalPsychologist {
  id: string;
  name: string;
  skill: number;             // 1~10
  salary: number;            // 기본 35
  assessmentsThisTurn: number;
  maxAssessments: number;    // skill별 1~3명/턴
}
```

- **고용**: 급여 ×2, AP 2. 해금 턴 33
- **심리검사** (AP 1): 내담자 1명 `assessed: true` → 이후 **모든 치료효과 ×1.5** (영구)
  - skill 1~3: 1명/턴, 4~7: 2명/턴, 8~10: 3명/턴
- **CBT 보조**: assessed 내담자에 child_cbt 전공 상담사가 치료 시 추가 +20%
- **바우처 심사**: Stage 3에서 바우처 대상 적격성 판단 역할 추가
- 게임 내 설명: "실제 임상심리전문가는 평가와 치료를 모두 수행합니다. 이 센터에서는 평가에 집중하여 팀의 치료 효과를 극대화합니다."

### 위기 대응 프로토콜 이벤트

`emotion_crisis` 내담자의 EM≥90 위기 발생 시, 단순 평판 하락 대신 **미니 이벤트**:

| 선택지 | 비용 | 효과 |
|--------|------|------|
| 안전 계획 수립 + 보호자 연락 | AP 2 | EM -15, 평판 유지 |
| 정신건강의학과 의뢰 | AP 1, 골드 -30 | 내담자 3턴 부재 후 EM 40 복귀 |
| 아무 조치 안 함 | — | 평판 -10, EM 95 리셋 |

- 위기 발생 시 **실제 도움 정보 팝업** (1393, 1577-0199)

### 아동학대 신고의무 이벤트

child_trauma 내담자에서 15% 확률 랜덤 발생:
- "상담 중 학대 의심 정황을 발견했습니다"
- **신고** → 부모참여도 -40, 평판 +5, 아동보호전문기관 연계
- **미신고** → 이후 30% 확률로 "신고의무 위반 조사" (골드 -300)
- 게임 가이드: "상담사는 아동학대 신고의무자입니다"

### 성인 vs 아동 비교

| 항목 | 성인 | 아동 |
|------|------|------|
| 위기 기준 EM | 100 | 90 |
| 종결 기준 EM | ≤15 (활동치료실 ≤20) | ≤20 (부모참여 적극 시 ≤25) |
| EM 자연증가 | +3~5 | +4~6 |
| 부모참여 | 없음 | 3단계 상태로 치료효과 보정 |
| 이름 형식 | 성인 이름 | 아동 이름 + 나이(7~17세) |
| 사연 톤 | 본인 서술 | 보호자 관점 혼합 |

---

## Stage 3: 영유아발달센터 (턴 61~90)

### 문제영역 (InfantIssue) — 6개

> 영유아는 "장애" 대신 **"발달적 관심영역"**으로 접근. 진단보다 조기개입이 핵심.

| 코드 | 이름 | 근거 | EM시작 | EM증가 | 라포난이도 | 재발% | 특수 메커니즘 |
|------|------|------|--------|--------|-----------|-------|-------------|
| `asd_early` | 자폐스펙트럼(조기) | ECT Lv1: 포괄 ABA. ESDM: 언어 d=2.52, IQ+17.6 | 55~80 | +2 | 1.5 | 0% | 발달이정표. 조기개입 보너스 |
| `dev_delay` | 발달지연 | ESDM·DIR/Floortime. 비용효과적, 부모주도 | 40~65 | +1 | 1.0 | 0% | 범용. 모든 전공 불일치 없음(최소 ×1.0) |
| `attachment` | 애착문제 | RAD/DSED. ABC 10회기 매뉴얼. 홀딩치료=유해 | 50~75 | +2 | 1.6 | 5% | 부모매개 필수. 비협조 시 EM 감소 불가 |
| `sensory` | 감각처리 어려움 | Ayres SI. DIR 병합 시 강화 | 35~60 | +1 | 0.8 | 0% | 감각통합실 ×1.5. 라포 쌓기 쉬움 |
| `speech_delay` | 언어발달지연 | 초기 언어중재, 부모매개 의사소통 중재 | 40~60 | +1 | 1.0 | 0% | 이정표 달성 시 EM 대폭 감소 |
| `behavioral_infant` | 영유아 행동문제 | PCIT(2~7세, d=1.65), Triple P Lv4 | 45~70 | +3 | 1.2 | 10% | 부모매개 전용. 상담사→부모→아이 |

### 상담사 전공 (InfantSpecialty) — 5개

| 코드 | 전공명 | 설명 | 최적(×1.4) | 보조(×1.15) |
|------|--------|------|-----------|------------|
| `aba` | 응용행동분석 | ABA, EIBI, 포괄적 행동중재 | asd_early, behavioral_infant | dev_delay |
| `developmental` | 발달놀이중재 | DIR/Floortime, ESDM | dev_delay, asd_early | sensory, speech_delay |
| `attachment_therapy` | 애착중재 | COS-P, VIPP-SD, Watch Wait Wonder | attachment | behavioral_infant, dev_delay |
| `sensory_integration` | 감각통합치료 | Ayres SI, 감각처리 중재 | sensory | asd_early, dev_delay |
| `speech_language` | 언어치료 | 초기 언어중재, AAC, 부모매개 의사소통 | speech_delay | asd_early, dev_delay |

### 치료실 (InfantFacility) — 5개

| 코드 | 이름 | 비용 | 유지비 | EM감소 | 효과 | 시너지 전공 | 해금 |
|------|------|------|--------|--------|------|-----------|------|
| `infant_play` | 영유아 놀이실 | 100 | 8 | 7 | 기본 치료실. 발달놀이 환경 | developmental, attachment_therapy | 턴61 |
| `sensory_room` | 감각통합실 | 180 | 15 | 9 | 감각처리 ×1.5. 자폐/발달지연 추가 EM-2 | sensory_integration, developmental | 턴61 |
| `parent_coaching` | 부모코칭실 | 120 | 10 | 5 | 부모매개 ×1.3. 부모참여도 자연감소 -3→-1 | attachment_therapy, aba | 턴65 |
| `language_lab` | 언어치료실 | 150 | 12 | 8 | 언어지연 ×1.5. 이정표 달성 가속 | speech_language, developmental | 턴70 |
| `structured_teaching` | 구조화교실 | 200 | 18 | 10 | 자폐 ×1.5. 행동문제 재발 -50% | aba | 턴75 |

### 해금 순서 (턴 61~90, 점진적 온보딩)

| 턴 | 문제영역 | 시설 | 기타 | 온보딩 미션 |
|----|---------|------|------|-----------|
| 61 | dev_delay (1명 입소) | infant_play | Stage 3 오픈 (튜토리얼) | "첫 영유아 내담자를 상담하세요" |
| 62 | sensory | sensory_room | 부모코칭 액션 해금 | "부모코칭을 실시하세요" |
| 65 | attachment, speech_delay | parent_coaching | 발달이정표 시스템 활성화 | — |
| 68 | — | — | **영유아 바우처 사업** 연계 이벤트 + **상담실장** 고용 해금 | — |
| 70 | asd_early | language_lab | — | — |
| 75 | behavioral_infant | structured_teaching | — | — |

### 층 구조 (영유아센터 전용 4층)

> 영유아는 4층 (단순화)

| FloorId | 이름 | 아이콘 | EM 범위 |
|---------|------|--------|---------|
| `infant_bloom` | 꽃피는 놀이방 | ✿ | 0~25 |
| `infant_nurture` | 따뜻한 돌봄방 | ♡ | 26~50 |
| `infant_care` | 발달지원센터 | ◎ | 51~75 |
| `infant_cocoon` | 안전한 둥지 | ◑ | 76~100 |

### 발달이정표 (DevelopmentalMilestone) — EM 기반 자동 달성

```
interface InfantPatient extends Patient {
  parentInvolvement: number;
  milestones: MilestoneStatus[];
  age: number;                   // 개월 수 (12~72)
  interventionStartTurn: number; // 조기개입 보너스 계산용
  referralSource?: "voucher" | "walk_in";
}

interface MilestoneStatus {
  id: string;
  label: string;
  emThreshold: number;   // 이 EM 이하 도달 시 자동 달성
  achieved: boolean;
  achievedTurn?: number;
}
```

- **EM 기반 자동 달성**: EM이 특정 구간 도달 시 순서대로 달성 (확률 아님, 플레이어 성취감 극대화)
- **내담자 카드에 프로그레스 바** 표시 (이정표 4개 중 2개 달성 = 50%)
- **달성 시**: EM -10 즉시 + 평판 +1 + **특별 애니메이션 + 효과음** + 감동 메시지
- **전체 이정표 달성**: 종결 기준 EM ≤30으로 완화 (기본 ≤20)

문제영역별 이정표 (EM 기준):

| 문제영역 | 이정표 1 (EM≤70) | 이정표 2 (EM≤50) | 이정표 3 (EM≤30) | 이정표 4 (EM≤15) |
|---------|-----------------|-----------------|-----------------|-----------------|
| 자폐 | 눈맞춤 | 공동주의 | 모방 | 기능적 놀이 |
| 언어지연 | 옹알이 | 첫 단어 | 두 단어 조합 | 간단한 문장 |
| 애착 | 안전기지 행동 | 분리 후 재결합 | 선택적 애착 | 감정 공유 |
| 감각 | 새 질감 수용 | 소리 적응 | 감각놀이 참여 | — (3개) |
| 발달지연 | 대근육 발달 | 소근육 발달 | 상징놀이 | — (3개) |
| 행동문제 | 지시 따르기 | 순서 기다리기 | 감정 표현 | — (3개) |

### 부모매개 중재 (Parent-Mediated Intervention)

- Stage 3에서 **모든 치료가 부모매개**: 상담사→부모 코칭→부모가 아이에게 적용
- **치료 효과** = 기본효과 × (부모참여도 / 100) × 매칭배율
- **부모코칭 세션** (AP 2): 부모참여도 +20 (부모코칭실 있으면 +30)
- **부모 번아웃**: 3턴 연속 참여도 80 이상 → 다음 턴 자연감소 -15
- **초기 부모참여도**: asd_early 50, dev_delay 60, attachment 35, sensory 70, speech_delay 65, behavioral_infant 45
- **UI**: 아동센터와 동일한 3단계 아이콘 표시

### 영유아 바우처 사업 연계

- **해금**: 턴 68
- **의뢰 규모**: 매 턴 **4~6명** (슬라이더 조절 가능)
- **문제영역 분포**: dev_delay 30%, speech_delay 25%, sensory 20%, asd_early 15%, behavioral_infant 10%
- **수입**: 회기 기반 (치료 1회당 3골드, 바우처 단가 반영)
- **임상심리사 시너지**: 바우처 대상 적격성 심사 역할

#### 양육 스트레스 관리 시스템 (ParentStress)

바우처 사업 수락 시 활성화. 부모를 **치료 파트너로서 지지**하는 관점.

```
interface ParentStress {
  id: string;
  patientId: string;
  severity: "concern" | "distress" | "conflict";
  description: string;
  turnOccurred: number;
  resolved: boolean;
  resolvedBy?: "director" | "player" | "unresolved";
}
```

- **발생 확률**: 바우처 내담자 1명당 매 턴 **5~8%** 확률
- **3단계**:

| 단계 | 이름 | 확률 | 내용 | 미해결 시 |
|------|------|------|------|---------|
| `concern` | 불안 표현 | 70% | "치료가 효과 있는지 불안해하십니다" | 부모참여도 -15 |
| `distress` | 양육 고충 | 25% | "양육 스트레스로 지쳐있습니다" | 평판 -5, 내담자 EM +10 |
| `conflict` | 법적 분쟁 | 5% | "치료 과실 주장" | 현재 골드의 **15~25%** 손실, 평판 -15 |

- **해결 방법**:
  1. **상담실장 자동 해결** (70~95% 성공률, skill 기반) → 부모참여도 +5
  2. **플레이어 직접 대응** (AP 2) → 70% 해결, 실패 시 단계 상승
  3. **무시** → 다음 턴 단계 상승 확정

- **법적 분쟁**: 해결 3턴 소요 (매 턴 골드 -50), 3건 누적 시 바우처 사업 자격 박탈 (평판 -20)

### 신규 직종: 상담실장 (CenterDirector)

**팀 역량 강화자** + 부모 소통 관리. 센터당 1명만 채용 가능.

```
interface CenterDirector {
  id: string;
  name: string;
  communicationSkill: number;  // 부모 소통 능력 (1~10)
  supervisionSkill: number;    // 슈퍼비전 역량 (1~10)
  salary: number;              // 기본 50
  disputesResolved: number;
}
```

- **고용**: 급여 ×3, AP 3. 해금 턴 68 (바우처와 동시)
- **핵심 역할 — 슈퍼비전**: 소속 상담사 전원 치료효과 **+10%** (자동)
- **사례회의**: 턴 종료 시 자동, 가장 EM 높은 내담자 1~2명 다음 턴 치료효과 **+15%**
- **부가 역할 — 양육 스트레스 자동 해결**: skill별 70~95% 성공률
  - skill 1~3: 70%, 4~6: 80%, 7~9: 90%, 10: 95%
- **법적 분쟁 예방**: conflict 발생 확률 80% 감소
- **전체 부모참여도 보너스**: 자연감소 -2 (기본 -3 → -1)
- **슈퍼비전 없는 상담사** (상담실장 미채용 시): 치료효과 **-15%**
- 영유아센터 소속. 아동센터에서도 별도 채용 가능 (선택적)

### 조기개입 시간 압박 (Golden Time)

- 입소 후 **12턴 이내** EM ≤40 미달 시, 이후 치료효과 매 턴 -5% (최대 -50%)
- 발달의 결정적 시기(critical period) 반영
- UI에 **"조기개입 남은 턴: X"** 표시 (긴박감)
- 12턴 내 EM ≤40 달성: "골든타임 확보!" 알림 + 평판 +3

---

## Cross-Stage 시스템

### 센터 전환 UI

```
type StageId = "adult" | "child" | "infant";
```

- 좌측 사이드바 상단에 센터 탭 3개 (아이콘)
- **키보드 단축키**: 1/2/3 키로 센터 전환
- **턴은 글로벌**: 턴 종료 시 모든 활성 센터 동시 처리
- **AP는 센터별 독립**: 각 센터 상담사 수 기반
- **시설/상담사는 센터 귀속**: 크로스센터 파견 불가
- **AP 소진 시**: "아동센터 AP를 모두 사용했습니다. 영유아센터로 이동할까요?" 자동 제안
- **대시보드 뷰**: 3개 센터 핵심 수치를 한 화면에 개요로 표시
- **턴 결과 순차 표시**: "성인 결과 → 아동 결과 → 영유아 결과" 각각 카드로
- **자동 운영 모드** (장기): 안정화된 센터는 AI 상담 배정, 플레이어는 이벤트만 처리

### 경제 시스템

| 항목 | 설계 | 이유 |
|------|------|------|
| 골드 | **공유** (하나의 통장) | 센터 간 전략적 자원 배분 |
| 평판 | **공유** (하나의 수치) | 어디서든 위기/종결이 전체에 영향 |
| AP | **센터별 독립** | 각 센터 개별 관리 경험 유지 |
| 수입 | 성인 ×25, 아동 ×30, 영유아: 회기 기반 + 정부지원금 50 | 난이도/보상 균형 |
| 파산 | 전체 합산 적자 기준 | 공유 경제 |
| **센터별 운영비** | 센터 유지만으로 턴당 고정 비용 | "기생" 전략 방지 |
| **손익 보고서** | 턴 종료 시 센터별 수입/지출 표시 | 가시성 |

### 센터 간 상호작용

| 메커니즘 | 설명 |
|---------|------|
| 추천 의뢰 | 아동센터 18세 내담자 → 성인센터 전환 (EM 유지, 문제영역 매핑) |
| 가족 연계 | 성인 내담자가 부모 → 아동센터 내담자 부모참여도 +10 |
| 연구 시너지 | 3개 센터 동시 운영 → 글로벌 치료효과 +10% |
| 공유 평판등급 | 등급 효과 모든 센터 동시 적용 |

### 평판 등급

| 등급 | 평판 | 이름 | 효과 |
|------|------|------|------|
| F | 0~19 | 무명 상담소 | 내담자 유입 -1 |
| D | 20~39 | 동네 치료실 | 기본 |
| C | 40~59 | 지역 상담센터 | 내담자 유입 +1 |
| B | 60~79 | 유명 치유센터 | 고급 상담사 지원 |
| A | 80~89 | 마음의 등대 | 모든 보너스 |
| **S** | **90~100** | **통합발달치유원** | 조기개입 +20%, 골든타임 +5턴 |

### 엔딩 분기

| 시점 | 엔딩 | 조건 |
|------|------|------|
| 턴 60 | **엔딩 A "아동의 벗"** | 아동센터까지 운영 완료 |
| 턴 90 | **엔딩 S "통합 치유의 빛"** | 3개 센터 풀클리어 |

- Stage별 **독립 플레이 모드**: Stage 2만, Stage 3만 하고 싶은 플레이어 지원
- 엔딩 시 **성적표**: "총 OO명의 마음을 치유했습니다. 평균 치료 기간 X턴. 위기 Y건."

---

## 이벤트 확장

### Stage 2 전용 이벤트 6종

1. **학교 교사 상담 요청** — 수락(평판+3, AP-2) / 거절(평판-1)
2. **부모 불안 표현** — 경청(부모참여도+10, AP-1) / 무시(참여도-15, 평판-2)
3. **아동 우정** — 내담자 2명 EM 각 -5 (무비용, 자동)
4. **SNS 비난** — 해명(골드-50, 평판+2) / 무시(평판-5)
5. **학술 발표 초청** — 수락(평판+5, 골드-40, 상담사 skill+1) / 거절
6. **아동학대 의심** — 신고(참여도-40, 평판+5) / 미신고(법적 리스크)

### Stage 3 전용 이벤트 6종

1. **정부 조기개입 지원금** — 수락(골드+150, AP-3) / 거절
2. **부모 번아웃** — 휴식 권유(참여도 -20→다음 턴 +30) / 무시(참여도 -10/턴 3턴)
3. **발달검사 의뢰** — 수락(치료효과 +20% 3턴) / 거절
4. **형제 시기** — 형제 프로그램(골드-60, 참여도+15) / 무시(참여도-10)
5. **이정표 달성 축하** — 축하 행사(골드-30, 전체 참여도+5) / 간소하게
6. **대기 아동 민원** — 수용 확대(AP-2, 내담자 한도 +3) / 현행 유지(평판-3)

---

## 업적 확장

### Stage 2 업적 8종

1. **첫 아동 종결**: 아동 내담자 1명 종결 → 골드+100
2. **놀이의 힘**: 놀이치료실에서 10회 치료 → 평판+5
3. **부모 파트너**: 부모참여 적극 내담자 5명 종결 → AP 영구+1
4. **학교 연계 전문가**: 학교자문 10회 → 평판+3
5. **아동 전문센터**: 아동센터 30명 종결 → 골드+300
6. **위기의 파수꾼**: Wee센터 연계 내담자 20명 종결 → 평판+10, 골드+150
7. **갱생의 길**: 보호관찰소 연계 내담자 10명 종결 → 평판+10, 골드+200
8. **정밀 진단가**: 심리검사 30회 실시 → 골드+100

### Stage 3 업적 8종

1. **첫 이정표**: 발달이정표 1개 달성 → 골드+50
2. **골든타임 수호자**: 골든타임 확보 5회 → 평판+5
3. **발달의 기적**: 모든 이정표 달성 영유아 1명 종결 → AP 영구+1
4. **부모 코치**: 부모매개 중재 50회 → 골드+200
5. **통합 마스터**: 3개 센터 동시 각 5명 이상 → S등급 즉시 달성
6. **바우처 전문가**: 바우처 연계 영유아 30명 종결 → 골드+300, 평판+5
7. **양육 스트레스 해결사**: 상담실장이 부모 지지 20건 자동 해결 → 평판+5
8. **무분쟁 센터**: 바우처 사업 10턴 연속 법적 분쟁 0건 → 골드+200

---

## 시각적/감정적 보상 (장기 과제)

- 센터 외관이 **평판 등급에 따라 변화** (F: 낡은 건물 → S: 빛나는 현대식 건물)
- 종결 시 **후일담**: "6개월 후, OO은 학교에 잘 적응하고 있습니다"
- Stage별 주요 내담자 3~5명에게 **고정 스토리라인** (턴마다 짧은 일기/대사)
- 대기실 장식/인테리어 커스터마이징 (소유감+애착)
- **자유 모드**: 턴 제한 없음, 모든 해금 상태
- **시나리오 모드**: "위기개입 전문센터", "조기개입 도전" 등 특화 시나리오
- **로컬 랭킹**: 자신의 이전 기록과 비교

---

## 코드 구조 확장 전략

### 타입 확장

```
src/types/
  child/
    patient.ts      — ChildIssue, ChildPatient (Patient extends + assessed, referralSource)
    counselor.ts    — ChildSpecialty, ChildCounselor
    facility.ts     — ChildFacilityType, ChildFacility
    floor.ts        — ChildFloorId
  infant/
    patient.ts      — InfantIssue, InfantPatient (+ milestones, referralSource)
    counselor.ts    — InfantSpecialty, InfantCounselor
    facility.ts     — InfantFacilityType, InfantFacility
    floor.ts        — InfantFloorId
  staff/
    psychologist.ts — ClinicalPsychologist
    director.ts     — CenterDirector (슈퍼비전 + 양육 스트레스 관리)
  referral.ts       — CommunityReferral, ParentStress
  stage.ts          — StageId, MultiStageState
```

### 상수 확장

```
src/lib/constants/
  childConstants.ts      — CHILD_ISSUE_CONFIG, CHILD_SPECIALTY_CONFIG, CHILD_FACILITY_TEMPLATES, CHILD_FLOORS
  infantConstants.ts     — INFANT_ISSUE_CONFIG, INFANT_SPECIALTY_CONFIG, INFANT_FACILITY_TEMPLATES, INFANT_FLOORS
  crossStageConstants.ts — 공유 경제 상수, 센터 전환 설정, 엔딩 분기 조건
```

### 엔진 확장

```
src/lib/engine/
  childEngine.ts    — 부모참여도 감소, 학교자문 효과, 아동 특화 로직
  infantEngine.ts   — 발달이정표 체크, 조기개입 타이머, 부모매개 보정
  milestone.ts      — 이정표 정의 및 EM 기반 달성 로직
  referral.ts       — 지역사회 연계 의뢰 생성, 연계 중단 판정
  parentStress.ts   — 양육 스트레스 발생/해결/상승 로직
  assessment.ts     — 심리검사 효과 (assessed → ×1.5)
  supervision.ts    — 상담실장 슈퍼비전/사례회의 효과
```

- `em.ts`: `getFloorForEM`에 stageId 파라미터 추가
- `patient.ts`: `generatePatient`에 stageId 분기
- `turn.ts`: `processTurn`에 stage별 분기 또는 별도 함수
- `economy.ts`: `calcIncome`에 stageId별 단가 + 센터별 운영비

### 스토어 확장

- `stageSlice.ts` 추가: `activeStage`, `switchStage()`
- `staffSlice.ts` 추가: 임상심리사, 상담실장 관리
- `referralSlice.ts` 추가: 지역사회 연계 상태, 양육 스트레스 큐
- 세이브 시스템: `SaveData` v2 (다중 센터 + 연계 + 스태프)

### 핵심 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `src/types/patient.ts` | ChildPatient, InfantPatient extends Patient |
| `src/types/staff/` | ClinicalPsychologist, CenterDirector |
| `src/types/referral.ts` | CommunityReferral, ParentStress |
| `src/lib/constants.ts` | 기존 유지, 새 상수 파일에서 동일 패턴 복제 |
| `src/lib/engine/turn.ts` | 다중 센터 동시 턴 처리 + 연계 + 양육 스트레스 |
| `src/lib/engine/supervision.ts` | 슈퍼비전/사례회의 효과 |
| `src/store/gameStore.ts` | StageSlice + StaffSlice + ReferralSlice 합성 |
| `src/hooks/useGameActions.ts` | 부모면담/학교자문/부모코칭/심리검사/스트레스 대응 |

---

## 구현 우선순위

| Phase | 작업 | 규모 | 상태 |
|-------|------|------|------|
| 1 | 타입/상수 정의 (types/child, infant, staff, constants) | 작음 | ✅ 완료 |
| 2 | 엔진 확장 (childEngine, infantEngine, milestone, supervision, turn) | 중간 | ✅ 완료 |
| 3 | 스토어 확장 (stageSlice, staffSlice, referralSlice, 세이브 v2) | 중간 | ✅ 완료 |
| 4 | UI 확장 (센터 탭, 대시보드, 부모참여 아이콘, 이정표 바, 새 액션) | 큼 | ✅ 완료 |
| 5 | 콘텐츠 (이름/사연, 이벤트, 업적, 가이드, 스토리라인, 후일담) | 중간 | ✅ 완료 |
| **6** | **비주얼 풀 업그레이드 (에셋 인프라 + 237개 에셋)** | **큼** | **🔧 진행중** |

---

## Phase 6: 비주얼 풀 업그레이드 (2026-03-18~)

### 목표
CSS 글래스모피즘 + 이모지 폴백 → 유니티급 풀 일러스트 비주얼

### 코드 인프라 (✅ 완료)
- `assetMap.ts`: 3스테이지 범용 (22개 함수, 유니온 타입, 이모지 폴백)
- `assetPreloader.ts`: lazy loading + prefetchInIdle
- `CharacterAvatar.tsx`: AnyIssue 지원
- `FacilityIllustration.tsx`: 17종 시설, 레벨별, 아동/영유아 색상 폴백
- `FloorBackground.tsx`: AnyFloorId, 14개 층 CSS 변수
- `SpriteAnimation.tsx`: 스프라이트시트 재생 (3/4프레임, 3단계 폴백)
- `ParticleCanvas.tsx`: 8종 프리셋 (star/heart 도형)
- `audio.ts`: BGM 크로스페이드, 환경음 루프, 12종 SFX, 볼륨 제어
- `index.css`: 아동5+영유아4 층 색상, 9개 글로우, 스프라이트 키프레임
- `public/assets/`: 20+ 서브디렉토리 구조

### 에셋 생성 (⏳ 미착수 — 사용자 작업)

총 237개 에셋, AI 프롬프트 전체 목록: `asset-prompts.md` (프로젝트 루트)

| # | 카테고리 | 수량 | 우선순위 |
|---|---------|------|---------|
| 1 | 성인 내담자 캐릭터 (7이슈×3감정) | 21 | ★★★ |
| 2 | 성인 층 배경 (insight, diagnostic) | 2 | ★★★ |
| 3 | 성인 치료중 포즈 (내담자 8 + 상담사 6) | 14 | ★★☆ |
| 4 | 성인 번아웃 상태 | 6 | ★☆☆ |
| 5 | 종결/사고 연출 | 2 | ★☆☆ |
| 6 | NPC 캐릭터 | 8 | ★☆☆ |
| 7 | 성인 시설 Lv.2/3 | 12 | ★★☆ |
| 8 | 아동 시설 (기본+Lv+내부) | 24 | ★★☆ |
| 9 | 영유아 시설 (기본+Lv+내부) | 20 | ★★☆ |
| 10 | 성인 시설 내부 | 6 | ★☆☆ |
| 11 | 아동 층 배경 5 + 영유아 층 배경 4 | 9 | ★★★ |
| 12 | 센터 외관 6등급 | 6 | ★★☆ |
| 13 | 업적 뱃지 | 26 | ★☆☆ |
| 14 | 이벤트 일러스트 | 17 | ★☆☆ |
| 15 | 인트로/엔딩/게임오버 컷씬 | 8 | ★☆☆ |
| 16 | UI 아이콘 (골드/AP/평판) | 3 | ★☆☆ |
| 17 | 아동 내담자 (8이슈×3감정) + 상담사 6 | 30 | ★★★ |
| 18 | 영유아 내담자 (6이슈×3감정) + 상담사 5 | 23 | ★★★ |

### 남은 코드 작업 (에셋 배치 후)
- 치료 모달에 포즈 이미지 표시 (TreatmentModal)
- 이벤트 모달에 일러스트 표시 (EventModal)
- 볼륨 설정 UI 컴포넌트 (메뉴)
- EM 게이지 SVG 리뉴얼 (EMBar)
- 센터 외관 표시 컴포넌트 (BuildingView)
- BGM/환경음 자동 전환 훅

---

## 검증 방법

1. `npm run build` — 타입 에러 0
2. `tsc --noEmit` — 빌드 성공
3. 각 Stage별 수동 플레이테스트:
   - Stage 2: 턴 31 진입 → 점진적 온보딩 → 연계 택일 → 치료 → 종결
   - Stage 3: 턴 61 진입 → 이정표 달성 → 골든타임 확인 → 바우처 + 양육 스트레스
4. 센터 전환 시 상태 격리 확인 (AP, 상담사, 시설 독립)
5. 세이브/로드 시 다중 센터 + 연계 + 스태프 상태 보존
6. 윤리적 표현 검증: "정서위기", "행동조절 어려움", "불안 표현" 등 용어 확인
7. 위기 발생 시 도움 정보 팝업 (1393, 1577-0199) 표시 확인
8. 모든 에셋 누락 시 이모지 폴백 정상 동작 (graceful degradation)
9. Lighthouse 성능 점수 ≥ 80 (lazy loading 확인)
