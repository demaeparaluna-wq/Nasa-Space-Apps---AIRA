import { useCallback, useEffect, useState } from 'react';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { NasaFooter } from './components/NasaFooter';
import { QuackChatWidget } from './components/QuackChatWidget';
import { Screen1Prologue } from './components/Screen1Prologue';
import { Screen2Hangar } from './components/Screen2Hangar';
import { Screen3Command } from './components/Screen3Command';
import { Screen4Modal } from './components/Screen4Modal';
import { Screen5Victory } from './components/Screen5Victory';
import { BackgroundEasterEggLayer } from './components/SpaceVisuals';
import { SplashScreen } from './components/SplashScreen';
import { HANGAR_BUDGET_M, INSTRUMENTS, ORBITS, ROCKETS, SOL_SCENARIOS } from './data/missionData';
import { getArchivedFallbackBundle, loadResilientNasaData } from './services/nasaApi';
import {
  AgeProfile,
  AvatarId,
  BadgeId,
  GameScreen,
  HangarConfig,
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

function computeInitialResources(config: HangarConfig): Resources {
  const next = { ...BASE_STARTING_RESOURCES };
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
  resource: ResourceKey,
  nasaData: NasaDataBundle
): Record<AgeProfile, string> {
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
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync Tailwind .dark class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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
  const [teamNames, setTeamNames] = useState<string[]>(['Luna', 'Mary', '', '']);

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
  const [modalFeedback, setModalFeedback] = useState<ModalFeedbackState | null>(null);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
    setModalFeedback(null);
    setScreen('command');
  };

  const handleChooseCard = (card: SolCard) => {
    const appliedDelta: ResourceDelta = { ...card.effects };

    // Apply contextual bonuses from Hangar engineering choices
    if (currentSol === 1 && card.id === 'B' && hangarConfig.orbit === 'high') {
      appliedDelta.comms = (appliedDelta.comms || 0) + 10;
    }
    if (currentSol === 2 && card.id === 'B') {
      const rocketCost =
        ROCKETS.find((r) => r.id === hangarConfig.rocket)?.costM || 40;
      const instCost = INSTRUMENTS.filter((i) =>
        hangarConfig.instruments.includes(i.id)
      ).reduce((s, i) => s + i.costM, 0);
      const savedBudget = HANGAR_BUDGET_M - (rocketCost + instCost);
      if (savedBudget > 0) {
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

    // Check if any meter hit 0% -> Loss / Critical Failure!
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
        failurePhysicsByProfile: buildFailurePhysics(failedKey, nasaData),
      });
      return;
    }

    // Check if any meter entered danger (<35%) -> Risk penalty + worried Quack!
    const enteredDanger = (Object.keys(updated) as ResourceKey[]).some(
      (k) => updated[k] < 35
    );
    if (enteredDanger) {
      playGentleAlertSound();
      setPenaltyPoints((p) => p + 15);
    } else {
      playBadgeUnlockSound();
    }

    const scenario = SOL_SCENARIOS.find((s) => s.sol === currentSol)!;
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
    setScreen('hangar');
  };

  const handlePlayAgain = () => {
    setCurrentSol(1);
    setUnlockedBadges([]);
    setPenaltyPoints(0);
    setLastDelta(null);
    setModalFeedback(null);
    setHangarConfig({ rocket: null, orbit: null, instruments: [] });
    setScreen('prologue');
  };

  const handleUpdateApod = (newApod: NasaApodData) => {
    setNasaData((prev) => ({
      ...prev,
      apod: newApod,
    }));
  };

  // Current automatic Quack expression: worried/terror if any bar < 35% in Command!
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
        <SplashScreen onComplete={handleSplashDone} />
        <NasaFooter nasaData={nasaData} lightSurface />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#080D1A] dark:text-slate-100 transition-colors">
      <BackgroundEasterEggLayer screen={screen} currentSol={currentSol} />

      {/* Clean Top Bar with Theme Switch + Audio Toggle */}
      <header className="relative z-10 border-b border-slate-200 bg-white/95 dark:border-slate-800/90 dark:bg-[#0A1020]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            Missão Sol-4 · Base Ares
          </span>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className={screen === 'prologue' ? 'text-orange-600 dark:text-orange-400' : ''}>
              1. Prólogo
            </span>
            <span className={screen === 'hangar' ? 'text-orange-600 dark:text-orange-400' : ''}>
              2. Hangar
            </span>
            <span className={screen === 'command' ? 'text-orange-600 dark:text-orange-400' : ''}>
              3. Central (4 Sols)
            </span>
            <span className={screen === 'victory' ? 'text-orange-600 dark:text-orange-400' : ''}>
              4. Passaporte NASA
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              aria-label={
                theme === 'dark' ? 'Mudar para visão clean clara' : 'Mudar para modo escuro espacial'
              }
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Visão Clean</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-600" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              aria-label={muted ? 'Ativar sons' : 'Silenciar sons'}
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{muted ? 'Mudo' : 'Som'}</span>
            </button>
          </div>
        </div>
      </header>

      <main
        className={`relative z-10 px-4 pt-6 pb-8 ${
          screen === 'victory' ? 'pointer-events-none' : ''
        }`}
      >
        {screen === 'prologue' && (
          <Screen1Prologue
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
            onStartHangar={() => setScreen('hangar')}
          />
        )}

        {screen === 'hangar' && (
          <Screen2Hangar
            ageProfile={ageProfile}
            config={hangarConfig}
            setConfig={setHangarConfig}
            onBack={() => setScreen('prologue')}
            onLaunchSuccess={handleLaunchSuccess}
          />
        )}

        {screen === 'command' && (
          <Screen3Command
            currentSol={currentSol}
            resources={resources}
            lastDelta={lastDelta}
            ageProfile={ageProfile}
            playMode={playMode}
            teamNames={teamNames}
            teamCount={teamCount}
            soloName={playerName}
            nasaData={nasaData}
            onChooseCard={handleChooseCard}
          />
        )}

        {screen === 'victory' && (
          <Screen5Victory
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
            nasaData={nasaData}
            onUpdateApod={handleUpdateApod}
            onPlayAgain={handlePlayAgain}
            onBackToHangar={handleBackToHangar}
          />
        )}
      </main>

      {modalFeedback && (
        <Screen4Modal
          modal={modalFeedback}
          resources={resources}
          ageProfile={ageProfile}
          onContinueNextSol={handleContinueNextSol}
          onRetrySol={handleRetrySol}
          onBackToHangar={handleBackToHangar}
        />
      )}

      <QuackChatWidget
        screen={screen}
        currentSol={currentSol}
        ageProfile={ageProfile}
        resources={resources}
        expression={widgetExpression}
        nasaData={nasaData}
      />

      <NasaFooter nasaData={nasaData} />
    </div>
  );
}

export default App;
