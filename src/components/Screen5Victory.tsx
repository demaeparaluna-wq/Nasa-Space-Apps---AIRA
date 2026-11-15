import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  MessageSquare,
  Microscope,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import {
  fetchRandomNasaApod,
  pickRandomVerifiedMemory,
} from '../services/nasaApi';
import {
  AgeProfile,
  AvatarId,
  BadgeId,
  ChoiceHistoryEntry,
  HangarConfig,
  Language,
  NasaApodData,
  NasaDataBundle,
  PlayMode,
  ResourceKey,
  Resources,
} from '../types/game';
import { playClickSound, playToolPickupSound } from '../utils/sound';
import {
  MARTIAN_CONSTELLATIONS,
  MartianObservatoryCard,
  MartianStargazingBackdrop,
  SpawnedTwinkleStar,
} from './MartianStargazingSky';
import { InfoHubTab } from './MissionInfoHubModal';
import { MissionPatchLogo } from './MissionPatchLogo';
import { MamboPartyBanner } from './SpaceVisuals';
import { TechnicalLineagePanel } from './TechnicalLineagePanel';

interface Screen5VictoryProps {
  lang?: Language;
  playerName: string;
  playMode: PlayMode;
  teamNames: string[];
  teamCount: number;
  avatarId: AvatarId;
  ageProfile: AgeProfile;
  hangarConfig: HangarConfig;
  resources: Resources;
  penaltyPoints: number;
  unlockedBadges: BadgeId[];
  choiceHistory: ChoiceHistoryEntry[];
  nasaData: NasaDataBundle;
  onUpdateApod: (newApod: NasaApodData) => void;
  onOpenInfoHub: (tab: InfoHubTab) => void;
  onPlayAgain: () => void;
  onBackToHangar: () => void;
}

const LocalMartianSpaceFallbackSvg: React.FC<{ isPt: boolean }> = ({ isPt }) => (
  <svg
    viewBox="0 0 400 300"
    className="h-full w-full"
    role="img"
    aria-label={
      isPt
        ? 'Ilustração espacial local da Cratera Jezero e céu estrelado de Marte'
        : 'Local space illustration of Jezero Crater and Martian starry sky'
    }
  >
    <defs>
      <linearGradient id="local-mars-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#070D1F" />
        <stop offset="60%" stopColor="#1B1838" />
        <stop offset="100%" stopColor="#7C2D12" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#local-mars-sky)" />
    <circle cx="52" cy="48" r="1.5" fill="#E2E8F0" />
    <circle cx="110" cy="32" r="2" fill="#7DD3FC" />
    <circle cx="168" cy="64" r="1.4" fill="#FFFFFF" />
    <circle cx="240" cy="40" r="1.8" fill="#FDE047" />
    <circle cx="315" cy="54" r="1.5" fill="#BAE6FD" />
    <circle cx="360" cy="28" r="2" fill="#FFFFFF" />
    <circle cx="88" cy="108" r="1.2" fill="#FDE68A" />
    <circle cx="288" cy="96" r="1.4" fill="#FFFFFF" />
    {/* Phobos & Deimos moons */}
    <circle cx="310" cy="84" r="22" fill="#94A3B8" opacity="0.25" />
    <circle cx="310" cy="84" r="15" fill="#CBD5E1" />
    <circle cx="305" cy="80" r="3" fill="#94A3B8" />
    <circle cx="315" cy="89" r="2.2" fill="#94A3B8" />
    <circle cx="82" cy="78" r="5" fill="#E2E8F0" opacity="0.85" />
    {/* Jezero Crater distant rim & dunes */}
    <path d="M0 218 Q95 170 190 205 T400 190 L400 300 L0 300 Z" fill="#9A3412" />
    <path d="M0 245 Q130 215 245 240 T400 228 L400 300 L0 300 Z" fill="#7C2D12" />
    <path d="M0 272 Q170 254 400 268 L400 300 L0 300 Z" fill="#431407" />
    {/* Tiny Base Ares dome silhouette */}
    <ellipse cx="145" cy="238" rx="28" ry="12" fill="#38BDF8" fillOpacity="0.35" stroke="#7DD3FC" strokeWidth="1.5" />
    <rect x="125" y="238" width="40" height="7" rx="3" fill="#E2E8F0" />
    <line x1="176" y1="238" x2="188" y2="226" stroke="#CBD5E1" strokeWidth="1.5" />
    <circle cx="189" cy="225" r="2" fill="#FACC15" />
  </svg>
);

export const Screen5Victory: React.FC<Screen5VictoryProps> = ({
  lang = 'en',
  playerName,
  playMode,
  teamNames,
  teamCount,
  avatarId,
  ageProfile,
  hangarConfig,
  resources,
  penaltyPoints,
  unlockedBadges,
  choiceHistory,
  nasaData,
  onUpdateApod,
  onOpenInfoHub,
  onPlayAgain,
  onBackToHangar,
}) => {
  const [copiedChallenge, setCopiedChallenge] = useState(false);
  const [drawingApod, setDrawingApod] = useState(false);
  const [lineageOpen, setLineageOpen] = useState(false);
  const [useLocalApodIllustration, setUseLocalApodIllustration] = useState(false);

  const failedUrlsRef = useRef<Set<string>>(new Set());
  const copyTimerRef = useRef<number | null>(null);

  const [twinkleStars, setTwinkleStars] = useState<SpawnedTwinkleStar[]>([]);
  const [revealedConstellations, setRevealedConstellations] = useState<string[]>([]);

  useEffect(() => {
    setUseLocalApodIllustration(false);
  }, [nasaData.apod.url]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const isPt = lang === 'pt';
  const {
    INSTRUMENTS,
    ORBITS,
    RESOURCE_META,
    ROCKETS,
    SOL_SCENARIOS,
  } = getLocalizedMissionData(lang);

  const handleSkyClick = (xPct: number, yPct: number) => {
    playToolPickupSound();
    const hues: ('amber' | 'sky' | 'white')[] = ['amber', 'sky', 'white'];
    const newStars: SpawnedTwinkleStar[] = [
      {
        id: `${Date.now()}-${Math.random()}`,
        xPct,
        yPct,
        size: 16 + Math.round(Math.random() * 10),
        hue: hues[Math.floor(Math.random() * hues.length)],
      },
      {
        id: `${Date.now()}-s2-${Math.random()}`,
        xPct: Math.max(4, Math.min(96, xPct + (Math.random() * 8 - 4))),
        yPct: Math.max(4, Math.min(90, yPct + (Math.random() * 8 - 4))),
        size: 10 + Math.round(Math.random() * 6),
        hue: hues[Math.floor(Math.random() * hues.length)],
      },
    ];
    setTwinkleStars((prev) => [...prev.slice(-26), ...newStars]);

    setRevealedConstellations((prev) => {
      if (prev.length >= MARTIAN_CONSTELLATIONS.length) return prev;
      const next = MARTIAN_CONSTELLATIONS[prev.length];
      return next ? [...prev, next.id] : prev;
    });
  };

  const handleDrawNewApod = async () => {
    if (drawingApod) return;
    playClickSound();
    setDrawingApod(true);
    try {
      const fresh = await fetchRandomNasaApod(nasaData.apod.url);
      if (failedUrlsRef.current.has(fresh.url)) {
        setUseLocalApodIllustration(true);
      } else {
        setUseLocalApodIllustration(false);
      }
      onUpdateApod(fresh);
    } finally {
      setDrawingApod(false);
    }
  };

  const lowKeys = (Object.keys(resources) as ResourceKey[]).filter((k) => resources[k] < 35);
  const isGoldVictory = lowKeys.length === 0;
  const isHeroicSurvival =
    resources.energy < 15 ||
    resources.lifeSupport < 15 ||
    resources.shield < 15 ||
    resources.comms < 15;

  const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket) || ROCKETS[0];
  const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit) || ORBITS[0];
  const instruments = INSTRUMENTS.filter((i) => hangarConfig.instruments.includes(i.id));

  const instrumentScience = instruments.reduce((s, i) => s + i.scienceBonus, 0);
  const resourceEfficiency = Math.round(
    (resources.energy + resources.lifeSupport + resources.shield + resources.comms) / 4
  );
  const totalScore = Math.max(100, instrumentScience * 10 + resourceEfficiency * 5 - penaltyPoints);

  const crewDisplay =
    playMode === 'team'
      ? teamNames
          .slice(0, teamCount)
          .map((n, i) => n.trim() || (isPt ? `Jogador ${i + 1}` : `Player ${i + 1}`))
          .join(', ')
      : playerName.trim() || (isPt ? 'Guardião(ã) Espacial' : 'Space Guardian');

  const missionCode = `ARES-${hangarConfig.rocket === 'light' ? 'L' : 'H'}${
    hangarConfig.orbit === 'high' ? 'A' : 'B'
  }-${totalScore}`;

  const riskyChoices = choiceHistory.filter((c) => c.enteredDanger);

  const handleCopyChallenge = async () => {
    playClickSound();
    const title = isGoldVictory
      ? isPt
        ? 'Guardião Ouro da Base Ares'
        : 'Gold Guardian of Ares Base'
      : isPt
        ? 'Sobrevivente de Marte'
        : 'Mars Survivor';

    const text = isPt
      ? `🚀 Completei a Missão Sol-4: Guardiões da Base Ares!\n🏅 Título: ${title}\n👨‍🚀 Tripulação: ${crewDisplay}\n🛰️ Nave: ${rocket.name} + ${orbit.name} (${missionCode})\n🔬 Pontuação Científica: ${totalScore} pts\n📊 Energia ${resources.energy}% | Suporte ${resources.lifeSupport}% | Escudo ${resources.shield}% | Rádio ${resources.comms}%\n\n“Quando o espaço apertar, continue a nadar! Quack!” — Você consegue bater meu placar usando dados reais da NASA?`
      : `🚀 I completed Mission Sol-4: Guardians of Ares Base!\n🏅 Title: ${title}\n👨‍🚀 Crew: ${crewDisplay}\n🛰️ Ship: ${rocket.name} + ${orbit.name} (${missionCode})\n🔬 Science Score: ${totalScore} pts\n📊 Energy ${resources.energy}% | Life Support ${resources.lifeSupport}% | Shield ${resources.shield}% | Comms ${resources.comms}%\n\n“When space gets tough, just keep swimming! Quack!” — Can you beat my score using real NASA data?`;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Ignore clipboard denial cleanly
      }
    }

    setCopiedChallenge(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      copyTimerRef.current = null;
      setCopiedChallenge(false);
    }, 3000);
  };

  return (
    <>
      <MartianStargazingBackdrop
        lang={lang}
        stars={twinkleStars}
        revealedIds={revealedConstellations}
        onSkyClick={handleSkyClick}
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 pb-[110px] pointer-events-none">
        {/* Festive Mambo Celebration Stage */}
        <section className="pointer-events-auto space-y-4">
          <MamboPartyBanner avatarId={avatarId} lang={lang} />

          <div className="rounded-2xl border border-amber-400/50 bg-white dark:border-amber-500/35 dark:bg-[#10182E]/95 p-5 text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {isPt
                  ? 'MISSÃO COMPLETA: RESGATAMOS O COMANDANTE QUACK! 🚀🦆'
                  : 'MISSION COMPLETE: WE RESCUED COMMANDER QUACK! 🚀🦆'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
              {isPt
                ? '🎉 Resgate Concluído & Grande Festa Dançando Mambo em Marte! 🎶'
                : '🎉 Rescue Complete & Grand Mambo Celebration on Mars! 🎶'}
            </h1>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200 max-w-3xl mx-auto">
              {isPt
                ? '“Missão completa — vocês vieram da Terra e me resgataram! Sorria e acene, e lembre-se: quando o espaço apertar, continue a nadar! Quack! Agora vamos comemorar antes de voltar para casa!”'
                : '“Mission complete — you flew from Earth and rescued me! Smile and wave, and remember: when space gets tough, just keep swimming! Quack! Now let’s celebrate before heading home!”'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPt
                ? 'Comandante Quack, os Guardiões no palco e toda a platéia de Carrapatos ETs estão comemorando juntos!'
                : 'Commander Quack, the Guardians on stage, and the whole crowd of Alien Ticks are celebrating together!'}
            </p>
          </div>
        </section>

        {/* Interactive Martian Night Sky Observatory */}
        <div className="pointer-events-auto">
          <MartianObservatoryCard
            lang={lang}
            ageProfile={ageProfile}
            stars={twinkleStars}
            revealedIds={revealedConstellations}
            onSkyClick={handleSkyClick}
          />
        </div>

        {/* Official Mission Certificate + Random NASA APOD Card */}
        <div className="pointer-events-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section
            className={`lg:col-span-7 rounded-2xl border p-6 space-y-5 ${
              isGoldVictory
                ? 'border-amber-400 bg-white dark:border-amber-400/70 dark:bg-gradient-to-br dark:from-[#17213B] dark:to-[#0F172A]'
                : 'border-sky-400/60 bg-white dark:bg-[#10182E]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-start gap-3.5">
                <MissionPatchLogo size={64} lang={lang} className="shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                    {isPt ? 'Passaporte Oficial · Missão Sol-4' : 'Official Passport · Mission Sol-4'}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {isGoldVictory
                      ? isPt
                        ? '🏆 Guardião Ouro da Base Ares'
                        : '🏆 Gold Guardian of Ares Base'
                      : isPt
                        ? '🛡️ Sobrevivente de Marte'
                        : '🛡️ Mars Survivor'}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {isGoldVictory
                      ? isPt
                        ? 'Maestria em Engenharia Sistêmica: todos os 4 sistemas terminaram acima de 35%!'
                        : 'Systems Engineering Mastery: every gauge finished at 35% or above!'
                      : isHeroicSurvival
                        ? isPt
                          ? 'Sobrevivência Heroica! Veja abaixo por que algumas barras ficaram baixas e tente o Título Ouro (>35% em tudo).'
                          : 'Heroic Survival! Check the diagnosis below to see why systems dipped and aim for Gold (>35% everywhere).'
                        : isPt
                          ? 'Você completou os 4 Sols! Veja abaixo o diagnóstico do que reduziu seus pontos para buscar o Título Ouro.'
                          : 'You survived all 4 Sols! See the breakdown below on why a gauge ended under 35% so you can chase Gold.'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {isPt ? 'Pontuação Científica' : 'Science Score'}
                </span>
                <span className="font-mono-tabular text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {totalScore} pts
                </span>
                {penaltyPoints > 0 && (
                  <span className="block text-[10px] text-rose-600 dark:text-rose-400">
                    (-{penaltyPoints} {isPt ? 'penalidade de risco' : 'risk penalty'})
                  </span>
                )}
              </div>
            </div>

            {/* Clear "Why didn't I get Gold?" diagnostic when not Gold */}
            {!isGoldVictory && (
              <div className="rounded-xl border border-amber-400/60 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-950/35 p-3.5 text-xs space-y-1.5">
                <p className="flex items-center gap-1.5 font-extrabold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    {isPt
                      ? 'Por que a missão não atingiu o Título Ouro?'
                      : 'Why didn’t the ship earn Gold Status?'}
                  </span>
                </p>
                <p className="leading-relaxed text-amber-950 dark:text-amber-100">
                  {isPt
                    ? `Sistemas abaixo de 35%: ${lowKeys.map((k) => `${RESOURCE_META[k].label} (${resources[k]}%)`).join(', ')}. `
                    : `Systems below 35%: ${lowKeys.map((k) => `${RESOURCE_META[k].label} (${resources[k]}%)`).join(', ')}. `}
                  {riskyChoices.length > 0
                    ? isPt
                      ? `As decisões em ${riskyChoices.map((c) => `Sol ${c.sol} (“${c.cardTitle}”)`).join(', ')} tiveram trade-offs pesados que derrubaram as reservas. `
                      : `Your choices in ${riskyChoices.map((c) => `Sol ${c.sol} (“${c.cardTitle}”)`).join(', ')} carried steep trade-offs that drained reserves. `
                    : ''}
                  {hangarConfig.rocket === 'heavy'
                    ? isPt
                      ? 'Além disso, o Foguete Pesado consumiu -8% de Energia logo no lançamento e reduziu sua folga de orçamento.'
                      : 'Also, the Heavy Rocket burned -8% Energy at liftoff and reduced spare cash for Sol 2.'
                    : isPt
                      ? 'Dica: tente equilibrar cartas híbridas (Carta C) e usar os bônus de Órbita/Orçamento no Hangar!'
                      : 'Tip: balance hybrid options (Card C) and combine Hangar Orbit/Budget bonuses!'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3">
                <span className="text-slate-500 dark:text-slate-400">
                  {isPt ? 'Tripulação Guardiã' : 'Guardian Crew'}
                </span>
                <p className="mt-0.5 font-bold text-slate-900 dark:text-white">{crewDisplay}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3">
                <span className="text-slate-500 dark:text-slate-400">
                  {isPt ? 'Código da Nave' : 'Spacecraft Code'}
                </span>
                <p className="mt-0.5 font-mono-tabular font-bold text-sky-700 dark:text-sky-300">
                  {missionCode} · {rocket.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(RESOURCE_META) as ResourceKey[]).map((key) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-2.5 text-center"
                >
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {RESOURCE_META[key].label}
                  </span>
                  <span className="mt-0.5 block font-mono-tabular text-base font-extrabold text-slate-900 dark:text-white">
                    {resources[key]}%
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Award className="h-4 w-4" />{' '}
                {isPt
                  ? `Selos Conquistados (${unlockedBadges.length}/4)`
                  : `Mission Badges Unlocked (${unlockedBadges.length}/4)`}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SOL_SCENARIOS.map((s) => {
                  const earned = unlockedBadges.includes(s.badge.id);
                  return (
                    <div
                      key={s.badge.id}
                      className={`rounded-xl border px-3 py-2 text-xs ${
                        earned
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/35 dark:text-emerald-100'
                          : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-[#0B1224] dark:text-slate-500'
                      }`}
                    >
                      <p className="font-bold">{s.badge.title}</p>
                      <p className="text-[10px] opacity-80">{s.badge.nasaConnection}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyChallenge}
                className="flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-slate-950 hover:bg-emerald-300 transition-colors"
              >
                {copiedChallenge ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span>
                  {copiedChallenge
                    ? isPt
                      ? 'Resumo Copiado!'
                      : 'Challenge Copied!'
                    : isPt
                      ? 'Desafiar um Amigo'
                      : 'Challenge a Friend'}
                </span>
              </button>
              {!isGoldVictory && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onBackToHangar();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/25 px-4 py-3 text-sm font-bold"
                >
                  <span>{isPt ? 'Buscar Ouro no Hangar' : 'Retry Hangar for Gold'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onPlayAgain();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 px-4 py-3 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{isPt ? 'Jogar Nova Missão' : 'Play New Mission'}</span>
              </button>
            </div>
          </section>

          {/* Random NASA APOD Memory Card */}
          <section className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#10182E] p-5 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                {isPt
                  ? `Lembrança Espacial Aleatória · NASA APOD (${nasaData.apod.date})`
                  : `Random Space Memory · NASA APOD (${nasaData.apod.date})`}
              </p>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {nasaData.apod.title}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-[#080D1A] aspect-[4/3]">
              {useLocalApodIllustration ? (
                <LocalMartianSpaceFallbackSvg isPt={isPt} />
              ) : (
                <img
                  src={nasaData.apod.url}
                  alt={nasaData.apod.title}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    failedUrlsRef.current.add(nasaData.apod.url);
                    if (failedUrlsRef.current.size <= 1) {
                      const fallback = pickRandomVerifiedMemory(nasaData.apod.url);
                      if (!failedUrlsRef.current.has(fallback.url)) {
                        onUpdateApod(fallback);
                        return;
                      }
                    }
                    setUseLocalApodIllustration(true);
                  }}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
              {nasaData.apod.explanation}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {nasaData.apod.isFallback
                  ? isPt
                    ? 'Acervo Verificado NASA'
                    : 'Verified NASA Archive'
                  : isPt
                    ? 'NASA APOD Ao Vivo'
                    : 'Live NASA APOD'}
              </span>
              <button
                type="button"
                disabled={drawingApod}
                onClick={handleDrawNewApod}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 disabled:opacity-60 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${drawingApod ? 'animate-spin' : ''}`} />
                <span>
                  {drawingApod
                    ? isPt
                      ? 'Sorteando...'
                      : 'Drawing...'
                    : isPt
                      ? '🔄 Sortear Outra Lembrança NASA'
                      : '🔄 Draw Another NASA Photo'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Clean Action Bar for Real Science Lab & Parents/Teachers Guide Modals */}
        <section className="pointer-events-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenInfoHub('explorer');
            }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-sky-400 dark:border-slate-800 dark:bg-[#10182E] dark:hover:border-sky-400/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
                <Microscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isPt ? 'Laboratório de Ciência Real' : 'Real Science Lab'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isPt
                    ? 'Visão Explorador, Visão Técnica NASA e Artigos Científicos'
                    : 'Explorer View, NASA Technical Lineage & Peer-Reviewed Papers'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {isPt ? 'Abrir ➔' : 'Open ➔'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenInfoHub('parents');
            }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-400 dark:border-slate-800 dark:bg-[#10182E] dark:hover:border-emerald-400/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isPt
                    ? 'Área Pais & Professores · Debate'
                    : 'Parents & Teachers · Classroom Guide'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isPt
                    ? '3 perguntas disparadoras, perfis e referências NASA'
                    : '3 discussion prompts, reading profiles & NASA references'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {isPt ? 'Abrir ➔' : 'Open ➔'}
            </span>
          </button>
        </section>

        {/* Collapsible End-to-End Technical Lineage Diagram (collapsed by default) */}
        <section className="pointer-events-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#10182E] overflow-hidden">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setLineageOpen((prev) => !prev);
            }}
            aria-expanded={lineageOpen}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {isPt
                    ? 'Linhagem de Dados NASA de Ponta a Ponta (Opcional)'
                    : 'End-to-End NASA Data Lineage (Optional)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isPt
                    ? 'Diagrama interativo ligando Hangar e Sols aos conjuntos OSD-120, MEDA e DONKI'
                    : 'Interactive diagram linking your Hangar & Sol choices to OSD-120, MEDA & DONKI telemetry'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 shrink-0">
              <span>
                {lineageOpen
                  ? isPt
                    ? 'Ocultar'
                    : 'Hide'
                  : isPt
                    ? 'Expandir'
                    : 'Expand'}
              </span>
              {lineageOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </button>

          {lineageOpen && (
            <div className="border-t border-slate-200 dark:border-slate-800 p-5 sm:p-6">
              <TechnicalLineagePanel
                lang={lang}
                nasaData={nasaData}
                ageProfile={ageProfile}
                hangarConfig={hangarConfig}
                resources={resources}
                choiceHistory={choiceHistory}
                initialView="technical"
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
};
