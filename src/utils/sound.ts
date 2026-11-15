let audioCtx: AudioContext | null = null;
let isMuted = false;

function getCtx(): AudioContext | null {
  if (isMuted || typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch {
    return null;
  }
  return audioCtx;
}

let mamboIntervalId: number | null = null;
let mamboMasterGain: GainNode | null = null;
let mamboStep = 0;

export function stopMamboLoop() {
  if (typeof window !== 'undefined' && mamboIntervalId !== null) {
    window.clearInterval(mamboIntervalId);
    mamboIntervalId = null;
  }
  if (mamboMasterGain && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      mamboMasterGain.gain.cancelScheduledValues(now);
      mamboMasterGain.gain.setTargetAtTime(0.0001, now, 0.03);
    } catch {
      // Ignore cleanup errors
    }
  }
  mamboMasterGain = null;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
  if (muted) {
    stopMamboLoop();
  }
}

export function getSoundMuted(): boolean {
  return isMuted;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.06,
  delay = 0,
  dest?: AudioNode
) {
  const ctx = getCtx();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + delay;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(dest || ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  } catch {
    // Ignore audio errors when autoplay policy blocks oscillator
  }
}

export function startMamboLoop(): boolean {
  if (isMuted || typeof window === 'undefined') return false;
  const ctx = getCtx();
  if (!ctx) return false;

  if (mamboIntervalId !== null) return true;

  try {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.88, ctx.currentTime);
    master.connect(ctx.destination);
    mamboMasterGain = master;
  } catch {
    return false;
  }

  mamboStep = 0;

  // 32-step "Cuban Pete" (The Mask) inspired Mars Mambo arrangement (~165ms per eighth-note step)
  // Phrase 1 & 2: Iconic playful rumba-mambo horn hook + "Chik-chiky-boom!" turnaround
  const bassNotes = [
    130.81, 0, 196.0, 130.81, 164.81, 196.0, 220.0, 196.0,
    174.61, 0, 196.0, 146.83, 196.0, 0, 130.81, 0,
    130.81, 0, 196.0, 130.81, 164.81, 196.0, 220.0, 196.0,
    174.61, 196.0, 146.83, 196.0, 130.81, 0, 98.0, 130.81,
  ];

  // Syncopated Cuban Pete brass & marimba melody
  const melodyNotes = [
    392.0, 392.0, 440.0, 392.0, 329.63, 261.63, 0, 329.63,
    440.0, 440.0, 493.88, 440.0, 392.0, 329.63, 0, 0,
    392.0, 440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 0,
    523.25, 392.0, 329.63, 0, 523.25, 392.0, 261.63, 0,
  ];

  // Classic 3-2 Cuban Son Clave pattern (2 bars of 16 eighth-notes)
  const claveSteps = new Set([0, 3, 6, 10, 12, 16, 19, 22, 26, 28]);

  // "Chik-chiky-boom!" maraca + low conga punch on turnarounds
  const maracaSteps = [
    1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
  ];
  const boomSteps = new Set([6, 14, 22, 27, 30]);

  const triggerStep = () => {
    if (isMuted || !mamboMasterGain) {
      stopMamboLoop();
      return;
    }
    const idx = mamboStep % 32;
    const bass = bassNotes[idx];
    const lead = melodyNotes[idx];

    if (bass > 0) {
      playTone(bass, 0.14, 'triangle', 0.06, 0, mamboMasterGain);
    }

    if (lead > 0) {
      // Warm brassy horn + harmonic overtone
      playTone(lead, 0.13, 'sawtooth', 0.022, 0, mamboMasterGain);
      playTone(lead * 1.25, 0.11, 'triangle', 0.017, 0.01, mamboMasterGain);
    }

    if (claveSteps.has(idx)) {
      playTone(1180, 0.035, 'sine', 0.032, 0, mamboMasterGain);
    }

    if (maracaSteps[idx]) {
      const isChikAccent = idx % 4 === 2 || idx % 16 >= 12;
      playTone(
        isChikAccent ? 5200 : 3900,
        isChikAccent ? 0.04 : 0.022,
        'triangle',
        isChikAccent ? 0.024 : 0.013,
        0,
        mamboMasterGain
      );
    }

    if (boomSteps.has(idx)) {
      // Low conga "boom!" thump
      playTone(110, 0.12, 'sine', 0.075, 0, mamboMasterGain);
    }

    mamboStep = (mamboStep + 1) % 32;
  };

  triggerStep();
  mamboIntervalId = window.setInterval(triggerStep, 165);
  return true;
}

export function playClickSound() {
  playTone(540, 0.07, 'triangle', 0.045);
}

export function playToolPickupSound() {
  playTone(587.33, 0.09, 'sine', 0.06, 0);
  playTone(880, 0.14, 'sine', 0.06, 0.06);
}

export function playLaunchSound() {
  playTone(180, 0.35, 'triangle', 0.06, 0);
  playTone(260, 0.35, 'triangle', 0.06, 0.18);
  playTone(390, 0.45, 'sine', 0.07, 0.36);
}

export function playBadgeUnlockSound() {
  playTone(523.25, 0.12, 'sine', 0.06, 0);
  playTone(659.25, 0.12, 'sine', 0.06, 0.1);
  playTone(783.99, 0.15, 'sine', 0.07, 0.2);
  playTone(1046.5, 0.28, 'triangle', 0.07, 0.32);
}

export function playGentleAlertSound() {
  playTone(330, 0.16, 'sine', 0.055, 0);
  playTone(261.63, 0.25, 'sine', 0.055, 0.16);
}

export function playVictoryMamboSound() {
  const notes = [523.25, 659.25, 783.99, 659.25, 880, 1046.5];
  notes.forEach((n, idx) => {
    playTone(n, 0.14, 'triangle', 0.065, idx * 0.11);
  });
}
