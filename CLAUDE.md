# MaumTeo (마음터) — Psychological Gravity World

## 프로젝트 개요
성인 심리 상담 센터 경영 시뮬레이션 / 타이쿤 웹 게임.
"마음의 짐이 가벼워질수록 인간은 더 높은 곳으로 올라간다"

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

### 해금 순서
- 턴 1: 우울/불안 + 개인상담실
- 턴 3: 관계/강박 + 집단상담실/노출치료실
- 턴 5: 트라우마/중독 + 마음챙김실/활동치료실
- 턴 7: 정서조절 + 가족상담실
- 턴 10: 정신증

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
- 턴 종료 시 30% 확률로 이벤트 발생 (턴 2부터)
- 5종: 보호자 면담, 언론 취재, 상담사 번아웃, 내담자 갈등, 후원금
- 각 이벤트에 2~3개 선택지 (트레이드오프)
- `PendingEvent.context`: 이벤트 발생 시 대상(상담사/내담자)을 미리 결정하여 이름 표시
- **번아웃 이벤트**: 대상 상담사 이름 표시, 특별 휴가 선택 시 `onLeave=true` (다음 턴 상담 불가, 턴 종료 시 자동 복귀)

### 온보딩/가이드 시스템
- **IntroScreen**: 새 게임 시 4페이지 인트로 (세계관/EM/근거기반치료/센터 성장)
- **컨텍스트 가이드 (GuideModal)**: 12종, 특정 이벤트 최초 발생 시 1회 표시
  - 첫 상담/격려/고용/건설, 첫 적자/사고/종결/층이동, 평판 등급 상승, 해금 안내 3종
  - localStorage `maumteo_guides_seen`에 이력 저장, 새 게임 시 초기화
  - `useGuide()` 훅: 큐 기반으로 다수 가이드 순차 표시

### 업적 시스템
- 10종 업적, 조건 충족 시 자동 달성 + 토스트 알림
- 보상: 골드, 평판, 영구 AP 보너스
- 메뉴에서 업적 목록 확인 가능

### 평판 등급
| 등급 | 평판 | 이름 | 효과 |
|------|------|------|------|
| F | 0~19 | 무명 상담소 | 내담자 유입 -1 |
| D | 20~39 | 동네 치료실 | 기본 |
| C | 40~59 | 지역 상담센터 | 내담자 유입 +1 |
| B | 60~79 | 유명 치유센터 | 고급 상담사 지원 |
| A | 80~100 | 마음의 등대 | 모든 보너스 |

### 경제
- 수입: 내담자 수 × 25 + 평판 보너스 (최소 10골드 보장)
- 고용비: 급여 × 2
- 상담사 treatmentCount 추적 (상세 표시)

## 아키텍처 규칙
- **순수 함수 엔진**: `lib/engine/*.ts`의 모든 함수는 side-effect 없는 순수 함수. localStorage 등 IO는 hooks에서 처리.
- **Zustand 슬라이스 패턴**: `store/slices/*.ts`로 분리, `gameStore.ts`에서 합성.
  - 슬라이스: resource, patient, facility, counselor, turn, ui, event, achievement
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

## 에셋 시스템
- `public/assets/` 하위: characters/patient, characters/counselor, facilities, floors, ui
- `src/lib/assetMap.ts` — 에셋 경로 레지스트리
- 이미지 없으면 자동 플레이스홀더 (이모지/SVG 폴백)
- AI 생성 에셋: Leonardo.ai / Scenario.com (WebP 포맷)
- 파일명 규칙: `{issue}_{emotion}.webp`, `{specialty}.webp`, `{facilityType}.webp`, `{floorId}.webp`

## Motion 사용 규칙
```tsx
import { motion, AnimatePresence } from "motion/react";
import { LazyMotion, domAnimation } from "motion/react";
```

## 저장 시스템
- localStorage 사용, 키: `maumteo_save_v1`
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
- CSS 글래스모피즘, 층별 글로우, 위기 펄스 (3초), 카와이 둥근 보정
- SVG 아이콘: 시설 6종 (FacilityIcon), UI 7종 (GameIcons)
- Web Audio API 절차적 효과음 7종 (audio.ts)
- Motion 애니메이션: 내담자 이동 스프링, 리소스 롤링
- Canvas 2D 파티클: heal(종결), crisis(사고)
- EventFlash: 화면 플래시 + 셰이크
- 층별 배경 이미지 (FloorBackground, 그라데이션 폴백)
- 캐릭터/상담사/시설 아바타 (이미지 or 플레이스홀더 폴백)

### 마스터 플랜 (미구현)
- Phase C: PixiJS 전환 (Phase A + G 검증 후 판단)
  - `pixi.js@^7.4.2` + `@pixi/react@^7.1.2` (React 18 호환)
  - 상세: `~/.claude/plans/delightful-humming-volcano.md`

### 무료 에셋 소스
| 용도 | 소스 | 라이선스 |
|------|------|---------|
| UI 아이콘 | Kenney.nl | CC0 |
| 게임 아이콘 | game-icons.net | CC BY 3.0 |
| 시설 일러스트 | Scenario.com / Leonardo.Ai (AI 생성) | 무료 티어 |
| 효과음 | Mixkit.co | 상업용 무료 |
| BGM | Suno.ai (AI 작곡) | 무료 티어 |

## QA Gate
각 Step 완료 후 반드시:
1. `npm run build` 성공 확인
2. `tsc --noEmit` 타입 에러 0 확인
3. console.error 0개 확인
4. 반복 가능 오류는 이 파일 또는 memory에 기록
