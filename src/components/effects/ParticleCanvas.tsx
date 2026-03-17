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
}

type ParticlePreset = "heal" | "crisis";

const PRESETS: Record<ParticlePreset, {
  count: number;
  color: () => string;
  speed: () => number;
  size: () => number;
  life: () => number;
  gravity: number;
}> = {
  heal: {
    count: 25,
    color: () => {
      const hue = 160 + Math.random() * 40; // teal~green
      return `hsl(${hue}, 70%, 70%)`;
    },
    speed: () => 0.3 + Math.random() * 0.8,
    size: () => 2 + Math.random() * 3,
    life: () => 60 + Math.random() * 40,
    gravity: -0.01, // 위로 떠오름
  },
  crisis: {
    count: 15,
    color: () => {
      const hue = Math.random() * 20; // red~orange
      return `hsl(${hue}, 80%, 55%)`;
    },
    speed: () => 0.5 + Math.random() * 1.2,
    size: () => 1.5 + Math.random() * 2,
    life: () => 40 + Math.random() * 30,
    gravity: 0.02, // 아래로 떨어짐
  },
};

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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
        ctx.fill();
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
