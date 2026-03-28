/**
 * 절차적 BGM 합성 (Web Audio API)
 * 외부 파일 없이 7개 트랙을 실시간 합성
 *
 * 트랙: main_theme, adult_ambient, child_playful,
 *       infant_gentle, crisis_tension, ending_hope, gameover_sad
 */

// ── 음계 주파수 ──

const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00,
  Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  Gb4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.26, F5: 698.46, G5: 783.99,
  A5: 880.00, B5: 987.77, C6: 1046.50, D6: 1174.66, E6: 1318.51,
};

// ── 악기 합성 ──

interface InstrumentOpts {
  ctx: AudioContext;
  dest: AudioNode;
  freq: number;
  time: number;
  duration: number;
  volume: number;
}

/** 피아노: triangle + 고조파, 빠른 어택 + 지수적 감쇠 */
function piano(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "triangle";
  osc.frequency.value = freq;
  osc2.type = "sine";
  osc2.frequency.value = freq * 2;

  filter.type = "lowpass";
  filter.frequency.value = Math.min(freq * 6, 8000);
  filter.Q.value = 1;

  const v = volume * 0.7;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(v, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(v * 0.4, time + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + duration);
  osc2.start(time);
  osc2.stop(time + duration);
}

/** 스트링 패드: sawtooth 필터링, 느린 어택 + 서스테인 */
function stringPad(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.value = freq;
  osc2.type = "sawtooth";
  osc2.frequency.value = freq * 1.003; // 약간의 디튜닝으로 따뜻함

  filter.type = "lowpass";
  filter.frequency.value = Math.min(freq * 3, 4000);
  filter.Q.value = 0.7;

  const v = volume * 0.35;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(v, time + duration * 0.25);
  gain.gain.setValueAtTime(v, time + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + duration + 0.1);
  osc2.start(time);
  osc2.stop(time + duration + 0.1);
}

/** 오르골/뮤직박스: sine, 즉각 어택 + 빠른 감쇠 */
function musicBox(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  const v = volume * 0.5;
  gain.gain.setValueAtTime(v, time);
  gain.gain.exponentialRampToValueAtTime(v * 0.15, time + duration * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + duration);
}

/** 마림바: sine + triangle, 밝은 타격감 */
function marimba(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;
  osc2.type = "triangle";
  osc2.frequency.value = freq * 4; // 고조파

  const v = volume * 0.45;
  gain.gain.setValueAtTime(v, time);
  gain.gain.exponentialRampToValueAtTime(v * 0.1, time + duration * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + duration);
  osc2.start(time);
  osc2.stop(time + duration);
}

/** 깊은 베이스: triangle, 낮은 주파수 */
function deepBass(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  const v = volume * 0.5;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(v, time + 0.02);
  gain.gain.setValueAtTime(v, time + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + duration);
}

/** 트레몰로 스트링: 위기용 떨리는 현악 */
function tremoloString(o: InstrumentOpts) {
  const { ctx, dest, freq, time, duration, volume } = o;
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.value = freq;

  lfo.type = "sine";
  lfo.frequency.value = 8; // 트레몰로 속도
  lfoGain.gain.value = volume * 0.15;

  filter.type = "lowpass";
  filter.frequency.value = freq * 2.5;

  gain.gain.value = volume * 0.2;

  lfo.connect(lfoGain).connect(gain.gain);
  osc.connect(filter).connect(gain).connect(dest);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume * 0.25, time + duration * 0.2);
  gain.gain.setValueAtTime(volume * 0.25, time + duration * 0.8);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.start(time);
  osc.stop(time + duration + 0.1);
  lfo.start(time);
  lfo.stop(time + duration + 0.1);
}

// ── 리버브 생성 ──

function createReverb(ctx: AudioContext, decay = 1.5): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * decay;
  const impulse = ctx.createBuffer(2, length, rate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

// ── 트랙 정의 ──

type ScheduleFn = (ctx: AudioContext, dest: AudioNode, startTime: number, vol: number) => number;

/** 1) 메인 테마 — 90bpm, 피아노+현악, 희망적 */
const scheduleMainTheme: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 90;
  // C - G/B - Am - F - C - G - F - G (8마디, 32박)
  const chords: [string, string, string][] = [
    ["C4", "E4", "G4"],   // C
    ["B3", "D4", "G4"],   // G/B
    ["A3", "C4", "E4"],   // Am
    ["F3", "A3", "C4"],   // F
    ["C4", "E4", "G4"],   // C
    ["G3", "B3", "D4"],   // G
    ["F3", "A3", "C4"],   // F
    ["G3", "B3", "D4"],   // G
  ];

  // 피아노 아르페지오
  const melody: [string, number][] = [
    ["E5", 0], ["G5", 1], ["C5", 2], ["E5", 3],
    ["D5", 4], ["G5", 5], ["B4", 6], ["D5", 7],
    ["C5", 8], ["E5", 9], ["A4", 10], ["C5", 11],
    ["A4", 12], ["C5", 13], ["F4", 14], ["A4", 15],
    ["E5", 16], ["G5", 17], ["C5", 18], ["E5", 19],
    ["D5", 20], ["B4", 21], ["G4", 22], ["D5", 23],
    ["C5", 24], ["A4", 25], ["F4", 26], ["C5", 27],
    ["D5", 28], ["B4", 29], ["G4", 30], ["D5", 31],
  ];

  for (const [note, beatIdx] of melody) {
    piano({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: beat * 1.8, volume: vol * 0.6,
    });
  }

  // 스트링 패드 (마디당)
  for (let i = 0; i < chords.length; i++) {
    for (const note of chords[i]) {
      stringPad({
        ctx, dest, freq: NOTE[note],
        time: t0 + i * 4 * beat,
        duration: 4 * beat * 0.95, volume: vol * 0.3,
      });
    }
  }

  return 32 * beat;
};

/** 2) 성인센터 — 70bpm, Lo-fi 피아노, 재즈 코드 */
const scheduleAdultAmbient: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 70;
  // Ebmaj7 - Cm7 - Abmaj7 - Bb7 (4마디, 16박)
  const chords: [string, string, string, string][] = [
    ["Eb4", "G4", "Bb4", "D5"],   // Ebmaj7
    ["C4", "Eb4", "G4", "Bb4"],   // Cm7
    ["Ab3", "C4", "Eb4", "G4"],   // Abmaj7
    ["Bb3", "D4", "F4", "Ab4"],   // Bb7
  ];

  // Rhodes-like 코드 (피아노 변형)
  for (let i = 0; i < chords.length; i++) {
    for (let j = 0; j < chords[i].length; j++) {
      piano({
        ctx, dest, freq: NOTE[chords[i][j]],
        time: t0 + i * 4 * beat + j * beat * 0.3,
        duration: beat * 3.5, volume: vol * 0.4,
      });
    }
  }

  // 느린 멜로디
  const melody: [string, number, number][] = [
    ["G5", 2, 2], ["F5", 5, 1.5], ["Eb5", 7, 2.5],
    ["G5", 10, 1], ["Bb4", 12, 2], ["C5", 14, 2],
  ];
  for (const [note, beatIdx, dur] of melody) {
    piano({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat, volume: vol * 0.35,
    });
  }

  return 16 * beat;
};

/** 3) 아동센터 — 100bpm, 마림바+밝은 멜로디 */
const scheduleChildPlayful: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 100;
  // G - D - Em - C (4마디)
  const bassNotes: [string, number][] = [
    ["G3", 0], ["D3", 4], ["E3", 8], ["C3", 12],
  ];

  for (const [note, beatIdx] of bassNotes) {
    deepBass({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: beat * 3.5, volume: vol * 0.3,
    });
  }

  // 마림바 멜로디
  const melody: [string, number, number][] = [
    ["G5", 0, 1], ["B4", 0.5, 0.5], ["D5", 1, 1], ["G5", 2, 0.5], ["E5", 2.5, 0.5], ["D5", 3, 1],
    ["D5", 4, 1], ["Gb4", 4.5, 0.5], ["A4", 5, 1], ["D5", 6, 0.5], ["B4", 6.5, 0.5], ["A4", 7, 1],
    ["E5", 8, 1], ["G5", 9, 0.5], ["B4", 9.5, 0.5], ["E5", 10, 1], ["D5", 11, 1],
    ["C5", 12, 1], ["E5", 13, 0.5], ["G4", 13.5, 0.5], ["C5", 14, 1], ["D5", 15, 1],
  ];

  for (const [note, beatIdx, dur] of melody) {
    marimba({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat, volume: vol * 0.55,
    });
  }

  return 16 * beat;
};

/** 4) 영유아센터 — 60bpm, 오르골+하프 */
const scheduleInfantGentle: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 60;
  // F - C/E - Dm - Bb (4마디)

  // 하프 아르페지오
  const harp: [string, number][] = [
    ["F4", 0], ["A4", 0.5], ["C5", 1], ["F5", 1.5],
    ["E4", 4], ["G4", 4.5], ["C5", 5], ["E5", 5.5],
    ["D4", 8], ["F4", 8.5], ["A4", 9], ["D5", 9.5],
    ["Bb3", 12], ["D4", 12.5], ["F4", 13], ["Bb4", 13.5],
  ];

  for (const [note, beatIdx] of harp) {
    musicBox({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: beat * 2.5, volume: vol * 0.4,
    });
  }

  // 오르골 멜로디 (높은 음역)
  const melody: [string, number, number][] = [
    ["C6", 2, 2], ["A5", 3, 1],
    ["G5", 6, 2], ["E5", 7, 1],
    ["F5", 10, 1.5], ["A5", 11, 1],
    ["F5", 14, 2], ["D5", 15, 1],
  ];

  for (const [note, beatIdx, dur] of melody) {
    musicBox({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat, volume: vol * 0.5,
    });
  }

  // 부드러운 패드
  const padNotes: [string, number][] = [
    ["F3", 0], ["C4", 4], ["D3", 8], ["Bb3", 12],
  ];
  for (const [note, beatIdx] of padNotes) {
    stringPad({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: beat * 3.8, volume: vol * 0.15,
    });
  }

  return 16 * beat;
};

/** 5) 위기 긴장 — 80bpm, Cm, 트레몰로 현악+심장 박동 */
const scheduleCrisisTension: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 80;
  // Cm - Fm - Ab - G (4마디)
  const chords: [string, string][] = [
    ["C3", "Eb3"], ["F3", "Ab3"], ["Ab3", "C4"], ["G3", "B3"],
  ];

  for (let i = 0; i < chords.length; i++) {
    for (const note of chords[i]) {
      tremoloString({
        ctx, dest, freq: NOTE[note],
        time: t0 + i * 4 * beat,
        duration: 4 * beat * 0.9, volume: vol * 0.5,
      });
    }
  }

  // 심장 박동 베이스 (매 2박)
  for (let i = 0; i < 8; i++) {
    deepBass({
      ctx, dest, freq: NOTE["C3"] * 0.5,
      time: t0 + i * 2 * beat,
      duration: beat * 0.4, volume: vol * 0.4,
    });
    deepBass({
      ctx, dest, freq: NOTE["C3"] * 0.5,
      time: t0 + i * 2 * beat + beat * 0.3,
      duration: beat * 0.3, volume: vol * 0.25,
    });
  }

  return 16 * beat;
};

/** 6) 엔딩 희망 — 100bpm, D major, 오케스트라 빌드업 */
const scheduleEndingHope: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 100;
  // D - A - Bm - G - D - A - G - A (8마디, 32박)

  // 피아노 코드 (빌드업)
  const pianoChords: [string[], number, number][] = [
    [["D4", "Gb4", "A4"], 0, 4],
    [["A3", "E4", "A4"], 4, 4],
    [["B3", "D4", "Gb4"], 8, 4],
    [["G3", "B3", "D4"], 12, 4],
    [["D4", "Gb4", "A4"], 16, 4],
    [["A3", "E4", "A4"], 20, 4],
    [["G3", "B3", "D4"], 24, 4],
    [["A3", "E4", "A4"], 28, 4],
  ];

  for (const [notes, beatIdx, dur] of pianoChords) {
    // 볼륨이 점점 커짐 (빌드업)
    const progress = beatIdx / 32;
    const dynVol = vol * (0.3 + progress * 0.7);
    for (const n of notes) {
      piano({
        ctx, dest, freq: NOTE[n],
        time: t0 + beatIdx * beat,
        duration: dur * beat * 0.9, volume: dynVol * 0.5,
      });
    }
  }

  // 상승 멜로디 (후반부에서 강해짐)
  const melody: [string, number, number][] = [
    ["D5", 0, 2], ["E5", 2, 2],
    ["Gb4", 4, 2], ["A4", 6, 2],
    ["Gb5", 8, 2], ["D5", 10, 1], ["E5", 11, 1],
    ["G5", 12, 3], ["Gb5", 15, 1],
    ["A5", 16, 2], ["Gb5", 18, 1], ["D5", 19, 1],
    ["E5", 20, 2], ["Gb5", 22, 2],
    ["G5", 24, 2], ["A5", 26, 2],
    ["D6", 28, 4],
  ];

  for (const [note, beatIdx, dur] of melody) {
    const progress = beatIdx / 32;
    const dynVol = vol * (0.3 + progress * 0.7);
    piano({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat, volume: dynVol * 0.6,
    });
  }

  // 스트링 패드 (후반 16박)
  const strChords: [string[], number][] = [
    [["D4", "Gb4", "A4"], 16],
    [["A3", "E4"], 20],
    [["G3", "B3", "D4"], 24],
    [["A3", "D4", "Gb4"], 28],
  ];
  for (const [notes, beatIdx] of strChords) {
    for (const n of notes) {
      stringPad({
        ctx, dest, freq: NOTE[n],
        time: t0 + beatIdx * beat,
        duration: 4 * beat * 0.95, volume: vol * 0.4,
      });
    }
  }

  return 32 * beat;
};

/** 7) 게임오버 — 60bpm, Am, 솔로 피아노 */
const scheduleGameoverSad: ScheduleFn = (ctx, dest, t0, vol) => {
  const beat = 60 / 60;
  // Am - F - C - G/B - Am - Dm - E - Am

  const melody: [string, number, number][] = [
    ["E5", 0, 2], ["C5", 2, 1], ["A4", 3, 1],
    ["F4", 4, 2], ["A4", 6, 1], ["C5", 7, 1],
    ["E5", 8, 2], ["G4", 10, 1], ["C5", 11, 1],
    ["D5", 12, 2], ["B4", 14, 2],
    ["A4", 16, 3], ["E4", 19, 1],
    ["D4", 20, 2], ["F4", 22, 1], ["A4", 23, 1],
    ["E4", 24, 1.5], ["Ab4", 25.5, 1.5], ["B4", 27, 1],
    ["A4", 28, 4],
  ];

  for (const [note, beatIdx, dur] of melody) {
    // 점점 조용해짐
    const progress = 1 - beatIdx / 32;
    const dynVol = vol * (0.3 + progress * 0.5);
    piano({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat * 1.2, volume: dynVol * 0.6,
    });
  }

  // 왼손 저음부 (간헐적)
  const bass: [string, number, number][] = [
    ["A3", 0, 4], ["F3", 4, 4], ["C4", 8, 4], ["G3", 12, 4],
    ["A3", 16, 4], ["D3", 20, 4], ["E3", 24, 4], ["A3", 28, 4],
  ];
  for (const [note, beatIdx, dur] of bass) {
    piano({
      ctx, dest, freq: NOTE[note],
      time: t0 + beatIdx * beat,
      duration: dur * beat, volume: vol * 0.25,
    });
  }

  return 32 * beat;
};

// ── 트랙 레지스트리 ──

const TRACKS: Record<string, ScheduleFn> = {
  "main_theme.mp3": scheduleMainTheme,
  "adult_ambient.mp3": scheduleAdultAmbient,
  "child_playful.mp3": scheduleChildPlayful,
  "infant_gentle.mp3": scheduleInfantGentle,
  "crisis_tension.mp3": scheduleCrisisTension,
  "ending_hope.mp3": scheduleEndingHope,
  "gameover_sad.mp3": scheduleGameoverSad,
};

// ── 재생 관리 ──

let activeCtx: AudioContext | null = null;
let activeTrack: string | null = null;
let loopTimer: ReturnType<typeof setTimeout> | null = null;
let masterGain: GainNode | null = null;

function scheduleLoop(
  ctx: AudioContext,
  dest: AudioNode,
  scheduleFn: ScheduleFn,
  volume: number,
) {
  const now = ctx.currentTime + 0.1;
  const loopDuration = scheduleFn(ctx, dest, now, volume);

  // 루프 끝나기 전에 다음 루프 스케줄
  const nextDelay = (loopDuration - 0.5) * 1000;
  loopTimer = setTimeout(() => {
    if (activeTrack) {
      scheduleLoop(ctx, dest, scheduleFn, volume);
    }
  }, Math.max(nextDelay, 1000));
}

/** 절차적 BGM 재생 (외부에서 호출) */
export function playProceduralBgm(track: string, volume = 0.3): boolean {
  const scheduleFn = TRACKS[track];
  if (!scheduleFn) return false;

  // 같은 트랙이면 무시
  if (activeTrack === track) return true;

  // 기존 정지
  stopProceduralBgm();

  const ctx = new AudioContext();
  activeCtx = ctx;
  activeTrack = track;

  const startPlayback = () => {
    // 정지 요청이 들어왔으면 중단
    if (activeTrack !== track || activeCtx !== ctx) {
      try { ctx.close(); } catch { /* ok */ }
      return;
    }

    const gain = ctx.createGain();
    const reverb = createReverb(ctx, 1.2);
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();

    dryGain.gain.value = 0.7;
    wetGain.gain.value = 0.3;

    gain.connect(dryGain).connect(ctx.destination);
    gain.connect(reverb).connect(wetGain).connect(ctx.destination);

    // 페이드인
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.5);

    masterGain = gain;
    scheduleLoop(ctx, gain, scheduleFn, volume);
  };

  if (ctx.state === "suspended") {
    // resume()이 완료될 때까지 기다린 후 스케줄
    ctx.resume().then(startPlayback).catch(() => { /* 재생 불가 — 무시 */ });
  } else {
    startPlayback();
  }

  return true;
}

/** 절차적 BGM 정지 */
export function stopProceduralBgm(): void {
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (masterGain && activeCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0, activeCtx.currentTime + 0.3);
    } catch { /* ok */ }
    setTimeout(() => {
      try { activeCtx?.close(); } catch { /* ok */ }
    }, 400);
  }
  activeCtx = null;
  activeTrack = null;
  masterGain = null;
}

/** 절차적 BGM 볼륨 변경 */
export function setProceduralBgmVolume(v: number): void {
  if (masterGain && activeCtx) {
    masterGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, v)),
      activeCtx.currentTime + 0.1,
    );
  }
}

/** 지원하는 트랙인지 확인 */
export function hasProceduralTrack(track: string): boolean {
  return track in TRACKS;
}

/** 현재 재생 중인 트랙 */
export function getActiveProceduralTrack(): string | null {
  return activeTrack;
}
