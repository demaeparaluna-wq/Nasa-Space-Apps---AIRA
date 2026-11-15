import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, HelpCircle, Rocket, X } from 'lucide-react';
import {
  BASE_CAPSULE_MASS_KG,
  HANGAR_BUDGET_M,
  INSTRUMENTS,
  ORBITS,
  ROCKETS,
} from '../data/missionData';
import { AgeProfile, HangarConfig, InstrumentId } from '../types/game';
import { playClickSound, playLaunchSound } from '../utils/sound';
import { GlossaryInline } from './GlossaryButton';
import { RocketLaunchOverlay } from './SpaceVisuals';

interface Screen2HangarProps {
  ageProfile: AgeProfile;
  config: HangarConfig;
  setConfig: React.Dispatch<React.SetStateAction<HangarConfig>>;
  onBack: () => void;
  onLaunchSuccess: () => void;
}

interface ExplanationModalData {
  title: string;
  subtitle: string;
  body: string;
}

export const Screen2Hangar: React.FC<Screen2HangarProps> = ({
  ageProfile,
  config,
  setConfig,
  onBack,
  onLaunchSuccess,
}) => {
  const [launching, setLaunching] = useState(false);
  const [explanationModal, setExplanationModal] = useState<ExplanationModalData | null>(null);

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

  const toggleInstrument = (id: InstrumentId) => {
    playClickSound();
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

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-20">
      {launching && selectedRocket && selectedOrbit && (
        <RocketLaunchOverlay rocketName={selectedRocket.name} orbitName={selectedOrbit.name} />
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
          <span>Voltar ao Prólogo</span>
        </button>

        <div className="text-right">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Hangar de Engenharia · Base Ares
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Marque todas as opções respeitando Massa Máxima e Orçamento de $100M.
          </p>
        </div>
      </div>

      {/* Live Physics Meters Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-4 sm:p-5 backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Massa Total da Carga
            </span>
            <span
              className={`font-mono-tabular font-bold ${
                isOverMass
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {totalMassKg.toLocaleString('pt-BR')} /{' '}
              {selectedRocket ? `${selectedRocket.maxMassKg.toLocaleString('pt-BR')} kg` : '—'}
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isOverMass ? 'bg-rose-500' : 'bg-emerald-500 dark:bg-emerald-400'
              }`}
              style={{ width: `${massPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            Cápsula base ({BASE_CAPSULE_MASS_KG} kg) + Instrumentos ({instrumentsMass} kg).
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Orçamento da Missão
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
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isOverBudget ? 'bg-rose-500' : 'bg-sky-500 dark:bg-sky-400'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {HANGAR_BUDGET_M - totalCostM >= 0
              ? `Reserva livre: $${HANGAR_BUDGET_M - totalCostM}M (bônus no Sol 2!).`
              : `Estourado em $${Math.abs(HANGAR_BUDGET_M - totalCostM)}M!`}
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-4 py-3">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Valor Científico Projetado
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              +{totalScience}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              pts ciência ({selectedInstruments.length}/2 instrumentos)
            </span>
          </div>
        </div>
      </section>

      {/* Step 1: Rocket */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Veículo de Lançamento *
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedRocket ? '✓ Selecionado' : 'Escolha 1 foguete'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ROCKETS.map((rocket) => {
            const active = config.rocket === rocket.id;
            return (
              <div
                key={rocket.id}
                onClick={() => {
                  playClickSound();
                  setConfig((prev) => ({ ...prev, rocket: rocket.id }));
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playClickSound();
                    setConfig((prev) => ({ ...prev, rocket: rocket.id }));
                  }
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  active
                    ? 'border-orange-500 bg-orange-50/70 shadow-md dark:border-orange-400 dark:bg-[#15203B]'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#10182E] dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {rocket.name}
                    </h3>
                    <p className="mt-0.5 font-mono-tabular text-xs font-semibold text-orange-600 dark:text-orange-300">
                      ${rocket.costM}M · Máx. {rocket.maxMassKg.toLocaleString('pt-BR')} kg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        setExplanationModal({
                          title: rocket.name,
                          subtitle: `$${rocket.costM}M · Carga Máxima ${rocket.maxMassKg} kg`,
                          body: rocket.whatIsIt,
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-sky-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>O que é?</span>
                    </button>
                    {active && (
                      <span className="rounded-full bg-orange-500 p-1 text-slate-950">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{rocket.summary}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Orbit */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Órbita &amp; Trajetória *
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedOrbit ? '✓ Selecionada' : 'Escolha 1 órbita'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ORBITS.map((orbit) => {
            const active = config.orbit === orbit.id;
            return (
              <div
                key={orbit.id}
                onClick={() => {
                  playClickSound();
                  setConfig((prev) => ({ ...prev, orbit: orbit.id }));
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playClickSound();
                    setConfig((prev) => ({ ...prev, orbit: orbit.id }));
                  }
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  active
                    ? 'border-sky-500 bg-sky-50/70 shadow-md dark:border-sky-400 dark:bg-[#15203B]'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#10182E] dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {orbit.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
                      {orbit.bonusLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        setExplanationModal({
                          title: orbit.name,
                          subtitle: orbit.bonusLabel,
                          body: orbit.whatIsIt,
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-sky-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>O que é?</span>
                    </button>
                    {active && (
                      <span className="rounded-full bg-sky-500 p-1 text-slate-950 dark:bg-sky-400">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{orbit.summary}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 3: Instruments (Pick 2 of 3) */}
      <section className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Instrumentos Científicos (Escolha 2 de 3) *
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Glossário:{' '}
            <GlossaryInline termKey="veggie" ageProfile={ageProfile}>
              Veggie
            </GlossaryInline>{' '}
            ·{' '}
            <GlossaryInline termKey="meda" ageProfile={ageProfile}>
              MEDA
            </GlossaryInline>{' '}
            ·{' '}
            <GlossaryInline termKey="x87" ageProfile={ageProfile}>
              DONKI
            </GlossaryInline>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {INSTRUMENTS.map((inst) => {
            const active = config.instruments.includes(inst.id);
            return (
              <div
                key={inst.id}
                onClick={() => toggleInstrument(inst.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleInstrument(inst.id);
                  }
                }}
                className={`cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md dark:border-emerald-400 dark:bg-[#142338]'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#10182E] dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {inst.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full p-1 ${
                        active
                          ? 'bg-emerald-500 text-slate-950 dark:bg-emerald-400'
                          : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono-tabular text-xs font-semibold text-amber-600 dark:text-amber-300">
                    {inst.massKg} kg · ${inst.costM}M · +{inst.scienceBonus} Ciência
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {inst.nasaRef}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setExplanationModal({
                        title: inst.name,
                        subtitle: `${inst.massKg} kg · $${inst.costM}M · ${inst.nasaRef}`,
                        body: inst.whatIsIt,
                      });
                    }}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300"
                  >
                    <HelpCircle className="h-3 w-3" />
                    <span>O que é?</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Physics Lock & Mandatory Selection Validation + Launch CTA */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#10182E]/95 p-5">
        {!canLaunch && (
          <div
            className="mb-4 flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-100 p-4 text-xs sm:text-sm"
            role="alert"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-700 dark:text-rose-300">
                {isMissingSelection
                  ? 'Complete Todas as Escolhas Obrigatórias!'
                  : 'Trava Física de Engenharia Ativada!'}
              </p>
              {isMissingSelection && (
                <p>
                  Antes de decolar, selecione: {!selectedRocket ? '1 Foguete' : ''}{' '}
                  {!selectedOrbit ? '· 1 Órbita' : ''}{' '}
                  {selectedInstruments.length !== 2
                    ? `· 2 Instrumentos (faltam ${2 - selectedInstruments.length})`
                    : ''}
                  .
                </p>
              )}
              {isOverMass && selectedRocket && (
                <p>
                  <strong>
                    Excesso de Massa ({totalMassKg} kg &gt; {selectedRocket.maxMassKg} kg):
                  </strong>{' '}
                  Na física de foguetes, quanto maior a carga, maior o empuxo necessário para vencer a gravidade. Troque por um instrumento mais leve!
                </p>
              )}
              {isOverBudget && (
                <p>
                  <strong>
                    Orçamento Excedido (${totalCostM}M &gt; ${HANGAR_BUDGET_M}M):
                  </strong>{' '}
                  O Foguete Pesado ($75M) consome quase toda a verba. Use o{' '}
                  <strong>Foguete Leve ($40M)</strong> e escolha 2 instrumentos que caibam em 1.200 kg!
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Nave:{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedRocket?.name || 'Nenhum foguete'}
            </strong>{' '}
            ·{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedOrbit?.name || 'Nenhuma órbita'}
            </strong>{' '}
            ·{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedInstruments.map((i) => i.shortName).join(' + ') || 'Nenhum instrumento'}
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
            <span>Iniciar Lançamento para Marte</span>
          </button>
        </div>
      </section>

      {/* "O que é?" Explanatory Modal */}
      {explanationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setExplanationModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#10182E] p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {explanationModal.subtitle}
                </p>
                <h3 className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">
                  {explanationModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExplanationModal(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Fechar explicação"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {explanationModal.body}
            </p>
            <button
              type="button"
              onClick={() => setExplanationModal(null)}
              className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
