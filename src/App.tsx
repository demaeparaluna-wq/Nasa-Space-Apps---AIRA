import { useCallback, useEffect, useState } from 'react';
import {
  Cpu,
  GraduationCap,
  Languages,
  Menu,
  Microscope,
  Moon,
  Sun,
  Target,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { InfoHubTab, MissionInfoHubModal } from './components/MissionInfoHubModal';
import { MissionPatchLogo } from './components/MissionPatchLogo';
import { NasaFooter } from './components/NasaFooter';
import { QuackChatWidget } from './components/QuackChatWidget';
import { Screen1Prologue } from './components/Screen1Prologue';
import { Screen2Hangar } from './components/Screen2Hangar';
import { Screen3Command } from './components/Screen3Command';
import { Screen4Modal } from './components/Screen4Modal';
import { Screen5Victory } from './components/Screen5Victory';
import { BackgroundEasterEggLayer } from './components/SpaceVisuals';
import { SplashScreen } from './components/SplashScreen';
import { HANGAR_BUDGET_M, INSTRUMENTS, ORBITS, ROCKETS } from './data/missionData';
import { getLocalizedMissionData } from './data/missionDataEn';
import { getArchivedFallbackBundle, loadResilientNasaData } from './services/nasaApi';
import {
  AgeProfile,
  AvatarId,
  BadgeId,
  ChoiceHistoryEntry,
  GameScreen,
  HangarConfig,
  Language,
  ModalFeedbackState,
  NasaApodData,
  NasaDataBundle,
  PlayMode,
  QuackExpression,
  ResourceDelta,
  ResourceKey,
  Resources,
  SolCard,
} from './types/game';
import {
  playBadgeUnlockSound,
  playGentleAlertSound,
  playVictoryMamboSound,
  setSoundMuted,
} from './utils/sound';

const BASE_STARTING_RESOURCES: Resources = {
  energy: 55,
  lifeSupport: 55,
  shield: 55,
  comms: 55,
};

function clampResource(val: number): number {
  return Math.max(0, Math.min(100, val));
}

function safeScrollToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    try {
      window.scrollTo(0, 0);
    } catch {
      // Ignore scroll errors in restricted containers
    }
  }
}

function computeInitialResources(config: HangarConfig): Resources {
  const next = { ...BASE_STARTING_RESOURCES };
  const rocket = ROCKETS.find((r) => r.id === config.rocket);
  if (rocket?.startingDelta) {
    (Object.entries(rocket.startingDelta) as [ResourceKey, number][]).forEach(([k, v]) => {
      next[k] = clampResource(next[k] + v);
    });
  }
  const orbit = ORBITS.find((o) => o.id === config.orbit);
  if (orbit?.delta) {
    (Object.entries(orbit.delta) as [ResourceKey, number][]).forEach(([k, v]) => {
      next[k] = clampResource(next[k] + v);
    });
  }
  INSTRUMENTS.filter((i) => config.instruments.includes(i.id)).forEach((inst) => {
    (Object.entries(inst.startingDelta) as [ResourceKey, number][]).forEach(([k, v]) => {
      next[k] = clampResource(next[k] + v);
    });
  });
  return next;
}

function buildFailurePhysics(
  lang: Language,
  resource: ResourceKey,
  nasaData: NasaDataBundle
): Record<AgeProfile, string> {
  if (lang === 'en') {
    if (resource === 'energy') {
      return {
        explorers: `The batteries ran dry and the ${nasaData.meda.nightTempC}°C Martian freeze turned Ares Base’s pipes to ice! Without power, heaters and lights shut down.`,
        strategists: `Energy hit 0%. At ${nasaData.meda.nightTempC}°C in Jezero Crater, losing electrical heating freezes water pipelines and shuts off core hardware.`,
        educators: `Thermal failure from electrical deficit: without Watts for resistive heaters, nocturnal Jezero temperatures (${nasaData.meda.nightTempC}°C MEDA) freeze the fluid loop.`,
      };
    }
    if (resource === 'lifeSupport') {
      return {
        explorers:
          'Fresh air and clean water ran out! Astronauts and Commander Quack need oxygen from Veggie plants and clean water pipes.',
        strategists:
          'Life Support reached 0%. Without biofilm-free water filtering and Veggie O₂ generation (16h LED), the habitat becomes unbreathable.',
        educators:
          'ECLSS failure: breakdown of closed-loop water recovery and photosynthetic oxygen regeneration.',
      };
    }
    if (resource === 'shield') {
      return {
        explorers:
          'The protective shield got too weak and solar flare rays plus Martian dust slammed into the base!',
        strategists: `Shield dropped to 0%. Without a planetary magnetosphere on Mars, Class ${nasaData.donkiFlare.classType} solar flare particles and dust storms damage the base.`,
        educators: `Critical radiation exposure (DONKI Class ${nasaData.donkiFlare.classType} event) due to depleted active/passive habitat shielding.`,
      };
    }
    return {
      explorers:
        'The radio went silent in space! Without the 14-minute signal back to Earth, we cannot guide our rescue ship.',
      strategists:
        'Comms fell to 0%. Across a 14-min one-way delay with an unaligned dish, telemetry with Earth mission control was lost.',
      educators:
        'Deep Space Network (DSN) link loss: without continuous telemetry across 28-min RTT latency, orbital maneuvers go blind.',
    };
  }

  if (resource === 'energy') {
    return {
      explorers: `As baterias acabaram e o frio de ${nasaData.meda.nightTempC}°C congelou os canos da Base Ares! Sem energia, os aquecedores e luzes não funcionam.`,
      strategists: `Energia chegou a 0%. A ${nasaData.meda.nightTempC}°C na Cratera Jezero, sem aquecimento elétrico, os dutos de água congelam e os equipamentos desligam.`,
      educators: `Falha térmica por déficit elétrico: sem watts para aquecedores resistivos, a temperatura noturna marciana (${nasaData.meda.nightTempC}°C MEDA) congela o sistema hídrico.`,
    };
  }
  if (resource === 'lifeSupport') {
    return {
      explorers:
        'O ar fresco e a água limpa acabaram! Os astronautas e o Comandante Quack precisam de oxigênio da Estufa Veggie e água limpa nos canos.',
      strategists:
        'Suporte de Vida chegou a 0%. Sem filtragem de água (livre de biofilmes) e sem O₂ da Estufa Veggie (16h LED), a cabine torna-se inabitável.',
      educators:
        'Colapso do Sistema de Controle Ambiental e Suporte de Vida (ECLSS): falha na reciclagem de água e produção fotossintética de oxigênio.',
    };
  }
  if (resource === 'shield') {
    return {
      explorers:
        'O escudo protetor ficou fraquinho e os raios da tempestade solar e a poeira de Marte bateram forte na base!',
      strategists: `Escudo chegou a 0%. Sem magnetosfera em Marte, partículas de explosões solares (Classe ${nasaData.donkiFlare.classType}) e tempestades de poeira danificam a nave.`,
      educators: `Exposição crítica à radiação cósmica e solar (evento DONKI Classe ${nasaData.donkiFlare.classType}) por insuficiência de blindagem ativa ou passiva.`,
    };
  }
  return {
    explorers:
      'O rádio ficou mudo no espaço! Sem o sinal de 14 minutinhos até a Terra, não conseguimos guiar a nave de resgate.',
    strategists:
      'Comunicações chegaram a 0%. Com o atraso de 14 min só de ida e sem antena alinhada, perdeu-se a telemetria com o controle da missão.',
    educators:
      'Perda de enlace na Rede de Espaço Profundo (DSN): sem telemetria contínua sob latência de 28 min, manobras orbitais tornam-se cegas.',
  };
}

export function App() {
  const [screen, setScreen] = useState<GameScreen>('splash');
  const [lang, setLang] = useState<Language>('en');
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isPt = lang === 'pt';

  // Sync Tailwind .dark class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync <html lang> and <title> with active language
  useEffect(() => {
    document.documentElement.lang = isPt ? 'pt-BR' : 'en-US';
    document.title = isPt
      ? 'Missão Sol-4: Guardiões da Base Ares'
      : 'Mission Sol-4: Guardians of Ares Base';
  }, [isPt]);

  // Auto-scroll to top / Commander Quack on every screen or Sol transition (great for mobile!)
  useEffect(() => {
    safeScrollToTop();
  }, [screen]);

  // Silent NASA fetch during splash
  const [nasaData, setNasaData] = useState<NasaDataBundle>(() =>
    getArchivedFallbackBundle()
  );

  useEffect(() => {
    let active = true;
    loadResilientNasaData().then((bundle) => {
      if (active) setNasaData(bundle);
    });
    return () => {
      active = false;
    };
  }, []);

  // Crew & Profile State
  const [playerName, setPlayerName] = useState('');
  const [avatarId, setAvatarId] = useState<AvatarId>('astra');
  const [ageProfile, setAgeProfile] = useState<AgeProfile>('explorers');
  const [playMode, setPlayMode] = useState<PlayMode>('solo');
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '', '']);
  const [hasVisitedHangar, setHasVisitedHangar] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [hasCompletedMission, setHasCompletedMission] = useState(false);

  // Hangar State starts unselected so players deliberately pick every option
  const [hangarConfig, setHangarConfig] = useState<HangarConfig>({
    rocket: null,
    orbit: null,
    instruments: [],
  });

  // Active Command State
  const [currentSol, setCurrentSol] = useState<1 | 2 | 3 | 4>(1);
  const [resources, setResources] = useState<Resources>(BASE_STARTING_RESOURCES);
  const [solStartResources, setSolStartResources] = useState<Resources>(
    BASE_STARTING_RESOURCES
  );
  const [lastDelta, setLastDelta] = useState<ResourceDelta | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>([]);
  const [penaltyPoints, setPenaltyPoints] = useState(0);
  const [choiceHistory, setChoiceHistory] = useState<ChoiceHistoryEntry[]>([]);
  const [modalFeedback, setModalFeedback] = useState<ModalFeedbackState | null>(null);
  const [infoHubTab, setInfoHubTab] = useState<InfoHubTab | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll to top cleanly whenever currentSol changes as well
  useEffect(() => {
    safeScrollToTop();
  }, [currentSol]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'pt' : 'en'));
  };

  const handleSplashDone = useCallback(() => {
    setScreen((prev) => (prev === 'splash' ? 'prologue' : prev));
  }, []);

  const handleLaunchSuccess = () => {
    const startRes = computeInitialResources(hangarConfig);
    setResources(startRes);
    setSolStartResources(startRes);
    setCurrentSol(1);
    setLastDelta(null);
    setUnlockedBadges([]);
    setPenaltyPoints(0);
    setChoiceHistory([]);
    setModalFeedback(null);
    setHasLaunched(true);
    setScreen('command');
  };

  const handleRequestToolHelpCost = () => {
    setResources((prev) => {
      const nextLS = Math.max(1, prev.lifeSupport - 8);
      setLastDelta({ lifeSupport: nextLS - prev.lifeSupport });
      return { ...prev, lifeSupport: nextLS };
    });
  };

  const handleChooseCard = (card: SolCard) => {
    const appliedDelta: ResourceDelta = { ...card.effects };

    // Apply contextual bonuses from Hangar engineering choices
    if (currentSol === 1 && card.id === 'B' && hangarConfig.orbit === 'high') {
      appliedDelta.comms = (appliedDelta.comms || 0) + 10;
    }
    if (currentSol === 2 && card.id === 'B') {
      const rocketCost =
        ROCKETS.find((r) => r.id === hangarConfig.rocket)?.costM || 35;
      const instCost = INSTRUMENTS.filter((i) =>
        hangarConfig.instruments.includes(i.id)
      ).reduce((s, i) => s + i.costM, 0);
      const savedBudget = HANGAR_BUDGET_M - (rocketCost + instCost);
      if (savedBudget >= 15) {
        appliedDelta.energy = (appliedDelta.energy || 0) + 10;
      }
    }

    const updated: Resources = {
      energy: clampResource(resources.energy + (appliedDelta.energy || 0)),
      lifeSupport: clampResource(
        resources.lifeSupport + (appliedDelta.lifeSupport || 0)
      ),
      shield: clampResource(resources.shield + (appliedDelta.shield || 0)),
      comms: clampResource(resources.comms + (appliedDelta.comms || 0)),
    };

    setLastDelta(appliedDelta);
    setResources(updated);

    const failedKey = (Object.keys(updated) as ResourceKey[]).find(
      (k) => updated[k] <= 0
    );

    if (failedKey) {
      playGentleAlertSound();
      setPenaltyPoints((p) => p + 50);
      setModalFeedback({
        type: 'failure',
        sol: currentSol,
        appliedDelta,
        failedResource: failedKey,
        failurePhysicsByProfile: buildFailurePhysics(lang, failedKey, nasaData),
      });
      return;
    }

    const enteredDanger = (Object.keys(updated) as ResourceKey[]).some(
      (k) => updated[k] < 35
    );
    if (enteredDanger) {
      playGentleAlertSound();
      setPenaltyPoints((p) => p + 15);
    } else {
      playBadgeUnlockSound();
    }

    const { SOL_SCENARIOS } = getLocalizedMissionData(lang);
    const scenario = SOL_SCENARIOS.find((s) => s.sol === currentSol)!;
    const historyEntry: ChoiceHistoryEntry = {
      sol: currentSol,
      solTitle: scenario.title,
      cardId: card.id,
      cardTitle: card.title,
      category: card.category,
      appliedDelta,
      resultingResources: updated,
      enteredDanger,
    };
    setChoiceHistory((prev) => [
      ...prev.filter((item) => item.sol !== currentSol),
      historyEntry,
    ]);

    if (!unlockedBadges.includes(scenario.badge.id)) {
      setUnlockedBadges((prev) => [...prev, scenario.badge.id]);
    }

    setModalFeedback({
      type: 'badge',
      sol: currentSol,
      badge: scenario.badge,
      chosenCard: card,
      appliedDelta,
    });
  };

  const handleContinueNextSol = () => {
    setModalFeedback(null);
    if (currentSol < 4) {
      const nextSol = (currentSol + 1) as 1 | 2 | 3 | 4;
      setCurrentSol(nextSol);
      setSolStartResources(resources);
      setLastDelta(null);
    } else {
      playVictoryMamboSound();
      setHasCompletedMission(true);
      setScreen('victory');
    }
  };

  const handleRetrySol = () => {
    setModalFeedback(null);
    setResources(solStartResources);
    setLastDelta(null);
  };

  const handleBackToHangar = () => {
    setModalFeedback(null);
    setHasVisitedHangar(true);
    setScreen('hangar');
  };

  const handlePlayAgain = () => {
    setCurrentSol(1);
    setUnlockedBadges([]);
    setPenaltyPoints(0);
    setChoiceHistory([]);
    setLastDelta(null);
    setModalFeedback(null);
    setHangarConfig({ rocket: null, orbit: null, instruments: [] });
    setHasVisitedHangar(false);
    setHasLaunched(false);
    setHasCompletedMission(false);
    setScreen('prologue');
  };

  const handleUpdateApod = (newApod: NasaApodData) => {
    setNasaData((prev) => ({
      ...prev,
      apod: newApod,
    }));
  };

  const { SOL_SCENARIOS } = getLocalizedMissionData(lang);

  // Automatic Quack expression: worried/terror if any bar < 35% in Command!
  const widgetExpression: QuackExpression = (() => {
    if (screen === 'prologue') return 'terror';
    if (screen === 'victory') return 'celebrate';
    if (
      screen === 'command' &&
      (resources.energy < 35 ||
        resources.lifeSupport < 35 ||
        resources.shield < 35 ||
        resources.comms < 35)
    ) {
      return 'terror';
    }
    if (screen === 'command') {
      const scenario = SOL_SCENARIOS.find((s) => s.sol === currentSol);
      return scenario?.quackExpression || 'terror';
    }
    return 'celebrate';
  })();

  if (screen === 'splash') {
    return (
      <>
        <SplashScreen lang={lang} onComplete={handleSplashDone} />
        <NasaFooter lang={lang} nasaData={nasaData} lightSurface />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B1221] dark:text-slate-100 transition-colors">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(234,88,12,0.16),_transparent_55%)]"
      />
      <BackgroundEasterEggLayer screen={screen} currentSol={currentSol} />

      {/* Top Bar: Orange Mission Patch + Clickable Stage Nav + Language Switcher right next to Dark Mode + Audio + Menu */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/98 dark:border-slate-800/80 dark:bg-[#0B1221]/98">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5">
          <button
            type="button"
            onClick={() => setScreen('prologue')}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 text-left hover:opacity-90 transition-opacity"
          >
            <MissionPatchLogo size={36} lang={lang} />
            <span className="font-display text-sm sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isPt ? 'Missão Sol-4 · Base Ares' : 'Mission Sol-4 · Ares Base'}
            </span>
          </button>

          {(() => {
            const crewReady =
              playMode === 'solo'
                ? playerName.trim().length > 0
                : Array.from({ length: teamCount }).every(
                    (_, i) => Boolean(teamNames[i] && teamNames[i].trim())
                  );
            const stageItems: {
              id: Exclude<GameScreen, 'splash'>;
              label: string;
              shortLabel: string;
              enabled: boolean;
            }[] = [
              {
                id: 'prologue',
                label: isPt ? '1. Prólogo' : '1. Prologue',
                shortLabel: isPt ? '1. Prólogo' : '1. Prologue',
                enabled: true,
              },
              {
                id: 'hangar',
                label: isPt ? '2. Hangar' : '2. Hangar',
                shortLabel: '2. Hangar',
                enabled: hasVisitedHangar || hasLaunched || hasCompletedMission || crewReady,
              },
              {
                id: 'command',
                label: isPt ? '3. Central (4 Sols)' : '3. Command (4 Sols)',
                shortLabel: isPt ? '3. Central' : '3. Command',
                enabled: hasLaunched || hasCompletedMission,
              },
              {
                id: 'victory',
                label: isPt ? '4. Passaporte NASA' : '4. NASA Passport',
                shortLabel: isPt ? '4. Passaporte' : '4. Passport',
                enabled: hasCompletedMission,
              },
            ];

            return (
              <nav
                aria-label={isPt ? 'Etapas da missão' : 'Mission stages'}
                className="hidden lg:flex items-center gap-2 text-xs font-semibold"
              >
                {stageItems.map((item) => {
                  const active = screen === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!item.enabled}
                      onClick={() => {
                        if (!item.enabled) return;
                        if (item.id === 'hangar') setHasVisitedHangar(true);
                        setModalFeedback(null);
                        setScreen(item.id);
                      }}
                      className={`rounded-lg px-2.5 py-1 transition-colors ${
                        active
                          ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold'
                          : item.enabled
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer'
                            : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            );
          })()}

          <div className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle right next to Dark Mode */}
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              aria-label={isPt ? 'Switch to US English' : 'Mudar para Português (Brasil)'}
              title={isPt ? 'Switch to English (US)' : 'Mudar para Português (BR)'}
            >
              <Languages className="h-3.5 w-3.5 text-orange-500" />
              <span>{isPt ? 'PT-BR' : 'EN-US'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              aria-label={
                theme === 'dark'
                  ? isPt
                    ? 'Mudar para visão clean clara'
                    : 'Switch to clean light mode'
                  : isPt
                    ? 'Mudar para modo escuro espacial'
                    : 'Switch to space dark mode'
              }
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isPt ? 'Visão Clean' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-600" />
                  <span className="hidden sm:inline">{isPt ? 'Modo Escuro' : 'Dark Mode'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              aria-label={
                muted ? (isPt ? 'Ativar sons' : 'Unmute sounds') : isPt ? 'Silenciar sons' : 'Mute sounds'
              }
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">
                {muted ? (isPt ? 'Mudo' : 'Muted') : isPt ? 'Som' : 'Sound'}
              </span>
            </button>

            {/* Discreet 3-bar hamburger menu */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={
                isPt
                  ? 'Abrir menu de informações, visão técnica e área dos pais'
                  : 'Open info, technical lineage & parents menu'
              }
              aria-expanded={menuOpen}
            >
              <Menu className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-11 z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-[#10182E]">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isPt ? 'Navegação & Ciência' : 'Navigation & Science'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setInfoHubTab('about');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Target className="h-4 w-4 text-orange-500" />
                    <span>{isPt ? 'Sobre o Jogo & Problema' : 'About & Problem Statement'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setInfoHubTab('explorer');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Microscope className="h-4 w-4 text-emerald-500" />
                    <span>{isPt ? 'Laboratório NASA (Explorador)' : 'NASA Science Lab (Explorer)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setInfoHubTab('technical');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Cpu className="h-4 w-4 text-sky-500" />
                    <span>{isPt ? 'Visão Técnica & Linhagem' : 'Technical View & Lineage'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setInfoHubTab('parents');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <GraduationCap className="h-4 w-4 text-violet-500" />
                    <span>{isPt ? 'Área Pais & Professores' : 'Parents & Teachers Area'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compact Mobile / Tablet Stage Navigation Bar */}
        {(() => {
          const crewReady =
            playMode === 'solo'
              ? playerName.trim().length > 0
              : Array.from({ length: teamCount }).every(
                  (_, i) => Boolean(teamNames[i] && teamNames[i].trim())
                );
          const mobileStages: {
            id: Exclude<GameScreen, 'splash'>;
            label: string;
            enabled: boolean;
          }[] = [
            { id: 'prologue', label: isPt ? '1. Prólogo' : '1. Prologue', enabled: true },
            {
              id: 'hangar',
              label: '2. Hangar',
              enabled: hasVisitedHangar || hasLaunched || hasCompletedMission || crewReady,
            },
            {
              id: 'command',
              label: isPt ? '3. Central' : '3. Command',
              enabled: hasLaunched || hasCompletedMission,
            },
            {
              id: 'victory',
              label: isPt ? '4. Passaporte' : '4. Passport',
              enabled: hasCompletedMission,
            },
          ];

          return (
            <nav
              aria-label={isPt ? 'Etapas da missão (móvel)' : 'Mission stages (mobile)'}
              className="lg:hidden flex items-center justify-between gap-1 overflow-x-auto border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 text-[11px] font-semibold"
            >
              {mobileStages.map((item) => {
                const active = screen === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!item.enabled}
                    onClick={() => {
                      if (!item.enabled) return;
                      if (item.id === 'hangar') setHasVisitedHangar(true);
                      setModalFeedback(null);
                      setScreen(item.id);
                    }}
                    className={`shrink-0 rounded-md px-2 py-0.5 transition-colors ${
                      active
                        ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold'
                        : item.enabled
                          ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          );
        })()}
      </header>

      <main
        className={`relative z-10 px-4 pt-6 pb-[110px] ${
          screen === 'victory' ? 'pointer-events-none' : ''
        }`}
      >
        {screen === 'prologue' && (
          <Screen1Prologue
            lang={lang}
            playerName={playerName}
            setPlayerName={setPlayerName}
            avatarId={avatarId}
            setAvatarId={setAvatarId}
            ageProfile={ageProfile}
            setAgeProfile={setAgeProfile}
            playMode={playMode}
            setPlayMode={setPlayMode}
            teamNames={teamNames}
            setTeamNames={setTeamNames}
            teamCount={teamCount}
            setTeamCount={setTeamCount}
            onStartHangar={() => {
              setHasVisitedHangar(true);
              setScreen('hangar');
            }}
          />
        )}

        {screen === 'hangar' && (
          <Screen2Hangar
            lang={lang}
            ageProfile={ageProfile}
            config={hangarConfig}
            setConfig={setHangarConfig}
            onBack={() => setScreen('prologue')}
            onLaunchSuccess={handleLaunchSuccess}
          />
        )}

        {screen === 'command' && (
          <Screen3Command
            lang={lang}
            currentSol={currentSol}
            resources={resources}
            lastDelta={lastDelta}
            ageProfile={ageProfile}
            playMode={playMode}
            teamNames={teamNames}
            teamCount={teamCount}
            soloName={playerName}
            hangarConfig={hangarConfig}
            nasaData={nasaData}
            onRequestToolHelpCost={handleRequestToolHelpCost}
            onChooseCard={handleChooseCard}
          />
        )}

        {screen === 'victory' && (
          <Screen5Victory
            lang={lang}
            playerName={playerName}
            playMode={playMode}
            teamNames={teamNames}
            teamCount={teamCount}
            avatarId={avatarId}
            ageProfile={ageProfile}
            hangarConfig={hangarConfig}
            resources={resources}
            penaltyPoints={penaltyPoints}
            unlockedBadges={unlockedBadges}
            choiceHistory={choiceHistory}
            nasaData={nasaData}
            onUpdateApod={handleUpdateApod}
            onOpenInfoHub={(tab) => setInfoHubTab(tab)}
            onPlayAgain={handlePlayAgain}
            onBackToHangar={handleBackToHangar}
          />
        )}
      </main>

      {modalFeedback && (
        <Screen4Modal
          lang={lang}
          modal={modalFeedback}
          resources={resources}
          ageProfile={ageProfile}
          onContinueNextSol={handleContinueNextSol}
          onRetrySol={handleRetrySol}
          onBackToHangar={handleBackToHangar}
        />
      )}

      {infoHubTab && (
        <MissionInfoHubModal
          lang={lang}
          activeTab={infoHubTab}
          onChangeTab={setInfoHubTab}
          onClose={() => setInfoHubTab(null)}
          nasaData={nasaData}
          ageProfile={ageProfile}
          hangarConfig={hangarConfig}
          resources={resources}
          choiceHistory={choiceHistory}
        />
      )}

      <QuackChatWidget
        lang={lang}
        screen={screen}
        currentSol={currentSol}
        ageProfile={ageProfile}
        resources={resources}
        expression={widgetExpression}
        nasaData={nasaData}
        hangarConfig={hangarConfig}
        choiceHistory={choiceHistory}
      />

      <NasaFooter lang={lang} nasaData={nasaData} />
    </div>
  );
}

export default App;
