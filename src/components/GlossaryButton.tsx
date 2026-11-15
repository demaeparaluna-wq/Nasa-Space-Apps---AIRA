import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/missionData';
import { AgeProfile } from '../types/game';
import { playClickSound } from '../utils/sound';

interface GlossaryInlineProps {
  termKey: keyof typeof GLOSSARY_TERMS;
  ageProfile: AgeProfile;
  children?: React.ReactNode;
}

export const GlossaryInline: React.FC<GlossaryInlineProps> = ({
  termKey,
  ageProfile,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const entry = GLOSSARY_TERMS[termKey];

  if (!entry) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          playClickSound();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1 border-b border-dashed border-sky-600/70 dark:border-sky-400/70 font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-sky-400"
        title={`Explicar: ${entry.term}`}
      >
        <span>{children ?? entry.term}</span>
        <HelpCircle className="h-3.5 w-3.5 shrink-0 opacity-85" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`glossary-${termKey}`}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#10182C] p-5 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  Glossário NASA · {entry.nasaSource}
                </p>
                <h3
                  id={`glossary-${termKey}`}
                  className="mt-1 text-lg font-bold text-slate-900 dark:text-white"
                >
                  {entry.term}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Fechar glossário"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {entry.definitionByProfile[ageProfile]}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
