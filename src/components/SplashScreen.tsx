import React, { useEffect, useState } from 'react';
import { Language } from '../types/game';
import { AccessibilityMenu } from './AccessibilityMenu';
import { UfoSplashVisual } from './SpaceVisuals';

interface SplashScreenProps {
  lang?: Language;
  onComplete: () => void;
  a11yLargeText: boolean;
  onToggleLargeText: () => void;
  a11yHighContrast: boolean;
  onToggleHighContrast: () => void;
  onBuildNarration: () => string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  lang = 'en',
  onComplete,
  a11yLargeText,
  onToggleLargeText,
  a11yHighContrast,
  onToggleHighContrast,
  onBuildNarration,
}) => {
  const [progress, setProgress] = useState(12);
  const [pausedByA11y, setPausedByA11y] = useState(false);

  useEffect(() => {
    if (pausedByA11y) return;
    const duration = 2500;
    const startProgress = progress;
    const remainingRatio = Math.max(0.05, (100 - startProgress) / 100);
    const effectiveDuration = Math.max(400, duration * remainingRatio);
    const start = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(
        100,
        Math.round(startProgress + (elapsed / effectiveDuration) * (100 - startProgress))
      );
      setProgress(pct);
      if (elapsed >= effectiveDuration) {
        window.clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete, pausedByA11y]);

  const isPt = lang === 'pt';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#FFFFFF] px-6 pt-14 pb-12 text-center text-slate-900">
      {/* Discreet top-right Accessibility Menu available right on Splash Screen */}
      <div className="fixed right-4 top-4 z-50">
        <AccessibilityMenu
          lang={lang}
          largeText={a11yLargeText}
          onToggleLargeText={onToggleLargeText}
          highContrast={a11yHighContrast}
          onToggleHighContrast={onToggleHighContrast}
          onBuildNarration={onBuildNarration}
          variant="splash"
          onOpenChange={setPausedByA11y}
        />
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <UfoSplashVisual />

        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {isPt
            ? 'Missão Sol-4: Guardiões da Base Ares'
            : 'Mission Sol-4: Guardians of Ares Base'}
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">
          {isPt
            ? 'Bem-vindo à Base Ares — Sincronizando telemetria com o Comandante Quack...'
            : 'Welcome to Ares Base — Syncing NASA telemetry with Commander Quack...'}
        </p>

        {/* Loading bar */}
        <div
          className="a11y-bar-track mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label={isPt ? 'Carregamento da telemetria NASA' : 'NASA telemetry loading progress'}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-orange-500 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex w-full items-center justify-between text-xs text-slate-500">
          <span className="font-mono-tabular">
            {isPt ? `Telemetria NASA · ${progress}%` : `NASA Telemetry · ${progress}%`}
          </span>
          <button
            type="button"
            onClick={onComplete}
            aria-label={
              isPt
                ? 'Pular tela de abertura e ir para o Prólogo'
                : 'Skip intro splash screen and go to Prologue'
            }
            className="rounded-lg px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {isPt ? 'Pular abertura ➔' : 'Skip intro ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
