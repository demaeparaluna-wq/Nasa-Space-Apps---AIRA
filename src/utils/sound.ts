let audioCtx: AudioContext | null = null;
let isMuted = false;

function getCtx(): AudioContext | null {
  if (isMuted || typeof window === 'undefined') return null;
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
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.06,
  delay = 0
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
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  } catch {
    // Ignore audio errors when autoplay policy blocks oscillator
  }
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
