# MaumTeo (마음터) — Psychological Gravity World

## 프로젝트 개요
심리 상담 센터 경영 시뮬레이션 / 타이쿤 웹 게임 (100턴: 튜토리얼 10 + 3단계 확장).
"마음의 짐이 가벼워질수록 인간은 더 높은 곳으로 올라간다"

### 턴 구조 (100턴)
- **튜토리얼 (턴 1~10)**: UI/기능을 하나씩 소개, 점진적 해금
- **Stage 1 (턴 11~40)**: 성인상담센터 — 문제영역 8개, 상담사 6전공, 치료실 6종
- **Stage 2 (턴 41~70)**: 아동청소년상담센터 — 문제영역 8개, 상담사 6전공, 치료실 6종
- **Stage 3 (턴 71~100)**: 영유아발달센터 — 문제영역 6개, 상담사 5전공, 치료실 5종
- 엔딩 분기: 턴 70 "엔딩 A — 아동의 벗", 턴 100 "엔딩 S — 통합 치유의 빛"

### 튜토리얼 시스템 (`src/lib/tutorialConfig.ts`)
- 턴 1: 격려만 (AP 1, 내담자 1명, 불안 고정)
- 턴 2: 상담사 자동 합류, 상담 버튼
- 턴 3: 사이드바, 우울 해금
- 턴 4: 건설 버튼, 개인상담실 해금
- 턴 5: 고용 버튼, 관계 해금
- 턴 6: 사연 읽기 하이라이트
- 턴 7: 간편/상세 모드 토글, 강박 해금
- 턴 8: 평판 등급 표시
- 턴 9: 업그레이드 버튼
- 턴 10: 전체 UI 완성
- 새로 해금되는 기능은 해당 턴에 `new-feature-glow` CSS 깜박임 적용
- UI 스케일: 1~2턴 2배 → 점진 축소 → 8턴 이후 1배

## 기술 스택 (버전 고정)
- **Vite** ^6.x (v8은 Rolldown 전환으로 미검증, v6이 안정)
- **React** ^18.3.1
- **TypeScript** ~5.6.x (5.7+ 호환 이슈 있음)
- **@vitejs/plugin-react** ^4.x
- **Tailwind CSS** ^4.x + **@tailwindcss/vite** ^4.x (postcss.config 불필요)
- **Zustand** ^5.0.x (~1KB, React 18 strict mode 호환)
- **Motion** ^12.x (import from "motion/react", LazyMotion으로 번들 축소)
- **@dnd-kit 사용하지 않음** — 유지보수 중단, motion과 충돌. 클릭 기반 UI로 대체.

## 빌드 명령
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 용어 규칙 (UI 표시)
| 코드/내부 | UI 표시 |
|-----------|---------|
| patient | **내담자** |
| discharge | **상담 종결** |
| admission | **상담 시작** |
| garden (층) | **옥상하늘정원** |
| insight (층) | **심리상담센터** |
| counseling (층) | **심리치료센터** |
| diagnostic (층) | **집중치료센터** |
| basement (층) | **거주치료센터** |

> 코드 내부 ID/변수명은 영어 유지. UI 라벨만 한국어 용어 적용.

### 윤리적 용어 규칙
| 코드/내부 | UI 표시 | 금지 표현 |
|-----------|---------|---------|
| `emotion_crisis` | **정서위기** | 자해, 자살사고 |
| `behavior_regulation` | **행동조절 어려움** | 품행/반항, 비행 |
| `ParentStress` | **양육 스트레스 관리** | 까다로운 부모, 부모 분쟁 |

- 위기 발생 시 실제 도움 정보 팝업 (자살예방상담전화 1393, 정신건강위기상담전화 1577-0199)
- 게임 시작 시 정신건강 주제 안내 문구

## 핵심 게임 시스템

### EM (Emotional Mass)
- 단일값 0~100. 모든 변경 후 `clampEM(0, 100)` 필수.
- **자연 증가**: 매 턴 기본 +3~5. 문제영역별 추가 증가율.
- **EM ≥ 100**: 사고 발생 → 평판 -5, EM 95로 리셋.
- **상담 종결**: EM ≤ 15 (활동치료실 있으면 ≤ 20).
- **평판**: 0~100 범위 clamp. 종결 시 +2.

### 문제영역 (DominantIssue) — 8개
| 코드 | 이름 | 근거 | 특성 |
|------|------|------|------|
| `depression` | 우울 | APA Div12 Depression | 라포 난이도 ×1.3 |
| `anxiety` | 불안 | Panic/GAD/Social Anxiety | EM 증가 빠름(+2) |
| `relationship` | 관계 | 대인관계/가족 갈등 | 라포 효과 편차 큼 |
| `obsession` | 강박 | OCD (ERP) | 재발 15% |
| `trauma` | 트라우마 | PTSD (PE/CPT/EMDR) | 고EM 시작(65~90) |
| `addiction` | 중독 | Substance Use (MET/CBT) | 재발 20% |
| `personality` | 정서조절 | BPD (DBT/MBT) | 고난도, 재발 10% |
| `psychosis` | 정신증 | Schizophrenia/Bipolar | 턴10 해금, 고EM |

### 상담사 전공 (CounselorSpecialty) — 6개
| 코드 | 전공명 | 최적(×1.4) | 보조(×1.15) |
|------|--------|-----------|------------|
| `cbt` | 인지행동치료 | 불안, 강박, 우울 | 중독, 트라우마 |
| `psychodynamic` | 정신역동 | 정서조절, 관계 | 트라우마, 우울 |
| `interpersonal` | 대인관계치료 | 우울, 관계 | 정서조절 |
| `dbt` | 변증법적행동치료 | 정서조절, 중독 | 우울, 불안 |
| `trauma_focused` | 트라우마초점 | 트라우마 | 불안, 정서조절 |
| `family_systemic` | 가족/체계치료 | 정신증, 관계 | 중독, 우울 |

그 외 불일치 = ×0.85 (활동치료실 있으면 ×1.0으로 완화)

### 치료실 (FacilityType) — 6개
| 코드 | 이름 | 효과 | 시너지 전공 |
|------|------|------|-----------|
| `individual_room` | 개인상담실 | 기본 EM 감소 | cbt, psychodynamic |
| `group_room` | 집단상담실 | 실 1개당 추가 1명 동시 치료(각70%) | interpersonal, dbt |
| `exposure_lab` | 노출치료실 | 불안/강박/트라우마 ×1.5 | cbt, trauma_focused |
| `mindfulness_room` | 마음챙김실 | 격려 2배 + 재발 감소 | dbt |
| `family_room` | 가족상담실 | 정신증/관계 ×1.3 | family_systemic, interpersonal |
| `activity_room` | 활동치료실 | 불일치 페널티 제거 + 종결 완화 | 모든 전공 |

### 시설 효과 규칙
- **시설 기반**: 플레이어가 선택한 1개 시설의 효과만 적용 (층 합산 없음)
- **집단상담실**: 주 내담자 100% + 추가 내담자 각 70% (Lv.1: +1명, Lv.2: +2명, Lv.3: +3명)
- **같은 유형 여러 개 설치 가능**: 각각 독립적으로 선택 가능 (턴당 1회 사용)

### AP 비용
상담 2, 격려 1, 건설 3, 고용 2, 업그레이드 2

### 해금 순서 (Stage 1 성인센터)
- 턴 1: 불안 (튜토리얼 강제)
- 턴 3: 우울
- 턴 4: 개인상담실
- 턴 5: 관계
- 턴 7: 강박
- 턴 13: 집단상담실/노출치료실
- 턴 15: 트라우마/중독 + 마음챙김실/활동치료실
- 턴 17: 정서조절 + 가족상담실
- 턴 20: 정신증

### Stage 2 아동청소년센터 (턴 41~70)

#### 문제영역 (ChildIssue) — 8개
| 코드 | 이름 | 근거 |
|------|------|------|
| `child_anxiety` | 아동 불안 | ECT Lv1: CBT, 노출, 가족기반CBT |
| `child_depression` | 청소년 우울 | ECT Lv1: CBT·IPT(청소년만) |
| `adhd` | ADHD | ECT Lv1: BPT·BCM |
| `behavior_regulation` | 행동조절 어려움 | ECT Lv1: PCIT, MST·FFT |
| `child_trauma` | 아동 트라우마 | ECT Lv1: TF-CBT |
| `child_ocd` | 아동 강박 | ECT Lv1: 가족중심 CBT+ERP |
| `eating_disorder` | 섭식장애 | ECT Lv1: FBT/Maudsley |
| `emotion_crisis` | 정서위기 | ECT Lv1: DBT-A |

#### 상담사 전공 (ChildSpecialty) — 6개
| 코드 | 전공명 | 최적(×1.4) | 보조(×1.15) |
|------|--------|-----------|------------|
| `child_cbt` | 아동 인지행동치료 | 불안, 강박, 우울 | 트라우마, 섭식 |
| `play_therapy` | 놀이치료 | — (Lv3~4) | 불안, 트라우마, ADHD |
| `parent_training` | 부모훈련/PCIT | ADHD, 행동조절 | 불안, 강박 |
| `dbt_a` | 청소년 DBT | 정서위기, 섭식 | 우울, 행동조절 |
| `tf_cbt` | 트라우마초점 CBT | 트라우마 | 불안, 정서위기 |
| `family_therapy` | 가족치료/MST | 섭식, 행동조절 | 강박, 우울 |

> `play_therapy` 고유효과: 라포 쌓기 ×1.3 (최적 매칭 없음, 보조만)

#### 핵심 메커니즘
- **부모참여도** (0~100): 3단계 UI (적극💚/보통💛/비협조🔴), 자연감소 -3/턴, 면담 AP 2
- **부모 번아웃**: 3턴 연속 참여도 80+ → 추가 감소 -15
- **학교자문** (AP 2): 다음 치료 EM감소 +30%, ADHD는 자연증가 0
- **임상심리사**: 심리검사 → 치료효과 ×1.5 + CBT 보조 +20%
- **지역사회 연계 (택일)**: Wee센터(평판 중심, 3~4명/턴) OR 보호관찰소(골드 중심, 3~5명/턴)
- **센터 특화 (턴 43)**: 외상전문(+25%/-10%) vs 종합(-20% 건설비)
- **위기 대응 프로토콜**: EM≥90 시 3선택지 미니이벤트
- **아동학대 신고의무**: child_trauma 내담자 15% 확률 이벤트
- **위기 기준**: EM≥90 (성인 100보다 민감), 종결: EM≤20 (적극 부모 시 ≤25)
- **무단결석**: 보호관찰소 연계 내담자 30% 확률 치료 불가

#### 해금 순서
| 턴 | 문제영역 | 시설 | 기타 |
|----|---------|------|------|
| 31 | child_anxiety | parent_room | 아동센터 오픈 (온보딩) |
| 32 | — | play_room | 부모참여도 활성화 |
| 33 | adhd | — | 임상심리사 해금 |
| 35 | child_depression, behavior_regulation | group_activity | 학교자문 해금 |
| 38 | — | — | Wee센터 OR 보호관찰소 택일 |
| 40 | child_ocd, child_trauma | exposure_child | — |
| 43 | — | — | 센터 특화 선택 |
| 45 | eating_disorder | nutrition_clinic | — |
| 48 | emotion_crisis | crisis_room | — |

### Stage 3 영유아발달센터 (턴 61~90)

#### 문제영역 (InfantIssue) — 6개 ("발달적 관심영역")
| 코드 | 이름 | 근거 |
|------|------|------|
| `asd_early` | 자폐스펙트럼(조기) | ECT Lv1: 포괄 ABA, ESDM |
| `dev_delay` | 발달지연 | ESDM·DIR/Floortime |
| `attachment` | 애착문제 | RAD/DSED, ABC |
| `sensory` | 감각처리 어려움 | Ayres SI |
| `speech_delay` | 언어발달지연 | 초기 언어중재 |
| `behavioral_infant` | 영유아 행동문제 | PCIT, Triple P |

#### 상담사 전공 (InfantSpecialty) — 5개
| 코드 | 전공명 | 최적(×1.4) | 보조(×1.15) |
|------|--------|-----------|------------|
| `aba` | 응용행동분석 | 자폐, 행동문제 | 발달지연 |
| `developmental` | 발달놀이중재 | 발달지연, 자폐 | 감각, 언어 |
| `attachment_therapy` | 애착중재 | 애착 | 행동, 발달 |
| `sensory_integration` | 감각통합치료 | 감각 | 자폐, 발달 |
| `speech_language` | 언어치료 | 언어지연 | 자폐, 발달 |

#### 핵심 메커니즘
- **발달이정표**: EM 기반 자동 달성 (확률 아님), 프로그레스 바, 달성 시 EM-10+평판+1
- **부모매개 중재**: 모든 치료가 부모 경유, 효과 = 기본 × (참여도/100)
- **골든타임**: 12턴 내 EM≤40 미달 → 치료효과 매 턴 -5% (최대 -50%)
- **바우처 사업**: 4~6명/턴, 양육 스트레스 관리 시스템 (5~8% 발생률)
- **상담실장**: 슈퍼비전 +10%, 사례회의 +15%, 양육 스트레스 자동 해결 70~95%
- **법적 분쟁**: 3턴 해결, 매 턴 골드 -50, 3건 누적 시 바우처 자격 박탈

#### 해금 순서
| 턴 | 문제영역 | 시설 | 기타 |
|----|---------|------|------|
| 61 | dev_delay | infant_play | 영유아센터 오픈 |
| 62 | sensory | sensory_room | 부모코칭 해금 |
| 65 | attachment, speech_delay | parent_coaching | 이정표 활성화 |
| 68 | — | — | 바우처 사업 + 상담실장 해금 |
| 70 | asd_early | language_lab | — |
| 75 | behavioral_infant | structured_teaching | — |

### Cross-Stage 시스템
- **골드/평판 공유**, AP 센터별 독립, 시설/상담사 센터 귀속
- **센터별 운영비**: 아동 30골드/턴, 영유아 25골드/턴
- **연구 시너지**: 3센터 동시 운영 → 치료효과 +10%
- **가족 연계**: 성인 내담자가 아동 부모 → 참여도 +10
- **평판 등급 S (90~100)**: 통합발달치유원, 조기개입 +20%

### 신규 직종
- **임상심리사**: 심리검사(AP 1) → 치료효과 ×1.5. skill별 1~3명/턴
- **상담실장**: 센터당 1명. 슈퍼비전+사례회의+양육 스트레스 자동해결

### 치료 흐름 (3단계 클릭)
- **PatientCard에 "상담하기" + "격려하기" 나란히 표시**
- **격려하기**: 클릭 즉시 실행 (AP 1, 모달 없음)
- **상담하기**: 3단계 모달 → 내담자(자동) → 상담사 선택 → 치료시설 선택
  - Step 1: "치료받을 상담사를 선택해주세요" (매칭 배율 미리보기)
  - Step 2: "치료실을 선택해주세요" (시설별 효과 표시 + "기본 상담" 옵션)
  - Step 3 (집단상담실만): "같이 치료받을 내담자를 선택해주세요" (Lv별 추가 인원)
- **시설 기반 효과**: 선택한 1개 시설 효과만 적용 (층 합산 폐지)
- **시설 없으면** 기본 상담 (EM -8)
- **알림 순서**: 치료 결과 메시지(success) → 층 이동 메시지(info)

### 랜덤 이벤트 시스템
- 턴 종료 시 30% 확률로 이벤트 발생 (튜토리얼 10턴까지는 비활성), 활성 스테이지의 이벤트 풀 통합
- Stage 1: 5종 (보호자 면담, 언론 취재, 상담사 번아웃, 내담자 갈등, 후원금)
- Stage 2: +8종 (학교 교사, 부모 불안, 아동 우정, SNS 비난, 학술 발표, 학대 의심, 센터 특화, 위기 프로토콜)
- Stage 3: +6종 (정부 지원금, 부모 번아웃, 발달검사, 형제 시기, 이정표 축하, 대기 민원)
- 각 이벤트에 2~3개 선택지 (트레이드오프)
- `PendingEvent.context`: 이벤트 발생 시 대상(상담사/내담자)을 미리 결정하여 이름 표시
- **번아웃 이벤트**: 대상 상담사 이름 표시, 특별 휴가 선택 시 `onLeave=true` (다음 턴 상담 불가, 턴 종료 시 자동 복귀)
- **상담사 과로 번아웃**: 한 턴에 2회 이상 상담 → 과로 누적. 2턴 연속 시 경고, 3턴 연속 시 강제 휴가.

### 온보딩/가이드 시스템
- **IntroScreen**: 새 게임 시 4페이지 인트로 (세계관/EM/근거기반치료/센터 성장)
- **컨텍스트 가이드 (GuideModal)**: 12종, 특정 이벤트 최초 발생 시 1회 표시
  - 첫 상담/격려/고용/건설, 첫 적자/사고/종결/층이동, 평판 등급 상승, 해금 안내 3종
  - localStorage `maumteo_guides_seen`에 이력 저장, 새 게임 시 초기화
  - `useGuide()` 훅: 큐 기반으로 다수 가이드 순차 표시

### 업적 시스템
- Stage 1: 10종, Stage 2: 8종, Stage 3: 8종 (총 26종)
- 조건 충족 시 자동 달성 + 토스트 알림
- 보상: 골드, 평판, 영구 AP 보너스

### 평판 등급
| 등급 | 평판 | 이름 | 효과 |
|------|------|------|------|
| F | 0~19 | 무명 상담소 | 내담자 유입 -1 |
| D | 20~39 | 동네 치료실 | 기본 |
| C | 40~59 | 지역 상담센터 | 내담자 유입 +1 |
| B | 60~79 | 유명 치유센터 | 고급 상담사 지원 |
| A | 80~89 | 마음의 등대 | 모든 보너스 |
| **S** | **90~100** | **통합발달치유원** | 조기개입 +20%, 골든타임 +5턴 |

### 경제
- 수입: 내담자 수 × 25 + 평판 보너스 (최소 10골드 보장)
- 고용비: 급여 × 2
- 상담사 treatmentCount 추적 (상세 표시)

## 아키텍처 규칙
- **순수 함수 엔진**: `lib/engine/*.ts`의 모든 함수는 side-effect 없는 순수 함수. localStorage 등 IO는 hooks에서 처리.
- **Zustand 슬라이스 패턴**: `store/slices/*.ts`로 분리, `gameStore.ts`에서 합성.
  - 슬라이스: resource, patient, facility, counselor, turn, ui, event, achievement, **stage, staff, referral**
- **ID 기반 참조**: 내담자/시설/상담사 간 참조는 string ID로만. 객체 참조 금지.
- **컴포넌트 200줄 제한**: 초과 시 즉시 분리. engine/store/types/hooks는 예외.
- **한글 UI**: 모든 사용자 노출 텍스트는 한국어. 용어 규칙 준수.
- **선택적 스토어 구독**: `useGameStore((s) => s.field)` 패턴 사용. 전체 구독 금지.

## 층별 색상 체계
```
basement(거주치료센터):   rose-800 + ▼ 아이콘     (EM 81~100)
diagnostic(집중치료센터): amber-700 + ◆ 아이콘    (EM 61~80)
counseling(심리치료센터): sky-700 + ● 아이콘      (EM 36~60)
insight(심리상담센터):   violet-600 + ★ 아이콘   (EM 16~35)
garden(옥상하늘정원):    teal-600 + ♥ 아이콘     (EM 0~15)
```

아동센터 층 (CSS: --color-floor-{id}):
child_shelter(보호치료센터): red-400 + ▽   (EM 81~100)
child_intensive(집중돌봄센터): orange-400 + ◈ (EM 61~80)
child_care(마음돌봄센터): sky-400 + ○      (EM 41~60)
child_comfort(안심상담실): violet-400 + ◇   (EM 21~40)
child_garden(하늘놀이터): amber-500 + ☀     (EM 0~20)

영유아센터 층 (4층, CSS: --color-floor-{id}):
infant_cocoon(안전한 둥지): purple-300 + ◑   (EM 76~100)
infant_care(발달지원센터): blue-300 + ◎      (EM 51~75)
infant_nurture(따뜻한 돌봄방): rose-300 + ♡  (EM 26~50)
infant_bloom(꽃피는 놀이방): green-300 + ✿   (EM 0~25)
```
- 색상 + 아이콘 + 텍스트 라벨 3중 표시 (접근성)
- EM 그라데이션: red→blue (적녹 대신 적청, 색각 이상 대응)
- `prefers-reduced-motion` 미디어 쿼리 존중

## 테마 시스템
- 다크(등대센터) + 라이트(햇살센터) 듀얼 테마
- CSS 변수 기반 시맨틱 토큰 (`index.css`의 `:root` / `[data-theme="light"]`)
- **컴포넌트에서 하드코딩 색상 금지** — 시맨틱 유틸리티 사용:

| 용도 | 사용할 클래스 | 금지 |
|------|-------------|------|
| 기본 텍스트 | `text-theme-primary` | `text-gray-200`, `text-white` |
| 보조 텍스트 | `text-theme-secondary` | `text-gray-300` |
| 비활성 텍스트 | `text-theme-tertiary` | `text-gray-400`, `text-gray-500` |
| 카드 배경 | `bg-surface-card` | `bg-gray-800` |
| 호버 배경 | `bg-surface-card-hover` | `bg-gray-700` |
| 테두리 | `border-theme-default` | `border-gray-800` |

- `ThemeToggle` 컴포넌트로 전환 (`data-theme` 속성)
- 전환 트랜지션: `.theme-transition` 클래스 (0.3s ease)

## 에셋 시스템 (3스테이지 범용)

### 디렉토리 구조
```
public/assets/
├── characters/
│   ├── patient/              # 성인 8이슈 × 3감정 = 24
│   ├── patient-child/        # 아동 8이슈 × 3감정 = 24
│   ├── patient-infant/       # 영유아 6이슈 × 3감정 = 18
│   ├── counselor/            # 성인 6전공
│   ├── counselor-child/      # 아동 6전공
│   ├── counselor-infant/     # 영유아 5전공
│   ├── npc/                  # 이벤트 NPC 8종
│   └── */poses/              # 치료중/번아웃 포즈
├── facilities/               # 성인 6종 (+ Lv별)
├── facilities-child/         # 아동 6종 (+ Lv별 + interior/)
├── facilities-infant/        # 영유아 5종 (+ Lv별 + interior/)
├── floors/ floors-child/ floors-infant/
├── building/                 # 센터 외관 6등급 (F~S)
├── cutscenes/                # 이벤트/인트로/엔딩/게임오버
├── ui/                       # 업적뱃지 26종 + UI 아이콘
└── audio/{bgm,sfx,ambient}/  # BGM 7 + SFX 12 + 환경음 9
```

### 에셋 레지스트리 (`src/lib/assetMap.ts`)
- **유니온 타입**: `AnyIssue`, `AnySpecialty`, `AnyFacilityType`, `AnyFloorId`
- 스테이지별 서브디렉토리 자동 라우팅 (Set 기반 분기)
- 함수 22개: 내담자/상담사/시설/층/건물/NPC/이벤트/컷씬/업적/UI
- `getFacilityAsset(type, level?)`: 레벨별 에셋 지원
- 이모지 폴백 맵: `ISSUE_EMOJI`, `SPECIALTY_EMOJI`, `FACILITY_EMOJI` (전 스테이지)

### 에셋 프리로딩 (`src/lib/assetPreloader.ts`)
- `preloadImages(srcs)`: 병렬 프리로드
- `prefetchInIdle(srcs)`: `requestIdleCallback` 기반 백그라운드 프리페치
- 로드 실패 시 이모지/그라데이션 폴백 (graceful degradation)

### 스프라이트 애니메이션 (`src/components/shared/SpriteAnimation.tsx`)
- CSS `steps()` 기반 스프라이트시트 재생 (3/4프레임)
- 3단계 폴백: 스프라이트 → 정적 이미지 → 이모지

### 파일명 규칙
- 내담자: `{issue}_{emotion}.webp` (calm/neutral/distress)
- 상담사: `{specialty}.webp`
- 시설: `{type}.webp`, `{type}_lv2.webp`, `{type}_lv3.webp`
- 시설 내부: `interior/{type}_interior.webp`
- 층 배경: `{floorId}.webp`
- 센터 외관: `center_{f|d|c|b|a|s}.webp`
- 업적: `badge_{achievementId}.webp`
- AI 생성: Leonardo.ai / Scenario.com (WebP 포맷)
- 프롬프트 총목록: `asset-prompts.md` (237개, 프로젝트 루트)

## Motion 사용 규칙
```tsx
import { motion, AnimatePresence } from "motion/react";
import { LazyMotion, domAnimation } from "motion/react";
```

## 저장 시스템
- localStorage 사용, 키: `maumteo_save_v1` (v1: 성인만, v2: 다중센터 포함)
- 테마 설정: `maumteo_theme` (light/dark, 게임 세이브와 분리)
- 가이드 이력: `maumteo_guides_seen` (표시된 가이드 ID 배열)
- UI 상태(selectedFloor, activeModal 등)는 저장에서 제외
- history 최근 20턴으로 제한 (5MB 한도)
- 저장 실패 시 try/catch + 알림, 손상된 세이브 자동 삭제
- `repairSaveData()`: 범위 밖 값 자동 clamp (EM, rapport, skill, salary 등)
- 새 게임 리셋: `initNewGame()` → 메뉴에서 접근

## 시스템 안정성
- **ErrorBoundary**: main.tsx에서 App 전체를 래핑. 렌더링 에러 시 복구 UI.
- **엔진 입력 방어**: `clampEM(NaN) → 50`, 수치 방어 가드.
- **게임오버**: 3턴 연속 적자+골드0 → 파산, 한 턴 사고 2건+평판0 → 신뢰 상실.
- **내담자 한도**: `MAX_PATIENTS(15) + 시설수×2`. 초과 시 평판 하락 + 알림.
- **모바일 반응형**: 사이드바 오버레이, TopBar 축약 표시, FloorView 세로 배치.
- **최소 수입 보장**: 10골드 (데스 스파이럴 방지).

## 비주얼/사운드 현황

### 구현 완료
- CSS 글래스모피즘, 층별 글로우 (성인5+아동5+영유아4 = 14종), 위기 펄스 (3초), 카와이 둥근 보정
- SVG 아이콘: 시설 6종 (FacilityIcon), UI 7종 (GameIcons)
- Web Audio API: 절차적 효과음 12종 (기존 7 + 신규 5: milestone, parentMeeting, assessment, stageSwitch, achievement)
- BGM 크로스페이드 루프 재생 시스템 + 환경음 루프 시스템 (audio.ts)
- 볼륨 개별 제어: BGM/SFX/환경음 독립 on/off + 볼륨 슬라이더
- Motion 애니메이션: 내담자 이동 스프링, 리소스 롤링
- Canvas 2D 파티클: 8종 (heal, crisis, milestone, levelup, reputation, parent_active, golden_time, ending)
  - 도형: circle, star (별), heart (하트)
- EventFlash: 화면 플래시 + 셰이크
- 층별 배경 이미지 (FloorBackground, AnyFloorId 지원, 그라데이션 폴백)
- 캐릭터 아바타: AnyIssue 지원 (성인+아동+영유아), 이모지 폴백 맵 내장
- 시설 일러스트: AnyFacilityType 지원, 레벨별 에셋, 17종 색상 폴백
- 스프라이트 애니메이션: CSS steps() 기반 (3/4프레임), SpriteAnimation 컴포넌트
- CSS 키프레임: sprite-4frame, sprite-3frame, float-gentle, sparkle

### 에셋 현황 (265개: 이미지 237 + 오디오 28)
- **에셋 트래커**: `/asset.html` — 실시간 파일 존재 감지, 미리보기, 프롬프트 복사
- **프롬프트**: `asset-prompts.md` — 265개 전체, 평균 440자/개, 스테이지별 스타일 분화
- **스타일 가이드**: 9종 스타일 앵커 (성인/아동/영유아 × 캐릭터/시설/상담사)
- **감정 조명 통일**: calm=teal, neutral=blue-gray, distress=red
- **스테이지 색감**: 성인=어스톤, 아동=밝은파스텔, 영유아=몽환파스텔
- **BGM**: 4분(240초) × 7곡, Suno.ai Tags 포함
- 인프라 코드 완료: 에셋 파일만 배치하면 자동 로드

### 오디오 시스템 (`src/lib/audio.ts`)
- **절차적 SFX 12종**: Web Audio API (외부 파일 없이 동작)
- **BGM 루프**: `playBgm(track)` — AudioBuffer 캐시, 0.5s 크로스페이드
- **환경음 루프**: `playAmbient(track)` — 층별 자동 전환
- **볼륨**: BGM/SFX/환경음 독립 제어, `localStorage maumteo_audio` 영속화
- **자동 전환**: `useAudioManager` 훅 — 센터→BGM, 층→환경음 자동 매핑
- **UI**: `AudioSettings` 컴포넌트 (GameMenu 내 슬라이더 3개)
- **SFX 연결**: achievement(업적), milestone(이정표), stageSwitch(센터전환) 완료
- **미연결**: sfxParentMeeting, sfxAssessment (해당 UI 액션 구현 시 연결 예정)

### 무료 에셋 소스
| 용도 | 도구 | 비용 |
|------|------|------|
| 캐릭터/시설/배경 | Leonardo.ai (Phoenix/DreamShaper) | 무료 150크레딧/일 |
| 스타일 일관성 | Scenario.com | 무료 티어 |
| 업적/아이콘 | Figma + AI 보조 | 무료 |
| BGM 7트랙 (4분) | Suno.ai (AI 작곡) | 무료 티어 |
| SFX 12종 | Mixkit.co / Freesound.org | 무료 상업용 |
| 환경음 9종 | Freesound.org | CC0/CC-BY |
| WebP 변환 | ShareX + cwebp / Squoosh | 무료 |

## 신규 시스템 (2026-03-28 추가)

### 센터장 DNA 리포트 (`src/lib/engine/dnaAnalysis.ts`, `src/components/stage/DnaReport.tsx`)
- 90턴(현재 100턴) 종료 시 플레이 데이터 분석 → 4축 16유형
- 공감(E)/효율(F), 근거주의(V)/다양추구(D), 수호자(G)/도전자(C), 확장형(X)/심화형(S)
- Canvas 1080×960 SNS 카드 자동 생성 + Web Share API
- `ActionStats` (turnSlice), `EventChoiceHistory` (eventSlice) 로 데이터 수집

### 내담자 스토리 시스템 (`src/lib/stories.ts`, `src/data/stories-*.json`)
- 22개 issue × 3단계(1/2/3문장) × 5종류 = 사연 330개, 회복 330개
- 스페셜 감사편지: 22 issue × 5종 = 110개 (400~600자)
- EM 시작값으로 level 결정: ≤55=level1, ≤75=level2, 76+=level3
- seed(내담자 ID) 기반 5종 결정론적 선택 → 같은 issue라도 다른 사연
- 스페셜 편지: level3 내담자 종결 시 50% 확률, TopBar 📜 아이콘 수집, localStorage 저장
- 📜 편지 아이콘은 첫 편지 수신 전까지 숨김, 첫 수신 시 "편지함에 저장됩니다" 안내

### 초보/전문가 모드 (`src/store/slices/uiSlice.ts` displayMode)
- beginner: EM 바 숫자 숨김, 매칭 별(★) 표시, rapport/treatmentCount 숨김
- expert: 모든 수치 표시 (기존 동작)
- TopBar 🔹/📊 토글

### 즉시 피드백
- 격려 시 하트 파티클 (`encourage` 프리셋) + 모바일 진동 (50ms)
- EM 바 신호등 색상: ≤30 초록, ≤60 노랑, ≤80 주황, 81+ 빨강

### 알림 순서 (App.tsx handleEndTurn)
- 종결 시퀀스 (확인 버튼, 자동사라짐 옵션) → 턴 결과 (확인) → 가이드/해금 알림
- postTurnGuidesRef로 콜백 체인, TurnResultOverlay onClose에서 실행
- 시설/문제영역 해금 시 자동 알림 + 건설 버튼 깜박임

### 모바일 터치
- 치료 모달: 모바일에서 바텀시트 (Modal bottomSheet prop)
- 주요 버튼 min-h-[44px]

## 향후 구현사항 (Backlog)

### Sertifier 보안 — 인증서 시스템 개발 시(9월)
- 인증서 발급 API 키가 클라이언트에 노출되면 어뷰징 가능
- **해결**: Cloudflare Workers(서버리스 함수)에 API 키 저장, 클라이언트는 Workers를 호출
- **플로우**: 유저 시험합격 → 토스페이먼츠 결제 → 결제 완료 웹훅 → Cloudflare Worker → 시험 결과 해시 검증 → Sertifier API 호출 → 인증서 URL 반환
- Workers 코드 50줄 수준, 무료 10만 요청/일

### react-window 가상화 — 내담자 50명+ 확장 시
- 현재 MAX_PATIENTS=15로 성능 문제 없음
- 확장팩으로 내담자 수가 늘어나면 PatientList에 react-window 적용
- `npm install react-window @types/react-window`

### 센터장 성향 분석 고도화
- AI(Claude API) 연동으로 플레이 데이터 기반 자연어 리포트 생성
- 금 인증서 AI 채점 서술형과 연동

### 센터장 아바타 시스템
- 게임 시작 시 또는 설정에서 센터장 아바타 생성 (헤어/의상/악세서리 조합)
- 센터 로비에 표시, 이벤트 대화에서 등장
- DNA 리포트 SNS 카드에 센터장 아바타 포함
- 엔딩 4페이지 카드에 아바타 표시
- 인증서에 아바타 인쇄
- 인증서 훈장(금/은/동) 아바타에 표시
- 유료 꾸미기 팩: 특별 의상 세트 (학회 발표 정장, 한복, 화이트 가운 등)
- 센터 인테리어 테마 팩 (북유럽풍, 한옥풍, 미래도시풍)

## QA Gate
각 Step 완료 후 반드시:
1. `npm run build` 성공 확인
2. `tsc --noEmit` 타입 에러 0 확인
3. console.error 0개 확인
4. 반복 가능 오류는 이 파일 또는 memory에 기록
