import React from 'react';
import { Language, NasaDataBundle } from '../types/game';

interface NasaFooterProps {
  nasaData: NasaDataBundle;
  lang?: Language;
  lightSurface?: boolean;
}

export const NasaFooter: React.FC<NasaFooterProps> = ({
  nasaData,
  lang = 'en',
  lightSurface = false,
}) => {
  const statusLabel =
    lang === 'pt'
      ? nasaData.status === 'live'
        ? '🟢 DADOS AO VIVO NASA'
        : nasaData.status === 'cache'
          ? '🔵 CACHE LOCAL (24H)'
          : '🟡 DADOS REAIS ARQUIVADOS'
      : nasaData.status === 'live'
        ? '🟢 LIVE NASA DATA'
        : nasaData.status === 'cache'
          ? '🔵 LOCAL CACHE (24H)'
          : '🟡 ARCHIVED REAL NASA DATA';

  return (
    <footer
      className={`fixed bottom-0 inset-x-0 z-30 border-t px-3 py-1.5 text-center transition-colors ${
        lightSurface
          ? 'border-slate-200 bg-white/98 text-slate-700'
          : 'border-slate-200 bg-white/98 text-slate-700 dark:border-slate-800/90 dark:bg-[#070B16]/98 dark:text-slate-300'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-0.5 sm:flex-row sm:gap-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide">
          <span>{statusLabel}</span>
          <span aria-hidden="true" className="hidden md:inline opacity-40">
            ·
          </span>
          <span className="hidden md:inline font-mono-tabular text-[11px] opacity-75">
            DONKI ({nasaData.donkiFlare.classType}) + OSDR OSD-120 + Mars MEDA + APOD
          </span>
        </div>
        <p className="text-[11px] leading-tight opacity-85">
          {lang === 'pt'
            ? 'Desenvolvido por Maryangela Costa de Souza Florentin & Luna Costa Antunes • NASA Space Apps Challenge'
            : 'Developed by Maryangela Costa de Souza Florentin & Luna Costa Antunes • NASA Space Apps Challenge'}
        </p>
      </div>
    </footer>
  );
};
