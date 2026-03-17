import { useEffect, useState, useCallback, useRef } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { useGameActions } from "@/hooks/useGameActions.ts";
import type { TreatResult } from "@/hooks/useGameActions.ts";
import { useSave, initNewGame } from "@/hooks/useSave.ts";
import { useGuide } from "@/hooks/useGuide.ts";
import { sfxClick, sfxTurnAdvance, sfxTreatComplete, sfxDischarge, sfxCrisis, sfxBuild, sfxHire } from "@/lib/audio.ts";
import { getReputationGrade } from "@/lib/constants.ts";
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
import { rollForEvent } from "@/lib/engine/events.ts";
import { checkAchievements } from "@/lib/engine/achievements.ts";
import type { AchievementDef } from "@/types/index.ts";
import ParticleCanvas from "@/components/effects/ParticleCanvas.tsx";
import EventFlash from "@/components/effects/EventFlash.tsx";
import type { ParticleEmission } from "@/components/effects/ParticleCanvas.tsx";
import type { TurnEvent, Patient, FacilityType } from "@/types/index.ts";

export default function App() {
  const { save, load, reset, hasSave } = useSave();
  const { treat, build, hire, encourage, upgrade, fire } = useGameActions();
  const { currentGuide, showGuide, dismissGuide, resetGuides } = useGuide();
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
  const feedbackCounter = useRef(0);
  const prevGradeRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loaded = load();
    if (!loaded) {
      initNewGame();
      setShowIntro(true);
    }
    // 초기 평판 등급 기록
    const rep = useGameStore.getState().reputation;
    prevGradeRef.current = getReputationGrade(rep).grade;
  }, [load]);

  const handleEndTurn = useCallback(() => {
    sfxTurnAdvance();
    const prevRep = useGameStore.getState().reputation;
    const prevGrade = getReputationGrade(prevRep).grade;

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

    // 종결 가이드
    if (result.dischargedPatients.length > 0) {
      sfxDischarge();
      setParticleEmission({ preset: "heal", x: 0.5, y: 0.4 });
      setFlashType("heal");
      setDischargeItems(result.dischargedPatients);
      showGuide("first_discharge");
    } else {
      setTurnResult({ turn: result.currentTurn - 1, events: result.events });
    }

    // 해금 안내 (기존 튜토리얼 대체)
    const turn = result.currentTurn;
    if (turn === 3) showGuide("unlock_diagnostic");
    if (turn === 5) showGuide("unlock_basement");
    if (turn === 8) showGuide("unlock_upper");

    // 평판 등급 변화 체크
    const newRep = useGameStore.getState().reputation;
    const newGrade = getReputationGrade(newRep).grade;
    if (newGrade !== prevGrade && newRep > prevRep) {
      showGuide("grade_up");
    }
    prevGradeRef.current = newGrade;

    // 이벤트 롤
    const event = rollForEvent(result.currentTurn);
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
  }, []);

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
      }
    },
    [treat, showGuide],
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
      }
    },
    [encourage, showGuide],
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
    (name: string, specialty: Parameters<typeof hire>[1], skill: number, salary: number) => {
      const ok = hire(name, specialty, skill, salary);
      if (ok) {
        sfxHire();
        showGuide("first_hire");
      }
    },
    [hire, showGuide],
  );

  const handleNewGame = useCallback(() => {
    reset();
    resetGuides();
    setShowMenu(false);
    setTurnResult(null);
    setDischargeItems([]);
    setGameOver(null);
    setTreatFeedback(null);
    setBuildSlot(0);
    setShowIntro(true);
  }, [reset, resetGuides]);

  // 인트로 화면
  if (showIntro) {
    return (
      <LazyMotion features={domAnimation}>
        <IntroScreen onStart={() => setShowIntro(false)} />
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
          onClose={() => setTurnResult(null)}
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
