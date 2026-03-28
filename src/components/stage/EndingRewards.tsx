/**
 * 엔딩 보상 3종 — 센터 스냅샷 / 감사편지 / 상담사 콜렉션
 */
import { useState } from "react";
import { motion } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { getExtendedReputationGrade } from "@/lib/constants/crossStageConstants.ts";
import { SPECIALTY_CONFIG } from "@/lib/constants.ts";
import { CHILD_SPECIALTY_CONFIG } from "@/lib/constants/childConstants.ts";
import { INFANT_SPECIALTY_CONFIG } from "@/lib/constants/infantConstants.ts";

interface Props {
  onClose: () => void;
}

type Tab = "snapshot" | "letters" | "collection";

const TABS: { id: Tab; label: string }[] = [
  { id: "snapshot", label: "센터 완성" },
  { id: "letters", label: "감사편지" },
  { id: "collection", label: "상담사 콜렉션" },
];

const THANK_YOU: Record<string, string> = {
  depression: "우울의 안개가 걷혔어요. 감사합니다.",
  anxiety: "더 이상 불안에 떨지 않아요.",
  relationship: "사람들과의 관계가 따뜻해졌어요.",
  obsession: "강박에서 벗어나 자유로워졌어요.",
  trauma: "아픈 기억을 마주할 용기가 생겼어요.",
  addiction: "새로운 삶을 시작합니다.",
  personality: "감정을 조절하는 법을 배웠어요.",
  psychosis: "세상이 다시 선명해졌어요.",
};

function getSpecialtyLabel(specialty: string): string {
  const adult = SPECIALTY_CONFIG[specialty as keyof typeof SPECIALTY_CONFIG];
  if (adult) return adult.label;
  const child = CHILD_SPECIALTY_CONFIG[specialty as keyof typeof CHILD_SPECIALTY_CONFIG];
  if (child) return child.label;
  const infant = INFANT_SPECIALTY_CONFIG[specialty as keyof typeof INFANT_SPECIALTY_CONFIG];
  if (infant) return infant.label;
  return specialty;
}

function SnapshotTab() {
  const reputation = useGameStore((s) => s.reputation);
  const counselors = useGameStore((s) => s.counselors);
  const facilities = useGameStore((s) => s.facilities);
  const turnLog = useGameStore((s) => s.turnLog);
  const childStage = useGameStore((s) => s.childStage);
  const infantStage = useGameStore((s) => s.infantStage);

  const grade = getExtendedReputationGrade(reputation);
  const counselorCount =
    Object.keys(counselors).length +
    Object.keys(childStage?.counselors ?? {}).length +
    Object.keys(infantStage?.counselors ?? {}).length;
  const facilityCount =
    Object.keys(facilities).length +
    Object.keys(childStage?.facilities ?? {}).length +
    Object.keys(infantStage?.facilities ?? {}).length;

  let discharges = 0;
  for (const entry of turnLog) {
    for (const ev of entry.events) {
      if (ev.type === "discharge") discharges++;
    }
  }

  const stats = [
    { label: "평판 등급", value: `${grade.grade} (${grade.label})` },
    { label: "총 상담사", value: `${counselorCount}명` },
    { label: "총 시설", value: `${facilityCount}개` },
    { label: "종결 내담자", value: `${discharges}명` },
  ];

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-theme-secondary">
        당신의 센터가 이만큼 성장했습니다
      </p>
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-between rounded-lg bg-surface-card-hover px-4 py-3"
        >
          <span className="text-theme-secondary">{s.label}</span>
          <span className="font-bold text-theme-primary">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

function LettersTab() {
  const turnLog = useGameStore((s) => s.turnLog);

  let discharges = 0;
  for (const entry of turnLog) {
    for (const ev of entry.events) {
      if (ev.type === "discharge") discharges++;
    }
  }

  const messages = Object.entries(THANK_YOU);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-theme-secondary">
        종결된 내담자 {discharges}명이 보내온 감사편지
      </p>
      <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
        {messages.map(([issue, msg]) => (
          <motion.div
            key={issue}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg border border-theme-default bg-surface-card px-4 py-3"
          >
            <p className="text-sm italic text-theme-primary">"{msg}"</p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg border border-theme-default bg-surface-card px-4 py-3"
        >
          <p className="text-sm italic text-theme-primary">
            "밝은 미래가 기다리고 있어요."
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function CollectionTab() {
  const counselors = useGameStore((s) => s.counselors);
  const childCounselors = useGameStore((s) => s.childStage?.counselors);
  const infantCounselors = useGameStore((s) => s.infantStage?.counselors);

  const all = [
    ...Object.values(counselors),
    ...Object.values(childCounselors ?? {}),
    ...Object.values(infantCounselors ?? {}),
  ];

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-theme-secondary">
        함께한 상담사 {all.length}명
      </p>
      <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
        {all.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-lg border border-theme-default bg-surface-card px-4 py-3"
          >
            <div>
              <p className="font-semibold text-theme-primary">{c.name}</p>
              <p className="text-xs text-theme-secondary">
                {getSpecialtyLabel(c.specialty)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-theme-primary">
                Lv.{c.skill}
              </p>
              <p className="text-xs text-theme-tertiary">
                상담 {c.treatmentCount}회
              </p>
            </div>
          </motion.div>
        ))}
        {all.length === 0 && (
          <p className="py-4 text-center text-sm text-theme-tertiary">
            고용된 상담사가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}

export default function EndingRewards({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("snapshot");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md rounded-xl bg-surface-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center text-lg font-bold text-theme-primary">
          엔딩 보상
        </h2>

        {/* 탭 */}
        <div className="mb-4 flex gap-1 rounded-lg bg-surface-card-hover p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "bg-violet-600 text-white"
                  : "text-theme-secondary hover:text-theme-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {tab === "snapshot" && <SnapshotTab />}
        {tab === "letters" && <LettersTab />}
        {tab === "collection" && <CollectionTab />}

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-surface-card-hover py-2.5 text-sm font-bold text-theme-secondary transition-colors hover:text-theme-primary"
        >
          닫기
        </button>
      </motion.div>
    </motion.div>
  );
}
