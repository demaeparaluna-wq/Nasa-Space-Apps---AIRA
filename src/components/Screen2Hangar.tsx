import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Orbit,
  Radio,
  Rocket,
  ShieldAlert,
  Sprout,
  ThermometerSun,
} from 'lucide-react';
import { BASE_CAPSULE_MASS_KG, HANGAR_BUDGET_M } from '../data/missionData';
import { getLocalizedMissionData } from '../data/missionDataEn';
import { AgeProfile, HangarConfig, InstrumentId, Language } from '../types/game';
import { playClickSound, playLaunchSound } from '../utils/sound';
import { GlossaryInline } from './GlossaryButton';
import { RocketLaunchOverlay } from './SpaceVisuals';

interface Screen2HangarProps {
  lang?: Language;
  ageProfile: AgeProfile;
  config: HangarConfig;
  setConfig: React.Dispatch<React.SetStateAction<HangarConfig>>;
  onBack: () => void;
  onLaunchSuccess: () => void;
}

type InspectableKey =
  | 'orbit:high'
  | 'orbit:low'
  | 'inst:veggie'
  | 'inst:meda'
  | 'inst:donki';

export const Screen2Hangar: React.FC<Screen2HangarProps> = ({
  lang = 'en',
  ageProfile,
  config,
  setConfig,
  onBack,
  onLaunchSuccess,
}) => {
  const [launching, setLaunching] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<InspectableKey | null>(null);
  const [pinnedItem, setPinnedItem] = useState<InspectableKey | null>(null);
  const [expandedRocketInfo, setExpandedRocketInfo] = useState<'light' | 'heavy' | null>(null);

  const isPt = lang === 'pt';
  const { ROCKETS, ORBITS, INSTRUMENTS } = getLocalizedMissionData(lang);

  const selectedRocket = ROCKETS.find((r) => r.id === config.rocket) || null;
  const selectedOrbit = ORBITS.find((o) => o.id === config.orbit) || null;
  const selectedInstruments = INSTRUMENTS.filter((i) => config.instruments.includes(i.id));

  const instrumentsMass = selectedInstruments.reduce((sum, i) => sum + i.massKg, 0);
  const totalMassKg = BASE_CAPSULE_MASS_KG + instrumentsMass;
  const totalCostM =
    (selectedRocket?.costM || 0) +
    selectedInstruments.reduce((sum, i) => sum + i.costM, 0);
  const totalScience = selectedInstruments.reduce((sum, i) => sum + i.scienceBonus, 0);

  const maxRocketMass = selectedRocket?.maxMassKg || 1200;
  const isMissingSelection =
    !selectedRocket || !selectedOrbit || selectedInstruments.length !== 2;
  const isOverMass = selectedRocket ? totalMassKg > selectedRocket.maxMassKg : false;
  const isOverBudget = totalCostM > HANGAR_BUDGET_M;
  const canLaunch = !isMissingSelection && !isOverMass && !isOverBudget;

  const activeInspectKey = hoveredItem || pinnedItem;

  const inspectDetails: Record<
    InspectableKey,
    { category: string; title: string; specs: string; summary: string; whatIsIt: string; tradeoff?: string }
  > = {
    'orbit:high': {
      category: isPt ? 'Órbita' : 'Orbit',
      title: ORBITS[0].name,
      specs: ORBITS[0].bonusLabel,
      summary: ORBITS[0].summary,
      whatIsIt: ORBITS[0].whatIsIt,
    },
    'orbit:low': {
      category: isPt ? 'Órbita' : 'Orbit',
      title: ORBITS[1].name,
      specs: ORBITS[1].bonusLabel,
      summary: ORBITS[1].summary,
      whatIsIt: ORBITS[1].whatIsIt,
    },
    'inst:veggie': {
      category: isPt ? 'Instrumento' : 'Instrument',
      title: INSTRUMENTS[0].name,
      specs: `${INSTRUMENTS[0].massKg} kg · $${INSTRUMENTS[0].costM}M · +${INSTRUMENTS[0].scienceBonus} ${isPt ? 'Ciência' : 'Science'} · +15% ${isPt ? 'Suporte' : 'Life Sup.'}`,
      summary: INSTRUMENTS[0].nasaRef,
      whatIsIt: INSTRUMENTS[0].whatIsIt,
    },
    'inst:meda': {
      category: isPt ? 'Instrumento' : 'Instrument',
      title: INSTRUMENTS[1].name,
      specs: `${INSTRUMENTS[1].massKg} kg · $${INSTRUMENTS[1].costM}M · +${INSTRUMENTS[1].scienceBonus} ${isPt ? 'Ciência' : 'Science'} · +10% ${isPt ? 'Energia' : 'Energy'}, +5% ${isPt ? 'Rádio' : 'Comms'}`,
      summary: INSTRUMENTS[1].nasaRef,
      whatIsIt: INSTRUMENTS[1].whatIsIt,
    },
    'inst:donki': {
      category: isPt ? 'Instrumento' : 'Instrument',
      title: INSTRUMENTS[2].name,
      specs: `${INSTRUMENTS[2].massKg} kg · $${INSTRUMENTS[2].costM}M · +${INSTRUMENTS[2].scienceBonus} ${isPt ? 'Ciência' : 'Science'} · +15% ${isPt ? 'Escudo' : 'Shield'}`,
      summary: INSTRUMENTS[2].nasaRef,
      whatIsIt: INSTRUMENTS[2].whatIsIt,
    },
  };

  const toggleInstrument = (id: InstrumentId) => {
    playClickSound();
    setPinnedItem(`inst:${id}`);
    setConfig((prev) => {
      const exists = prev.instruments.includes(id);
      if (exists) {
        return { ...prev, instruments: prev.instruments.filter((item) => item !== id) };
      }
      if (prev.instruments.length >= 2) {
        return { ...prev, instruments: [prev.instruments[1], id] };
      }
      return { ...prev, instruments: [...prev.instruments, id] };
    });
  };

  const handleLaunch = () => {
    if (!canLaunch) return;
    playLaunchSound();
    setLaunching(true);
    window.setTimeout(() => {
      setLaunching(false);
      onLaunchSuccess();
    }, 2200);
  };

  const massPct = Math.min(100, Math.round((totalMassKg / maxRocketMass) * 100));
  const budgetPct = Math.min(100, Math.round((totalCostM / HANGAR_BUDGET_M) * 100));
  const remainingBudget = HANGAR_BUDGET_M - totalCostM;

  const inspected = activeInspectKey ? inspectDetails[activeInspectKey] : null;

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-20">
      {launching && selectedRocket && selectedOrbit && (
        <RocketLaunchOverlay
          rocketName={selectedRocket.name}
          orbitName={selectedOrbit.name}
          lang={lang}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#10182E] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isPt ? 'Voltar ao Prólogo' : 'Back to Prologue'}</span>
        </button>

        <div className="text-right">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {isPt ? 'Hangar de Engenharia · Base Ares' : 'Engineering Hangar · Ares Base'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isPt
              ? 'Compare os foguetes nos cards e toque nos ícones de Órbita e Instrumentos para ver detalhes.'
              : 'Compare rockets below and hover or tap Orbit & Instrument icons to inspect specs.'}
          </p>
        </div>
      </div>

      {/* Live Physics Meters Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-3.5 sm:p-4 backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isPt ? 'Massa Total' : 'Total Payload Mass'}
            </span>
            <span
              className={`font-mono-tabular font-bold ${
                isOverMass
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {totalMassKg.toLocaleString(isPt ? 'pt-BR' : 'en-US')} /{' '}
              {selectedRocket
                ? `${selectedRocket.maxMassKg.toLocaleString(isPt ? 'pt-BR' : 'en-US')} kg`
                : '—'}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isOverMass ? 'bg-rose-500' : 'bg-emerald-500 dark:bg-emerald-400'
              }`}
              style={{ width: `${massPct}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isPt
              ? `Cápsula (${BASE_CAPSULE_MASS_KG} kg) + Instr. (${instrumentsMass} kg)`
              : `Capsule (${BASE_CAPSULE_MASS_KG} kg) + Instr. (${instrumentsMass} kg)`}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isPt ? 'Orçamento' : 'Mission Budget'}
            </span>
            <span
              className={`font-mono-tabular font-bold ${
                isOverBudget
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              ${totalCostM}M / ${HANGAR_BUDGET_M}M
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isOverBudget ? 'bg-rose-500' : 'bg-sky-500 dark:bg-sky-400'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {remainingBudget > 0
              ? isPt
                ? `Reserva: $${remainingBudget}M (bônus Sol 2!)`
                : `Reserve: $${remainingBudget}M (Sol 2 bonus!)`
              : remainingBudget === 0
                ? isPt
                  ? '$0M livre (sem bônus extra no Sol 2)'
                  : '$0M left (no Sol 2 reserve bonus)'
                : isPt
                  ? `Estourado em $${Math.abs(remainingBudget)}M!`
                  : `Over budget by $${Math.abs(remainingBudget)}M!`}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3.5 py-2.5">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isPt ? 'Ciência Projetada' : 'Projected Science'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-tabular text-xl font-extrabold text-amber-600 dark:text-amber-400">
                +{totalScience}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                pts ({selectedInstruments.length}/2)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-right text-slate-500 dark:text-slate-400">
            <GlossaryInline termKey="veggie" ageProfile={ageProfile} lang={lang}>
              Veggie
            </GlossaryInline>
            {' · '}
            <GlossaryInline termKey="meda" ageProfile={ageProfile} lang={lang}>
              MEDA
            </GlossaryInline>
            {' · '}
            <GlossaryInline termKey="x87" ageProfile={ageProfile} lang={lang}>
              DONKI
            </GlossaryInline>
          </div>
        </div>
      </section>

      {/* Step 1: Restored Full Rocket Cards */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-4 sm:p-5 backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            1. {isPt ? 'Escolha o Foguete' : 'Choose Launch Rocket'} *
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {selectedRocket ? `✓ ${selectedRocket.name}` : isPt ? 'Obrigatório (0/1)' : 'Required (0/1)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ROCKETS.map((rocket) => {
            const active = config.rocket === rocket.id;
            const infoOpen = expandedRocketInfo === rocket.id;
            return (
              <div
                key={rocket.id}
                className={`rounded-2xl border p-4 transition-all ${
                  active
                    ? 'border-orange-500 bg-orange-50/75 shadow-sm dark:border-orange-400 dark:bg-[#182442]'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setConfig((prev) => ({ ...prev, rocket: rocket.id }));
                  }}
                  className="w-full text-left space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          rocket.id === 'light'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-orange-500/20 text-orange-500'
                        }`}
                      >
                        <Rocket className={rocket.id === 'light' ? 'h-5 w-5' : 'h-6 w-6'} />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {rocket.name}
                        </h3>
                        <p className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-orange-300">
                          ${rocket.costM}M · {isPt ? 'Máx.' : 'Max'}{' '}
                          {rocket.maxMassKg.toLocaleString(isPt ? 'pt-BR' : 'en-US')} kg
                        </p>
                      </div>
                    </div>

                    {active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-950">
                        <Check className="h-3 w-3" />
                        <span>{isPt ? 'Selecionado' : 'Selected'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                    {rocket.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-lg border border-slate-300 bg-white px-2 py-0.5 font-mono-tabular font-bold text-slate-800 dark:border-slate-700 dark:bg-[#10182E] dark:text-slate-200">
                      {rocket.id === 'light'
                        ? isPt
                          ? '+5% Energia · -5% Escudo'
                          : '+5% Energy · -5% Shield'
                        : isPt
                          ? '+5% Escudo · -8% Energia'
                          : '+5% Shield · -8% Energy'}
                    </span>
                    <span className="text-orange-700 dark:text-orange-300 font-semibold">
                      ⚖️ {rocket.tradeoffNote}
                    </span>
                  </div>
                </button>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setExpandedRocketInfo(infoOpen ? null : rocket.id);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>
                      {infoOpen
                        ? isPt
                          ? 'Ocultar explicação'
                          : 'Hide explanation'
                        : isPt
                          ? 'O que é este foguete?'
                          : 'What is this rocket?'}
                    </span>
                  </button>
                </div>

                {infoOpen && (
                  <p className="mt-2 rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-2 text-xs leading-relaxed text-slate-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-slate-200">
                    {rocket.whatIsIt}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Steps 2 & 3: Compact Expandable Icon Grid ONLY for Orbit & Instruments */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-4 backdrop-blur-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Column 1: Orbit (2 compact icon tiles) */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                2. {isPt ? 'Órbita' : 'Orbit'} *
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {selectedOrbit ? '✓ 1/1' : '0/1'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ORBITS.map((orbit) => {
                const active = config.orbit === orbit.id;
                const key: InspectableKey = `orbit:${orbit.id}`;
                const isInspected = activeInspectKey === key;
                return (
                  <button
                    key={orbit.id}
                    type="button"
                    onMouseEnter={() => setHoveredItem(key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onFocus={() => setHoveredItem(key)}
                    onBlur={() => setHoveredItem(null)}
                    onClick={() => {
                      playClickSound();
                      setPinnedItem(key);
                      setConfig((prev) => ({ ...prev, orbit: orbit.id }));
                    }}
                    className={`relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      active
                        ? 'border-sky-500 bg-sky-50/80 shadow-sm dark:border-sky-400 dark:bg-[#182442]'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between mb-1">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setPinnedItem(pinnedItem === key ? null : key);
                        }}
                        className={`rounded-md p-0.5 ${
                          isInspected
                            ? 'text-sky-500'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isPt ? 'Ver detalhes técnicos' : 'Inspect specs'}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </span>
                      {active && (
                        <span className="rounded-full bg-sky-500 p-0.5 text-slate-950">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                      {orbit.id === 'high' ? (
                        <Radio className="h-5 w-5" />
                      ) : (
                        <Orbit className="h-5 w-5" />
                      )}
                    </div>
                    <span className="mt-1.5 text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                      {orbit.name}
                    </span>
                    <span className="mt-0.5 font-mono-tabular text-[10px] font-bold text-sky-700 dark:text-sky-300 leading-tight">
                      {orbit.bonusLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Instruments (3 compact icon tiles) */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                3. {isPt ? 'Instrumentos (2/3)' : 'Instruments (2/3)'} *
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {selectedInstruments.length}/2
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {INSTRUMENTS.map((inst) => {
                const active = config.instruments.includes(inst.id);
                const key: InspectableKey = `inst:${inst.id}`;
                const isInspected = activeInspectKey === key;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onMouseEnter={() => setHoveredItem(key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onFocus={() => setHoveredItem(key)}
                    onBlur={() => setHoveredItem(null)}
                    onClick={() => toggleInstrument(inst.id)}
                    className={`relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                      active
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-sm dark:border-emerald-400 dark:bg-[#14263C]'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between mb-1">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setPinnedItem(pinnedItem === key ? null : key);
                        }}
                        className={`rounded-md p-0.5 ${
                          isInspected
                            ? 'text-emerald-500'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isPt ? 'Ver detalhes técnicos' : 'Inspect specs'}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </span>
                      {active && (
                        <span className="rounded-full bg-emerald-500 p-0.5 text-slate-950">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        inst.id === 'veggie'
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : inst.id === 'meda'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-violet-500/15 text-violet-500'
                      }`}
                    >
                      {inst.id === 'veggie' ? (
                        <Sprout className="h-5 w-5" />
                      ) : inst.id === 'meda' ? (
                        <ThermometerSun className="h-5 w-5" />
                      ) : (
                        <ShieldAlert className="h-5 w-5" />
                      )}
                    </div>
                    <span className="mt-1.5 text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      {inst.shortName}
                    </span>
                    <span className="mt-0.5 font-mono-tabular text-[10px] font-bold text-amber-600 dark:text-amber-300">
                      ${inst.costM}M · {inst.massKg}kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expandable Technical Explanation Drawer (only shown when hovering or clicking an item!) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-4 py-3 transition-all">
          {inspected ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    {inspected.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {inspected.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-tabular text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                    {inspected.specs}
                  </span>
                  {pinnedItem && !hoveredItem && (
                    <button
                      type="button"
                      onClick={() => setPinnedItem(null)}
                      className="inline-flex items-center gap-0.5 rounded-md border border-slate-300 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                    >
                      <ChevronUp className="h-3 w-3" />
                      <span>{isPt ? 'Recolher' : 'Hide'}</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                {inspected.whatIsIt}
              </p>
              {inspected.tradeoff && (
                <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-300">
                  ⚖️ {isPt ? 'Trade-off:' : 'Trade-off:'} {inspected.tradeoff}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>
                  {isPt
                    ? 'Passe o mouse ou clique em qualquer ícone acima para expandir a explicação técnica e o trade-off.'
                    : 'Hover or tap any icon above to expand its technical explanation and engineering trade-off.'}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </div>
          )}
        </div>
      </section>

      {/* Physics Lock & Clear Trade-Off Warning + Launch CTA */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-4 sm:p-5">
        {!canLaunch && (
          <div
            className="mb-4 flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-100 p-4 text-xs sm:text-sm"
            role="alert"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-700 dark:text-rose-300">
                {isMissingSelection
                  ? isPt
                    ? 'Complete Todas as Escolhas Obrigatórias!'
                    : 'Complete All Required Selections!'
                  : isPt
                    ? 'Trava Física de Engenharia Ativada — Por que não decola?'
                    : 'Engineering Physics Lock — Why Can’t We Launch?'}
              </p>
              {isMissingSelection && (
                <p>
                  {isPt ? 'Antes de decolar, selecione:' : 'Before liftoff, select:'}{' '}
                  {!selectedRocket ? (isPt ? '1 Foguete' : '1 Rocket') : ''}{' '}
                  {!selectedOrbit ? (isPt ? '· 1 Órbita' : '· 1 Orbit') : ''}{' '}
                  {selectedInstruments.length !== 2
                    ? isPt
                      ? `· 2 Instrumentos (faltam ${2 - selectedInstruments.length})`
                      : `· 2 Instruments (${2 - selectedInstruments.length} left)`
                    : ''}
                  .
                </p>
              )}
              {isOverMass && selectedRocket && (
                <p>
                  <strong>
                    {isPt
                      ? `Excesso de Massa (${totalMassKg} kg > ${selectedRocket.maxMassKg} kg):`
                      : `Mass Overload (${totalMassKg} kg > ${selectedRocket.maxMassKg} kg):`}
                  </strong>{' '}
                  {isPt
                    ? `O ${selectedRocket.name} não tem empuxo para erguer Veggie (450 kg) + DONKI (500 kg) + cápsula (350 kg = 1.300 kg). Troque um instrumento pelo MEDA (350 kg) ou mude para o Foguete Pesado ($50M, aceita até 2.200 kg com -8% Energia)!`
                    : `The ${selectedRocket.name} cannot lift Veggie (450 kg) + DONKI (500 kg) + capsule (350 kg = 1,300 kg). Swap one instrument for MEDA (350 kg) or upgrade to the Heavy Rocket ($50M, lifts 2,200 kg at -8% Energy)!`}
                </p>
              )}
              {isOverBudget && (
                <p>
                  <strong>
                    {isPt
                      ? `Orçamento Excedido ($${totalCostM}M > $${HANGAR_BUDGET_M}M):`
                      : `Budget Exceeded ($${totalCostM}M > $${HANGAR_BUDGET_M}M):`}
                  </strong>{' '}
                  {isPt
                    ? 'O custo somado ultrapassou o teto de $100M. Troque para o Foguete Leve ($35M) ou inclua a Estação MEDA ($15M)!'
                    : 'Combined cost passed the $100M limit. Switch to the Light Rocket ($35M) or pick the MEDA Station ($15M)!'}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {isPt ? 'Nave:' : 'Loadout:'}{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedRocket?.name || (isPt ? 'Nenhum foguete' : 'No rocket')}
            </strong>{' '}
            ·{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedOrbit?.name || (isPt ? 'Nenhuma órbita' : 'No orbit')}
            </strong>{' '}
            ·{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedInstruments.map((i) => i.shortName).join(' + ') ||
                (isPt ? 'Nenhum instrumento' : 'No instruments')}
            </strong>
          </div>
          <button
            type="button"
            disabled={!canLaunch}
            onClick={handleLaunch}
            className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm sm:text-base font-extrabold transition-all ${
              canLaunch
                ? 'bg-orange-500 text-slate-950 shadow-lg hover:bg-orange-400'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            <Rocket className="h-5 w-5" />
            <span>
              {isPt ? 'Iniciar Lançamento para Marte' : 'Launch Mission to Mars'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
