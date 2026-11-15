import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  FlaskConical,
  HeartPulse,
  HelpCircle,
  MapPin,
  Radio,
  Search,
  Shield,
  Wrench,
  X,
} from 'lucide-react';
import workshopImg from '../assets/images/mars_space_workshop_1794706252297.jpg';
import {
  BASE_HOTSPOTS,
  RESOURCE_META,
  SOL_SCENARIOS,
  TEAM_ROLES,
} from '../data/missionData';
import {
  AgeProfile,
  HotspotInfo,
  NasaDataBundle,
  PlayMode,
  QuackExpression,
  ResourceDelta,
  ResourceKey,
  Resources,
  SolCard,
} from '../types/game';
import { playClickSound, playToolPickupSound } from '../utils/sound';
import { GlossaryInline } from './GlossaryButton';
import { QuackMascot } from './QuackMascot';

interface Screen3CommandProps {
  currentSol: 1 | 2 | 3 | 4;
  resources: Resources;
  lastDelta: ResourceDelta | null;
  ageProfile: AgeProfile;
  playMode: PlayMode;
  teamNames: string[];
  teamCount: number;
  soloName: string;
  nasaData: NasaDataBundle;
  onChooseCard: (card: SolCard) => void;
}

const METHOD_STEPS = ['Observação', 'Hipótese', 'Experimento', 'Conclusão'] as const;

const LOST_WORKSHOP_TOOLS = [
  {
    id: 'torque',
    label: 'Chave de Torque',
    hint: 'Perto da bancada inferior à esquerda',
    top: '68%',
    left: '21%',
    rotate: '-26deg',
  },
  {
    id: 'multimeter',
    label: 'Multímetro',
    hint: 'Escondido na estante metálica central',
    top: '46%',
    left: '49%',
    rotate: '14deg',
  },
  {
    id: 'kapton',
    label: 'Fita Kapton',
    hint: 'Presa perto dos cabos no teto à esquerda',
    top: '17%',
    left: '31%',
    rotate: '-12deg',
  },
] as const;

const ToolSvg: React.FC<{ id: 'torque' | 'multimeter' | 'kapton' }> = ({ id }) => {
  if (id === 'torque') {
    return (
      <svg viewBox="0 0 64 32" className="w-12 h-7 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        <path
          d="M12 10 C6 10, 4 16, 8 20 C11 23, 16 21, 18 18 L46 18 C48 21, 53 23, 57 19 C60 15, 58 9, 52 10 L50 14 L54 15 L52 17 L48 16 L46 13 L18 13 C16 11, 14 10, 12 10 Z"
          fill="#E2E8F0"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <rect x="24" y="13" width="16" height="5" rx="1.5" fill="#F97316" />
      </svg>
    );
  }
  if (id === 'multimeter') {
    return (
      <svg viewBox="0 0 40 52" className="w-9 h-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        <rect x="6" y="4" width="28" height="42" rx="5" fill="#FACC15" stroke="#854D0E" strokeWidth="1.8" />
        <rect x="10" y="9" width="20" height="12" rx="2" fill="#0F172A" />
        <text x="13" y="18" fill="#38BDF8" fontSize="7" fontFamily="monospace" fontWeight="bold">
          12.4
        </text>
        <circle cx="20" cy="30" r="6" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
        <line x1="20" y1="30" x2="23" y2="26" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="41" r="2" fill="#DC2626" />
        <circle cx="26" cy="41" r="2" fill="#0F172A" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
      <circle cx="24" cy="24" r="16" fill="#F59E0B" stroke="#92400E" strokeWidth="1.8" />
      <circle cx="24" cy="24" r="12" fill="#FBBF24" />
      <circle cx="24" cy="24" r="6.5" fill="#1E293B" stroke="#78350F" strokeWidth="1.4" />
      <path d="M36 14 L45 10 L46 18 L38 22 Z" fill="#FCD34D" fillOpacity="0.9" />
    </svg>
  );
};

export const Screen3Command: React.FC<Screen3CommandProps> = ({
  currentSol,
  resources,
  lastDelta,
  ageProfile,
  playMode,
  teamNames,
  teamCount,
  soloName,
  nasaData,
  onChooseCard,
}) => {
  const scenario = SOL_SCENARIOS.find((s) => s.sol === currentSol) || SOL_SCENARIOS[0];

  const [hotspotsModalOpen, setHotspotsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo>(BASE_HOTSPOTS[0]);

  // Sol 3 workshop search minigame state
  const [collectedTools, setCollectedTools] = useState<string[]>([]);
  const [minigameTimer, setMinigameTimer] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [workshopImgError, setWorkshopImgError] = useState(false);

  const isSol3Locked =
    scenario.requiresMinigame && collectedTools.length < LOST_WORKSHOP_TOOLS.length;

  useEffect(() => {
    setHotspotsModalOpen(false);
    if (currentSol === 3) {
      setCollectedTools([]);
      setMinigameTimer(15);
      setShowHint(false);
    }
  }, [currentSol]);

  useEffect(() => {
    if (!isSol3Locked) return;
    const id = window.setInterval(() => {
      setMinigameTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isSol3Locked]);

  const handleCollectTool = (toolId: string) => {
    if (collectedTools.includes(toolId)) return;
    playToolPickupSound();
    setCollectedTools((prev) => [...prev, toolId]);
  };

  // Automatic Quack expression: worried/terror if ANY resource is in danger (<35%) or 0%
  const isInDanger =
    resources.energy < 35 ||
    resources.lifeSupport < 35 ||
    resources.shield < 35 ||
    resources.comms < 35;

  const autoExpression: QuackExpression = isInDanger ? 'terror' : scenario.quackExpression;

  // Team turn rotation
  const activePlayerIdx = (currentSol - 1) % Math.max(1, teamCount);
  const activeRole = TEAM_ROLES[activePlayerIdx];
  const activePlayerName =
    playMode === 'team'
      ? teamNames[activePlayerIdx]?.trim() || `Jogador ${activePlayerIdx + 1}`
      : soloName.trim() || 'Guardião(ã)';

  const renderResourceIcon = (key: ResourceKey) => {
    if (key === 'energy') return <BatteryCharging className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
    if (key === 'lifeSupport') return <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    if (key === 'shield') return <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
    return <Radio className="h-4 w-4 text-violet-600 dark:text-violet-400" />;
  };

  const renderEffectsRow = (effects: ResourceDelta) => {
    const entries = (Object.entries(effects) as [ResourceKey, number][]).filter(
      ([, v]) => v !== 0
    );
    return (
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([key, val]) => {
          const isPositive = val > 0;
          return (
            <span
              key={key}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 font-mono-tabular text-[11px] font-bold ${
                isPositive
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              <span>{isPositive ? `+${val}%` : `${val}%`}</span>
              <span className="font-sans font-medium">{RESOURCE_META[key].shortLabel}</span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-20">
      {/* Top HUD: Turn Indicator + 4 Resource Bars + Scientific Method Tracker */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-4 backdrop-blur-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono-tabular font-bold text-orange-600 dark:text-orange-400">
              SOL {currentSol} / 4
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {playMode === 'team'
                ? `Turno de ${activePlayerName} (${activeRole.role})`
                : `Comandante: ${activePlayerName}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <FlaskConical className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 mr-0.5" />
            {METHOD_STEPS.map((step, i) => {
              const isCurrent = step === scenario.methodStep;
              const isDone = i < currentSol - 1;
              return (
                <React.Fragment key={step}>
                  <span
                    className={`rounded-md px-2 py-0.5 font-semibold ${
                      isCurrent
                        ? 'bg-sky-500 text-slate-950'
                        : isDone
                          ? 'text-emerald-600 dark:text-emerald-300'
                          : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step}
                  </span>
                  {i < METHOD_STEPS.length - 1 && (
                    <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                      ➔
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(RESOURCE_META) as ResourceKey[]).map((key) => {
            const meta = RESOURCE_META[key];
            const val = resources[key];
            const delta = lastDelta?.[key];
            const isDanger = val < 35;
            return (
              <div
                key={key}
                className={`relative rounded-xl border p-3 ${
                  isDanger
                    ? 'border-rose-400 bg-rose-50 dark:border-rose-500/60 dark:bg-rose-950/25'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224]'
                }`}
              >
                {typeof delta === 'number' && delta !== 0 && (
                  <span
                    key={`${currentSol}-${key}-${delta}`}
                    className={`animate-float-delta pointer-events-none absolute right-3 top-2 font-mono-tabular text-xs font-extrabold ${
                      delta > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {delta > 0 ? `+${delta}%` : `${delta}%`}
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {renderResourceIcon(key)}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {meta.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono-tabular text-sm font-extrabold ${
                      isDanger
                        ? 'text-rose-600 dark:text-rose-300'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {val}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDanger ? 'bg-rose-500' : meta.barBg
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                  />
                </div>
                {isDanger && (
                  <p className="mt-1 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                    ▲ Perigo (&lt;35%)
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Focused Theatrical Sol Stage (Hotspots moved to clean modal!) */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-5 backdrop-blur-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              {scenario.actLabel}
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {scenario.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setHotspotsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60"
          >
            <MapPin className="h-4 w-4" />
            <span>Inspecionar Base Ares (4 Hotspots)</span>
          </button>
        </div>

        {isInDanger && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-rose-400 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-800 dark:border-rose-500/50 dark:bg-rose-950/50 dark:text-rose-200"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Comandante Quack está preocupado! Um sistema caiu abaixo de 35% — se chegar a 0%, você perde a missão!
            </span>
          </div>
        )}

        {scenario.earthTransmission && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-100">
            {scenario.earthTransmission}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4">
          <div className="shrink-0">
            <QuackMascot expression={autoExpression} size={126} />
          </div>
          <div className="space-y-2.5">
            <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100">
              {scenario.quackQuoteByProfile[ageProfile]}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Termos NASA:</span>
              {currentSol === 1 && (
                <>
                  <GlossaryInline termKey="biofilmes" ageProfile={ageProfile} />
                  <GlossaryInline termKey="meda" ageProfile={ageProfile} />
                </>
              )}
              {currentSol === 2 && (
                <>
                  <GlossaryInline termKey="x87" ageProfile={ageProfile}>
                    Explosão {nasaData.donkiFlare.classType}
                  </GlossaryInline>
                  <GlossaryInline termKey="jezero" ageProfile={ageProfile} />
                </>
              )}
              {currentSol === 3 && (
                <>
                  <GlossaryInline termKey="veggie" ageProfile={ageProfile} />
                  <GlossaryInline termKey="kapton" ageProfile={ageProfile} />
                </>
              )}
              {currentSol === 4 && (
                <>
                  <GlossaryInline termKey="jezero" ageProfile={ageProfile} />
                  <GlossaryInline termKey="meda" ageProfile={ageProfile} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sol 3 Interactive Workshop Search Minigame (disappears once all 3 tools are found!) */}
      {isSol3Locked ? (
        <section className="rounded-2xl border border-amber-400/60 bg-white/95 dark:border-amber-500/40 dark:bg-[#121C35]/95 p-5 backdrop-blur-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Oficina em Microgravidade: Encontre as 3 Ferramentas Perdidas!
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Vasculhe a oficina da Base Ares abaixo e clique nas 3 ferramentas escondidas ({collectedTools.length}/3).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowHint((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showHint ? 'Ocultar dica' : 'Dica de busca'}</span>
              </button>
              <span className="font-mono-tabular rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300">
                {minigameTimer > 0 ? `Tempo: ${minigameTimer}s` : 'Continue procurando!'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {LOST_WORKSHOP_TOOLS.map((tool) => {
              const found = collectedTools.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-semibold ${
                    found
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 line-through dark:border-emerald-500/50 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-[#0B1224] dark:text-slate-200'
                  }`}
                >
                  {found ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Search className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  )}
                  <span>{tool.label}</span>
                  {showHint && !found && (
                    <span className="text-[11px] font-normal text-sky-600 dark:text-sky-300">
                      ({tool.hint})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative aspect-[16/9] min-h-[250px] w-full overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-[#10182E]">
            {!workshopImgError ? (
              <img
                src={workshopImg}
                alt="Interior da oficina espacial da Base Ares em Marte"
                onError={() => setWorkshopImgError(true)}
                className="h-full w-full object-cover select-none"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_70%_40%,_#7c2d12_0%,_#1e293b_55%,_#090d16_100%)]" />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />

            {LOST_WORKSHOP_TOOLS.map((tool, index) => {
              const collected = collectedTools.includes(tool.id);
              if (collected) {
                return (
                  <div
                    key={tool.id}
                    style={{ top: tool.top, left: tool.left }}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400 bg-emerald-950/90 p-2 text-emerald-300 shadow-lg"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                );
              }
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleCollectTool(tool.id)}
                  style={{
                    top: tool.top,
                    left: tool.left,
                    transform: `translate(-50%, -50%) rotate(${tool.rotate})`,
                    animationDelay: `${index * 0.45}s`,
                  }}
                  title={`Pegar ${tool.label}`}
                  aria-label={`Pegar ${tool.label} perdida na oficina`}
                  className="animate-float-zero-g group absolute flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-1.5 transition-transform hover:scale-125 focus-visible:outline-2 focus-visible:outline-amber-300"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-300/10 ring-1 ring-amber-300/35 group-hover:bg-amber-300/25 group-hover:ring-amber-300" />
                  <ToolSvg id={tool.id} />
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        /* 3 Balanced Trade-Off Cards */
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Escolha Sua Ação de Engenharia (Obrigatório Escolher 1 Carta)
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Cuidado: escolhas erradas podem zerar seus sistemas!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenario.cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onChooseCard(card);
                }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500 dark:border-slate-800 dark:bg-[#10182E]/95 dark:hover:border-orange-400/80 dark:hover:bg-[#14203B] focus-visible:outline-2 focus-visible:outline-orange-400"
              >
                <div className="space-y-2.5">
                  <span className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-orange-400">
                    CARTA {card.id} · {card.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-200">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {card.summaryByProfile[ageProfile]}
                  </p>
                  {card.bonusNote && (
                    <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                      {card.bonusNote}
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
                  {renderEffectsRow(card.effects)}
                  <span className="block text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:underline">
                    Executar esta ação ➔
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modal: Base Ares Hotspots Inspector (keeps main screen clean!) */}
      {hotspotsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setHotspotsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#10182E] p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Mapa Tátil da Base Ares
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Toque em cada módulo para ver a ciência real da NASA em operação.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHotspotsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Fechar mapa da base"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {BASE_HOTSPOTS.map((spot) => {
                const isSelected = selectedHotspot.id === spot.id;
                const val = resources[spot.relatedResource];
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedHotspot(spot);
                    }}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-500/15'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {spot.shortTag}
                      </span>
                      <Search className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    </div>
                    <span className="mt-1 font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                      {RESOURCE_META[spot.relatedResource].shortLabel}: {val}%
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3.5 text-xs dark:border-sky-500/35 dark:bg-sky-950/35 space-y-1.5">
              <p className="font-bold text-sky-800 dark:text-sky-300">
                {selectedHotspot.label} · {selectedHotspot.nasaDataset}
              </p>
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                {selectedHotspot.summaryByProfile[ageProfile]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHotspotsModalOpen(false)}
              className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
            >
              Voltar ao Comando
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
