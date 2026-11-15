import React from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Target,
} from 'lucide-react';
import {
  INSTRUMENTS,
  ORBITS,
  PEER_REVIEWED_REFERENCES,
  RESOURCE_META,
  ROCKETS,
} from '../data/missionData';
import {
  AgeProfile,
  ChoiceHistoryEntry,
  HangarConfig,
  NasaDataBundle,
  ResourceKey,
  Resources,
} from '../types/game';

interface TechnicalLineagePanelProps {
  nasaData: NasaDataBundle;
  ageProfile: AgeProfile;
  hangarConfig: HangarConfig;
  resources: Resources;
  choiceHistory: ChoiceHistoryEntry[];
  compact?: boolean;
}

const AGE_PROFILE_LABELS: Record<AgeProfile, string> = {
  explorers: 'Exploradores (7–10 anos · Vocabulário Lúdico)',
  strategists: 'Estrategistas (11+ anos · Trade-offs e Dados)',
  educators: 'Professores & Pais (Terminologia Técnica)',
};

export const TechnicalLineagePanel: React.FC<TechnicalLineagePanelProps> = ({
  nasaData,
  ageProfile,
  hangarConfig,
  resources,
  choiceHistory,
  compact = false,
}) => {
  const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket);
  const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit);
  const selectedInstruments = INSTRUMENTS.filter((i) =>
    hangarConfig.instruments.includes(i.id)
  );

  const statusBadge =
    nasaData.status === 'live'
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
            text: '🟡 ACERVO DETERMINÍSTICO OFFLINE',
            cls: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300',
          };

  const liveLineageRows = [
    {
      api: 'NASA CCMC DONKI (/FLR)',
      source: 'kauai.ccmc.gsfc.nasa.gov',
      loadedValue: `ID ${nasaData.donkiFlare.flrID} · Classe ${nasaData.donkiFlare.classType} (${nasaData.donkiFlare.sourceLocation})`,
      fallback: 'Evento real X8.7 (2024-05-14)',
      mechanicLink:
        'Dispara severidade da tempestade no Sol 2, ativa o bônus +10% Energia da Carta B se sobrou verba no Hangar e aciona Quack "drama".',
      isFallback: nasaData.donkiFlare.isFallback,
    },
    {
      api: 'NASA OSDR (Estudo OSD-120)',
      source: 'Open Science Data Repository',
      loadedValue: `${nasaData.osdr.studyId} · ${nasaData.osdr.ledHoursPerDay}h/dia LEDs · ${nasaData.osdr.crop}`,
      fallback: 'Estufa Veggie + Biofilmes (Zea et al.)',
      mechanicLink:
        'Controla biofilmes ("Carrapatos ETs") nos dutos no Sol 1 e o trade-off fotossíntese (16h LED) × bateria elétrica no Sol 3.',
      isFallback: false,
    },
    {
      api: 'Mars 2020 Perseverance (MEDA)',
      source: 'Dados Ambientais Cratera Jezero',
      loadedValue: `Noite ${nasaData.meda.nightTempC}°C · Poeira τ=${nasaData.meda.dustOpacityTau} · Rádio ${nasaData.meda.oneWayRadioDelayMin} min (28 min ida/volta)`,
      fallback: 'MEDA Jezero Arquivado (Rodriguez-Manfredi et al.)',
      mechanicLink:
        'Define bônus orbital (+10% Rádio no Sol 1 Carta B com Órbita Alta), perda solar por poeira no Sol 3 e congelamento térmico se Energia = 0%.',
      isFallback: false,
    },
    {
      api: 'NASA APOD (count=1)',
      source: 'api.nasa.gov/planetary/apod',
      loadedValue: `"${nasaData.apod.title}" (${nasaData.apod.date})`,
      fallback: 'Pool de 5 imagens verificadas NASA JPL/Hubble',
      mechanicLink:
        'Alimenta o Passaporte Final com fotos astronômicas reais sorteadas sob demanda e contextualiza fatos estelares no QuackChatWidget.',
      isFallback: nasaData.apod.isFallback,
    },
  ];

  const syncTime = new Date(nasaData.fetchedAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-5">
      {/* 1. Problem Clarity Banner */}
      <div className="rounded-2xl border border-orange-300/70 bg-orange-50/90 dark:border-orange-500/35 dark:bg-orange-950/25 p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              O Problema que a Missão Sol-4 Resolve
            </h3>
          </div>
          <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${statusBadge.cls}`}>
            {statusBadge.text} · {syncTime}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-orange-200 bg-white/90 dark:border-slate-800 dark:bg-[#0B1221]/90 p-3 space-y-1">
            <p className="font-bold text-rose-600 dark:text-rose-400">1. O Problema Real</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Telemetrias da NASA (radiação, clima marciano, biofilmes) são complexas, técnicas e em inglês; além disso, escolas costumam ensinar física, biologia e tecnologia isoladas.
            </p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white/90 dark:border-slate-800 dark:bg-[#0B1221]/90 p-3 space-y-1">
            <p className="font-bold text-sky-600 dark:text-sky-400">2. Nossa Solução</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Traduzimos APIs e artigos reais da NASA em <strong>engenharia sistêmica jogável</strong> com zero conhecimento prévio, glossário contextual e linguagem adaptada por faixa etária.
            </p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-white/90 dark:border-slate-800 dark:bg-[#0B1221]/90 p-3 space-y-1">
            <p className="font-bold text-emerald-600 dark:text-emerald-400">3. Impacto Educacional</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              O aluno vivencia causa e consequência reais: poupar verba no Hangar vira reserva elétrica em Marte, e água limpa também protege contra tempestades solares.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Technical Data Lineage Table */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Database className="h-4 w-4 text-sky-500" />
            <span>Linhagem Técnica dos Dados Carregados (Telemetria NASA)</span>
          </h3>
          <span className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
            Cache: quack_nasa_cache_v1 (TTL 24h · Timeout 5s)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 dark:bg-[#0B1224] dark:text-slate-300">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Fonte / API NASA</th>
                <th className="px-3 py-2.5 font-semibold">Dado Carregado Agora</th>
                <th className="px-3 py-2.5 font-semibold">Blindagem Fallback</th>
                <th className="px-3 py-2.5 font-semibold">Relação com a Mecânica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800 dark:divide-slate-800 dark:bg-[#0F172A] dark:text-slate-200">
              {liveLineageRows.map((row) => (
                <tr key={row.api} className="align-top">
                  <td className="px-3 py-2.5">
                    <p className="font-mono-tabular font-bold text-sky-700 dark:text-sky-300">
                      {row.api}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{row.source}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {row.loadedValue}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        row.isFallback
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                      }`}
                    >
                      {row.isFallback ? 'Acervo Arquivado' : 'Sincronizado'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{row.fallback}</td>
                  <td className="px-3 py-2.5 leading-relaxed">{row.mechanicLink}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Relationship Architecture: NASA Data <-> Game Mechanics */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1224] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <GitBranch className="h-4 w-4 text-violet-500" />
            <span>Visão do Relacionamento Técnico nas Mecânicas do Jogo</span>
          </h3>
          <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">
            Perfil Ativo: {AGE_PROFILE_LABELS[ageProfile]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#131C33] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400">
              <Layers className="h-3.5 w-3.5" />
              <span>1. Hangar (Física &amp; Verba)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Trava física real: <strong>350 kg (cápsula) + instrumentos ≤ Capacidade do Foguete</strong> e custo total <strong>≤ $100M</strong>.
            </p>
            <p className="font-mono-tabular text-[10px] text-sky-700 dark:text-sky-300 pt-1 border-t border-slate-100 dark:border-slate-800">
              Atual: {rocket ? rocket.name : 'Sem foguete'} · {orbit ? orbit.name : 'Sem órbita'} ·{' '}
              {selectedInstruments.length}/2 instr.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#131C33] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
              <Cpu className="h-3.5 w-3.5" />
              <span>2. Bônus Cruzados</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              • <strong>Órbita Alta + Sol 1 (B)</strong> = +10% Rádio (alivia atraso de {nasaData.meda.oneWayRadioDelayMin} min).
              <br />• <strong>Sobra de $ no Hangar + Sol 2 (B)</strong> = +10% Energia na tempestade {nasaData.donkiFlare.classType}.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#131C33] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <Activity className="h-3.5 w-3.5" />
              <span>3. Motor de Estado (4 Sols)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Base inicial <strong>55%</strong> + deltas. Se qualquer barra &lt; <strong>35%</strong>, Quack entra em <em>terror</em> e soma <strong>-15 pts</strong>; em <strong>0%</strong>, falha física (-50 pts).
            </p>
            <p className="font-mono-tabular text-[10px] text-amber-700 dark:text-amber-300 pt-1 border-t border-slate-100 dark:border-slate-800">
              {(Object.keys(RESOURCE_META) as ResourceKey[])
                .map((k) => `${RESOURCE_META[k].label.split(' ')[0]} ${resources[k]}%`)
                .join(' · ')}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#131C33] p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>4. Histórico &amp; Tutor IA</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Cada carta escolhida registra o histórico da sessão para o <strong>QuackChatWidget</strong> gerar dicas de física adaptadas ao perfil e sem spoiler.
            </p>
            <p className="font-mono-tabular text-[10px] text-emerald-700 dark:text-emerald-300 pt-1 border-t border-slate-100 dark:border-slate-800">
              Decisões registradas: {choiceHistory.length}/4 Sols
            </p>
          </div>
        </div>

        {choiceHistory.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#131C33] p-3 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rastro de Decisões desta Missão ({choiceHistory.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {choiceHistory.map((entry) => (
                <div
                  key={`${entry.sol}-${entry.cardId}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#0B1224] px-2.5 py-1.5 text-[11px]"
                >
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    Sol {entry.sol} ({entry.cardId}):
                  </span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {entry.cardTitle}
                  </span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">
                    ({entry.category}
                    {entry.enteredDanger ? ' · Alerta <35%' : ''})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Peer-Reviewed References */}
      {!compact && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
            <BookOpen className="h-4 w-4" />
            <span>Referências Científicas Revisadas por Pares (NASA)</span>
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
      )}
    </div>
  );
};
