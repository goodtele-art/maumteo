import { useRef, useEffect, useCallback } from "react";

/** 파티클 하나 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  shape?: "circle" | "star" | "heart";
}

export type ParticlePreset =
  | "heal"
  | "crisis"
  | "milestone"
  | "levelup"
  | "reputation"
  | "parent_active"
  | "golden_time"
  | "ending"
  | "encourage";

interface PresetConfig {
  count: number;
  color: () => string;
  speed: () => number;
  size: () => number;
  life: () => number;
  gravity: number;
  shape?: "circle" | "star" | "heart";
}

const PRESETS: Record<ParticlePreset, PresetConfig> = {
  heal: {
    count: 25,
    color: () => `hsl(${160 + Math.random() * 40}, 70%, 70%)`,
    speed: () => 0.3 + Math.random() * 0.8,
    size: () => 2 + Math.random() * 3,
    life: () => 60 + Math.random() * 40,
    gravity: -0.01,
  },
  crisis: {
    count: 15,
    color: () => `hsl(${Math.random() * 20}, 80%, 55%)`,
    speed: () => 0.5 + Math.random() * 1.2,
    size: () => 1.5 + Math.random() * 2,
    life: () => 40 + Math.random() * 30,
    gravity: 0.02,
  },
  milestone: {
    count: 30,
    color: () => `hsl(${40 + Math.random() * 20}, 90%, ${60 + Math.random() * 20}%)`,
    speed: () => 0.5 + Math.random() * 1.5,
    size: () => 2 + Math.random() * 4,
    life: () => 80 + Math.random() * 40,
    gravity: -0.015,
    shape: "star",
  },
  levelup: {
    count: 20,
    color: () => `hsl(${200 + Math.random() * 30}, 80%, 65%)`,
    speed: () => 0.4 + Math.random() * 1.0,
    size: () => 2 + Math.random() * 3,
    life: () => 60 + Math.random() * 30,
    gravity: -0.02,
  },
  reputation: {
    count: 25,
    color: () => `hsl(${270 + Math.random() * 30}, 70%, 70%)`,
    speed: () => 0.3 + Math.random() * 0.9,
    size: () => 2 + Math.random() * 3,
    life: () => 70 + Math.random() * 40,
    gravity: -0.01,
    shape: "star",
  },
  parent_active: {
    count: 15,
    color: () => `hsl(${130 + Math.random() * 30}, 60%, 60%)`,
    speed: () => 0.3 + Math.random() * 0.6,
    size: () => 3 + Math.random() * 3,
    life: () => 50 + Math.random() * 30,
    gravity: -0.01,
    shape: "heart",
  },
  golden_time: {
    count: 35,
    color: () => `hsl(${45 + Math.random() * 10}, 95%, ${55 + Math.random() * 15}%)`,
    speed: () => 0.8 + Math.random() * 1.5,
    size: () => 2 + Math.random() * 4,
    life: () => 90 + Math.random() * 50,
    gravity: -0.008,
    shape: "star",
  },
  ending: {
    count: 60,
    color: () => `hsl(${Math.random() * 360}, 80%, 65%)`,
    speed: () => 1.0 + Math.random() * 2.5,
    size: () => 2 + Math.random() * 5,
    life: () => 100 + Math.random() * 60,
    gravity: 0.01,
    shape: "star",
  },
  encourage: {
    count: 20,
    color: () => `hsl(${340 + Math.random() * 30}, 75%, ${65 + Math.random() * 15}%)`,
    speed: () => 0.3 + Math.random() * 0.7,
    size: () => 3 + Math.random() * 3,
    life: () => 60 + Math.random() * 30,
    gravity: -0.02,
    shape: "heart",
  },
};

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const method = i === 0 ? "moveTo" : "lineTo";
    ctx[method](x + r * Math.cos(angle), y + r * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.3);
  ctx.bezierCurveTo(x - r, y - r * 0.5, x - r * 0.5, y - r, x, y - r * 0.4);
  ctx.bezierCurveTo(x + r * 0.5, y - r, x + r, y - r * 0.5, x, y + r * 0.3);
  ctx.fill();
}

export interface ParticleEmission {
  preset: ParticlePreset;
  x: number; // 0~1 비율
  y: number; // 0~1 비율
}

interface ParticleCanvasProps {
  emission: ParticleEmission | null;
  onComplete?: () => void;
}

export default function ParticleCanvas({ emission, onComplete }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const emissionRef = useRef<ParticleEmission | null>(null);

  const spawn = useCallback((e: ParticleEmission, canvas: HTMLCanvasElement) => {
    const preset = PRESETS[e.preset];
    const cx = e.x * canvas.width;
    const cy = e.y * canvas.height;

    for (let i = 0; i < preset.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = preset.speed();
      const life = preset.life();
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: preset.size(),
        color: preset.color(),
        alpha: 1,
        shape: preset.shape,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        const preset = emissionRef.current ? PRESETS[emissionRef.current.preset] : PRESETS.heal;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += preset.gravity;
        p.life--;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fillStyle = p.color;

        const drawSize = p.size * p.alpha;
        if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, drawSize * 1.5);
        } else if (p.shape === "heart") {
          drawHeart(ctx, p.x, p.y, drawSize * 2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      if (particles.length === 0 && emissionRef.current) {
        emissionRef.current = null;
        onComplete?.();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [onComplete]);

  // 새 emission이 들어오면 spawn
  useEffect(() => {
    if (!emission || !canvasRef.current) return;
    emissionRef.current = emission;
    spawn(emission, canvasRef.current);
  }, [emission, spawn]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
}
