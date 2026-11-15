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
    master.gain.setValueAtTime(0.85, ctx.currentTime);
    master.connect(ctx.destination);
    mamboMasterGain = master;
  } catch {
    return false;
  }

  mamboStep = 0;

  // 16-step Cuban Mambo ("Tcha-tcha!") groove at ~200ms per eighth-note step
  const bassNotes = [
    130.81, 0, 196.0, 130.81, 164.81, 0, 196.0, 220.0,
    174.61, 0, 196.0, 174.61, 146.83, 0, 196.0, 164.81,
  ];
  const brassHook = [
    392.0, 440.0, 523.25, 0, 659.25, 587.33, 523.25, 0,
    440.0, 523.25, 659.25, 0, 783.99, 659.25, 587.33, 523.25,
  ];
  // Syncopated maraca "ch-ch-CHA" pulse
  const maracaSteps = [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1];

  const triggerStep = () => {
    if (isMuted || !mamboMasterGain) {
      stopMamboLoop();
      return;
    }
    const idx = mamboStep % 16;
    const bass = bassNotes[idx];
    const lead = brassHook[idx];

    if (bass > 0) {
      playTone(bass, 0.16, 'triangle', 0.055, 0, mamboMasterGain);
    }
    if (lead > 0) {
      playTone(lead, 0.13, 'sawtooth', 0.022, 0, mamboMasterGain);
      playTone(lead * 1.25, 0.11, 'triangle', 0.018, 0.01, mamboMasterGain);
    }
    if (maracaSteps[idx]) {
      const accent = idx % 4 === 2 || idx === 15;
      playTone(
        accent ? 4800 : 3600,
        accent ? 0.045 : 0.025,
        'triangle',
        accent ? 0.026 : 0.014,
        0,
        mamboMasterGain
      );
    }

    mamboStep = (mamboStep + 1) % 16;
  };

  triggerStep();
  mamboIntervalId = window.setInterval(triggerStep, 200);
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
