import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { analyzeDna } from "@/lib/engine/dnaAnalysis.ts";
import type { DnaResult } from "@/lib/engine/dnaAnalysis.ts";
import { useGameStore } from "@/store/gameStore.ts";

interface DnaReportProps {
  onClose: () => void;
}

/** 축 코드별 색상 */
const AXIS_COLORS: Record<string, string> = {
  E: "#4ade80", F: "#60a5fa",
  V: "#a78bfa", D: "#f472b6",
  G: "#2dd4bf", C: "#fb923c",
  X: "#facc15", S: "#e879f9",
};

export default function DnaReport({ onClose }: DnaReportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dna, setDna] = useState<DnaResult | null>(null);

  const actionStats = useGameStore((s) => s.actionStats);
  const eventHistory = useGameStore((s) => s.eventChoiceHistory);
  const reputation = useGameStore((s) => s.reputation);
  const turnLog = useGameStore((s) => s.turnLog);

  useEffect(() => {
    // turnLog에서 종결/사고 카운트
    let discharges = 0;
    let incidents = 0;
    for (const entry of turnLog) {
      for (const ev of entry.events) {
        if (ev.type === "discharge") discharges++;
        if (ev.type === "incident") incidents++;
      }
    }

    const result = analyzeDna(actionStats, eventHistory, discharges, incidents, reputation);
    setDna(result);
  }, [actionStats, eventHistory, reputation, turnLog]);

  useEffect(() => {
    if (!dna || !canvasRef.current) return;
    drawCard(canvasRef.current, dna);
  }, [dna]);

  if (!dna) return null;

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "maumteo-dna.png")] })) {
        navigator.share({
          title: `나의 센터장 DNA: ${dna.typeCode}`,
          text: `나는 "${dna.typeName}" 유형! 마음터에서 확인해보세요`,
          files: [new File([blob], "maumteo-dna.png", { type: "image/png" })],
        });
      } else {
        const link = document.createElement("a");
        link.download = `maumteo-dna-${dna.typeCode}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }, "image/png");
  };

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
        className="bg-surface-card rounded-xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-theme-primary text-lg font-bold text-center mb-3">
          나의 센터장 DNA
        </h2>

        {/* 유형 코드 */}
        <div className="text-center mb-3">
          <div className="text-3xl font-black tracking-widest mb-1">
            {dna.typeCode.split("").map((c, i) => (
              <span key={i} style={{ color: AXIS_COLORS[c] }}>{c}</span>
            ))}
          </div>
          <div className="text-theme-primary font-bold text-lg">{dna.typeName}</div>
          <div className="text-theme-secondary text-sm mt-1">{dna.description}</div>
          <div className="text-theme-tertiary text-xs mt-2">전국 플레이어 중 상위 {dna.percentile}%</div>
        </div>

        {/* 4축 바 */}
        <div className="space-y-2 mb-4">
          {dna.axes.map((axis, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs text-theme-tertiary mb-0.5">
                <span>{axis.left}</span>
                <span className="text-theme-secondary font-medium">{axis.label}</span>
                <span>{axis.right}</span>
              </div>
              <div className="h-3 bg-surface-card-hover rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-700"
                  style={{
                    left: 0,
                    width: `${Math.max(5, axis.score * 100)}%`,
                    background: AXIS_COLORS[axis.code],
                    opacity: 0.8,
                  }}
                />
                <div className="absolute top-0 left-1/2 w-px h-full bg-theme-tertiary/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Canvas (SNS 공유용 이미지) */}
        <canvas
          ref={canvasRef}
          width={540}
          height={960}
          className="hidden"
        />

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors"
          >
            SNS 공유 / 저장
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-surface-card-hover text-theme-secondary font-bold text-sm transition-colors hover:text-theme-primary"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Canvas에 SNS 카드 그리기 (540×960, 인스타 스토리 비율) */
function drawCard(canvas: HTMLCanvasElement, dna: DnaResult) {
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
  ctx.beginPath(); ctx.arc(100, 150, 120, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(59,130,246,0.08)";
  ctx.beginPath(); ctx.arc(440, 700, 150, 0, Math.PI * 2); ctx.fill();

  // 타이틀
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "16px 'Malgun Gothic'";
  ctx.textAlign = "center";
  ctx.fillText("마음터 (MaumTeo)", W / 2, 50);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px 'Malgun Gothic'";
  ctx.fillText("나의 센터장 DNA", W / 2, 85);

  // 유형 코드 (큰 글씨, 색상)
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

    // 바 배경
    const bx = 30, bw = W - 60, bh = 16, by = y + 8;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, bx, by, bw, bh, 8);
    ctx.fill();

    // 바 채움
    ctx.fillStyle = AXIS_COLORS[axis.code] ?? "#888";
    const fw = Math.max(bw * 0.05, bw * axis.score);
    roundRect(ctx, bx, by, fw, bh, 8);
    ctx.fill();

    // 중앙선
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
  ctx.fillText("MaumTeo — 근거기반 심리치료센터 경영 시뮬레이션", W / 2, H - 20);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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
