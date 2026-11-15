import React, { useEffect, useState } from 'react';
import { AvatarId, GameScreen, Language } from '../types/game';
import { QuackMascot } from './QuackMascot';

export const UfoSplashVisual: React.FC = () => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 180);
    }, 1800);
    return () => window.clearInterval(id);
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
  scratchBelly?: boolean;
}> = ({
  size = 54,
  party = false,
  blink = false,
  armsUp = false,
  scratchBelly = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 80 80" role="img" aria-label="Carrapato ET amigável">
    {armsUp ? (
      <path
        d="M22 44 L10 26 M24 54 L14 66 M58 44 L70 26 M56 54 L66 66"
        stroke="#22C55E"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    ) : scratchBelly ? (
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
    <line x1="31" y1="22" x2="26" y2="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="25" cy="11" r="3" fill="#FACC15" />
    <line x1="49" y1="22" x2="54" y2="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="55" cy="11" r="3" fill="#FACC15" />
    <ellipse cx="40" cy="44" rx="22" ry="20" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
    <ellipse cx="40" cy="50" rx="14" ry="10" fill="#BBF7D0" fillOpacity="0.45" />
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
    ) : (
      <g>
        <circle cx="32" cy="39" r="3.5" fill="#0F172A" />
        <circle cx="48" cy="39" r="3.5" fill="#0F172A" />
        <circle cx="33" cy="38" r="1.2" fill="#FFFFFF" />
        <circle cx="49" cy="38" r="1.2" fill="#FFFFFF" />
      </g>
    )}
    <path d="M34 48 Q40 53 46 48" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
    {scratchBelly && (
      <g className="animate-et-scratch">
        <path
          d="M58 46 Q52 54 41 53"
          fill="none"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="53" r="3" fill="#22C55E" stroke="#16A34A" strokeWidth="1.2" />
      </g>
    )}
  </svg>
);

const CowAbductionVignette: React.FC<{ gradientId: string }> = ({ gradientId }) => (
  <svg viewBox="0 0 110 120" className="w-24 h-26 sm:w-28 sm:h-30 overflow-visible">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    <polygon points="34,34 76,34 98,112 12,112" fill={`url(#${gradientId})`} />
    <g className="animate-cow-abduction" style={{ transformOrigin: '55px 78px' }}>
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

const CruisingSaucerBackground: React.FC<{ topClass?: string }> = ({ topClass = 'top-16' }) => (
  <div className={`fixed inset-x-0 ${topClass} opacity-40 dark:opacity-50`}>
    <div className="animate-ufo-flyby inline-block">
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
 */
export const BackgroundEasterEggLayer: React.FC<{
  screen: GameScreen;
  currentSol: 1 | 2 | 3 | 4;
}> = ({ screen, currentSol }) => {
  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [screen, currentSol]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 180);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  if (screen === 'splash') return null;

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
              <div className="animate-bg-et-peek fixed right-3 bottom-14 sm:right-6 sm:bottom-16 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={58} blink={blink} />
              </div>
              <div className="animate-float-zero-g fixed left-3 top-24 sm:left-8 sm:top-28 opacity-35 dark:opacity-45">
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

          {/* HANGAR: Belly-scratching ET in bottom-left + cruising spaceship flying across sky behind */}
          {screen === 'hangar' && (
            <>
              <CruisingSaucerBackground topClass="top-20" />
              <div className="animate-bg-et-peek fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={60} blink={blink} scratchBelly />
              </div>
            </>
          )}

          {/* COMMAND SOL 1: Blinking ET top-left + Cow Abduction bottom-right */}
          {screen === 'command' && currentSol === 1 && (
            <>
              <div className="animate-bg-et-peek fixed left-3 top-24 sm:left-8 sm:top-28 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={56} blink={blink} />
              </div>
              <div className="fixed right-3 bottom-14 sm:right-8 sm:bottom-16 opacity-45 dark:opacity-55">
                <CowAbductionVignette gradientId="tractor-beam-sol1" />
              </div>
            </>
          )}

          {/* COMMAND SOL 2: Spaceship cruising across background sky + Belly-scratching ET bottom-right */}
          {screen === 'command' && currentSol === 2 && (
            <>
              <CruisingSaucerBackground topClass="top-20" />
              <div className="animate-bg-et-peek fixed right-3 bottom-14 sm:right-8 sm:bottom-16 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={60} blink={blink} scratchBelly />
              </div>
            </>
          )}

          {/* COMMAND SOL 3: Cow Abduction top-right + Blinking ET bottom-left */}
          {screen === 'command' && currentSol === 3 && (
            <>
              <div className="fixed right-3 top-24 sm:right-8 sm:top-28 opacity-45 dark:opacity-55">
                <CowAbductionVignette gradientId="tractor-beam-sol3" />
              </div>
              <div className="animate-bg-et-peek fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={58} blink={blink} />
              </div>
            </>
          )}

          {/* COMMAND SOL 4: Flag-waving ET bottom-left + Blinking ET top-right */}
          {screen === 'command' && currentSol === 4 && (
            <>
              <div className="animate-bg-et-peek fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-45 dark:opacity-55 flex items-end gap-1">
                <MiniAlienTickSvg size={56} party armsUp />
                <svg viewBox="0 0 32 48" className="w-6 h-10 -ml-2">
                  <line x1="6" y1="6" x2="6" y2="44" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M7 8 L29 13 L7 21 Z" fill="#F97316" />
                </svg>
              </div>
              <div className="animate-bg-et-peek fixed right-3 top-24 sm:right-8 sm:top-28 opacity-40 dark:opacity-50">
                <MiniAlienTickSvg size={54} blink={blink} />
              </div>
            </>
          )}

          {/* VICTORY: Belly-scratching blinking ET top-right + Cow Abduction bottom-left + Cruising saucer in starry sky */}
          {screen === 'victory' && (
            <>
              <CruisingSaucerBackground topClass="top-20" />
              <div className="animate-bg-et-peek fixed right-3 top-24 sm:right-8 sm:top-28 opacity-45">
                <MiniAlienTickSvg size={58} blink={blink} scratchBelly />
              </div>
              <div className="fixed left-3 bottom-14 sm:left-8 sm:bottom-16 opacity-50">
                <CowAbductionVignette gradientId="tractor-beam-victory" />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Minions-stealing-the-Moon inspired Victory Celebration Stage:
 * - Top illuminated stage platform ("Gru"): Comandante Quack in the center flanked by the 3 aligned mini astronauts
 * - Bottom cheering crowd pit: a synchronized row of cute Carrapatos ETs jumping and raising their arms!
 */
export const MamboPartyBanner: React.FC<{ avatarId: AvatarId; lang?: Language }> = ({
  avatarId,
  lang = 'en',
}) => {
  const crewOrder: AvatarId[] = ['astra', 'orbita', 'cometa'];
  const orderedCrew = [
    avatarId,
    ...crewOrder.filter((id) => id !== avatarId),
  ];

  const crowdDelays = ['0s', '0.14s', '0.28s', '0.08s', '0.22s', '0.35s', '0.12s'];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#172342]/95 via-[#0F1830]/95 to-[#090F1E]/95 px-4 pt-6 pb-4 backdrop-blur-md">
      {/* Subtle spotlight beam behind Commander Quack */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.22),_transparent_70%)]"
        aria-hidden="true"
      />

      {/* TOP STAGE PLATFORM: Commander Quack + 3 Aligned Crew Astronauts */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-6">
          {/* Left Crew Astronaut */}
          <div className="animate-mambo flex flex-col items-center" style={{ animationDelay: '0.15s' }}>
            <SpaceAvatarSvg id={orderedCrew[1]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-sky-300">
              {lang === 'pt' ? 'Piloto' : 'Pilot'}
            </span>
          </div>

          {/* Center Star: Commander Quack */}
          <div className="animate-mambo flex flex-col items-center">
            <QuackMascot expression="celebrate" size={124} />
            <span className="mt-0.5 text-xs font-extrabold text-amber-300">
              {lang === 'pt' ? 'Comandante Quack' : 'Commander Quack'}
            </span>
          </div>

          {/* Right Crew Astronauts (2 & 3) */}
          <div className="animate-mambo flex flex-col items-center" style={{ animationDelay: '0.25s' }}>
            <SpaceAvatarSvg id={orderedCrew[0]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-emerald-300">
              {lang === 'pt' ? 'Guardião(ã)' : 'Guardian'}
            </span>
          </div>

          <div className="hidden sm:flex animate-mambo flex-col items-center" style={{ animationDelay: '0.35s' }}>
            <SpaceAvatarSvg id={orderedCrew[2]} size={54} />
            <span className="mt-1 text-[11px] font-semibold text-amber-300">
              {lang === 'pt' ? 'Engenharia' : 'Engineering'}
            </span>
          </div>
        </div>

        {/* Base Ares Illuminated Stage Platform Divider */}
        <div className="mt-2 h-2.5 w-full max-w-xl rounded-full border border-orange-400/50 bg-gradient-to-r from-slate-800 via-orange-500/70 to-slate-800 shadow-[0_0_18px_rgba(249,115,22,0.4)]" />
      </div>

      {/* BOTTOM CROWD PIT: Row of Cheering Alien Ticks */}
      <div className="relative z-10 mt-3 flex flex-col items-center">
        <div className="flex items-end justify-center gap-1.5 sm:gap-3 overflow-hidden pt-1">
          {crowdDelays.map((delay, idx) => (
            <div
              key={idx}
              className={`animate-minion-cheer ${idx >= 5 ? 'hidden sm:block' : ''}`}
              style={{ animationDelay: delay }}
            >
              <MiniAlienTickSvg
                size={idx === 3 ? 52 : 44}
                party={idx % 2 === 0}
                armsUp
              />
            </div>
          ))}
        </div>
        <p className="mt-1 text-[11px] font-semibold text-emerald-300">
          {lang === 'pt'
            ? 'Platéia da Base Ares: os Carrapatos ETs vibrando com a tripulação!'
            : 'Ares Base Crowd: the Alien Ticks cheering wildly with the crew!'}
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
