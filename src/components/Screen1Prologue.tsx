import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Database,
  Target,
  User,
  Users,
  X,
} from 'lucide-react';
import { AGE_PROFILES, SPACE_AVATARS, TEAM_ROLES } from '../data/missionData';
import { AgeProfile, AvatarId, NasaDataBundle, PlayMode } from '../types/game';
import { playClickSound } from '../utils/sound';
import { GlossaryInline } from './GlossaryButton';
import { MissionPatchLogo } from './MissionPatchLogo';
import { QuackMascot } from './QuackMascot';
import { SpaceAvatarSvg } from './SpaceVisuals';

interface Screen1PrologueProps {
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
  nasaData: NasaDataBundle;
  onOpenLineage: () => void;
  onStartHangar: () => void;
}

export const Screen1Prologue: React.FC<Screen1PrologueProps> = ({
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
  nasaData,
  onOpenLineage,
  onStartHangar,
}) => {
  const [activeInfoModal, setActiveInfoModal] = useState<'howto' | 'badges' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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
        setValidationError('Por favor, digite seu nome de Guardião(ã) antes de entrar no Hangar.');
        return;
      }
    } else {
      const missingIdx = Array.from({ length: teamCount }).findIndex(
        (_, i) => !teamNames[i] || !teamNames[i].trim()
      );
      if (missingIdx !== -1) {
        setValidationError(
          `Preencha o nome de todos os ${teamCount} integrantes da equipe antes de avançar.`
        );
        return;
      }
    }
    setValidationError(null);
    onStartHangar();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Hero Patch + Title Lockup matching Screenshot Aesthetic */}
      <section className="flex flex-col items-center text-center pt-1 space-y-3">
        <MissionPatchLogo size={116} />

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
          O Chamado da Base Ares
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
          Missão Sol-4:{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Guardiões da Base Ares
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
            <span>Como Jogar em 3 Passos</span>
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
            <span>Vitrine de Selos</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenLineage();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-900/50"
          >
            <Database className="h-3.5 w-3.5 text-sky-500" />
            <span>Linhagem NASA &amp; Mecânicas</span>
          </button>
        </div>
      </section>

      {/* Clear Problem Statement & Real NASA Value */}
      <section className="rounded-2xl border border-orange-200/80 bg-white/90 dark:border-orange-500/25 dark:bg-[#131C33]/90 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              <Target className="h-3.5 w-3.5" />
              <span>Qual problema resolvemos?</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Dados espaciais da NASA costumam ser complexos e desconectados da sala de aula. Aqui você toma decisões reais de <strong>engenharia sistêmica</strong> (com{' '}
              <strong>zero conhecimento prévio</strong>) ligando tempestades solares (<strong>{nasaData.donkiFlare.classType}</strong>), clima de Marte (<strong>{nasaData.meda.nightTempC}°C</strong>) e biofilmes (<strong>{nasaData.osdr.studyId}</strong>) à sobrevivência da base.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenLineage();
            }}
            className="shrink-0 self-start sm:self-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#192440] dark:text-sky-300 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            Ver Mapa Técnico ➔
          </button>
        </div>
      </section>

      {/* Emergency Transmission Card with Centered Comandante Quack matching Screenshot */}
      <section className="rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-800/80 dark:bg-[#131C33]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center space-y-4">
          <QuackMascot expression="terror" size={144} />

          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-[#192440] p-4 sm:p-5 space-y-3 text-left">
            <span className="inline-block rounded-lg bg-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
              Comandante Quack · Sol 1
            </span>

            <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100">
              “Quack! Alô, Terra?! Aqui é o Comandante Quack na{' '}
              <GlossaryInline termKey="jezero" ageProfile={ageProfile}>
                Cratera Jezero
              </GlossaryInline>{' '}
              — um enorme buraco em Marte onde pousou o robô Perseverance! O sinal está falhando e... o que é aquilo se mexendo nos dutos de água?!”
            </p>
          </div>
        </div>
      </section>

      {/* Focused Crew Configuration Card */}
      <section className="rounded-3xl border border-slate-200 bg-white/95 dark:border-slate-800/80 dark:bg-[#131C33]/95 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Identidade da Tripulação
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Preencha os dados obrigatórios abaixo para liberar o Hangar de Engenharia.
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
            <span>Solo</span>
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
            <span>Equipe (2–4 jogadores)</span>
          </button>
        </div>

        {playMode === 'solo' ? (
          <div>
            <label
              htmlFor="player-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Seu Nome de Guardião(ã) *
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
              placeholder="Digite seu nome (Ex: Luna ou Capitão Leo)"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none dark:border-slate-700 dark:bg-[#0B1224] dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#0B1224]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Turnos Rotativos (1 papel por Sol)
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
                    placeholder={`Nome do Jogador ${idx + 1}`}
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
            Avatar Espacial
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
            Perfil de Leitura (adapta textos e chat do Quack)
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
          <span>Entrar no Hangar de Engenharia</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      {/* Modals for How to Play & Badges */}
      {activeInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
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
                  ? 'Como Jogar em 3 Passos'
                  : 'Vitrine de Selos da NASA'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Fechar janela"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeInfoModal === 'howto' ? (
              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">01.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Hangar ($100M):</strong> Escolha Foguete, Órbita e 2 Instrumentos sem estourar o peso ou o orçamento.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">02.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">4 Sols Marcianos:</strong> Cada decisão tem prós e contras reais. Escolhas descuidadas zeram seus medidores e fazem você perder!
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular font-bold text-orange-500">03.</span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Título Ouro:</strong> Termine os 4 Sols com todas as 4 barras em 35% ou mais e celebre na Festa Mambo!
                  </span>
                </li>
              </ol>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-200">
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🏅 <strong>Caçador de Biofilmes</strong> — Sol 1 (OSDR + MEDA)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🛡️ <strong>Guardião das Tempestades Solares</strong> — Sol 2 (DONKI X8.7)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🌱 <strong>Botânico Espacial</strong> — Sol 3 (Estufa Veggie 16h LED)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] px-3 py-2.5">
                  🚀 <strong>Comandante de Marte</strong> — Sol 4 (Pouso Final)
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="w-full rounded-xl bg-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-orange-400"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
