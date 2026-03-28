import { useEffect, useState, useCallback, useRef } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { useGameActions } from "@/hooks/useGameActions.ts";
import type { TreatResult } from "@/hooks/useGameActions.ts";
import { useSave, initNewGame } from "@/hooks/useSave.ts";
import { useGuide } from "@/hooks/useGuide.ts";
import { useAudioManager } from "@/hooks/useAudioManager.ts";
import { sfxClick, sfxTurnAdvance, sfxTreatComplete, sfxDischarge, sfxCrisis, sfxBuild, sfxHire, sfxAchievement, sfxMilestone, loadAudioSettings, stopAll } from "@/lib/audio.ts";
import { calculateEndingData } from "@/lib/engine/endingEngine.ts";
import type { EndingData } from "@/lib/engine/endingEngine.ts";
import { getReputationGrade, FACILITY_TEMPLATES, ISSUE_CONFIG } from "@/lib/constants.ts";
import GameLayout from "@/components/layout/GameLayout.tsx";
import FloorView from "@/components/floor/FloorView.tsx";
import TreatAction from "@/components/action/TreatAction.tsx";
import BuildAction from "@/components/action/BuildAction.tsx";
import HireAction from "@/components/action/HireAction.tsx";
import TurnResultOverlay from "@/components/turn/TurnResultOverlay.tsx";
import TurnLog from "@/components/turn/TurnLog.tsx";
import StatsDashboard from "@/components/stats/StatsDashboard.tsx";
import DischargeSequence from "@/components/patient/DischargeSequence.tsx";
import IntroScreen from "@/components/onboarding/IntroScreen.tsx";
import GuideModal from "@/components/onboarding/GuideModal.tsx";
import NotificationToast from "@/components/shared/NotificationToast.tsx";
import TreatFeedback from "@/components/shared/TreatFeedback.tsx";
import GameMenu from "@/components/shared/GameMenu.tsx";
import GameOverScreen from "@/components/shared/GameOverScreen.tsx";
import EventModal from "@/components/event/EventModal.tsx";
import AchievementToast from "@/components/shared/AchievementToast.tsx";
import AchievementList from "@/components/shared/AchievementList.tsx";
import { rollForEvent, getSpecialEvent } from "@/lib/engine/events.ts";
import { checkAchievements } from "@/lib/engine/achievements.ts";
import type { AchievementDef } from "@/types/index.ts";
import ParticleCanvas from "@/components/effects/ParticleCanvas.tsx";
import EventFlash from "@/components/effects/EventFlash.tsx";
import EndingScreen from "@/components/stage/EndingScreen.tsx";
import CrisisHelpPopup from "@/components/stage/CrisisHelpPopup.tsx";
import DelegationReportModal from "@/components/stage/DelegationReportModal.tsx";
import SpecialLetterModal from "@/components/shared/SpecialLetterModal.tsx";
import { getSpecialLetter, hasSpecialLetter } from "@/lib/stories.ts";
import { ENDING_A_TURN, ENDING_S_TURN, CHILD_STAGE_OPEN_TURN, INFANT_STAGE_OPEN_TURN } from "@/lib/constants/crossStageConstants.ts";
import { getTutorialConfig, isTutorialTurn } from "@/lib/tutorialConfig.ts";
import { getDebugTurn, applyDebugScenario } from "@/lib/debugScenarios.ts";
import type { ParticleEmission } from "@/components/effects/ParticleCanvas.tsx";
import type { TurnEvent, Patient, FacilityType } from "@/types/index.ts";

export default function App() {
  const { save, load, reset, hasSave } = useSave();
  const { treat, build, hire, encourage, upgrade, demolish, fire } = useGameActions();
  const { currentGuide, showGuide, dismissGuide, resetGuides } = useGuide();
  useAudioManager();
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const initialized = useRef(false);

  const [turnResult, setTurnResult] = useState<{
    turn: number;
    events: TurnEvent[];
  } | null>(null);
  const [dischargeItems, setDischargeItems] = useState<
    Array<{ patient: Patient; message: string }>
  >([]);
  const [showIntro, setShowIntro] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [gameOver, setGameOver] = useState<{ reason: string; turn: number } | null>(null);
  const [buildSlot, setBuildSlot] = useState(0);
  const [treatFeedback, setTreatFeedback] = useState<TreatResult | null>(null);
  const [achievementToast, setAchievementToast] = useState<AchievementDef | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [particleEmission, setParticleEmission] = useState<ParticleEmission | null>(null);
  const [flashType, setFlashType] = useState<"heal" | "crisis" | null>(null);
  const [endingType, setEndingType] = useState<"A" | "S" | null>(null);
  const [showCrisisHelp, setShowCrisisHelp] = useState(false);
  const feedbackCounter = useRef(0);
  const prevGradeRef = useRef<string | null>(null);
  const endingShownRef = useRef<Set<string>>(new Set());
  const pendingEndingRef = useRef<"A" | "S" | null>(null);
  const endingDataRef = useRef<EndingData | null>(null);
  const postTurnGuidesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadAudioSettings();

    // 디버그 모드: ?debug=30 또는 ?debug=60
    const debugTurn = getDebugTurn();
    if (debugTurn) {
      applyDebugScenario(debugTurn);
      return;
    }

    const loaded = load();
    if (!loaded) {
      initNewGame();
      setShowIntro(true);
    }
    // 초기 평판 등급 기록
    const rep = useGameStore.getState().reputation;
    prevGradeRef.current = getReputationGrade(rep).grade;
  }, [load]);

  // 할 수 있는 행동이 없을 때 안내 (턴 1 전용, 이후에는 표시하지 않음)
  const checkNothingToDo = useCallback(() => {
    const s = useGameStore.getState();
    if (s.currentTurn > 2) return; // 턴 1~2에서만 안내
    const ap = s.activeStage === "child" && s.childStage ? s.childStage.ap
      : s.activeStage === "infant" && s.infantStage ? s.infantStage.ap : s.ap;
    const patients = s.activeStage === "child" && s.childStage
      ? Object.values(s.childStage.patients)
      : s.activeStage === "infant" && s.infantStage
        ? Object.values(s.infantStage.patients)
        : Object.values(s.patients);
    const canTreat = ap >= 2 && patients.length > 0;
    const canEncourage = ap >= 1 && patients.length > 0;
    const canBuild = ap >= 3 && s.gold >= 100;
    const canHire = ap >= 2 && s.gold >= 40;
    if (!canTreat && !canEncourage && !canBuild && !canHire) {
      setTimeout(() => showGuide("tutorial_end_turn"), 500);
    }
  }, [showGuide]);

  const handleEndTurn = useCallback(() => {
    sfxTurnAdvance();
    const prevRep = useGameStore.getState().reputation;
    const prevGrade = getReputationGrade(prevRep).grade;

    // 아동/영유아 내담자를 advanceTurn 전에 캡처 (종결자 비교용)
    const prevState = useGameStore.getState();
    const prevChildPatients = prevState.childStage?.patients ?? {};
    const prevInfantPatients = prevState.infantStage?.patients ?? {};

    const result = useGameStore.getState().advanceTurn();
    save();

    if (result.isGameOver && result.gameOverReason) {
      sfxCrisis();
      setGameOver({ reason: result.gameOverReason, turn: result.currentTurn - 1 });
      return;
    }

    // 사고 발생 시 위기 경보
    const hasIncident = result.events.some((e) => e.type === "incident");
    if (hasIncident) {
      sfxCrisis();
      setParticleEmission({ preset: "crisis", x: 0.5, y: 0.3 });
      setFlashType("crisis");
      showGuide("first_incident");
    }

    // 적자 체크
    const incomeEv = result.events.find((e) => e.type === "income");
    const upkeepEv = result.events.find((e) => e.type === "upkeep");
    if (incomeEv && upkeepEv && incomeEv.type === "income" && upkeepEv.type === "upkeep") {
      if (upkeepEv.amount > incomeEv.amount) {
        showGuide("first_deficit");
      }
    }

    // 층 이동 가이드
    if (result.events.some((e) => e.type === "floor_move")) {
      showGuide("first_floor_move");
    }

    // 턴 후 가이드/알림을 지연 표시하는 함수 (종결 완료 후 또는 바로)
    const turn = result.currentTurn;
    const prevTurn = turn - 1;
    const showPostTurnGuides = () => {
      setTimeout(() => {
        const { addNotification } = useGameStore.getState();
        // 튜토리얼 2턴: 상담사 도착 알림
        if (turn === 2) addNotification("김마음 상담사가 센터에 합류했습니다!", "success");

        const tutGuideConfig = getTutorialConfig(turn);
        if (tutGuideConfig.guideId) showGuide(tutGuideConfig.guideId);

        if (turn === 13) showGuide("unlock_diagnostic");
        if (turn === 15) showGuide("unlock_basement");
        if (turn === 18) showGuide("unlock_upper");

        for (const [, tpl] of Object.entries(FACILITY_TEMPLATES)) {
          if (tpl.unlockTurn === turn && tpl.unlockTurn > prevTurn) {
            addNotification(`새 시설 해금: ${tpl.label} (건설 비용 ${tpl.buildCost}G)`, "info");
          }
        }
        for (const [, cfg] of Object.entries(ISSUE_CONFIG)) {
          if (cfg.unlockTurn === turn && cfg.unlockTurn > prevTurn) {
            addNotification(`새 문제영역 해금: ${cfg.label}`, "info");
          }
        }
      }, 500);
    };

    // 스페셜 편지 체크 함수
    const trySpecialLetter = (issue: string, name: string, backstory: string, treatmentCount: number): boolean => {
      const isLevel3 = backstory.length >= 80;
      if (isLevel3 && hasSpecialLetter(issue) && Math.random() < 0.5) {
        const letter = getSpecialLetter(issue, treatmentCount);
        if (letter) {
          useGameStore.getState().setPendingSpecialLetter({
            id: `sl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            issue, patientName: name, letter, turn: prevTurn,
          });
          return true;
        }
      }
      return false;
    };

    // 종결자 처리
    if (result.dischargedPatients.length > 0) {
      sfxDischarge();
      setParticleEmission({ preset: "heal", x: 0.5, y: 0.4 });
      setFlashType("heal");
      setDischargeItems(result.dischargedPatients);
      // 가이드/알림은 종결 시퀀스 완료 후 표시 (handleDischargeComplete → showPostTurnGuides)
      postTurnGuidesRef.current = showPostTurnGuides;

      // 스페셜 편지 체크 (종결 시퀀스와 별도)
      let letterSent = false;
      for (const dp of result.dischargedPatients) {
        if (letterSent) break;
        letterSent = trySpecialLetter(dp.patient.dominantIssue, dp.patient.name, dp.patient.backstory, dp.patient.treatmentCount);
      }
      if (!letterSent) {
        const curChildPatients = useGameStore.getState().childStage?.patients ?? {};
        for (const [id, patient] of Object.entries(prevChildPatients)) {
          if (letterSent) break;
          if (!curChildPatients[id]) {
            letterSent = trySpecialLetter(patient.dominantIssue, patient.name, patient.backstory, patient.treatmentCount);
          }
        }
      }
      if (!letterSent) {
        const curInfantPatients = useGameStore.getState().infantStage?.patients ?? {};
        for (const [id, patient] of Object.entries(prevInfantPatients)) {
          if (letterSent) break;
          if (!curInfantPatients[id]) {
            letterSent = trySpecialLetter(patient.dominantIssue, patient.name, patient.backstory, patient.treatmentCount);
          }
        }
      }
    } else {
      setTurnResult({ turn: prevTurn, events: result.events });
      postTurnGuidesRef.current = showPostTurnGuides; // TurnResult 닫힌 후 실행
    }

    // Stage 오픈 안내 (오픈 턴 직후)
    if (turn === CHILD_STAGE_OPEN_TURN) showGuide("child_stage_open");
    if (turn === INFANT_STAGE_OPEN_TURN) showGuide("infant_stage_open");

    // 평판 등급 변화 체크
    const newRep = useGameStore.getState().reputation;
    const newGrade = getReputationGrade(newRep).grade;
    if (newGrade !== prevGrade && newRep > prevRep) {
      showGuide("grade_up");
    }
    prevGradeRef.current = newGrade;

    // ── 엔딩 체크 (턴 결과 확인 후 표시하기 위해 지연) ──
    const computeEnding = (eType: "A" | "S") => {
      const es = useGameStore.getState();
      endingDataRef.current = calculateEndingData(
        eType,
        {
          reputation: es.reputation,
          gold: es.gold,
          counselors: es.counselors,
          facilities: es.facilities,
          patients: es.patients,
          childStage: es.childStage,
          infantStage: es.infantStage,
        },
        es.lifetimeStats,
        es.actionStats,
        es.eventChoiceHistory,
        es.unlockedAchievementIds.length,
      );
    };
    if (result.currentTurn === ENDING_A_TURN + 1 && !endingShownRef.current.has("A")) {
      endingShownRef.current.add("A");
      pendingEndingRef.current = "A";
      computeEnding("A");
    }
    if (result.currentTurn === ENDING_S_TURN + 1 && !endingShownRef.current.has("S")) {
      endingShownRef.current.add("S");
      pendingEndingRef.current = "S";
      computeEnding("S");
    }

    // ── Stage 특수 이벤트 트리거 ──
    const storeForStage = useGameStore.getState();
    // 턴 43: center_specialization (아동센터 특화 방향)
    if (result.currentTurn === 43 && storeForStage.childStage && !storeForStage.childStage.specialization) {
      const specEvent = getSpecialEvent("center_specialization");
      if (specEvent) {
        storeForStage.setPendingEvent({ event: specEvent, turn: result.currentTurn });
      }
    }

    // 아동 내담자 EM >= 90 위기 시 crisis_protocol 이벤트 + 위기 도움 팝업
    if (storeForStage.childStage) {
      const childIncident = Object.values(storeForStage.childStage.patients).some(
        (p) => p.em >= 90,
      );
      if (childIncident) {
        const crisisEvent = getSpecialEvent("crisis_protocol");
        if (crisisEvent && !storeForStage.pendingEvent) {
          storeForStage.setPendingEvent({ event: crisisEvent, turn: result.currentTurn });
        }
        setShowCrisisHelp(true);
      }
    }

    // 이벤트 롤 (튜토리얼 중에는 이벤트 비활성)
    const hasChild = storeForStage.childStage !== null;
    const hasInfant = storeForStage.infantStage !== null;
    const event = isTutorialTurn(result.currentTurn) ? null : rollForEvent(result.currentTurn, undefined, hasChild, hasInfant);
    if (event) {
      const storeNow = useGameStore.getState();
      const pending: import("@/types/index.ts").PendingEvent = { event: { ...event }, turn: result.currentTurn };

      // 번아웃 이벤트: 대상 상담사 미리 결정
      if (event.id === "counselor_burnout") {
        const cList = Object.values(storeNow.counselors).filter((c) => !c.onLeave);
        if (cList.length > 0) {
          const target = cList[Math.floor(Math.random() * cList.length)]!;
          pending.context = { targetCounselorId: target.id, targetCounselorName: target.name };
          pending.event = {
            ...event,
            description: `${target.name} 상담사가 과로 증세를 보이고 있습니다. 어떻게 대처하시겠습니까?`,
          };
        } else {
          // 상담사가 없으면 이벤트 무효
          useGameStore.getState().setPendingEvent(null);
        }
      }

      // 내담자 갈등 이벤트: 대상 내담자 미리 결정
      if (event.id === "patient_conflict") {
        const pList = Object.values(storeNow.patients);
        if (pList.length >= 2) {
          const target = pList[Math.floor(Math.random() * pList.length)]!;
          pending.context = { targetPatientId: target.id, targetPatientName: target.name };
        }
      }

      if (pending.event) {
        storeNow.setPendingEvent(pending);
      }
    }

    // 영유아 이정표 달성 SFX (턴 처리 후 알림에서 감지)
    const storeAfterTurn = useGameStore.getState();
    if (storeAfterTurn.infantStage) {
      const hasMilestone = Object.values(storeAfterTurn.infantStage.patients).some(
        (p) => p.milestones?.some((m) => m.achieved && m.achievedTurn === result.currentTurn),
      );
      if (hasMilestone) {
        sfxMilestone();
        setParticleEmission({ preset: "milestone", x: 0.5, y: 0.3 });
      }
    }

    // 업적 체크
    const store = useGameStore.getState();
    const newAchievements = checkAchievements(
      store as unknown as import("@/types/index.ts").GameState,
      store.unlockedAchievementIds,
    );
    for (const a of newAchievements) {
      store.unlockAchievement(a.id);
      if (a.reward.type === "gold") {
        useGameStore.setState((s) => ({ gold: s.gold + a.reward.value }));
      } else if (a.reward.type === "reputation") {
        useGameStore.setState((s) => ({ reputation: Math.min(100, s.reputation + a.reward.value) }));
      } else if (a.reward.type === "ap_permanent") {
        useGameStore.getState().addApBonus(a.reward.value);
      }
    }
    if (newAchievements.length > 0) {
      sfxAchievement();
      setParticleEmission({ preset: "reputation", x: 0.5, y: 0.2 });
      setAchievementToast(newAchievements[0]!);
    }
  }, [save, showGuide]);

  const handleDischargeComplete = useCallback(() => {
    setDischargeItems([]);
    const lastLog = useGameStore.getState().turnLog;
    if (lastLog.length > 0) {
      const entry = lastLog[lastLog.length - 1]!;
      setTurnResult({ turn: entry.turn, events: entry.events });
    }
    // 종결 시퀀스 완료 후 가이드/알림 표시
    if (postTurnGuidesRef.current) {
      postTurnGuidesRef.current();
      postTurnGuidesRef.current = null;
    }
    showGuide("first_discharge");
  }, [showGuide]);

  const [treatPatientId, setTreatPatientId] = useState<string | null>(null);

  const handleTreat = useCallback(
    (patientId: string, counselorId?: string, facilityId?: string, groupPatientIds?: string[]) => {
      const result = treat(patientId, counselorId, facilityId, groupPatientIds);
      if (result && result.success) {
        sfxTreatComplete();
        feedbackCounter.current += 1;
        setTreatFeedback(result);
        showGuide("first_treat");

        // 1) 치료 결과 메시지 (먼저)
        const parts = [result.patientName];
        if (result.groupResults && result.groupResults.length > 0) {
          parts.push(...result.groupResults.map((g) => g.name));
        }
        const names = parts.join(", ");
        const facilityText = result.facilityLabel ? ` ${result.facilityLabel}에서` : "";
        const counselorText = result.counselorName ? ` ${result.counselorName} 상담사와` : "";
        useGameStore.getState().addNotification(
          `${names} 내담자가${counselorText}${facilityText} 치료를 받았습니다 (EM ${result.emBefore}→${Math.round(result.emAfter)})`,
          "success",
        );

        // 2) 층 이동 메시지 (치료 결과 다음에)
        if (result.floorChanged && result.newFloorLabel) {
          useGameStore.getState().addNotification(
            `${result.patientName}이(가) ${result.newFloorLabel}(으)로 이동합니다`,
            "info",
          );
        }
        checkNothingToDo();
      }
    },
    [treat, showGuide, checkNothingToDo],
  );

  const handleOpenTreat = useCallback((patientId: string) => {
    setTreatPatientId(patientId);
    useGameStore.getState().openModal("treat");
  }, []);

  const handleEncourage = useCallback(
    (patientId: string) => {
      const result = encourage(patientId);
      if (result && result.success) {
        sfxClick();
        feedbackCounter.current += 1;
        setTreatFeedback(result);
        showGuide("first_encourage");
        checkNothingToDo();
      }
    },
    [encourage, showGuide, checkNothingToDo],
  );

  const handleUpgrade = useCallback(
    (facilityId: string) => {
      upgrade(facilityId);
    },
    [upgrade],
  );

  const handleBuild = useCallback(
    (type: FacilityType) => {
      const ok = build(type, buildSlot);
      if (ok) {
        sfxBuild();
        showGuide("first_build");
      }
    },
    [build, buildSlot, showGuide],
  );

  const handleBuildSlot = useCallback((slotIndex: number) => {
    setBuildSlot(slotIndex);
    useGameStore.getState().openModal("build");
  }, []);

  const handleHire = useCallback(
    (name: string, specialty: string, skill: number, salary: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ok = hire(name, specialty as any, skill, salary);
      if (ok) {
        sfxHire();
        showGuide("first_hire");
      }
    },
    [hire, showGuide],
  );

  const handleNewGame = useCallback(() => {
    stopAll();
    reset();
    resetGuides();
    setShowMenu(false);
    setTurnResult(null);
    setDischargeItems([]);
    setGameOver(null);
    setTreatFeedback(null);
    setBuildSlot(0);
    setEndingType(null);
    setShowCrisisHelp(false);
    endingShownRef.current.clear();
    endingDataRef.current = null;
    setShowIntro(true);
  }, [reset, resetGuides]);

  // 인트로 화면
  if (showIntro) {
    return (
      <LazyMotion features={domAnimation}>
        <IntroScreen onStart={() => { setShowIntro(false); showGuide("tut_welcome"); }} />
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <GameLayout onEndTurn={handleEndTurn} onOpenMenu={() => setShowMenu(true)}>
        <FloorView
          onTreat={handleOpenTreat}
          onEncourage={handleEncourage}
          onBuild={handleBuildSlot}
          onUpgrade={handleUpgrade}
          onDemolish={demolish}
          onFire={fire}
        />
        <TurnLog />
        <StatsDashboard />
      </GameLayout>

      <TreatAction
        open={activeModal === "treat"}
        onClose={() => { closeModal(); setTreatPatientId(null); }}
        preselectedPatientId={treatPatientId ?? undefined}
        onTreat={handleTreat}
      />
      <BuildAction
        open={activeModal === "build"}
        onClose={closeModal}
        onBuild={handleBuild}
      />
      <HireAction
        open={activeModal === "hire"}
        onClose={closeModal}
        onHire={handleHire}
      />

      {turnResult && (
        <TurnResultOverlay
          open
          turn={turnResult.turn}
          events={turnResult.events}
          onClose={() => {
            setTurnResult(null);
            // 턴 결과 확인 후 → 가이드/알림 표시 → 엔딩
            if (postTurnGuidesRef.current) {
              postTurnGuidesRef.current();
              postTurnGuidesRef.current = null;
            }
            if (pendingEndingRef.current) {
              setEndingType(pendingEndingRef.current);
              pendingEndingRef.current = null;
            }
          }}
        />
      )}

      {dischargeItems.length > 0 && (
        <DischargeSequence
          items={dischargeItems}
          onComplete={handleDischargeComplete}
        />
      )}

      {treatFeedback && (
        <TreatFeedback
          key={feedbackCounter.current}
          id={String(feedbackCounter.current)}
          emDelta={treatFeedback.emDelta}
          patientName={treatFeedback.patientName}
          actionType={treatFeedback.actionType}
        />
      )}

      {showMenu && (
        <GameMenu
          onClose={() => setShowMenu(false)}
          onNewGame={handleNewGame}
          onSave={() => { save(); setShowMenu(false); }}
          onShowAchievements={() => setShowAchievements(true)}
          hasSave={hasSave()}
        />
      )}

      {gameOver && (
        <GameOverScreen
          reason={gameOver.reason}
          turn={gameOver.turn}
          onNewGame={handleNewGame}
        />
      )}

      {endingType && endingDataRef.current && (
        <EndingScreen
          endingData={endingDataRef.current}
          onContinue={() => setEndingType(null)}
          onNewGame={handleNewGame}
        />
      )}

      {showCrisisHelp && <CrisisHelpPopup onClose={() => setShowCrisisHelp(false)} />}
      <DelegationReportModal />
      <SpecialLetterModal />

      <EventModal />
      <GuideModal guide={currentGuide} onDismiss={dismissGuide} />
      <AchievementToast achievement={achievementToast} onDone={() => setAchievementToast(null)} />
      <AchievementList open={showAchievements} onClose={() => setShowAchievements(false)} />
      <NotificationToast />
      <EventFlash type={flashType} onComplete={() => setFlashType(null)} />
      <ParticleCanvas
        emission={particleEmission}
        onComplete={() => setParticleEmission(null)}
      />
    </LazyMotion>
  );
}
