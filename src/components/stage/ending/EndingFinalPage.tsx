/**
 * EndingFinalPage (4/4) — DNA 카드 + 업적 카드 + 스페셜 편지 + 계속/새 게임
 */
import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import type { DnaResult } from "@/lib/engine/dnaAnalysis.ts";
import type { EndingTier } from "@/lib/engine/endingEngine.ts";
import { useGameStore } from "@/store/gameStore.ts";
import { ACHIEVEMENTS } from "@/lib/engine/achievements.ts";
import { CHILD_ACHIEVEMENTS } from "@/lib/engine/childAchievements.ts";
import { INFANT_ACHIEVEMENTS } from "@/lib/engine/infantAchievements.ts";
import { getBuildingAsset } from "@/lib/assetMap.ts";

interface Props {
  dna: DnaResult;
  tier: EndingTier;
  tierTitle: string;
  totalDischarges: number;
  cmsScore: number;
  onContinue: () => void;
  onNewGame: () => void;
}

/** 축 코드별 색상 */
const AXIS_COLORS: Record<string, string> = {
  E: "#4ade80",
  F: "#60a5fa",
  V: "#a78bfa",
  D: "#f472b6",
  G: "#2dd4bf",
  C: "#fb923c",
  X: "#facc15",
  S: "#e879f9",
};

export default function EndingFinalPage({ dna, tier, tierTitle, totalDischarges, cmsScore, onContinue, onNewGame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const achieveCanvasRef = useRef<HTMLCanvasElement>(null);
  const specialLetters = useGameStore((s) => s.specialLetters);
  const unlockedIds = useGameStore((s) => s.unlockedAchievementIds);
  const allAchievements = [...ACHIEVEMENTS, ...CHILD_ACHIEVEMENTS, ...INFANT_ACHIEVEMENTS];

  useEffect(() => {
    if (!canvasRef.current) return;
    drawShareCard(canvasRef.current, dna);
  }, [dna]);

  useEffect(() => {
    if (!achieveCanvasRef.current) return;
    drawAchievementCard(achieveCanvasRef.current, {
      tier, tierTitle, totalDischarges, cmsScore,
      achievedCount: unlockedIds.length,
      totalCount: allAchievements.length,
      dnaCode: dna.typeCode,
      dnaName: dna.typeName,
    });
  }, [tier, tierTitle, totalDischarges, cmsScore, unlockedIds.length, allAchievements.length, dna]);

  const shareCanvas = (canvas: HTMLCanvasElement | null, filename: string, title: string) => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        navigator.share({ title, text: title, files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }, "image/png");
  };

  const handleShare = () => shareCanvas(canvasRef.current, `maumteo-dna-${dna.typeCode}.png`, `나의 센터장 DNA: ${dna.typeCode}`);

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl bg-surface-card p-5">
      {/* DNA 미니 카드 */}
      <motion.div
        className="mb-4 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl font-black tracking-widest">
          {dna.typeCode.split("").map((c, i) => (
            <span key={i} style={{ color: AXIS_COLORS[c] }}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-1 font-bold text-theme-primary">{dna.typeName}</div>
      </motion.div>

      {/* 카드 공유 버튼 */}
      <motion.div
        className="mb-4 flex w-full max-w-xs gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleShare}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-violet-500 hover:to-indigo-500"
        >
          DNA 카드 저장
        </button>
        <button
          onClick={() => shareCanvas(achieveCanvasRef.current, `maumteo-achievement-${tier}.png`, `마음터 ${tierTitle} 달성!`)}
          className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-yellow-500"
        >
          업적 카드 저장
        </button>
      </motion.div>

      {/* 숨겨진 Canvas */}
      <canvas ref={canvasRef} width={540} height={960} className="hidden" />
      <canvas ref={achieveCanvasRef} width={540} height={960} className="hidden" />

      {/* 스페셜 편지 수 */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-theme-tertiary">수집한 스페셜 편지</div>
        <div className="mt-1 text-2xl font-bold text-theme-primary">
          {specialLetters.length}
          <span className="ml-1 text-sm text-theme-tertiary">통</span>
        </div>
      </motion.div>

      {/* 계속/새 게임 버튼 */}
      <motion.div
        className="flex w-full max-w-xs gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onContinue}
          className="flex-1 rounded-lg bg-surface-card-hover px-4 py-3 font-semibold text-theme-primary transition-colors hover:bg-surface-card"
        >
          계속 플레이
        </button>
        <button
          onClick={onNewGame}
          className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
        >
          새 게임
        </button>
      </motion.div>
    </div>
  );
}

/** Canvas에 SNS 카드 그리기 (540x960) */
function drawShareCard(canvas: HTMLCanvasElement, dna: DnaResult) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = 540, H = 960;

  // 배경 그라디언트
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1e1b4b");
  bg.addColorStop(0.5, "#1a2744");
  bg.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 장식 원
  ctx.fillStyle = "rgba(139,92,246,0.1)";
  ctx.beginPath();
  ctx.arc(100, 150, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(59,130,246,0.08)";
  ctx.beginPath();
  ctx.arc(440, 700, 150, 0, Math.PI * 2);
  ctx.fill();

  // 타이틀
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "16px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText("마음터 (MaumTeo)", W / 2, 50);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px 'Malgun Gothic'";
  ctx.fillText("나의 센터장 DNA", W / 2, 85);

  // 유형 코드
  let codeX = W / 2 - 80;
  ctx.font = "bold 60px 'Malgun Gothic'";
  for (const c of dna.typeCode) {
    ctx.fillStyle = AXIS_COLORS[c] ?? "#fff";
    ctx.textAlign = "center";
    ctx.fillText(c, codeX, 170);
    codeX += 54;
  }

  // 유형명
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText(`"${dna.typeName}"`, W / 2, 220);

  // 설명
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "14px 'Malgun Gothic'";
  wrapText(ctx, dna.description, W / 2, 260, W - 60, 20);

  // 4축 바
  const barY = 360;
  dna.axes.forEach((axis, i) => {
    const y = barY + i * 80;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px 'Malgun Gothic'";
    ctx.textAlign = "left";
    ctx.fillText(axis.left, 30, y);
    ctx.textAlign = "right";
    ctx.fillText(axis.right, W - 30, y);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "bold 12px 'Malgun Gothic'";
    ctx.fillText(axis.label, W / 2, y);

    const bx = 30, bw = W - 60, bh = 16, by = y + 8;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, bx, by, bw, bh, 8);
    ctx.fill();
    ctx.fillStyle = AXIS_COLORS[axis.code] ?? "#888";
    roundRect(ctx, bx, by, Math.max(bw * 0.05, bw * axis.score), bh, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(W / 2 - 0.5, by, 1, bh);
  });

  // 상위 퍼센트
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "14px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText(`전국 플레이어 중 상위 ${dna.percentile}%`, W / 2, barY + 340);

  // 하단 CTA
  ctx.fillStyle = "rgba(139,92,246,0.3)";
  roundRect(ctx, 70, H - 80, W - 140, 40, 20);
  ctx.fill();
  ctx.fillStyle = "#c4b5fd";
  ctx.font = "bold 14px 'Malgun Gothic'";
  ctx.fillText("나도 마음터에서 센터장 DNA 확인하기", W / 2, H - 55);

  // 푸터
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "10px 'Malgun Gothic'";
  ctx.fillText(
    "MaumTeo — 근거기반 심리치료센터 경영 시뮬레이션",
    W / 2,
    H - 20,
  );
}

/** 업적 카드 그리기 (540x960) */
interface AchieveCardData {
  tier: EndingTier;
  tierTitle: string;
  totalDischarges: number;
  cmsScore: number;
  achievedCount: number;
  totalCount: number;
  dnaCode: string;
  dnaName: string;
}

const TIER_CARD_COLORS: Record<EndingTier, { bg1: string; bg2: string; accent: string }> = {
  S: { bg1: "#78350f", bg2: "#451a03", accent: "#fbbf24" },
  A: { bg1: "#4c1d95", bg2: "#2e1065", accent: "#a78bfa" },
  B: { bg1: "#0c4a6e", bg2: "#082f49", accent: "#38bdf8" },
  C: { bg1: "#064e3b", bg2: "#022c22", accent: "#34d399" },
  D: { bg1: "#374151", bg2: "#1f2937", accent: "#9ca3af" },
};

function drawAchievementCard(canvas: HTMLCanvasElement, data: AchieveCardData) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = 540, H = 960;
  const colors = TIER_CARD_COLORS[data.tier];

  const drawContent = () => {
    // 헤더
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "14px 'Malgun Gothic'";
    ctx.textAlign = "center";
    ctx.fillText("마음터 (MaumTeo)", W / 2, 45);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px 'Malgun Gothic'";
    ctx.fillText("업적 카드", W / 2, 80);

    ctx.fillStyle = colors.accent;
    ctx.font = "bold 36px 'Malgun Gothic'";
    ctx.fillText(data.tierTitle, W / 2, 310);
  };

  // 배경
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, colors.bg1);
  bg.addColorStop(1, colors.bg2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 장식 원
  ctx.fillStyle = colors.accent + "15";
  ctx.beginPath(); ctx.arc(430, 120, 150, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = colors.accent + "10";
  ctx.beginPath(); ctx.arc(100, 750, 180, 0, Math.PI * 2); ctx.fill();

  // 건물 이미지 로드 → 중앙 크게 배치
  const buildingGrade = data.tier === "S" ? "A" : data.tier;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const imgW = 200, imgH = 200;
    ctx.drawImage(img, (W - imgW) / 2, 90, imgW, imgH);
    drawContent();
    drawStatsSection(ctx, W, H, data, colors);
  };
  img.onerror = () => {
    // 이미지 없으면 이모지 폴백
    const tierEmoji: Record<EndingTier, string> = { S: "🏛️", A: "🌟", B: "🌱", C: "🏠", D: "🕯️" };
    ctx.font = "60px 'Malgun Gothic'";
    ctx.textAlign = "center";
    ctx.fillText(tierEmoji[data.tier], W / 2, 200);
    drawContent();
    drawStatsSection(ctx, W, H, data, colors);
  };
  img.src = getBuildingAsset(buildingGrade);
}

function drawStatsSection(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  data: AchieveCardData,
  colors: { accent: string },
) {
  const stats = [
    { label: "치유한 내담자", value: `${data.totalDischarges}명` },
    { label: "CMS 점수", value: `${data.cmsScore}/1000` },
    { label: "업적 달성", value: `${data.achievedCount}/${data.totalCount}` },
    { label: "센터장 DNA", value: `${data.dnaCode} (${data.dnaName})` },
  ];

  const boxY = 360;
  stats.forEach((st, i) => {
    const y = boxY + i * 80;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, 40, y, W - 80, 65, 12);
    ctx.fill();
    ctx.strokeStyle = colors.accent + "40";
    ctx.lineWidth = 1;
    roundRect(ctx, 40, y, W - 80, 65, 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "13px 'Malgun Gothic'";
    ctx.textAlign = "left";
    ctx.fillText(st.label, 65, y + 26);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px 'Malgun Gothic'";
    ctx.textAlign = "right";
    ctx.fillText(st.value, W - 65, y + 50);
  });

  // 업적 프로그레스 바
  const barY = boxY + stats.length * 80 + 20;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "13px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText("업적 달성률", W / 2, barY);
  const ratio = data.totalCount > 0 ? data.achievedCount / data.totalCount : 0;
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundRect(ctx, 60, barY + 10, W - 120, 20, 10);
  ctx.fill();
  ctx.fillStyle = colors.accent;
  roundRect(ctx, 60, barY + 10, Math.max(20, (W - 120) * ratio), 20, 10);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px 'Malgun Gothic'";
  ctx.fillText(`${Math.round(ratio * 100)}%`, W / 2, barY + 25);

  // 하단 CTA
  ctx.fillStyle = colors.accent + "30";
  roundRect(ctx, 70, H - 80, W - 140, 40, 20);
  ctx.fill();
  ctx.fillStyle = colors.accent;
  ctx.font = "bold 14px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText("나도 마음터에서 도전하기", W / 2, H - 55);

  // 푸터
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "10px 'Malgun Gothic'";
  ctx.fillText("MaumTeo — 근거기반 심리치료센터 경영 시뮬레이션", W / 2, H - 20);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = text.split("");
  let line = "";
  let curY = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, curY);
      line = ch;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}
