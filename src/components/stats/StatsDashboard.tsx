import { useMemo, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { useGameStore } from "@/store/gameStore.ts";
import { getReputationGrade, REPUTATION_GRADES } from "@/lib/constants.ts";
import type { TurnLogEntry } from "@/types/index.ts";

interface TurnStat {
  turn: number;
  income: number;
  upkeep: number;
  net: number;
  admissions: number;
  discharges: number;
  incidents: number;
}

function extractStats(turnLog: TurnLogEntry[]): TurnStat[] {
  return turnLog.map((entry) => {
    let income = 0;
    let upkeep = 0;
    let admissions = 0;
    let discharges = 0;
    let incidents = 0;

    for (const ev of entry.events) {
      switch (ev.type) {
        case "income": income = ev.amount; break;
        case "upkeep": upkeep = ev.amount; break;
        case "admission": admissions++; break;
        case "discharge": discharges++; break;
        case "incident": incidents++; break;
      }
    }

    return { turn: entry.turn, income, upkeep, net: income - upkeep, admissions, discharges, incidents };
  });
}

type TabId = "economy" | "patients" | "grade";

export default function StatsDashboard() {
  const turnLog = useGameStore((s) => s.turnLog);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("economy");

  const stats = useMemo(() => extractStats(turnLog), [turnLog]);

  const totals = useMemo(() => {
    let totalIncome = 0;
    let totalUpkeep = 0;
    let totalDischarges = 0;
    let totalIncidents = 0;
    for (const s of stats) {
      totalIncome += s.income;
      totalUpkeep += s.upkeep;
      totalDischarges += s.discharges;
      totalIncidents += s.incidents;
    }
    return { totalIncome, totalUpkeep, totalDischarges, totalIncidents };
  }, [stats]);

  if (stats.length === 0) return null;

  return (
    <div className="glass-card rounded-lg mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-3 text-sm text-theme-tertiary hover:text-theme-primary transition-colors flex items-center justify-between"
      >
        <span>통계</span>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              {/* 탭 */}
              <div className="flex gap-1 mb-3">
                {(["economy", "patients", "grade"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      tab === t
                        ? "bg-sky-900/40 text-sky-300"
                        : "text-theme-tertiary hover:text-theme-primary"
                    }`}
                  >
                    {t === "economy" ? "경제" : t === "patients" ? "내담자" : "등급"}
                  </button>
                ))}
              </div>

              {/* 요약 카드 */}
              {tab !== "grade" && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {tab === "economy" ? (
                    <>
                      <MiniStat label="총 수입" value={totals.totalIncome} color="text-green-400" />
                      <MiniStat label="총 지출" value={totals.totalUpkeep} color="text-red-400" />
                    </>
                  ) : (
                    <>
                      <MiniStat label="총 종결" value={totals.totalDischarges} color="text-teal-400" />
                      <MiniStat label="총 사고" value={totals.totalIncidents} color="text-red-400" />
                    </>
                  )}
                </div>
              )}

              {/* 바 차트 */}
              <div className="space-y-1">
                {tab === "economy" && <EconomyChart stats={stats} />}
                {tab === "patients" && <PatientChart stats={stats} />}
                {tab === "grade" && <GradeProgress />}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-surface-card/30 rounded p-2 text-center">
      <div className="text-xs text-theme-tertiary">{label}</div>
      <div className={`text-sm font-medium ${color}`}>{value}</div>
    </div>
  );
}

function EconomyChart({ stats }: { stats: TurnStat[] }) {
  const recent = stats.slice(-10);
  const maxVal = Math.max(...recent.map((s) => Math.max(s.income, s.upkeep)), 1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 text-xs text-theme-tertiary mb-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> 수입</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> 지출</span>
      </div>
      {recent.map((s) => (
        <div key={s.turn} className="flex items-center gap-2 text-xs">
          <span className="w-6 text-theme-tertiary text-right shrink-0">{s.turn}</span>
          <div className="flex-1 flex flex-col gap-0.5">
            <div
              className="h-2 rounded-sm bg-green-600/70"
              style={{ width: `${(s.income / maxVal) * 100}%` }}
            />
            <div
              className="h-2 rounded-sm bg-red-600/70"
              style={{ width: `${(s.upkeep / maxVal) * 100}%` }}
            />
          </div>
          <span className={`w-10 text-right shrink-0 ${s.net >= 0 ? "text-green-400" : "text-red-400"}`}>
            {s.net >= 0 ? "+" : ""}{s.net}
          </span>
        </div>
      ))}
    </div>
  );
}

function PatientChart({ stats }: { stats: TurnStat[] }) {
  const recent = stats.slice(-10);
  const maxVal = Math.max(...recent.map((s) => Math.max(s.admissions, s.discharges, s.incidents)), 1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 text-xs text-theme-tertiary mb-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block" /> 시작</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-500 inline-block" /> 종결</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> 사고</span>
      </div>
      {recent.map((s) => (
        <div key={s.turn} className="flex items-center gap-2 text-xs">
          <span className="w-6 text-theme-tertiary text-right shrink-0">{s.turn}</span>
          <div className="flex-1 flex gap-1">
            {s.admissions > 0 && (
              <div
                className="h-3 rounded-sm bg-blue-600/70"
                style={{ width: `${(s.admissions / maxVal) * 100}%` }}
                title={`시작 ${s.admissions}`}
              />
            )}
            {s.discharges > 0 && (
              <div
                className="h-3 rounded-sm bg-teal-600/70"
                style={{ width: `${(s.discharges / maxVal) * 100}%` }}
                title={`종결 ${s.discharges}`}
              />
            )}
            {s.incidents > 0 && (
              <div
                className="h-3 rounded-sm bg-red-600/70"
                style={{ width: `${(s.incidents / maxVal) * 100}%` }}
                title={`사고 ${s.incidents}`}
              />
            )}
          </div>
          <span className="w-12 text-right text-theme-tertiary shrink-0">
            {s.admissions}/{s.discharges}/{s.incidents}
          </span>
        </div>
      ))}
    </div>
  );
}

function GradeProgress() {
  const reputation = useGameStore((s) => s.reputation);
  const current = getReputationGrade(reputation);

  return (
    <div className="space-y-2">
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-yellow-400">{current.grade}</div>
        <div className="text-sm text-theme-secondary">{current.label}</div>
        <div className="text-xs text-theme-tertiary mt-1">평판 {reputation} / 100</div>
      </div>

      <div className="relative h-6 bg-surface-card rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${reputation}%` }}
        />
        {REPUTATION_GRADES.slice(0, -1).map((g) => (
          <div
            key={g.grade}
            className="absolute inset-y-0 w-px bg-surface-base/70"
            style={{ left: `${g.max + 1}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-xs text-theme-tertiary px-1">
        {REPUTATION_GRADES.map((g) => (
          <span
            key={g.grade}
            className={g.grade === current.grade ? "text-yellow-400 font-medium" : ""}
          >
            {g.grade}
          </span>
        ))}
      </div>

      {current.max < 100 && (
        <div className="text-xs text-theme-tertiary text-center mt-2">
          다음 등급까지 평판 {current.max + 1 - reputation} 필요
        </div>
      )}
    </div>
  );
}
