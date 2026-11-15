import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Microscope, Music, Pause, Play } from 'lucide-react';
import { AvatarId, GameScreen, Language } from '../types/game';
import { QuackMascot } from './QuackMascot';

function detectLowPerformanceDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    const cores = navigator.hardwareConcurrency;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof cores === 'number' && cores > 0 && cores <= 4) return true;
    if (typeof memory === 'number' && memory > 0 && memory <= 4) return true;
  } catch {
    return false;
  }
  return false;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export const UfoSplashVisual: React.FC = () => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout: number | null = null;
    const id = window.setInterval(() => {
      setBlink(true);
      blinkTimeout = window.setTimeout(() => setBlink(false), 180);
    }, 1800);
    return () => {
      window.clearInterval(id);
      if (blinkTimeout !== null) window.clearTimeout(blinkTimeout);
    };
  }, []);

  return (
    <div className="animate-float-zero-g inline-flex flex-col items-center">
      <svg viewBox="0 0 160 120" className="w-36 h-28 overflow-visible" role="img" aria-label="Disco voador com ET piscando">
        <polygon points="62,84 98,84 114,118 46,118" fill="#38BDF8" fillOpacity="0.16" />
        <path
          d="M52 58 C52 28, 108 28, 108 58 Z"
          fill="#E0F2FE"
          fillOpacity="0.75"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
        <ellipse cx="80" cy="49" rx="14" ry="13" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.8" />
        <line x1="80" y1="36" x2="80" y2="29" stroke="#16A34A" strokeWidth="2" />
        <circle cx="80" cy="28" r="2.8" fill="#FACC15" />
        {blink ? (
          <g>
            <line x1="71" y1="47" x2="77" y2="47" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="83" y1="47" x2="89" y2="47" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <circle cx="74" cy="47" r="3.4" fill="#0F172A" />
            <circle cx="86" cy="47" r="3.4" fill="#0F172A" />
            <circle cx="75" cy="46" r="1.1" fill="#FFFFFF" />
            <circle cx="87" cy="46" r="1.1" fill="#FFFFFF" />
          </g>
        )}
        <path d="M75 54 Q80 57 85 54" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="80" cy="64" rx="52" ry="15" fill="#334155" stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="80" cy="61" rx="46" ry="10" fill="#94A3B8" />
        <circle cx="46" cy="65" r="3.5" fill="#F97316" />
        <circle cx="68" cy="69" r="3.5" fill="#FACC15" />
        <circle cx="92" cy="69" r="3.5" fill="#38BDF8" />
        <circle cx="114" cy="65" r="3.5" fill="#4ADE80" />
      </svg>
    </div>
  );
};

export const SpaceAvatarSvg: React.FC<{ id: AvatarId; size?: number }> = ({ id, size = 56 }) => {
  const visorColor = id === 'astra' ? '#10B981' : id === 'orbita' ? '#38BDF8' : '#F59E0B';
  const suitColor = id === 'astra' ? '#ECFDF5' : id === 'orbita' ? '#F0F9FF' : '#FFFBEB';

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" role="img" aria-label={`Avatar ${id}`}>
      <circle cx="40" cy="40" r="36" fill="#0F172A" stroke={visorColor} strokeWidth="2.5" />
      <path d="M20 70 C20 56, 60 56, 60 70" fill={suitColor} stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="40" cy="36" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <rect x="27" y="27" width="26" height="17" rx="8" fill="#0F172A" stroke={visorColor} strokeWidth="2" />
      <circle cx="35" cy="35" r="2.2" fill="#FFFFFF" />
      <circle cx="45" cy="35" r="2.2" fill="#FFFFFF" />
      <path d="M36 40 Q40 43 44 40" fill="none" stroke={visorColor} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="40" cy="63" r="4" fill={visorColor} />
    </svg>
  );
};

export const MiniAlienTickSvg: React.FC<{
  size?: number;
  party?: boolean;
  blink?: boolean;
  armsUp?: boolean;
  scratchHead?: boolean;
  maracas?: boolean;
  disableCssAnimation?: boolean;
}> = ({
  size = 54,
  party = false,
  blink = false,
  armsUp = false,
  scratchHead = false,
  maracas = false,
  disableCssAnimation = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 80 80" role="img" aria-label="Carrapato ET amigável">
    {armsUp ? (
      <path
        d="M22 44 L10 26 M24 54 L14 66 M58 44 L70 26 M56 54 L66 66"
        stroke="#22C55E"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    ) : scratchHead ? (
      <path
        d="M22 50 L14 58 M24 58 L16 66 M56 58 L64 66"
        stroke="#22C55E"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M22 50 L14 58 M24 58 L16 66 M58 50 L66 58 M56 58 L64 66"
        stroke="#22C55E"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )}

    {maracas && (
      <g>
        {/* Left & Right Cuban Mambo maracas */}
        <line x1="10" y1="26" x2="7" y2="20" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="6" cy="17" rx="4.2" ry="5.2" transform="rotate(-20 6 17)" fill="#F97316" stroke="#FACC15" strokeWidth="1.2" />
        <line x1="70" y1="26" x2="73" y2="20" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="74" cy="17" rx="4.2" ry="5.2" transform="rotate(20 74 17)" fill="#FACC15" stroke="#F97316" strokeWidth="1.2" />
      </g>
    )}

    <line x1="31" y1="22" x2="26" y2="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="25" cy="11" r="3" fill="#FACC15" />
    <line x1="49" y1="22" x2="54" y2="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="55" cy="11" r="3" fill="#FACC15" />
    <ellipse cx="40" cy="44" rx="22" ry="20" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
    <ellipse cx="40" cy="50" rx="14" ry="10" fill="#BBF7D0" fillOpacity="0.45" />

    {scratchHead && (
      <g>
        {/* Quizzical "eita..." eyebrows */}
        <path d="M27 32 Q32 28 36 32" fill="none" stroke="#0F172A" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M44 34 Q48 31 53 33" fill="none" stroke="#0F172A" strokeWidth="1.9" strokeLinecap="round" />
        {/* Tiny cartoon sweat drop */}
        <path d="M23 30 Q25.5 34 23 37 Q20.5 34 23 30 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="0.8" />
      </g>
    )}

    {party ? (
      <g>
        <rect x="24" y="34" width="14" height="9" rx="2.5" fill="#0F172A" />
        <rect x="42" y="34" width="14" height="9" rx="2.5" fill="#0F172A" />
        <line x1="38" y1="38" x2="42" y2="38" stroke="#0F172A" strokeWidth="2" />
      </g>
    ) : blink ? (
      <g>
        <line x1="28" y1="39" x2="36" y2="39" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="39" x2="52" y2="39" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ) : scratchHead ? (
      <g>
        {/* Wide surprised "eita" eyes */}
        <circle cx="32" cy="39" r="4.3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
        <circle cx="33" cy="39" r="2.1" fill="#0F172A" />
        <circle cx="33.8" cy="38.1" r="0.8" fill="#FFFFFF" />
        <circle cx="48" cy="39" r="3.4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
        <circle cx="48.6" cy="39.2" r="1.7" fill="#0F172A" />
        <circle cx="49.2" cy="38.4" r="0.7" fill="#FFFFFF" />
      </g>
    ) : (
      <g>
        <circle cx="32" cy="39" r="3.5" fill="#0F172A" />
        <circle cx="48" cy="39" r="3.5" fill="#0F172A" />
        <circle cx="33" cy="38" r="1.2" fill="#FFFFFF" />
        <circle cx="49" cy="38" r="1.2" fill="#FFFFFF" />
      </g>
    )}

    {scratchHead ? (
      /* Crooked wavy "eita..." mouth */
      <path
        d="M33 49 Q36.5 46 40 49.5 Q43.5 52.5 47 48.5"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    ) : (
      <path d="M34 48 Q40 53 46 48" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
    )}

    {scratchHead && (
      <g className={disableCssAnimation ? undefined : 'animate-et-head-scratch'}>
        <path
          d="M59 45 Q69 34 55 24"
          fill="none"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="54" cy="24" r="3.1" fill="#22C55E" stroke="#16A34A" strokeWidth="1.2" />
        <path d="M51 21 L48 23 M52 24 L49 26" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

const CowAbductionVignette: React.FC<{
  gradientId: string;
  cowRef?: React.RefObject<SVGGElement | null>;
  useRaf: boolean;
}> = ({ gradientId, cowRef, useRaf }) => (
  <svg viewBox="0 0 110 120" className="w-24 h-26 sm:w-28 sm:h-30 overflow-visible">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    <polygon points="34,34 76,34 98,112 12,112" fill={`url(#${gradientId})`} />
    <g
      ref={cowRef}
      className={useRaf ? undefined : 'animate-cow-abduction'}
      style={{ transformOrigin: '55px 78px', willChange: 'transform, opacity' }}
    >
      <line x1="44" y1="86" x2="43" y2="94" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="49" y1="86" x2="49" y2="94" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="86" x2="60" y2="94" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="65" y1="86" x2="66" y2="94" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="55" cy="79" rx="14" ry="9" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
      <circle cx="50" cy="77" r="3" fill="#0F172A" />
      <circle cx="59" cy="81" r="2.3" fill="#0F172A" />
      <circle cx="68" cy="74" r="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
      <path d="M64 68 L62 64 M71 68 L73 64" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="70" cy="76.5" rx="4" ry="2.6" fill="#FDA4AF" />
      <circle cx="66.5" cy="72.5" r="1.3" fill="#0F172A" />
      <circle cx="70.5" cy="72.5" r="1.3" fill="#0F172A" />
    </g>
    <path d="M36 26 C36 10, 74 10, 74 26 Z" fill="#BAE6FD" fillOpacity="0.88" stroke="#38BDF8" strokeWidth="1.5" />
    <ellipse cx="55" cy="30" rx="34" ry="9" fill="#475569" stroke="#1E293B" strokeWidth="1.8" />
    <circle cx="34" cy="31" r="2.5" fill="#FACC15" />
    <circle cx="55" cy="33" r="2.5" fill="#F97316" />
    <circle cx="76" cy="31" r="2.5" fill="#4ADE80" />
  </svg>
);

const CruisingSaucerBackground: React.FC<{
  topClass?: string;
  saucerRef?: React.RefObject<HTMLDivElement | null>;
  useRaf: boolean;
}> = ({ topClass = 'top-16', saucerRef, useRaf }) => (
  <div className={`fixed inset-x-0 ${topClass} opacity-40 dark:opacity-50`}>
    <div
      ref={saucerRef}
      className={useRaf ? 'inline-block' : 'animate-ufo-flyby inline-block'}
      style={{ willChange: 'transform, opacity' }}
    >
      <svg viewBox="0 0 96 48" className="w-20 h-10 sm:w-24 sm:h-12">
        <path d="M30 22 C30 8, 66 8, 66 22 Z" fill="#BAE6FD" fillOpacity="0.75" />
        <ellipse cx="48" cy="25" rx="34" ry="9" fill="#64748B" />
        <circle cx="28" cy="26" r="2.8" fill="#FACC15" />
        <circle cx="48" cy="28" r="2.8" fill="#F97316" />
        <circle cx="68" cy="26" r="2.8" fill="#4ADE80" />
      </svg>
    </div>
  </div>
);

/**
 * Ambient Easter Eggs rendered strictly in the background scenery behind UI cards,
 * with pointer-events-none and low opacity so each screen alternates playful scenes
 * in different corners without ever obstructing clicks.
 *
 * On basic/low-performance hardware, continuous CSS animations are disabled and replaced
 * by a single 30fps-throttled requestAnimationFrame loop mutating DOM transforms directly
 * with `will-change: transform` to minimize CPU & GPU pressure.
 */
export const BackgroundEasterEggLayer: React.FC<{
  screen: GameScreen;
  currentSol: 1 | 2 | 3 | 4;
}> = ({ screen, currentSol }) => {
  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState(false);
  const lowSpec = useMemo(() => detectLowPerformanceDevice(), []);

  const saucerRef = useRef<HTMLDivElement | null>(null);
  const cowRef = useRef<SVGGElement | null>(null);
  const scoutUfoRef = useRef<HTMLDivElement | null>(null);
  const etPeekRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisible(false);
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [screen, currentSol]);

  useEffect(() => {
    let blinkTimeout: number | null = null;
    const id = window.setInterval(() => {
      setBlink(true);
      blinkTimeout = window.setTimeout(() => setBlink(false), 180);
    }, 2200);
    return () => {
      window.clearInterval(id);
      if (blinkTimeout !== null) window.clearTimeout(blinkTimeout);
    };
  }, []);

  // 30fps requestAnimationFrame driver for low-spec hardware
  useEffect(() => {
    if (!lowSpec || !visible || screen === 'splash' || prefersReducedMotion()) return;

    let rafId = 0;
    let startTime = 0;
    let lastTick = 0;
    const frameIntervalMs = 1000 / 30; // ~33.3ms cap (30fps)

    const step = (now: number) => {
      if (!startTime) startTime = now;
      if (now - lastTick >= frameIntervalMs) {
        lastTick = now;
        const elapsed = (now - startTime) / 1000;

        if (saucerRef.current) {
          const cycle = (elapsed % 11) / 11;
          const xVw = -15 + cycle * 123;
          const yPx = Math.sin(elapsed * 1.4) * 6;
          const alpha = cycle < 0.12 ? cycle / 0.12 : cycle > 0.88 ? (1 - cycle) / 0.12 : 1;
          saucerRef.current.style.transform = `translate3d(${xVw.toFixed(2)}vw, ${yPx.toFixed(1)}px, 0)`;
          saucerRef.current.style.opacity = (alpha * 0.65).toFixed(2);
        }

        if (cowRef.current) {
          const c = (elapsed % 4.6) / 4.6;
          let yPx = 18;
          let scale = 1;
          let rot = 0;
          let alpha = 1;
          if (c < 0.12) {
            alpha = c / 0.12;
            yPx = 20 - (c / 0.12) * 2;
            rot = -3;
          } else if (c < 0.45) {
            const p = (c - 0.12) / 0.33;
            yPx = 18 - p * 16;
            scale = 1 - p * 0.08;
            rot = -3 + p * 9;
          } else if (c < 0.78) {
            const p = (c - 0.45) / 0.33;
            yPx = 2 - p * 22;
            scale = 0.92 - p * 0.47;
            rot = 6 - p * 16;
            alpha = 1 - p * 0.1;
          } else if (c < 0.9) {
            const p = (c - 0.78) / 0.12;
            yPx = -20 - p * 8;
            scale = 0.45 - p * 0.3;
            alpha = 0.9 * (1 - p);
          } else {
            yPx = -28;
            scale = 0.15;
            alpha = 0;
          }
          cowRef.current.style.transform = `translate3d(0, ${yPx.toFixed(1)}px, 0) scale(${scale.toFixed(2)}) rotate(${rot.toFixed(1)}deg)`;
          cowRef.current.style.opacity = alpha.toFixed(2);
        }

        if (scoutUfoRef.current) {
          const yPx = Math.sin(elapsed * 2.1) * 6;
          const rot = Math.sin(elapsed * 1.6) * 3;
          scoutUfoRef.current.style.transform = `translate3d(0, ${yPx.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
        }

        if (etPeekRef.current) {
          const enter = Math.min(1, elapsed / 0.8);
          const bob = Math.sin(elapsed * 2.2) * 3;
          const yPx = (1 - enter) * 16 + bob;
          etPeekRef.current.style.transform = `translate3d(0, ${yPx.toFixed(1)}px, 0)`;
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [lowSpec, visible, screen, currentSol]);

  if (screen === 'splash') return null;

  const useRaf = lowSpec;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Distant Martian Crater Ridge Silhouette along bottom background */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 inset-x-0 h-28 sm:h-36 w-full opacity-20 dark:opacity-40"
      >
        <path
          d="M0 160 L0 105 Q220 55 430 108 T900 92 T1220 112 T1440 82 L1440 160 Z"
          fill="#431407"
        />
      </svg>

      {/* Subtle ambient stars in dark mode */}
      {screen !== 'victory' && (
        <div
          className="hidden dark:block absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 8% 22%, #e2e8f0 100%, transparent), radial-gradient(1.5px 1.5px at 24% 68%, #7dd3fc 100%, transparent), radial-gradient(1px 1px at 78% 18%, #fde68a 100%, transparent), radial-gradient(1.5px 1.5px at 92% 64%, #7dd3fc 100%, transparent), radial-gradient(1px 1px at 54% 85%, #ffffff 100%, transparent)',
          }}
        />
      )}

      {visible && (
        <>
          {/* PROLOGUE: Blinking ET peeking bottom-right + tiny hovering scout UFO top-left */}
          {screen === 'prologue' && (
            <>
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed right-3 bottom-14 sm:right-6 sm:bottom-16 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={58} blink={blink} disableCssAnimation={useRaf} />
              </div>
              <div
                ref={scoutUfoRef}
                style={{ willChange: 'transform' }}
                className={`${useRaf ? '' : 'animate-float-zero-g'} fixed left-3 top-24 sm:left-8 sm:top-28 opacity-35 dark:opacity-45`}
              >
                <svg viewBox="0 0 80 48" className="w-16 h-10 sm:w-20 sm:h-12">
                  <polygon points="28,32 52,32 62,48 18,48" fill="#38BDF8" fillOpacity="0.16" />
                  <path d="M24 22 C24 8, 56 8, 56 22 Z" fill="#BAE6FD" fillOpacity="0.7" />
                  <ellipse cx="40" cy="24" rx="28" ry="8" fill="#475569" />
                  <circle cx="24" cy="25" r="2.2" fill="#FACC15" />
                  <circle cx="40" cy="27" r="2.2" fill="#F97316" />
                  <circle cx="56" cy="25" r="2.2" fill="#4ADE80" />
                </svg>
              </div>
            </>
          )}

          {/* HANGAR: Head-scratching "eita..." ET in bottom-left + cruising spaceship flying across sky behind */}
          {screen === 'hangar' && (
            <>
              <CruisingSaucerBackground topClass="top-20" saucerRef={saucerRef} useRaf={useRaf} />
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={60} blink={blink} scratchHead disableCssAnimation={useRaf} />
              </div>
            </>
          )}

          {/* COMMAND SOL 1: Blinking ET top-left + Cow Abduction bottom-right */}
          {screen === 'command' && currentSol === 1 && (
            <>
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed left-3 top-24 sm:left-8 sm:top-28 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={56} blink={blink} disableCssAnimation={useRaf} />
              </div>
              <div className="fixed right-3 bottom-14 sm:right-8 sm:bottom-16 opacity-45 dark:opacity-55">
                <CowAbductionVignette gradientId="tractor-beam-sol1" cowRef={cowRef} useRaf={useRaf} />
              </div>
            </>
          )}

          {/* COMMAND SOL 2: Spaceship cruising across background sky + Head-scratching "eita..." ET bottom-right */}
          {screen === 'command' && currentSol === 2 && (
            <>
              <CruisingSaucerBackground topClass="top-20" saucerRef={saucerRef} useRaf={useRaf} />
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed right-3 bottom-14 sm:right-8 sm:bottom-16 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={60} blink={blink} scratchHead disableCssAnimation={useRaf} />
              </div>
            </>
          )}

          {/* COMMAND SOL 3: Cow Abduction top-right + Blinking ET bottom-left */}
          {screen === 'command' && currentSol === 3 && (
            <>
              <div className="fixed right-3 top-24 sm:right-8 sm:top-28 opacity-45 dark:opacity-55">
                <CowAbductionVignette gradientId="tractor-beam-sol3" cowRef={cowRef} useRaf={useRaf} />
              </div>
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={58} blink={blink} disableCssAnimation={useRaf} />
              </div>
            </>
          )}

          {/* COMMAND SOL 4: Flag-waving ET bottom-left + Blinking ET top-right */}
          {screen === 'command' && currentSol === 4 && (
            <>
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-45 dark:opacity-55 flex items-end gap-1`}
              >
                <MiniAlienTickSvg size={56} party armsUp disableCssAnimation={useRaf} />
                <svg viewBox="0 0 32 48" className="w-6 h-10 -ml-2">
                  <line x1="6" y1="6" x2="6" y2="44" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M7 8 L29 13 L7 21 Z" fill="#F97316" />
                </svg>
              </div>
              <div
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed right-3 top-24 sm:right-8 sm:top-28 opacity-40 dark:opacity-50`}
              >
                <MiniAlienTickSvg size={54} blink={blink} disableCssAnimation={useRaf} />
              </div>
            </>
          )}

          {/* VICTORY: Head-scratching "eita..." blinking ET top-right + Cow Abduction bottom-left + Cruising saucer in starry sky */}
          {screen === 'victory' && (
            <>
              <CruisingSaucerBackground topClass="top-20" saucerRef={saucerRef} useRaf={useRaf} />
              <div
                ref={etPeekRef}
                style={{ willChange: 'transform, opacity' }}
                className={`${useRaf ? '' : 'animate-bg-et-peek'} fixed right-3 top-24 sm:right-8 sm:top-28 opacity-45`}
              >
                <MiniAlienTickSvg size={58} blink={blink} scratchHead disableCssAnimation={useRaf} />
              </div>
              <div className="fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-50">
                <CowAbductionVignette gradientId="tractor-beam-victory" cowRef={cowRef} useRaf={useRaf} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Minions + "The Mask" (Cuban Pete) inspired Victory Celebration Stage:
 * - Top illuminated stage platform: Commander Quack in the center flanked by the 3 aligned mini astronauts
 * - Bottom conga pit: Continuous left-to-right Mambo conga parade of Carrapatos ETs shaking maracas ("Tcha-tcha!")
 * - Music Play/Pause button + inviting shortcut to research that "Carrapatos ETs" is a nickname for real biofilms!
 */
export const MamboPartyBanner: React.FC<{
  avatarId: AvatarId;
  lang?: Language;
  mamboPlaying?: boolean;
  onToggleMambo?: () => void;
  onResearchBiofilms?: () => void;
}> = ({
  avatarId,
  lang = 'en',
  mamboPlaying = true,
  onToggleMambo,
  onResearchBiofilms,
}) => {
  const crewOrder: AvatarId[] = ['astra', 'orbita', 'cometa'];
  const orderedCrew = [
    avatarId,
    ...crewOrder.filter((id) => id !== avatarId),
  ];

  const isPt = lang === 'pt';
  const lowSpec = useMemo(() => detectLowPerformanceDevice(), []);
  const paradeTrackRef = useRef<HTMLDivElement | null>(null);

  // 30fps requestAnimationFrame conga march on low-spec devices
  useEffect(() => {
    if (!lowSpec || prefersReducedMotion()) return;
    let rafId = 0;
    let startTime = 0;
    let lastTick = 0;
    const frameIntervalMs = 1000 / 30;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      if (now - lastTick >= frameIntervalMs) {
        lastTick = now;
        const elapsed = (now - startTime) / 1000;
        const progress = (elapsed % 12) / 12;
        const pct = -50 + progress * 50;
        if (paradeTrackRef.current) {
          paradeTrackRef.current.style.transform = `translate3d(${pct.toFixed(2)}%, 0, 0)`;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [lowSpec]);

  const dancers = [
    { delay: '0s', phrase: 'Tcha-tcha!', party: true },
    { delay: '0.16s', phrase: '', party: false },
    { delay: '0.32s', phrase: 'Mambo! 🎶', party: true },
    { delay: '0.12s', phrase: '', party: false },
    { delay: '0.28s', phrase: 'Tcha-tcha-tcha!', party: true },
    { delay: '0.2s', phrase: '', party: false },
  ];

  const renderDancerGroup = (groupKey: string) => (
    <div key={groupKey} className="flex shrink-0 items-end gap-4 sm:gap-7 pr-4 sm:pr-7">
      {dancers.map((d, idx) => (
        <div
          key={`${groupKey}-${idx}`}
          className="relative flex flex-col items-center"
        >
          {d.phrase && (
            <span className="mb-1 rounded-lg border border-amber-400/60 bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-200 whitespace-nowrap">
              {d.phrase}
            </span>
          )}
          <div
            className={lowSpec ? undefined : 'animate-mambo'}
            style={{ animationDelay: d.delay, willChange: 'transform' }}
          >
            <MiniAlienTickSvg
              size={idx % 3 === 0 ? 52 : 46}
              party={d.party}
              armsUp
              maracas
              disableCssAnimation={lowSpec}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#172342] via-[#0F1830] to-[#090F1E] px-4 pt-6 pb-4">
      {/* Subtle spotlight beam behind Commander Quack */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.22),_transparent_70%)]"
        aria-hidden="true"
      />

      {/* TOP STAGE PLATFORM: Commander Quack + 3 Aligned Crew Astronauts */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-6">
          {/* Left Crew Astronaut */}
          <div
            className={`${lowSpec ? '' : 'animate-mambo'} flex flex-col items-center`}
            style={{ animationDelay: '0.15s', willChange: 'transform' }}
          >
            <SpaceAvatarSvg id={orderedCrew[1]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-sky-300">
              {isPt ? 'Piloto' : 'Pilot'}
            </span>
          </div>

          {/* Center Star: Commander Quack */}
          <div
            className={`${lowSpec ? '' : 'animate-mambo'} flex flex-col items-center`}
            style={{ willChange: 'transform' }}
          >
            <QuackMascot expression="celebrate" size={124} />
            <span className="mt-0.5 text-xs font-extrabold text-amber-300">
              {isPt ? 'Comandante Quack' : 'Commander Quack'}
            </span>
          </div>

          {/* Right Crew Astronauts (2 & 3) */}
          <div
            className={`${lowSpec ? '' : 'animate-mambo'} flex flex-col items-center`}
            style={{ animationDelay: '0.25s', willChange: 'transform' }}
          >
            <SpaceAvatarSvg id={orderedCrew[0]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-emerald-300">
              {isPt ? 'Guardião(ã)' : 'Guardian'}
            </span>
          </div>

          <div
            className={`hidden sm:flex ${lowSpec ? '' : 'animate-mambo'} flex-col items-center`}
            style={{ animationDelay: '0.35s', willChange: 'transform' }}
          >
            <SpaceAvatarSvg id={orderedCrew[2]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-amber-300">
              {isPt ? 'Engenharia' : 'Engineering'}
            </span>
          </div>
        </div>

        {/* Base Ares Illuminated Stage Platform Divider */}
        <div className="mt-2 h-2.5 w-full max-w-xl rounded-full border border-orange-400/50 bg-gradient-to-r from-slate-800 via-orange-500/70 to-slate-800 shadow-[0_0_18px_rgba(249,115,22,0.4)]" />
      </div>

      {/* BOTTOM CONGA PIT: Left-to-Right "The Mask" Cuban Pete Mambo Parade */}
      <div className="relative z-10 mt-3 flex flex-col items-center space-y-2.5">
        <div className="w-full overflow-hidden pt-1">
          <div
            ref={paradeTrackRef}
            className={`flex w-max items-end ${lowSpec ? '' : 'animate-mambo-parade'}`}
            style={{ willChange: 'transform' }}
          >
            {renderDancerGroup('track-a')}
            {renderDancerGroup('track-b')}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {onToggleMambo && (
            <button
              type="button"
              onClick={onToggleMambo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 text-xs font-extrabold text-amber-200 hover:bg-amber-500/30 transition-colors"
            >
              {mamboPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <Music className="h-3.5 w-3.5 text-amber-300" />
              <span>
                {mamboPlaying
                  ? isPt
                    ? 'Pausar Música Mambo'
                    : 'Pause Mambo Music'
                  : isPt
                    ? 'Tocar Música Mambo'
                    : 'Play Mambo Music'}
              </span>
            </button>
          )}

          {onResearchBiofilms && (
            <button
              type="button"
              onClick={onResearchBiofilms}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/45 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 transition-colors"
            >
              <Microscope className="h-3.5 w-3.5 text-emerald-300" />
              <span>
                {isPt
                  ? 'Pesquisar: “Carrapatos ETs” = Biofilmes NASA ➔'
                  : 'Research: “Alien Ticks” = NASA Biofilms ➔'}
              </span>
            </button>
          )}
        </div>

        <p className="text-[11px] font-medium text-emerald-200/90 text-center max-w-2xl leading-relaxed">
          {isPt
            ? 'Platéia da Base Ares: fila do Mambo (tcha-tcha!) dos Carrapatos ETs — apelido divertido da missão para os biofilmes estudados pela NASA em microgravidade!'
            : 'Ares Base Crowd: the Alien Ticks Mambo conga line (cha-cha!) — our fun mission nickname for real biofilms studied by NASA in microgravity!'}
        </p>
      </div>
    </div>
  );
};

export const RocketLaunchOverlay: React.FC<{
  rocketName: string;
  orbitName: string;
  lang?: Language;
}> = ({ rocketName, orbitName, lang = 'en' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060B16]/95 px-6 text-center">
    <div className="relative h-56 w-40 flex items-end justify-center overflow-hidden">
      <div className="animate-rocket-launch flex flex-col items-center">
        <svg viewBox="0 0 80 120" className="w-24 h-36">
          <path d="M40 8 C54 24, 58 52, 56 84 L24 84 C22 52, 26 24, 40 8 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M40 8 C48 18, 52 28, 53 36 L27 36 C28 28, 32 18, 40 8 Z" fill="#F97316" />
          <circle cx="40" cy="54" r="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <path d="M24 68 L10 90 L24 84 Z" fill="#F97316" />
          <path d="M56 68 L70 90 L56 84 Z" fill="#F97316" />
          <polygon points="30,84 50,84 44,114 40,104 36,114" fill="#FACC15" />
        </svg>
      </div>
    </div>
    <h2 className="mt-4 text-2xl font-bold text-white">
      {lang === 'pt' ? 'Decolagem rumo à Cratera Jezero!' : 'Liftoff to Jezero Crater!'}
    </h2>
    <p className="mt-2 text-sm text-slate-300">
      {rocketName} · {orbitName}
    </p>
    <p className="mt-1 font-mono-tabular text-xs text-orange-400">
      {lang === 'pt'
        ? 'Trajetória confirmada para a Base Ares em Marte...'
        : 'Trajectory locked for Ares Base on Mars...'}
    </p>
  </div>
);
