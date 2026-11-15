import React, { useEffect, useRef, useState } from 'react';
import { Accessibility, Eye, Palette, Square, Volume2, X } from 'lucide-react';
import { Language } from '../types/game';
import { isSpeechSupported, speakText, stopSpeech } from '../utils/a11ySpeech';
import { playClickSound } from '../utils/sound';

interface AccessibilityMenuProps {
  lang: Language;
  largeText: boolean;
  onToggleLargeText: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onBuildNarration: () => string;
  variant?: 'header' | 'splash';
  onOpenChange?: (open: boolean) => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({
  lang,
  largeText,
  onToggleLargeText,
  highContrast,
  onToggleHighContrast,
  onBuildNarration,
  variant = 'header',
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUnavailable, setSpeechUnavailable] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const isPt = lang === 'pt';

  const setMenuOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    setOpen((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      onOpenChange?.(resolved);
      return resolved;
    });
  };

  // Close with Escape key and return focus to trigger button
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Cancel speech cleanly when language changes or component unmounts
  useEffect(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, [lang]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleReadCurrentScreen = () => {
    playClickSound();
    if (!isSpeechSupported()) {
      setSpeechUnavailable(true);
      setIsSpeaking(false);
      return;
    }
    setSpeechUnavailable(false);
    const script = onBuildNarration();
    const ok = speakText(script, lang, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
    if (ok) {
      setIsSpeaking(true);
    } else {
      setSpeechUnavailable(true);
      setIsSpeaking(false);
    }
  };

  const handleStopReading = () => {
    playClickSound();
    stopSpeech();
    setIsSpeaking(false);
  };

  const triggerClass =
    variant === 'splash'
      ? 'inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap'
      : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap transition-colors';

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          playClickSound();
          setMenuOpen((prev) => !prev);
        }}
        className={triggerClass}
        aria-label={
          isPt
            ? 'Abrir menu de acessibilidade (Baixa Visão, Alto Contraste e Leitura em Voz Alta)'
            : 'Open accessibility menu (Low Vision, High Contrast and Read Aloud)'
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Accessibility className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
        <span className="hidden md:inline">
          {isPt ? 'Acessibilidade' : 'Accessibility'}
        </span>
        {(largeText || highContrast || isSpeaking) && (
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-500"
          />
        )}
      </button>

      {open && (
        <>
          {/* Click-outside backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="false"
            aria-label={isPt ? 'Opções de Acessibilidade' : 'Accessibility Options'}
            className="a11y-popover-card absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-2xl dark:border-slate-700 dark:bg-[#10182E] space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-sky-500" aria-hidden="true" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isPt ? '♿ Acessibilidade' : '♿ Accessibility'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  triggerRef.current?.focus();
                }}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={isPt ? 'Fechar menu de acessibilidade' : 'Close accessibility menu'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 1: Low Vision / Large Text */}
            <button
              type="button"
              role="switch"
              aria-checked={largeText}
              aria-label={
                isPt
                  ? 'Baixa Visão (Texto Ampliado) — alternar tamanho das fontes e espaçamentos'
                  : 'Low Vision (Large Text) — toggle enlarged typography and spacing'
              }
              onClick={() => {
                playClickSound();
                onToggleLargeText();
              }}
              className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                largeText
                  ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-sky-950/50 dark:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:text-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Eye className="h-3.5 w-3.5 text-sky-500 shrink-0" aria-hidden="true" />
                  <span>
                    {isPt ? '👁️ Baixa Visão (Texto Ampliado)' : '👁️ Low Vision (Large Text)'}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                  {isPt
                    ? 'Amplia fontes, botões e espaçamento dos cartões.'
                    : 'Enlarges fonts, buttons, and card spacing.'}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  largeText
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {largeText ? (isPt ? 'Ativo' : 'On') : isPt ? 'Off' : 'Off'}
              </span>
            </button>

            {/* Feature 2: High Contrast & Colorblind */}
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              aria-label={
                isPt
                  ? 'Alto Contraste & Daltonismo — alternar tema escuro profundo, padrões e etiquetas textuais'
                  : 'High Contrast & Colorblind — toggle deep dark contrast, patterns, and text badges'
              }
              onClick={() => {
                playClickSound();
                onToggleHighContrast();
              }}
              className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                highContrast
                  ? 'border-amber-400 bg-amber-50 text-slate-900 dark:border-amber-400 dark:bg-amber-950/40 dark:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:text-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Palette className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                  <span>
                    {isPt ? '🎨 Alto Contraste & Daltonismo' : '🎨 High Contrast & Colorblind'}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                  {isPt
                    ? 'Fundo escuro profundo, bordas nítidas, padrões e selos textuais.'
                    : 'Deep dark theme, crisp borders, bar patterns, and text badges.'}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  highContrast
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {highContrast ? (isPt ? 'Ativo' : 'On') : isPt ? 'Off' : 'Off'}
              </span>
            </button>

            {/* Feature 3: Audio Description & Read Aloud */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#0B1224] space-y-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Volume2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>
                    {isPt
                      ? '🔊 Áudio-Descrição & Leitura em Voz Alta'
                      : '🔊 Audio Description & Read Aloud'}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                  {isPt
                    ? 'Lê título, fala do Quack, barras de recursos e descrição da cena.'
                    : 'Reads screen title, Quack speech, resource bars, and scene description.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReadCurrentScreen}
                  aria-label={
                    isPt
                      ? 'Ler tela atual em voz alta com áudio-descrição'
                      : 'Read current screen aloud with audio description'
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isPt ? 'Ler Tela Atual' : 'Read Current Screen'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStopReading}
                  disabled={!isSpeaking}
                  aria-label={isPt ? 'Parar leitura em voz alta' : 'Stop reading aloud'}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-bold transition-colors ${
                    isSpeaking
                      ? 'border-rose-500 bg-rose-500 text-white hover:bg-rose-400'
                      : 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                  <span>{isPt ? 'Parar Leitura' : 'Stop Reading'}</span>
                </button>
              </div>

              <p aria-live="polite" className="text-[10px] text-slate-500 dark:text-slate-400">
                {speechUnavailable
                  ? isPt
                    ? 'Seu navegador não suporta leitura nativa por voz (SpeechSynthesis).'
                    : 'Your browser does not support native voice reading (SpeechSynthesis).'
                  : isSpeaking
                    ? isPt
                      ? 'Lendo tela atual em voz alta...'
                      : 'Reading current screen aloud...'
                    : isPt
                      ? 'Pressione Esc ou clique fora para fechar este menu.'
                      : 'Press Esc or click outside to close this menu.'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
