import React from 'react';
import {
  BookOpen,
  Cpu,
  GraduationCap,
  Microscope,
  Target,
  Users,
  X,
} from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import {
  AgeProfile,
  ChoiceHistoryEntry,
  HangarConfig,
  Language,
  NasaDataBundle,
  Resources,
} from '../types/game';
import { playClickSound } from '../utils/sound';
import { TechnicalLineagePanel } from './TechnicalLineagePanel';

export type InfoHubTab = 'about' | 'explorer' | 'technical' | 'parents';

interface MissionInfoHubModalProps {
  lang?: Language;
  activeTab: InfoHubTab;
  onChangeTab: (tab: InfoHubTab) => void;
  onClose: () => void;
  nasaData: NasaDataBundle;
  ageProfile: AgeProfile;
  hangarConfig: HangarConfig;
  resources: Resources;
  choiceHistory: ChoiceHistoryEntry[];
}

export const MissionInfoHubModal: React.FC<MissionInfoHubModalProps> = ({
  lang = 'en',
  activeTab,
  onChangeTab,
  onClose,
  nasaData,
  ageProfile,
  hangarConfig,
  resources,
  choiceHistory,
}) => {
  const isPt = lang === 'pt';
  const {
    AGE_PROFILES,
    CLASSROOM_DEBATE_QUESTIONS,
    PEER_REVIEWED_REFERENCES,
  } = getLocalizedMissionData(lang);

  const HUB_TABS: { id: InfoHubTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'about',
      label: isPt ? 'Sobre o Jogo' : 'About Mission',
      icon: <Target className="h-3.5 w-3.5" />,
    },
    {
      id: 'explorer',
      label: isPt ? 'Laboratório NASA' : 'NASA Science Lab',
      icon: <Microscope className="h-3.5 w-3.5" />,
    },
    {
      id: 'technical',
      label: isPt ? 'Visão Técnica' : 'Technical View',
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    {
      id: 'parents',
      label: isPt ? 'Pais & Professores' : 'Parents & Teachers',
      icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#10182E] p-5 sm:p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              {isPt
                ? 'Central Científica & Pedagógica · Base Ares'
                : 'Science & Classroom Hub · Ares Base'}
            </p>
            <h2 className="mt-0.5 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {activeTab === 'about' &&
                (isPt
                  ? 'Sobre o Jogo & O Problema que Resolvemos'
                  : 'About the Game & The Problem We Solve')}
              {activeTab === 'explorer' &&
                (isPt
                  ? 'Laboratório de Ciência Real (Visão Explorador)'
                  : 'Real Science Lab (Explorer View)')}
              {activeTab === 'technical' &&
                (isPt
                  ? 'Linhagem Técnica de Dados NASA & Mecânicas'
                  : 'Technical NASA Data Lineage & Mechanics')}
              {activeTab === 'parents' &&
                (isPt
                  ? 'Área dos Pais & Professores · Guia de Debate'
                  : 'Parents & Teachers Area · Classroom Guide')}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isPt ? 'Fechar janela' : 'Close dialog'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-[#0B1224] p-1.5">
          {HUB_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onChangeTab(tab.id);
                }}
                className={`inline-flex flex-1 min-w-[130px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: About & Problem Statement */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-950/20 p-4 space-y-1.5">
                <p className="font-extrabold text-rose-700 dark:text-rose-300">
                  {isPt ? '1. Qual problema resolvemos?' : '1. What problem do we solve?'}
                </p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                  {isPt
                    ? 'Telemetrias reais da NASA (explosões solares DONKI, clima de Marte MEDA e biologia OSDR) são técnicas e distantes de crianças e salas de aula. Além disso, física, biologia e tecnologia costumam ser ensinadas separadamente.'
                    : 'Real NASA telemetry (DONKI solar flares, MEDA Mars weather, and OSDR space biology) is overly technical and disconnected from kids and classrooms—and physics, biology, and engineering are usually taught in isolation.'}
                </p>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50/70 dark:border-sky-500/30 dark:bg-sky-950/20 p-4 space-y-1.5">
                <p className="font-extrabold text-sky-700 dark:text-sky-300">
                  {isPt ? '2. Como a Missão Sol-4 resolve?' : '2. How does Mission Sol-4 solve it?'}
                </p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                  {isPt
                    ? 'Transformamos dados reais da NASA (com cache 24h e fallback offline) em decisões narrativas com zero conhecimento prévio exigido, glossário embutido e linguagem adaptada por faixa etária.'
                    : 'We turn live NASA data (with 24h cache and resilient offline fallback) into hands-on story decisions with zero prior knowledge required, built-in glossary popups, and age-adaptive language.'}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20 p-4 space-y-1.5">
                <p className="font-extrabold text-emerald-700 dark:text-emerald-300">
                  {isPt ? '3. Aprendizado Sistêmico' : '3. Systems Thinking'}
                </p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                  {isPt
                    ? 'Cada escolha mostra causa e consequência reais: economizar verba no Hangar vira energia reserva na tempestade solar do Sol 2, e água limpa também ajuda a blindar contra radiação.'
                    : 'Every trade-off reveals real cause and effect: saving budget in the Hangar unlocks emergency energy during Sol 2’s solar flare, while clean water doubles as radiation shielding.'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-2 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">
                {isPt
                  ? 'Jornada em 5 Telas + Método Científico'
                  : '5-Screen Journey + Scientific Method'}
              </p>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {isPt
                  ? 'Do Prólogo na Cratera Jezero ao Hangar de Engenharia (trava real de Massa × Orçamento de $100M), passando pelos 4 Sols (Observação → Hipótese → Experimento → Conclusão) até o Passaporte Final com constelações marcianas e foto astronômica real da NASA.'
                  : 'From Jezero Crater Prologue to the Engineering Hangar ($100M Mass × Budget physics lock), across 4 Martian Sols (Observation → Hypothesis → Experiment → Conclusion) to the Final Passport with Martian constellations and real NASA space photography.'}
              </p>
              <p className="pt-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                {isPt
                  ? 'Autoria oficial: Maryangela Costa de Souza Florentin & Luna Costa Antunes · NASA Space Apps Challenge'
                  : 'Created by Maryangela Costa de Souza Florentin & Luna Costa Antunes · NASA Space Apps Challenge'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2 & 3: Interactive Lineage Diagram */}
        {(activeTab === 'explorer' || activeTab === 'technical') && (
          <TechnicalLineagePanel
            key={`${activeTab}-${lang}`}
            lang={lang}
            nasaData={nasaData}
            ageProfile={ageProfile}
            hangarConfig={hangarConfig}
            resources={resources}
            choiceHistory={choiceHistory}
            initialView={activeTab === 'explorer' ? 'explorer' : 'technical'}
          />
        )}

        {/* Tab 4: Parents & Teachers Area */}
        {activeTab === 'parents' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20 p-4 text-xs space-y-1.5">
              <p className="flex items-center gap-1.5 font-extrabold text-emerald-800 dark:text-emerald-300">
                <Users className="h-4 w-4" />
                <span>
                  {isPt
                    ? 'Como usar em Sala de Aula ou em Família'
                    : 'Classroom & Family Facilitation Guide'}
                </span>
              </p>
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                {isPt
                  ? 'No modo Equipe (2 a 4 jogadores), cada participante assume um papel da NASA (Líder de Missão, Ciência, Comunicações e Sistemas) e precisa defender sua recomendação antes do grupo clicar na carta de cada Sol.'
                  : 'In Team Mode (2–4 players), each learner takes a real NASA role (Mission Leader, Science Officer, Comms Officer, Systems Engineer) and argues their recommendation before the crew locks in each Sol card.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isPt
                  ? '3 Perguntas Disparadoras para Debate'
                  : '3 Classroom Discussion Prompts'}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {CLASSROOM_DEBATE_QUESTIONS.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5"
                  >
                    <span className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-orange-400">
                      {isPt ? `Pergunta ${item.number}` : `Prompt ${item.number}`}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.question}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>{isPt ? 'Conceito-chave:' : 'Key Concept:'}</strong> {item.concept}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isPt ? 'Perfis Adaptativos de Linguagem' : 'Adaptive Reading Profiles'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {AGE_PROFILES.map((prof) => (
                  <div
                    key={prof.id}
                    className={`rounded-xl border p-3.5 space-y-1 ${
                      ageProfile === prof.id
                        ? 'border-orange-400 bg-orange-50/70 dark:border-orange-500/60 dark:bg-orange-950/25'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224]'
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">
                      {prof.label} ({prof.shortLabel})
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {prof.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                <BookOpen className="h-4 w-4" />
                <span>
                  {isPt
                    ? 'Base Científica Oficial (Artigos Revisados por Pares)'
                    : 'Official Peer-Reviewed NASA Literature'}
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PEER_REVIEWED_REFERENCES.map((ref) => (
                  <div
                    key={ref.authors}
                    className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3 text-xs space-y-1"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{ref.authors}</p>
                    <p className="italic text-sky-700 dark:text-sky-300">{ref.title}</p>
                    <p className="text-slate-600 dark:text-slate-400">{ref.relevance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
        >
          {isPt ? 'Fechar' : 'Close'}
        </button>
      </div>
    </div>
  );
};
