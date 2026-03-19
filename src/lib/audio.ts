/**
 * 오디오 시스템 (Web Audio API)
 * - 절차적 효과음 합성 (기존)
 * - BGM 루프 재생 + 크로스페이드 전환
 * - SFX 파일 재생 (외부 파일 있으면 우선, 없으면 합성 폴백)
 * - 환경음 루프
 * - 볼륨 개별 제어
 */

const BASE = import.meta.env.BASE_URL;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// ── 볼륨 설정 ──

let bgmVolume = 0.3;
let sfxVolume = 0.5;
let ambientVolume = 0.2;
let bgmEnabled = true;
let sfxEnabled = true;
let ambientEnabled = true;

export function setBgmVolume(v: number) { bgmVolume = Math.max(0, Math.min(1, v)); updateBgmGain(); }
export function setSfxVolume(v: number) { sfxVolume = Math.max(0, Math.min(1, v)); }
export function setAmbientVolume(v: number) { ambientVolume = Math.max(0, Math.min(1, v)); updateAmbientGain(); }
export function toggleBgm(on?: boolean) { bgmEnabled = on ?? !bgmEnabled; updateBgmGain(); }
export function toggleSfx(on?: boolean) { sfxEnabled = on ?? !sfxEnabled; }
export function toggleAmbient(on?: boolean) { ambientEnabled = on ?? !ambientEnabled; updateAmbientGain(); }
export function getAudioSettings() {
  return { bgmVolume, sfxVolume, ambientVolume, bgmEnabled, sfxEnabled, ambientEnabled };
}

// ── 절차적 효과음 합성 ──

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  ramp: "up" | "down" | "peak" = "down",
) {
  if (!sfxEnabled) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0;

  const now = c.currentTime;
  const vol = volume * sfxVolume;
  if (ramp === "down") {
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else if (ramp === "up") {
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + duration * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else {
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + duration * 0.3);
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

/** 이정표 달성 — 반짝이는 상승 음 */
export function sfxMilestone() {
  playTone(784, 0.4, "sine", 0.12, "peak");
  setTimeout(() => playTone(988, 0.5, "sine", 0.12, "peak"), 150);
  setTimeout(() => playTone(1175, 0.6, "sine", 0.1, "peak"), 300);
}

/** 부모면담/코칭 — 따뜻한 두 음 */
export function sfxParentMeeting() {
  playTone(330, 0.2, "sine", 0.08);
  setTimeout(() => playTone(440, 0.3, "sine", 0.1), 100);
}

/** 심리검사 — 쓰는 소리 흉내 */
export function sfxAssessment() {
  playTone(600, 0.1, "triangle", 0.06);
  setTimeout(() => playTone(700, 0.08, "triangle", 0.06), 80);
  setTimeout(() => playTone(650, 0.1, "triangle", 0.06), 160);
}

/** 센터 전환 — 엘리베이터 톤 */
export function sfxStageSwitch() {
  playTone(262, 0.15, "sine", 0.1);
  setTimeout(() => playTone(330, 0.15, "sine", 0.1), 100);
  setTimeout(() => playTone(392, 0.15, "sine", 0.1), 200);
  setTimeout(() => playTone(523, 0.3, "sine", 0.12), 300);
}

/** 업적 달성 — 화려한 팡파레 */
export function sfxAchievement() {
  playTone(523, 0.2, "triangle", 0.1, "peak");
  setTimeout(() => playTone(659, 0.2, "triangle", 0.1, "peak"), 80);
  setTimeout(() => playTone(784, 0.2, "triangle", 0.1, "peak"), 160);
  setTimeout(() => playTone(1047, 0.5, "triangle", 0.14, "peak"), 240);
}

// ── BGM 루프 재생 시스템 ──

let currentBgm: { source: AudioBufferSourceNode; gain: GainNode; track: string } | null = null;
const bgmCache = new Map<string, AudioBuffer>();

function updateBgmGain() {
  if (currentBgm) {
    currentBgm.gain.gain.value = bgmEnabled ? bgmVolume : 0;
  }
}

async function loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
  if (bgmCache.has(url)) return bgmCache.get(url)!;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await getCtx().decodeAudioData(await res.arrayBuffer());
    bgmCache.set(url, buf);
    return buf;
  } catch {
    return null;
  }
}

/** BGM 트랙 재생 (크로스페이드 전환) */
export async function playBgm(track: string): Promise<void> {
  if (!bgmEnabled) return;
  const url = `${BASE}assets/audio/bgm/${track}`;

  // 같은 트랙이면 무시
  if (currentBgm?.track === track) return;

  const buffer = await loadAudioBuffer(url);
  if (!buffer) return; // 파일 없으면 조용히 실패

  const c = getCtx();

  // 기존 BGM 페이드아웃
  if (currentBgm) {
    const oldGain = currentBgm.gain;
    const oldSource = currentBgm.source;
    oldGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
    setTimeout(() => {
      try { oldSource.stop(); } catch { /* 이미 정지 */ }
    }, 600);
  }

  // 새 BGM 페이드인
  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(bgmVolume, c.currentTime + 0.5);
  source.connect(gain).connect(c.destination);
  source.start();

  currentBgm = { source, gain, track };
}

/** BGM 정지 */
export function stopBgm(): void {
  if (!currentBgm) return;
  const c = getCtx();
  currentBgm.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
  const src = currentBgm.source;
  setTimeout(() => { try { src.stop(); } catch { /* ok */ } }, 400);
  currentBgm = null;
}

// ── 환경음 루프 시스템 ──

let currentAmbient: { source: AudioBufferSourceNode; gain: GainNode; track: string } | null = null;

function updateAmbientGain() {
  if (currentAmbient) {
    currentAmbient.gain.gain.value = ambientEnabled ? ambientVolume : 0;
  }
}

/** 환경음 재생 */
export async function playAmbient(track: string): Promise<void> {
  if (!ambientEnabled) return;
  const url = `${BASE}assets/audio/ambient/${track}`;

  if (currentAmbient?.track === track) return;

  const buffer = await loadAudioBuffer(url);
  if (!buffer) return;

  const c = getCtx();

  if (currentAmbient) {
    const oldGain = currentAmbient.gain;
    const oldSource = currentAmbient.source;
    oldGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
    setTimeout(() => { try { oldSource.stop(); } catch { /* ok */ } }, 600);
  }

  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(ambientVolume, c.currentTime + 0.5);
  source.connect(gain).connect(c.destination);
  source.start();

  currentAmbient = { source, gain, track };
}

/** 환경음 정지 */
export function stopAmbient(): void {
  if (!currentAmbient) return;
  const c = getCtx();
  currentAmbient.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
  const src = currentAmbient.source;
  setTimeout(() => { try { src.stop(); } catch { /* ok */ } }, 400);
  currentAmbient = null;
}

/** 모든 오디오 정지 (게임 종료/리셋 시) */
export function stopAll(): void {
  stopBgm();
  stopAmbient();
}
