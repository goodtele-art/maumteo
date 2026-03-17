/**
 * 절차적 효과음 시스템 (Web Audio API)
 * 외부 파일 불필요 — 코드로 합성
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  ramp: "up" | "down" | "peak" = "down",
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0;

  const now = c.currentTime;
  if (ramp === "down") {
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else if (ramp === "up") {
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else {
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  }

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration);
}

/** 클릭/선택 — 짧은 틱 */
export function sfxClick() {
  playTone(800, 0.08, "sine", 0.1);
}

/** 턴 진행 — 상승 두 음 */
export function sfxTurnAdvance() {
  playTone(440, 0.15, "triangle", 0.12);
  setTimeout(() => playTone(660, 0.2, "triangle", 0.12), 100);
}

/** 상담 완료 — 부드러운 벨 */
export function sfxTreatComplete() {
  playTone(523, 0.3, "sine", 0.1);
  setTimeout(() => playTone(659, 0.25, "sine", 0.08), 120);
}

/** 퇴원 팡파레 — 밝은 3화음 */
export function sfxDischarge() {
  playTone(523, 0.4, "triangle", 0.1, "peak");
  setTimeout(() => playTone(659, 0.35, "triangle", 0.1, "peak"), 100);
  setTimeout(() => playTone(784, 0.5, "triangle", 0.12, "peak"), 200);
}

/** 위기 경보 — 낮은 경고음 */
export function sfxCrisis() {
  playTone(220, 0.4, "sawtooth", 0.08, "peak");
  setTimeout(() => playTone(196, 0.5, "sawtooth", 0.06, "peak"), 300);
}

/** 건설 완료 — 짧은 해머 사운드 */
export function sfxBuild() {
  playTone(300, 0.1, "square", 0.08);
  setTimeout(() => playTone(500, 0.2, "triangle", 0.1), 80);
}

/** 고용 — 환영 차임 */
export function sfxHire() {
  playTone(392, 0.2, "sine", 0.1);
  setTimeout(() => playTone(523, 0.3, "sine", 0.1), 150);
}
