import React, { useEffect, useState } from 'react';
import { Language } from '../types/game';
import { UfoSplashVisual } from './SpaceVisuals';

interface SplashScreenProps {
  lang?: Language;
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ lang = 'en', onComplete }) => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const start = Date.now();
    const duration = 2500;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        window.clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFFFF] px-6 text-center text-slate-900">
      <div className="w-full max-w-md flex flex-col items-center">
        <UfoSplashVisual />

        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {lang === 'pt'
            ? 'Missão Sol-4: Guardiões da Base Ares'
            : 'Mission Sol-4: Guardians of Ares Base'}
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">
          {lang === 'pt'
            ? 'Bem-vindo à Base Ares — Sincronizando telemetria com o Comandante Quack...'
            : 'Welcome to Ares Base — Syncing NASA telemetry with Commander Quack...'}
        </p>

        {/* Loading bar */}
        <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-orange-500 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex w-full items-center justify-between text-xs text-slate-500">
          <span className="font-mono-tabular">
            {lang === 'pt' ? `Telemetria NASA · ${progress}%` : `NASA Telemetry · ${progress}%`}
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="rounded-lg px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {lang === 'pt' ? 'Pular abertura ➔' : 'Skip intro ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
