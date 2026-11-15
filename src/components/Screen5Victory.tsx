import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  MessageSquare,
  Microscope,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CLASSROOM_DEBATE_QUESTIONS,
  INSTRUMENTS,
  ORBITS,
  PEER_REVIEWED_REFERENCES,
  RESOURCE_META,
  ROCKETS,
  SOL_SCENARIOS,
  TECHNICAL_LINEAGE_ROWS,
} from '../data/missionData';
import {
  fetchRandomNasaApod,
  pickRandomVerifiedMemory,
} from '../services/nasaApi';
import {
  AgeProfile,
  AvatarId,
  BadgeId,
  HangarConfig,
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
import { MamboPartyBanner } from './SpaceVisuals';

interface Screen5VictoryProps {
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
  nasaData: NasaDataBundle;
  onUpdateApod: (newApod: NasaApodData) => void;
  onPlayAgain: () => void;
  onBackToHangar: () => void;
}

export const Screen5Victory: React.FC<Screen5VictoryProps> = ({
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
  nasaData,
  onUpdateApod,
  onPlayAgain,
  onBackToHangar,
}) => {
  const [labView, setLabView] = useState<'explorer' | 'technical'>('explorer');
  const [copiedChallenge, setCopiedChallenge] = useState(false);
  const [drawingApod, setDrawingApod] = useState(false);
  const [activeVictoryModal, setActiveVictoryModal] = useState<'classroom' | 'science' | null>(null);

  // Stargazing state shared between background sky clicks and Observatory sky dome
  const [twinkleStars, setTwinkleStars] = useState<SpawnedTwinkleStar[]>([]);
  const [revealedConstellations, setRevealedConstellations] = useState<string[]>([]);

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
    const fresh = await fetchRandomNasaApod(nasaData.apod.url);
    onUpdateApod(fresh);
    setDrawingApod(false);
  };

  const isGoldVictory =
    resources.energy >= 35 &&
    resources.lifeSupport >= 35 &&
    resources.shield >= 35 &&
    resources.comms >= 35;

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
          .map((n, i) => n.trim() || `Jogador ${i + 1}`)
          .join(', ')
      : playerName.trim() || 'Guardião(ã) Espacial';

  const missionCode = `ARES-${hangarConfig.rocket === 'light' ? 'L' : 'H'}${
    hangarConfig.orbit === 'high' ? 'A' : 'B'
  }-${totalScore}`;

  const handleCopyChallenge = async () => {
    playClickSound();
    const title = isGoldVictory ? 'Guardião Ouro da Base Ares' : 'Sobrevivente de Marte';
    const text = `🚀 Completei a Missão Sol-4: Guardiões da Base Ares!\n🏅 Título: ${title}\n👨‍🚀 Tripulação: ${crewDisplay}\n🛰️ Nave: ${rocket.name} + ${orbit.name} (${missionCode})\n🔬 Pontuação Científica: ${totalScore} pts\n📊 Energia ${resources.energy}% | Suporte ${resources.lifeSupport}% | Escudo ${resources.shield}% | Rádio ${resources.comms}%\n\n“Quando o espaço apertar, continue a nadar! Quack!” — Você consegue bater meu placar usando dados reais da NASA?`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedChallenge(true);
      window.setTimeout(() => setCopiedChallenge(false), 3000);
    } catch {
      setCopiedChallenge(true);
      window.setTimeout(() => setCopiedChallenge(false), 3000);
    }
  };

  return (
    <>
      {/* Full-bleed interactive Martian night sky background */}
      <MartianStargazingBackdrop
        stars={twinkleStars}
        revealedIds={revealedConstellations}
        onSkyClick={handleSkyClick}
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 pb-20 pointer-events-none">
        {/* Festive Minions-with-Gru Mambo Celebration Stage */}
        <section className="pointer-events-auto space-y-4">
          <MamboPartyBanner avatarId={avatarId} />

          <div className="rounded-2xl border border-amber-400/50 bg-white/95 dark:border-amber-500/35 dark:bg-[#10182E]/90 p-5 text-center backdrop-blur-md space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>FESTA MAMBO NA BASE ARES</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
              “Missão cumprida! Sorria e acene — e lembre-se: quando o espaço apertar, continue a nadar! Quack!”
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Comandante Quack, os Guardiões no palco e toda a platéia de Carrapatos ETs estão comemorando!
            </p>
          </div>
        </section>

        {/* Observação de Estrelas Interativa no Hemisfério Marciano */}
        <div className="pointer-events-auto">
          <MartianObservatoryCard
            ageProfile={ageProfile}
            stars={twinkleStars}
            revealedIds={revealedConstellations}
            onSkyClick={handleSkyClick}
          />
        </div>

        {/* Official Mission Certificate + Random NASA APOD Card */}
        <div className="pointer-events-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section
            className={`lg:col-span-7 rounded-2xl border p-6 backdrop-blur-md space-y-5 ${
              isGoldVictory
                ? 'border-amber-400 bg-white/95 dark:border-amber-400/70 dark:bg-gradient-to-br dark:from-[#17213B]/95 dark:to-[#0F172A]/95'
                : 'border-sky-400/60 bg-white/95 dark:bg-[#10182E]/95'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                  Passaporte Oficial · Missão Sol-4
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {isGoldVictory
                    ? '🏆 Guardião Ouro da Base Ares'
                    : '🛡️ Sobrevivente de Marte'}
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {isGoldVictory
                    ? 'Maestria em Engenharia Sistêmica: todos os 4 sistemas terminaram acima de 35%!'
                    : isHeroicSurvival
                      ? 'Sobrevivência Heroica! Que tal testar outra combinação no Hangar para buscar o Título Ouro (>35% em tudo)?'
                      : 'Você completou os 4 Sols! Tente manter todas as 4 barras ≥ 35% para conquistar o Título Ouro.'}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  Pontuação Científica
                </span>
                <span className="font-mono-tabular text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {totalScore} pts
                </span>
                {penaltyPoints > 0 && (
                  <span className="block text-[10px] text-rose-600 dark:text-rose-400">
                    (-{penaltyPoints} penalidade de risco)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3">
                <span className="text-slate-500 dark:text-slate-400">Tripulação Guardiã</span>
                <p className="mt-0.5 font-bold text-slate-900 dark:text-white">{crewDisplay}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3">
                <span className="text-slate-500 dark:text-slate-400">Código da Nave</span>
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
                <Award className="h-4 w-4" /> Selos Conquistados ({unlockedBadges.length}/4)
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
                  {copiedChallenge ? 'Resumo Copiado para WhatsApp!' : 'Desafiar um Amigo'}
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
                  <span>Buscar Ouro no Hangar</span>
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
                <span>Jogar Nova Missão</span>
              </button>
            </div>
          </section>

          {/* Random NASA APOD Memory Card */}
          <section className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-5 backdrop-blur-md space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                Lembrança Espacial Aleatória · NASA APOD ({nasaData.apod.date})
              </p>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {nasaData.apod.title}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-[#080D1A] aspect-[4/3]">
              <img
                src={nasaData.apod.url}
                alt={nasaData.apod.title}
                referrerPolicy="no-referrer"
                onError={() => {
                  const fallback = pickRandomVerifiedMemory(nasaData.apod.url);
                  onUpdateApod(fallback);
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
              {nasaData.apod.explanation}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {nasaData.apod.isFallback
                  ? 'Acervo Verificado NASA'
                  : 'NASA APOD Ao Vivo'}
              </span>
              <button
                type="button"
                disabled={drawingApod}
                onClick={handleDrawNewApod}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 disabled:opacity-60 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${drawingApod ? 'animate-spin' : ''}`} />
                <span>
                  {drawingApod ? 'Sorteando...' : '🔄 Sortear Outra Lembrança NASA'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Clean Action Bar for Real Science Lab & Classroom Guide Modals (keeps screen uncluttered!) */}
        <section className="pointer-events-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveVictoryModal('science');
            }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-5 text-left shadow-sm hover:border-sky-400 dark:border-slate-800 dark:bg-[#10182E]/95 dark:hover:border-sky-400/60 backdrop-blur-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
                <Microscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Laboratório de Ciência Real
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visão Explorador, Linhagem Técnica NASA e Artigos Científicos
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Abrir ➔</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveVictoryModal('classroom');
            }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-5 text-left shadow-sm hover:border-emerald-400 dark:border-slate-800 dark:bg-[#10182E]/95 dark:hover:border-emerald-400/60 backdrop-blur-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Guia de Debate · Sala de Aula
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  3 perguntas disparadoras para pais, alunos e professores
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Abrir ➔</span>
          </button>
        </section>
      </div>

      {/* Modals for Real Science Lab & Classroom Guide */}
      {activeVictoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setActiveVictoryModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#10182E] p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeVictoryModal === 'science'
                  ? 'Laboratório de Ciência Real (NASA)'
                  : 'Guia de Debate em Sala de Aula & Família'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveVictoryModal(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Fechar janela"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeVictoryModal === 'science' ? (
              <div className="space-y-5">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-[#0B1224] p-1 w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setLabView('explorer');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      labView === 'explorer'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Visão Explorador
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setLabView('technical');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      labView === 'technical'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Visão Técnica
                  </button>
                </div>

                {labView === 'explorer' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
                      <p className="font-bold text-amber-600 dark:text-amber-300">☀️ Sol &amp; DONKI</p>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        A tempestade do Sol Classe <strong>{nasaData.donkiFlare.classType}</strong> aconteceu de verdade e a NASA monitora isso o tempo todo!
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
                      <p className="font-bold text-emerald-700 dark:text-emerald-300">🥬 Estufa Veggie</p>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        Astronautas cultivam alface Outredgeous no espaço usando luzes LED por <strong>16 horas por dia</strong>!
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
                      <p className="font-bold text-sky-700 dark:text-sky-300">🦠 Biofilmes nos Dutos</p>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        Micróbios formam colônias pegajosas nos canos de água espaciais — nossos famosos ‘Carrapatos ETs’!
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
                      <p className="font-bold text-violet-700 dark:text-violet-300">📡 Clima de Marte (MEDA)</p>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        Faz <strong>-85°C</strong> à noite na Cratera Jezero e o sinal de rádio leva <strong>14 minutos</strong> para chegar à Terra!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 dark:bg-[#0B1224] dark:text-slate-300">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Base / API NASA</th>
                            <th className="px-3 py-2 font-semibold">Parâmetro Real</th>
                            <th className="px-3 py-2 font-semibold">Fallback</th>
                            <th className="px-3 py-2 font-semibold">Impacto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-slate-800 dark:divide-slate-800 dark:bg-[#0F172A] dark:text-slate-200">
                          {TECHNICAL_LINEAGE_ROWS.map((row) => (
                            <tr key={row.api}>
                              <td className="px-3 py-2 font-mono-tabular font-semibold text-sky-700 dark:text-sky-300">
                                {row.api}
                              </td>
                              <td className="px-3 py-2">{row.parameter}</td>
                              <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                                {row.fallback}
                              </td>
                              <td className="px-3 py-2">{row.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-2">
                      <h3 className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                        <BookOpen className="h-4 w-4" />
                        <span>Referências Científicas Revisadas por Pares</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PEER_REVIEWED_REFERENCES.map((ref) => (
                          <div
                            key={ref.authors}
                            className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3 text-xs space-y-1"
                          >
                            <p className="font-bold text-slate-900 dark:text-white">{ref.authors}</p>
                            <p className="italic text-sky-700 dark:text-sky-300">{ref.title}</p>
                            <p className="text-slate-600 dark:text-slate-400">{ref.relevance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {CLASSROOM_DEBATE_QUESTIONS.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5"
                  >
                    <span className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-orange-400">
                      Pergunta {item.number}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.question}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.concept}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveVictoryModal(null)}
              className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
