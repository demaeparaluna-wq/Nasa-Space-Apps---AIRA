import React from 'react';
import { AlertTriangle, ArrowRight, Award, RotateCcw, Wrench } from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import { getProfileToneCopy } from '../data/toneCopy';
import { AgeProfile, Language, ModalFeedbackState, ResourceKey, Resources } from '../types/game';
import { playClickSound } from '../utils/sound';
import { QuackMascot } from './QuackMascot';

interface Screen4ModalProps {
  lang?: Language;
  modal: ModalFeedbackState;
  resources: Resources;
  ageProfile: AgeProfile;
  onContinueNextSol: () => void;
  onRetrySol: () => void;
  onBackToHangar: () => void;
}

export const Screen4Modal: React.FC<Screen4ModalProps> = ({
  lang = 'en',
  modal,
  resources,
  ageProfile,
  onContinueNextSol,
  onRetrySol,
  onBackToHangar,
}) => {
  const isPt = lang === 'pt';
  const tone = getProfileToneCopy(lang, ageProfile);
  const { RESOURCE_META } = getLocalizedMissionData(lang);

  if (modal.type === 'failure') {
    const failedMeta = modal.failedResource ? RESOURCE_META[modal.failedResource] : null;
    const failureText = modal.failurePhysicsByProfile?.[ageProfile];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-lg rounded-2xl border border-rose-500/60 bg-white dark:bg-[#10182E] p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <QuackMascot expression="terror" size={112} />
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {tone.modal.failureTag(modal.sol)}
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                {failedMeta
                  ? isPt
                    ? `${failedMeta.label} chegou a 0%!`
                    : `${failedMeta.label} dropped to 0%!`
                  : isPt
                    ? 'Sistema em estado crítico!'
                    : 'Critical system failure!'}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {tone.modal.failureIntro}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-[#0B1224] dark:text-slate-200 p-4 text-sm leading-relaxed">
            {failureText}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onRetrySol();
              }}
              aria-label={isPt ? 'Tentar este Sol novamente mantendo a mesma nave' : 'Retry this Sol with current ship'}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-orange-400"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isPt ? 'Tentar Este Sol Novamente' : 'Retry This Sol'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onBackToHangar();
              }}
              aria-label={isPt ? 'Voltar ao Hangar para reprojetar a nave' : 'Return to Hangar to redesign ship'}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 px-4 py-3 text-sm font-semibold"
            >
              <Wrench className="h-4 w-4" />
              <span>{isPt ? 'Reprojetar Nave no Hangar' : 'Redesign Ship in Hangar'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dangerKeys = (Object.keys(resources) as ResourceKey[]).filter((k) => resources[k] < 35);
  const inDangerNow = dangerKeys.length > 0;

  const deltaEntries = (Object.entries(modal.appliedDelta) as [ResourceKey, number][]).filter(
    ([, val]) => val !== 0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-lg rounded-2xl border bg-white dark:bg-[#10182E] p-6 shadow-2xl space-y-5 ${
          inDangerNow ? 'border-amber-500/70' : 'border-emerald-500/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <QuackMascot expression={inDangerNow ? 'terror' : 'celebrate'} size={118} />
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
              <Award className="h-4 w-4" />
              <span>
                {isPt ? `SELO DESBLOQUEADO · SOL ${modal.sol}` : `BADGE UNLOCKED · SOL ${modal.sol}`}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {modal.badge?.title}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              {modal.badge?.subtitle}
            </p>
          </div>
        </div>

        {inDangerNow && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-400 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-900 dark:border-amber-500/50 dark:bg-amber-950/50 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              {tone.modal.closeCallPrefix}{' '}
              {dangerKeys.map((k) => `${RESOURCE_META[k].label} (${resources[k]}%)`).join(', ')}{' '}
              {tone.modal.closeCallSuffix}
            </span>
          </div>
        )}

        {deltaEntries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {deltaEntries.map(([key, val]) => (
              <span
                key={key}
                className={`rounded-lg border px-2.5 py-1 font-mono-tabular text-xs font-bold ${
                  val > 0
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {val > 0 ? `+${val}%` : `${val}%`} {RESOURCE_META[key].label}
              </span>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-2">
          <p className="text-xs font-bold text-sky-700 dark:text-sky-300">
            {tone.modal.scienceHeading}
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {modal.chosenCard?.scienceExplanationByProfile[ageProfile]}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {modal.badge?.nasaConnection}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            onContinueNextSol();
          }}
          aria-label={
            modal.sol < 4
              ? isPt
                ? `Avançar para o Sol ${modal.sol + 1}`
                : `Advance to Sol ${modal.sol + 1}`
              : isPt
                ? 'Avançar para o Passaporte Final e Festa Mambo'
                : 'Advance to Final Passport and Mambo Party'
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 hover:bg-emerald-300 transition-colors"
        >
          <span>
            {modal.sol < 4
              ? isPt
                ? `Avançar para o Sol ${modal.sol + 1}`
                : `Advance to Sol ${modal.sol + 1}`
              : isPt
                ? 'Ir para o Passaporte & Festa Mambo!'
                : 'Go to Passport & Mambo Party!'}
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
