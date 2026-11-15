import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  User,
  Users,
  X,
} from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import { AgeProfile, AvatarId, Language, PlayMode } from '../types/game';
import { playClickSound } from '../utils/sound';
import { GlossaryInline } from './GlossaryButton';
import { MissionPatchLogo } from './MissionPatchLogo';
import { QuackMascot } from './QuackMascot';
import { SpaceAvatarSvg } from './SpaceVisuals';

interface Screen1PrologueProps {
  lang?: Language;
  playerName: string;
  setPlayerName: (name: string) => void;
  avatarId: AvatarId;
  setAvatarId: (id: AvatarId) => void;
  ageProfile: AgeProfile;
  setAgeProfile: (profile: AgeProfile) => void;
  playMode: PlayMode;
  setPlayMode: (mode: PlayMode) => void;
  teamNames: string[];
  setTeamNames: (names: string[]) => void;
  teamCount: number;
  setTeamCount: (count: number) => void;
  onStartHangar: () => void;
}

export const Screen1Prologue: React.FC<Screen1PrologueProps> = ({
  lang = 'en',
  playerName,
  setPlayerName,
  avatarId,
  setAvatarId,
  ageProfile,
  setAgeProfile,
  playMode,
  setPlayMode,
  teamNames,
  setTeamNames,
  teamCount,
  setTeamCount,
  onStartHangar,
}) => {
  const [activeInfoModal, setActiveInfoModal] = useState<'howto' | 'badges' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { AGE_PROFILES, SPACE_AVATARS, TEAM_ROLES } = getLocalizedMissionData(lang);
  const isPt = lang === 'pt';

  const handleTeamNameChange = (idx: number, val: string) => {
    setValidationError(null);
    const updated = [...teamNames];
    updated[idx] = val;
    setTeamNames(updated);
  };

  const handleProceed = () => {
    playClickSound();
    if (playMode === 'solo') {
      if (!playerName.trim()) {
        setValidationError(
          isPt
            ? 'Por favor, digite seu nome de Guardião(ã) antes de entrar no Hangar.'
            : 'Please enter your Guardian name before entering the Engineering Hangar.'
        );
        return;
      }
    } else {
      const missingIdx = Array.from({ length: teamCount }).findIndex(
        (_, i) => !teamNames[i] || !teamNames[i].trim()
      );
      if (missingIdx !== -1) {
        setValidationError(
          isPt
            ? `Preencha o nome de todos os ${teamCount} integrantes da equipe antes de avançar.`
            : `Please fill in all ${teamCount} crew member names before continuing.`
        );
        return;
      }
    }
    setValidationError(null);
    onStartHangar();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-[110px]">
      {/* Hero Patch + Title Lockup */}
      <section className="flex flex-col items-center text-center pt-1 space-y-3">
        <MissionPatchLogo size={116} lang={lang} />

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
          {isPt ? 'O Chamado da Base Ares' : 'The Call from Ares Base'}
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
          {isPt ? 'Missão Sol-4:' : 'Mission Sol-4:'}{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            {isPt ? 'Guardiões da Base Ares' : 'Guardians of Ares Base'}
          </span>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveInfoModal('howto');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700/90 dark:bg-[#131C33] dark:text-sky-200 dark:hover:bg-[#1A2540]"
          >
            <BookOpen className="h-3.5 w-3.5 text-sky-500" />
            <span>{isPt ? 'Como Jogar em 3 Passos' : 'How to Play in 3 Steps'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveInfoModal('badges');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700/90 dark:bg-[#131C33] dark:text-amber-300 dark:hover:bg-[#1A2540]"
          >
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>{isPt ? 'Vitrine de Selos' : 'Mission Badges'}</span>
          </button>
        </div>
      </section>

      {/* Emergency Transmission Card with Centered Commander Quack */}
      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#131C33] p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <QuackMascot expression="terror" size={144} />

          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-[#192440] p-4 sm:p-5 space-y-3 text-left">
            <span className="inline-block rounded-lg bg-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
              {isPt ? 'Comandante Quack · Sol 1' : 'Commander Quack · Sol 1'}
            </span>

            {isPt ? (
              <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100">
                “Quack! Alô, Terra?! Aqui é o Comandante Quack na{' '}
                <GlossaryInline termKey="jezero" ageProfile={ageProfile} lang={lang}>
                  Cratera Jezero
                </GlossaryInline>{' '}
                — onde pousou o robô Perseverance! Os sensores estão falhando, o frio vai despencar para -85°C e algo estranho está entupindo nossos dutos de água! Vocês aí no Centro de Controle da Terra precisam preparar e lançar uma nave de apoio urgente antes que a Base Ares fique sem energia!”
              </p>
            ) : (
              <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100">
                “Quack! Hello, Earth?! This is Commander Quack at{' '}
                <GlossaryInline termKey="jezero" ageProfile={ageProfile} lang={lang}>
                  Jezero Crater
                </GlossaryInline>{' '}
                — where the Perseverance rover landed! Sensors are glitching, temperatures are plunging to -85°C, and something strange is clogging our water pipes! You at Earth Mission Control must build and launch an urgent rescue ship before Ares Base loses all power!”
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Crew Configuration Card */}
      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#131C33] p-5 sm:p-6 shadow-xl space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {isPt ? 'Identidade da Tripulação' : 'Crew Identity'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isPt
              ? 'Preencha os dados obrigatórios abaixo para liberar o Hangar de Engenharia.'
              : 'Fill in the required fields below to unlock the Engineering Hangar.'}
          </p>
        </div>

        {/* Solo vs Team toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-800 dark:bg-[#0B1224]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setValidationError(null);
              setPlayMode('solo');
            }}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
              playMode === 'solo'
                ? 'bg-orange-500 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            <span>{isPt ? 'Solo' : 'Solo'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setValidationError(null);
              setPlayMode('team');
            }}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
              playMode === 'team'
                ? 'bg-orange-500 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isPt ? 'Equipe (2–4 jogadores)' : 'Team (2–4 players)'}</span>
          </button>
        </div>

        {playMode === 'solo' ? (
          <div>
            <label
              htmlFor="player-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {isPt ? 'Seu Nome de Guardião(ã) *' : 'Your Guardian Name *'}
            </label>
            <input
              id="player-name"
              type="text"
              maxLength={28}
              value={playerName}
              onChange={(e) => {
                setValidationError(null);
                setPlayerName(e.target.value);
              }}
              placeholder={
                isPt
                  ? 'Ex: Nome ou apelido'
                  : 'e.g., Name or nickname'
              }
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none dark:border-slate-700 dark:bg-[#0B1224] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#0B1224]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isPt ? 'Turnos Rotativos (1 papel por Sol)' : 'Rotating Turns (1 role per Sol)'}
              </span>
              <div className="flex items-center gap-1">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setTeamCount(num);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                      teamCount === num
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEAM_ROLES.slice(0, teamCount).map((item, idx) => (
                <div key={item.role} className="space-y-1">
                  <label className="block text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                    Sol {idx + 1} · {item.role} *
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={teamNames[idx] || ''}
                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                    placeholder={
                      isPt
                        ? `Jogador ${idx + 1} · Ex: Nome ou apelido`
                        : `Player ${idx + 1} · Name or nickname`
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-[#131C33] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 Space Avatars */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isPt ? 'Avatar Espacial' : 'Space Avatar'}
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {SPACE_AVATARS.map((av) => {
              const selected = avatarId === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setAvatarId(av.id);
                  }}
                  className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
                    selected
                      ? 'border-orange-500 bg-orange-50 shadow-sm dark:border-amber-400 dark:bg-[#1A2540]'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-700'
                  }`}
                >
                  <SpaceAvatarSvg id={av.id} size={48} />
                  <span className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                    {av.name}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {av.specialty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Profile Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isPt
              ? 'Perfil de Leitura (adapta textos e chat do Quack)'
              : 'Reading Profile (adapts mission texts & Quack chat)'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {AGE_PROFILES.map((prof) => {
              const active = ageProfile === prof.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setAgeProfile(prof.id);
                  }}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? 'border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-[#1A2540]'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0B1224] dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {prof.label}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 dark:text-slate-300">
                    {prof.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleProceed}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-extrabold text-slate-950 shadow-lg hover:brightness-105 transition-all focus-visible:outline-2 focus-visible:outline-orange-400"
        >
          <span>{isPt ? 'Entrar no Hangar de Engenharia' : 'Enter Engineering Hangar'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      {/* Modals for How to Play & Badges */}
      {activeInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveInfoModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#131C33] p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {activeInfoModal === 'howto'
                  ? isPt
                    ? 'Como Jogar em 3 Passos'
                    : 'How to Play in 3 Steps'
                  : isPt
                    ? 'Vitrine de Selos da NASA'
                    : 'NASA Mission Badges'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={isPt ? 'Fechar janela' : 'Close dialog'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeInfoModal === 'howto' ? (
              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">01.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      {isPt ? 'Hangar ($100M):' : 'Hangar ($100M):'}
                    </strong>{' '}
                    {isPt
                      ? 'Escolha Foguete, Órbita e 2 Instrumentos sem estourar o peso ou o orçamento.'
                      : 'Pick a Rocket, an Orbit, and 2 Instruments without exceeding mass or budget limits.'}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">02.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      {isPt ? '4 Sols Marcianos:' : '4 Martian Sols:'}
                    </strong>{' '}
                    {isPt
                      ? 'Cada decisão tem prós e contras reais. Escolhas descuidadas zeram seus medidores e fazem você perder!'
                      : 'Every choice carries real trade-offs. Reckless choices drain systems to 0% and fail the mission!'}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">03.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      {isPt ? 'Título Ouro:' : 'Gold Guardian:'}
                    </strong>{' '}
                    {isPt
                      ? 'Termine os 4 Sols com todas as 4 barras em 35% ou mais e celebre na Festa Mambo!'
                      : 'Finish all 4 Sols with every system at 35% or higher and celebrate at the Mambo Party!'}
                  </span>
                </li>
              </ol>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-200">
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🏅 <strong>{isPt ? 'Caçador de Biofilmes' : 'Biofilm Hunter'}</strong> — Sol 1 (OSDR + MEDA)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🛡️ <strong>{isPt ? 'Guardião das Tempestades Solares' : 'Solar Storm Guardian'}</strong> — Sol 2 (DONKI X8.7)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🌱 <strong>{isPt ? 'Botânico Espacial' : 'Space Botanist'}</strong> — Sol 3 (Veggie 16h LED)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🚀 <strong>{isPt ? 'Comandante de Marte' : 'Commander of Mars'}</strong> — Sol 4 ({isPt ? 'Pouso Final' : 'Final Landing'})
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="w-full rounded-xl bg-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-orange-400"
            >
              {isPt ? 'Entendi!' : 'Got it!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
