import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Cpu,
  Database,
  GitBranch,
  Microscope,
  Sparkles,
} from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import {
  AgeProfile,
  ChoiceHistoryEntry,
  HangarConfig,
  Language,
  NasaDataBundle,
  ResourceKey,
  Resources,
} from '../types/game';
import { playClickSound } from '../utils/sound';

interface TechnicalLineagePanelProps {
  lang?: Language;
  nasaData: NasaDataBundle;
  ageProfile: AgeProfile;
  hangarConfig: HangarConfig;
  resources: Resources;
  choiceHistory: ChoiceHistoryEntry[];
  initialView?: 'explorer' | 'technical';
  compact?: boolean;
}

type LineageNodeId = 'osdr' | 'meda' | 'donki' | 'apod' | 'hangar' | 'sols' | 'systems';

const NODE_CONNECTIONS: Record<LineageNodeId, LineageNodeId[]> = {
  osdr: ['osdr', 'hangar', 'sols', 'systems'],
  meda: ['meda', 'hangar', 'sols', 'systems'],
  donki: ['donki', 'hangar', 'sols', 'systems'],
  apod: ['apod', 'systems'],
  hangar: ['osdr', 'meda', 'donki', 'hangar', 'sols', 'systems'],
  sols: ['osdr', 'meda', 'donki', 'hangar', 'sols', 'systems'],
  systems: ['osdr', 'meda', 'donki', 'apod', 'hangar', 'sols', 'systems'],
};

const EDGE_LIST: { from: LineageNodeId; to: LineageNodeId; d: string }[] = [
  { from: 'osdr', to: 'hangar', d: 'M 178 46 C 230 46, 230 112, 272 112' },
  { from: 'meda', to: 'hangar', d: 'M 178 112 C 225 112, 230 124, 272 124' },
  { from: 'donki', to: 'hangar', d: 'M 178 178 C 230 178, 230 136, 272 136' },
  { from: 'hangar', to: 'sols', d: 'M 428 124 C 462 124, 466 112, 502 112' },
  { from: 'osdr', to: 'sols', d: 'M 178 36 C 320 14, 410 38, 502 92' },
  { from: 'meda', to: 'sols', d: 'M 178 102 C 330 68, 415 74, 502 104' },
  { from: 'donki', to: 'sols', d: 'M 178 188 C 330 218, 420 184, 502 132' },
  { from: 'sols', to: 'systems', d: 'M 658 112 C 692 112, 695 108, 728 108' },
  { from: 'apod', to: 'systems', d: 'M 178 242 C 420 268, 630 232, 728 144' },
];

export const TechnicalLineagePanel: React.FC<TechnicalLineagePanelProps> = ({
  lang = 'en',
  nasaData,
  ageProfile,
  hangarConfig,
  resources,
  choiceHistory,
  initialView = 'technical',
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'explorer' | 'technical'>(initialView);
  const [selectedNode, setSelectedNode] = useState<LineageNodeId>('osdr');

  const isPt = lang === 'pt';
  const {
    INSTRUMENTS,
    ORBITS,
    PEER_REVIEWED_REFERENCES,
    RESOURCE_META,
    ROCKETS,
  } = getLocalizedMissionData(lang);

  const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket);
  const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit);
  const selectedInstruments = INSTRUMENTS.filter((i) =>
    hangarConfig.instruments.includes(i.id)
  );

  const statusBadge = isPt
    ? nasaData.status === 'live'
      ? {
          text: '🟢 TELEMETRIA AO VIVO (NASA API)',
          cls: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300',
        }
      : nasaData.status === 'cache'
        ? {
            text: '🔵 CACHE PERSISTENTE (24H)',
            cls: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-300',
          }
        : {
            text: '🟡 ACERVO REAL ARQUIVADO',
            cls: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300',
          }
    : nasaData.status === 'live'
      ? {
          text: '🟢 LIVE TELEMETRY (NASA API)',
          cls: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300',
        }
      : nasaData.status === 'cache'
        ? {
            text: '🔵 PERSISTENT CACHE (24H)',
            cls: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-300',
          }
        : {
            text: '🟡 ARCHIVED REAL DATA',
            cls: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300',
          };

  const syncTime = new Date(nasaData.fetchedAt).toLocaleTimeString(isPt ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const activeSet = NODE_CONNECTIONS[selectedNode];

  const nodeInspector: Record<
    LineageNodeId,
    { title: string; explorer: string; technical: string; liveState: string }
  > = isPt
    ? {
        osdr: {
          title: `NASA OSDR (${nasaData.osdr.studyId}) — Estufa Veggie & Biofilmes`,
          explorer:
            'Mostra como micróbios grudentos ("Carrapatos ETs") crescem em canos de água no espaço e como a alface Outredgeous usa 16 horas de luzes LED coloridas para gerar ar fresco!',
          technical: `Estudo real ${nasaData.osdr.studyId} (Massa et al., 2017; Zea et al., 2018/2020): alimenta o módulo Estufa Veggie no Hangar, o evento de biofilmes no Sol 1 e o trade-off de ${nasaData.osdr.ledHoursPerDay}h LED × baterias no Sol 3.`,
          liveState: `Parâmetro ativo: ${nasaData.osdr.crop} · ${nasaData.osdr.ledHoursPerDay}h LED/dia`,
        },
        meda: {
          title: `Mars 2020 Perseverance (MEDA) — Clima de Marte`,
          explorer:
            'A estação do tempo do robô Perseverance na Cratera Jezero! Ela conta que faz -85°C à noite, tem poeira vermelha cobrindo os painéis solares e o rádio demora 14 minutinhos só para ir até a Terra.',
          technical: `Dados MEDA (Rodriguez-Manfredi et al., 2021): noite a ${nasaData.meda.nightTempC}°C, opacidade óptica de poeira τ=${nasaData.meda.dustOpacityTau} e latência one-way de ${nasaData.meda.oneWayRadioDelayMin} min. Controla bônus da Órbita Alta no Sol 1, perda solar no Sol 3 e congelamento em 0% Energia.`,
          liveState: `MEDA ativo: ${nasaData.meda.nightTempC}°C · τ=${nasaData.meda.dustOpacityTau} · ${nasaData.meda.oneWayRadioDelayMin} min`,
        },
        donki: {
          title: `NASA CCMC DONKI (/FLR) — Explosões Solares`,
          explorer:
            'O radar espacial do Sol! Quando o Sol dá um espirro gigante (explosão solar), essa informação avisa o Comandante Quack para proteger a base no Sol 2.',
          technical: `Endpoint /DONKI/WS/get/FLR: injeta evento solar Classe ${nasaData.donkiFlare.classType} (ID ${nasaData.donkiFlare.flrID}). Define a severidade do Sol 2, ativa o bônus +10% Energia na Carta B se sobrou verba no Hangar e dispara expressão "drama".`,
          liveState: `Fulguração carregada: ${nasaData.donkiFlare.classType}`,
        },
        apod: {
          title: `NASA APOD — Lembrança Espacial`,
          explorer:
            'Traz fotos reais de estrelas, nebulosas e Marte tiradas por telescópios e robôs da NASA para você colecionar no Passaporte Final!',
          technical: `Endpoint api.nasa.gov/planetary/apod?count=1 (filtro media_type === "image") com pool determinístico de 5 imagens verificadas JPL/Hubble. Hidrata a Tela 5 e contextualiza fatos astronômicos no QuackChatWidget.`,
          liveState: `Foto atual: "${nasaData.apod.title}" (${nasaData.apod.date})`,
        },
        hangar: {
          title: 'Hangar de Engenharia — Foguete, Órbita & Instrumentos',
          explorer:
            'Suas escolhas de mochila espacial! Levar peso demais trava o foguete leve, enquanto o foguete pesado gasta -8% Energia e sobra menos dinheiro para emergências.',
          technical:
            'Trava física real: 350 kg (cápsula) + Σ instrumentos ≤ capacidade do foguete (1.200 kg Leve / 2.200 kg Pesado) e custo ≤ $100M, mais deltas iniciais de foguete/órbita/instrumentos.',
          liveState: `Nave: ${rocket ? rocket.name : 'Não definido'} · ${orbit ? orbit.name : 'Sem órbita'} · ${selectedInstruments.length}/2`,
        },
        sols: {
          title: 'Central de Comando — Decisões nos Sols 1 a 4',
          explorer:
            'Cada dia em Marte (Sol) traz um desafio ligado aos dados da NASA! Cada escolha muda as 4 barrinhas da nave e fica salva no histórico para o Quack comentar.',
          technical:
            'Motor de estado determinístico por turno (Sols 1–4): aplica deltas de carta + bônus cruzados do Hangar + custo de ajuda no Sol 3 (-8% Suporte), grava ChoiceHistoryEntry e alimenta o tutor QuackChatWidget.',
          liveState: `Progresso: ${choiceHistory.length}/4 Sols concluídos`,
        },
        systems: {
          title: 'Sistemas da Base Ares & Comandante Quack',
          explorer:
            'São os 4 corações da base (Energia, Suporte de Vida, Escudo e Rádio)! Se alguma barrinha cair de 35%, o Quack fica assustado; se zerar, analisamos o porquê!',
          technical:
            'Estado final [0..100%], pontuação científica, disparo automático das 4 expressões SVG do Quack (terror <35%/0%, drama Sol 2, dizzy Sol 3, celebrate selos/vitória) e Passaporte.',
          liveState: `Barras: E ${resources.energy}% · Sup ${resources.lifeSupport}% · Esc ${resources.shield}% · Rád ${resources.comms}%`,
        },
      }
    : {
        osdr: {
          title: `NASA OSDR (${nasaData.osdr.studyId}) — Veggie Greenhouse & Biofilms`,
          explorer:
            'Shows how sticky microbes (“Alien Ticks”) grow inside space water pipes and how Outredgeous lettuce uses 16 hours of colorful LEDs to make fresh oxygen!',
          technical: `Real study ${nasaData.osdr.studyId} (Massa et al., 2017; Zea et al., 2018/2020): powers the Veggie Greenhouse instrument in the Hangar, Sol 1 pipe biofilms, and Sol 3 ${nasaData.osdr.ledHoursPerDay}h LED × battery trade-off.`,
          liveState: `Active param: ${nasaData.osdr.crop} · ${nasaData.osdr.ledHoursPerDay}h LED/day`,
        },
        meda: {
          title: `Mars 2020 Perseverance (MEDA) — Mars Weather`,
          explorer:
            'The weather station on the Perseverance rover in Jezero Crater! It measures -85°C freezing nights, red dust covering solar arrays, and a 14-minute radio delay each way to Earth.',
          technical: `MEDA telemetry (Rodriguez-Manfredi et al., 2021): ${nasaData.meda.nightTempC}°C nights, dust opacity τ=${nasaData.meda.dustOpacityTau}, and ${nasaData.meda.oneWayRadioDelayMin}-min one-way radio latency. Drives High Orbit Sol 1 bonus, Sol 3 solar loss, and 0% Energy freeze.`,
          liveState: `Active MEDA: ${nasaData.meda.nightTempC}°C · τ=${nasaData.meda.dustOpacityTau} · ${nasaData.meda.oneWayRadioDelayMin} min`,
        },
        donki: {
          title: `NASA CCMC DONKI (/FLR) — Solar Flares`,
          explorer:
            'Our space radar for the Sun! Whenever the Sun blasts out a giant solar storm, DONKI warns Commander Quack to shield Ares Base during Sol 2.',
          technical: `/DONKI/WS/get/FLR endpoint: injects solar flare Class ${nasaData.donkiFlare.classType} (ID ${nasaData.donkiFlare.flrID}). Sets Sol 2 storm hazard, activates +10% Energy Card B bonus if budget was saved in Hangar, and triggers Quack's "drama" face.`,
          liveState: `Loaded flare: ${nasaData.donkiFlare.classType}`,
        },
        apod: {
          title: `NASA APOD — Space Memory`,
          explorer:
            'Pulls real photos of stars, nebulae, and Mars captured by NASA telescopes and rovers for your Final Passport!',
          technical: `api.nasa.gov/planetary/apod?count=1 (filtered to media_type === "image") backed by 5 verified NASA/JPL fallback images. Powers Screen 5 and astronomy trivia in QuackChatWidget.`,
          liveState: `Current photo: "${nasaData.apod.title}" (${nasaData.apod.date})`,
        },
        hangar: {
          title: 'Engineering Hangar — Rocket, Orbit & Instruments',
          explorer:
            'Your spacecraft packing challenge! Overloading mass locks the Light Rocket, while the Heavy Rocket burns -8% Energy at liftoff and leaves less cash reserve.',
          technical:
            'Real physics lock: 350 kg capsule + Σ instruments ≤ rocket max mass (1,200 kg Light / 2,200 kg Heavy) and cost ≤ $100M, applying initial Rocket, Orbit, and Instrument deltas.',
          liveState: `Ship: ${rocket ? rocket.name : 'Pending'} · ${orbit ? orbit.name : 'No orbit'} · ${selectedInstruments.length}/2`,
        },
        sols: {
          title: 'Command Center — Sols 1–4 Decisions',
          explorer:
            'Every Martian Sol brings a real NASA-driven dilemma! Each card shifts your 4 ship gauges and saves to your mission log for Quack to analyze.',
          technical:
            'Deterministic turn engine (Sols 1–4): applies card effects + cross-system Hangar bonuses + optional Sol 3 Help cost (-8% Life Support), recording ChoiceHistoryEntry for QuackChatWidget.',
          liveState: `Progress: ${choiceHistory.length}/4 Sols completed`,
        },
        systems: {
          title: 'Ares Base Systems & Commander Quack',
          explorer:
            'The 4 vital hearts of your base (Energy, Life Support, Shield, Comms)! Drop below 35% and Quack panics; hit 0% and we diagnose the physics!',
          technical:
            'Final telemetry state [0..100%], scientific score, automatic SVG expression triggers (terror <35%/0%, drama Sol 2, dizzy Sol 3, celebrate badges/victory), and Passport generation.',
          liveState: `Gauges: E ${resources.energy}% · LS ${resources.lifeSupport}% · Sh ${resources.shield}% · Cm ${resources.comms}%`,
        },
      };

  const liveLineageRows = isPt
    ? [
        {
          api: 'NASA CCMC DONKI (/FLR)',
          source: 'kauai.ccmc.gsfc.nasa.gov',
          loadedValue: `ID ${nasaData.donkiFlare.flrID} · Classe ${nasaData.donkiFlare.classType}`,
          fallback: 'Evento real X8.7 (2024-05-14)',
          mechanicLink: 'Severidade do Sol 2 + Bônus de verba poupada (Carta B) + Quack "drama".',
        },
        {
          api: 'NASA OSDR (OSD-120)',
          source: 'Open Science Data Repository',
          loadedValue: `${nasaData.osdr.studyId} · ${nasaData.osdr.ledHoursPerDay}h LED · ${nasaData.osdr.crop}`,
          fallback: 'Veggie + Biofilmes (Zea et al.)',
          mechanicLink: 'Biofilmes nos dutos (Sol 1) e fotossíntese 16h LED × Energia (Sol 3).',
        },
        {
          api: 'Mars 2020 MEDA',
          source: 'Rover Perseverance · Cratera Jezero',
          loadedValue: `${nasaData.meda.nightTempC}°C · Poeira τ=${nasaData.meda.dustOpacityTau} · ${nasaData.meda.oneWayRadioDelayMin} min rádio`,
          fallback: 'Rodriguez-Manfredi et al., 2021',
          mechanicLink: 'Atraso 28 min (Sol 1), Bônus Órbita Alta, perda solar (Sol 3) e falha 0% Energia.',
        },
        {
          api: 'NASA APOD (count=1)',
          source: 'api.nasa.gov/planetary/apod',
          loadedValue: `"${nasaData.apod.title}" (${nasaData.apod.date})`,
          fallback: '5 imagens verificadas NASA JPL/Hubble',
          mechanicLink: 'Passaporte Final (Tela 5) e curiosidades espaciais no QuackChatWidget.',
        },
      ]
    : [
        {
          api: 'NASA CCMC DONKI (/FLR)',
          source: 'kauai.ccmc.gsfc.nasa.gov',
          loadedValue: `ID ${nasaData.donkiFlare.flrID} · Class ${nasaData.donkiFlare.classType}`,
          fallback: 'Real X8.7 Flare (2024-05-14)',
          mechanicLink: 'Sol 2 storm severity + Saved Hangar reserve bonus (Card B) + Quack "drama".',
        },
        {
          api: 'NASA OSDR (OSD-120)',
          source: 'Open Science Data Repository',
          loadedValue: `${nasaData.osdr.studyId} · ${nasaData.osdr.ledHoursPerDay}h LED · ${nasaData.osdr.crop}`,
          fallback: 'Veggie + Biofilms (Zea et al.)',
          mechanicLink: 'Pipe biofilms (Sol 1) and 16h LED photosynthesis vs. Energy (Sol 3).',
        },
        {
          api: 'Mars 2020 MEDA',
          source: 'Perseverance Rover · Jezero Crater',
          loadedValue: `${nasaData.meda.nightTempC}°C · Dust τ=${nasaData.meda.dustOpacityTau} · ${nasaData.meda.oneWayRadioDelayMin}m delay`,
          fallback: 'Rodriguez-Manfredi et al., 2021',
          mechanicLink: '28-min RTT (Sol 1), High Orbit boost, solar loss (Sol 3), and 0% Energy freeze.',
        },
        {
          api: 'NASA APOD (count=1)',
          source: 'api.nasa.gov/planetary/apod',
          loadedValue: `"${nasaData.apod.title}" (${nasaData.apod.date})`,
          fallback: '5 verified NASA JPL/Hubble images',
          mechanicLink: 'Final Passport (Screen 5) and astronomy facts inside QuackChatWidget.',
        },
      ];

  const isEdgeActive = (from: LineageNodeId, to: LineageNodeId) =>
    activeSet.includes(from) && activeSet.includes(to);

  const nodeBoxClasses = (id: LineageNodeId) => {
    const isSelected = selectedNode === id;
    const isConnected = activeSet.includes(id);
    if (isSelected) return { stroke: '#F97316', strokeWidth: 2.8, opacity: 1 };
    if (isConnected) return { stroke: '#38BDF8', strokeWidth: 2, opacity: 1 };
    return { stroke: '#475569', strokeWidth: 1.2, opacity: 0.45 };
  };

  return (
    <div className="space-y-5">
      {/* Header + Explorer / Technical Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-orange-500" />
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {isPt
              ? 'Linhagem de Dados Ponta a Ponta (NASA ↔ Jogo)'
              : 'End-to-End Data Lineage (NASA ↔ Gameplay)'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${statusBadge.cls}`}>
            {statusBadge.text} · {syncTime}
          </span>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-[#0B1224] p-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setViewMode('explorer');
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'explorer'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{isPt ? 'Visão Explorador' : 'Explorer View'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setViewMode('technical');
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'technical'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>{isPt ? 'Visão Técnica' : 'Technical View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive End-to-End SVG Data Lineage Diagram */}
      <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
          <span className="font-semibold text-sky-300">
            {isPt
              ? 'Diagrama Interativo de Linhagem (Toque em qualquer bloco para rastrear o fluxo)'
              : 'Interactive Lineage Diagram (Tap any node to trace data flow)'}
          </span>
          <span className="font-mono-tabular text-slate-400">
            {isPt ? 'Perfil:' : 'Profile:'}{' '}
            {ageProfile === 'explorers'
              ? isPt
                ? 'Exploradores'
                : 'Explorers'
              : ageProfile === 'strategists'
                ? isPt
                  ? 'Estrategistas'
                  : 'Strategists'
                : isPt
                  ? 'Educadores'
                  : 'Educators'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 900 272"
            className="w-full min-w-[660px] h-auto select-none"
            role="img"
            aria-label={
              isPt
                ? 'Diagrama visual interativo da linhagem de dados NASA até as mecânicas da Missão Sol-4'
                : 'Interactive visual diagram of NASA data lineage into Mission Sol-4 mechanics'
            }
          >
            <defs>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
              </marker>
              <marker
                id="arrow-dim"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
              </marker>
            </defs>

            <text x="95" y="14" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
              {isPt ? '1. FONTES REAIS NASA' : '1. REAL NASA SOURCES'}
            </text>
            <text x="350" y="14" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
              {isPt ? '2. ESCOLHAS HANGAR' : '2. HANGAR CHOICES'}
            </text>
            <text x="580" y="14" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
              {isPt ? '3. DECISÕES SOLS 1–4' : '3. SOLS 1–4 DECISIONS'}
            </text>
            <text x="808" y="14" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
              {isPt ? '4. SISTEMAS & QUACK' : '4. SYSTEMS & QUACK'}
            </text>

            {EDGE_LIST.map((edge, idx) => {
              const active = isEdgeActive(edge.from, edge.to);
              return (
                <path
                  key={`${edge.from}-${edge.to}-${idx}`}
                  d={edge.d}
                  fill="none"
                  stroke={active ? '#38BDF8' : '#334155'}
                  strokeWidth={active ? 2.4 : 1.3}
                  strokeDasharray={active ? 'none' : '4 4'}
                  opacity={active ? 0.95 : 0.4}
                  markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow-dim)'}
                />
              );
            })}

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('osdr');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('osdr').opacity}
            >
              <rect
                x="14"
                y="24"
                width="164"
                height="46"
                rx="10"
                fill="#0F1D36"
                stroke={nodeBoxClasses('osdr').stroke}
                strokeWidth={nodeBoxClasses('osdr').strokeWidth}
              />
              <text x="24" y="43" fill="#34D399" fontSize="11" fontWeight="800">
                NASA OSDR ({nasaData.osdr.studyId})
              </text>
              <text x="24" y="59" fill="#CBD5E1" fontSize="9.5">
                {viewMode === 'explorer'
                  ? isPt
                    ? 'Alface 16h LED + Biofilmes'
                    : 'Lettuce 16h LED + Biofilms'
                  : '16h/day LED · Zea et al. ISS'}
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('meda');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('meda').opacity}
            >
              <rect
                x="14"
                y="84"
                width="164"
                height="48"
                rx="10"
                fill="#0F1D36"
                stroke={nodeBoxClasses('meda').stroke}
                strokeWidth={nodeBoxClasses('meda').strokeWidth}
              />
              <text x="24" y="103" fill="#A78BFA" fontSize="11" fontWeight="800">
                Mars 2020 MEDA
              </text>
              <text x="24" y="119" fill="#CBD5E1" fontSize="9.5">
                {nasaData.meda.nightTempC}°C · τ={nasaData.meda.dustOpacityTau} · {nasaData.meda.oneWayRadioDelayMin}m {isPt ? 'rádio' : 'radio'}
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('donki');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('donki').opacity}
            >
              <rect
                x="14"
                y="146"
                width="164"
                height="48"
                rx="10"
                fill="#0F1D36"
                stroke={nodeBoxClasses('donki').stroke}
                strokeWidth={nodeBoxClasses('donki').strokeWidth}
              />
              <text x="24" y="165" fill="#FBBF24" fontSize="11" fontWeight="800">
                NASA DONKI (/FLR)
              </text>
              <text x="24" y="181" fill="#CBD5E1" fontSize="9.5">
                {viewMode === 'explorer'
                  ? isPt
                    ? `Explosão Solar ${nasaData.donkiFlare.classType}`
                    : `Solar Flare ${nasaData.donkiFlare.classType}`
                  : `${nasaData.donkiFlare.classType} · ${nasaData.donkiFlare.sourceLocation.slice(0, 18)}`}
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('apod');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('apod').opacity}
            >
              <rect
                x="14"
                y="210"
                width="164"
                height="46"
                rx="10"
                fill="#0F1D36"
                stroke={nodeBoxClasses('apod').stroke}
                strokeWidth={nodeBoxClasses('apod').strokeWidth}
              />
              <text x="24" y="229" fill="#38BDF8" fontSize="11" fontWeight="800">
                NASA APOD (count=1)
              </text>
              <text x="24" y="245" fill="#CBD5E1" fontSize="9.5">
                {nasaData.apod.date} · {isPt ? 'Foto Espacial' : 'Space Photo'}
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('hangar');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('hangar').opacity}
            >
              <rect
                x="272"
                y="84"
                width="156"
                height="82"
                rx="12"
                fill="#172542"
                stroke={nodeBoxClasses('hangar').stroke}
                strokeWidth={nodeBoxClasses('hangar').strokeWidth}
              />
              <text x="350" y="106" textAnchor="middle" fill="#FB923C" fontSize="11.5" fontWeight="800">
                {isPt ? 'Hangar Pré-Voo' : 'Pre-Flight Hangar'}
              </text>
              <text x="350" y="124" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600">
                {rocket ? rocket.name : isPt ? 'Foguete pendente' : 'Rocket pending'}
              </text>
              <text x="350" y="139" textAnchor="middle" fill="#94A3B8" fontSize="9.5">
                {orbit ? orbit.name : isPt ? 'Órbita pendente' : 'Orbit pending'}
              </text>
              <text x="350" y="155" textAnchor="middle" fill="#38BDF8" fontSize="9.5">
                {selectedInstruments.length}/2 {isPt ? 'instrumentos' : 'instruments'} · $100M
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('sols');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('sols').opacity}
            >
              <rect
                x="502"
                y="74"
                width="156"
                height="98"
                rx="12"
                fill="#172542"
                stroke={nodeBoxClasses('sols').stroke}
                strokeWidth={nodeBoxClasses('sols').strokeWidth}
              />
              <text x="580" y="96" textAnchor="middle" fill="#FBBF24" fontSize="11.5" fontWeight="800">
                {isPt ? 'Sols 1 a 4 (Trade-offs)' : 'Sols 1–4 (Trade-offs)'}
              </text>
              <text x="580" y="114" textAnchor="middle" fill="#E2E8F0" fontSize="9.5">
                {isPt ? 'Sol 1: Biofilmes (OSDR)' : 'Sol 1: Biofilms (OSDR)'}
              </text>
              <text x="580" y="128" textAnchor="middle" fill="#E2E8F0" fontSize="9.5">
                Sol 2: Flare {nasaData.donkiFlare.classType} (DONKI)
              </text>
              <text x="580" y="142" textAnchor="middle" fill="#E2E8F0" fontSize="9.5">
                Sol 3: 16h LED × τ={nasaData.meda.dustOpacityTau}
              </text>
              <text x="580" y="158" textAnchor="middle" fill="#34D399" fontSize="9.5" fontWeight="700">
                {choiceHistory.length}/4 {isPt ? 'decisões gravadas' : 'decisions logged'}
              </text>
            </g>

            <g
              onClick={() => {
                playClickSound();
                setSelectedNode('systems');
              }}
              className="cursor-pointer"
              opacity={nodeBoxClasses('systems').opacity}
            >
              <rect
                x="728"
                y="68"
                width="158"
                height="112"
                rx="12"
                fill="#172542"
                stroke={nodeBoxClasses('systems').stroke}
                strokeWidth={nodeBoxClasses('systems').strokeWidth}
              />
              <text x="807" y="90" textAnchor="middle" fill="#34D399" fontSize="11.5" fontWeight="800">
                {isPt ? 'Base Ares & Quack' : 'Ares Base & Quack'}
              </text>
              <text x="807" y="109" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                ⚡ {RESOURCE_META.energy.shortLabel}: {resources.energy}%
              </text>
              <text x="807" y="124" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                🌱 {RESOURCE_META.lifeSupport.shortLabel}: {resources.lifeSupport}%
              </text>
              <text x="807" y="139" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                🛡️ {RESOURCE_META.shield.shortLabel}: {resources.shield}%
              </text>
              <text x="807" y="154" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                📡 {RESOURCE_META.comms.shortLabel}: {resources.comms}%
              </text>
              <text x="807" y="170" textAnchor="middle" fill="#FDBA74" fontSize="9">
                {isPt ? 'QuackChat + Passaporte' : 'QuackChat + Passport'}
              </text>
            </g>
          </svg>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3.5 text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-extrabold text-orange-400">
              {nodeInspector[selectedNode].title}
            </span>
            <span className="font-mono-tabular text-[11px] text-sky-300">
              {nodeInspector[selectedNode].liveState}
            </span>
          </div>
          <p className="leading-relaxed text-slate-200">
            {viewMode === 'explorer'
              ? nodeInspector[selectedNode].explorer
              : nodeInspector[selectedNode].technical}
          </p>
        </div>
      </div>

      {viewMode === 'explorer' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
            <p className="font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
              <Microscope className="h-3.5 w-3.5" />{' '}
              {isPt ? '☀️ Explosões do Sol (DONKI)' : '☀️ Solar Flares (DONKI)'}
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {isPt
                ? `A tempestade Classe ${nasaData.donkiFlare.classType} aconteceu de verdade! No jogo, ela testa o Escudo da Base Ares no Sol 2 e premia quem economizou verba no Hangar.`
                : `The Class ${nasaData.donkiFlare.classType} solar storm really happened! In the game, it tests Ares Base’s shield in Sol 2 and rewards players who saved Hangar cash.`}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
            <p className="font-bold text-emerald-700 dark:text-emerald-300">
              🥬 {isPt ? 'Estufa Veggie' : 'Veggie Greenhouse'} ({nasaData.osdr.studyId})
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {isPt
                ? `Astronautas cultivam alface Outredgeous com ${nasaData.osdr.ledHoursPerDay}h/dia de luz LED! No Sol 3, você equilibra manter as plantinhas respirando e não gastar toda a bateria.`
                : `Astronauts grow Outredgeous lettuce under ${nasaData.osdr.ledHoursPerDay}h/day of LED light! In Sol 3, you balance keeping plants alive without draining the batteries.`}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
            <p className="font-bold text-sky-700 dark:text-sky-300">
              🦠 {isPt ? '‘Carrapatos ETs’ nos Dutos (Biofilmes)' : '‘Alien Ticks’ in Pipes (Biofilms)'}
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {isPt
                ? 'Na vida real, bactérias formam camadas grudentas nos canos de água no espaço! É esse mistério da Estação Espacial que aparece logo no Sol 1.'
                : 'In real spaceflight, bacteria form sticky layers inside water recycling pipes! That real ISS science mystery kicks off Sol 1.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-1.5">
            <p className="font-bold text-violet-700 dark:text-violet-300">
              📡 {isPt ? 'Clima de Marte (MEDA)' : 'Mars Weather (MEDA)'}
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {isPt
                ? `Na Cratera Jezero faz ${nasaData.meda.nightTempC}°C à noite, a poeira cobre os painéis (τ=${nasaData.meda.dustOpacityTau}) e o rádio leva ${nasaData.meda.oneWayRadioDelayMin} min só para ir até a Terra!`
                : `Jezero Crater plunges to ${nasaData.meda.nightTempC}°C at night, dust dims solar arrays (τ=${nasaData.meda.dustOpacityTau}), and radio takes ${nasaData.meda.oneWayRadioDelayMin} min just to reach Earth!`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Database className="h-3.5 w-3.5 text-sky-500" />
              <span>
                {isPt
                  ? 'Tabela de Linhagem Técnica (Cache 24h: quack_nasa_cache_v1)'
                  : 'Technical Data Lineage Table (24h Cache: quack_nasa_cache_v1)'}
              </span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 dark:bg-[#0B1224] dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold">{isPt ? 'Fonte / API NASA' : 'NASA Source / API'}</th>
                    <th className="px-3 py-2 font-semibold">{isPt ? 'Dado Carregado' : 'Loaded Value'}</th>
                    <th className="px-3 py-2 font-semibold">Fallback</th>
                    <th className="px-3 py-2 font-semibold">{isPt ? 'Impacto nas Mecânicas' : 'Gameplay Mechanics Link'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-800 dark:divide-slate-800 dark:bg-[#0F172A] dark:text-slate-200">
                  {liveLineageRows.map((row) => (
                    <tr key={row.api} className="align-top">
                      <td className="px-3 py-2">
                        <p className="font-mono-tabular font-bold text-sky-700 dark:text-sky-300">
                          {row.api}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{row.source}</p>
                      </td>
                      <td className="px-3 py-2 font-semibold">{row.loadedValue}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                        {row.fallback}
                      </td>
                      <td className="px-3 py-2">{row.mechanicLink}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Session Trace */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-3.5 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                <Activity className="h-3.5 w-3.5" />{' '}
                {isPt ? 'Rastro da Sessão Atual (Hangar + Sols)' : 'Live Session Trace (Hangar + Sols)'}
              </span>
              <span className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                {(Object.keys(RESOURCE_META) as ResourceKey[])
                  .map((k) => `${RESOURCE_META[k].shortLabel}: ${resources[k]}%`)
                  .join(' · ')}
              </span>
            </div>

            {choiceHistory.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">
                {isPt
                  ? 'Nenhuma carta jogada nos Sols ainda — conforme você decidir nos Sols 1–4, cada escolha aparece conectada aqui!'
                  : 'No Sol cards played yet — as you make choices in Sols 1–4, each decision links live right here!'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {choiceHistory.map((entry) => (
                  <div
                    key={`${entry.sol}-${entry.cardId}`}
                    className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#131C33] px-2.5 py-1.5 text-[11px]"
                  >
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      Sol {entry.sol} ({entry.cardId}):
                    </span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {entry.cardTitle}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">
                      ({entry.category}
                      {entry.enteredDanger ? (isPt ? ' · Alerta <35%' : ' · Danger <35%') : ''})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!compact && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                <BookOpen className="h-4 w-4" />
                <span>
                  {isPt
                    ? 'Referências Científicas Revisadas por Pares (NASA)'
                    : 'Peer-Reviewed NASA Scientific References'}
                </span>
              </h4>
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
          )}
        </div>
      )}
    </div>
  );
};
