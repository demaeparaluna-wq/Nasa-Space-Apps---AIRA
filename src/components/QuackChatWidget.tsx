import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { INSTRUMENTS, ORBITS, RESOURCE_META, ROCKETS } from '../data/missionData';
import {
  AgeProfile,
  ChoiceHistoryEntry,
  GameScreen,
  HangarConfig,
  NasaDataBundle,
  QuackExpression,
  ResourceKey,
  Resources,
} from '../types/game';
import { playClickSound } from '../utils/sound';
import { QuackMascot } from './QuackMascot';

interface ChatMessage {
  id: string;
  sender: 'quack' | 'user';
  text: string;
}

interface QuackChatWidgetProps {
  screen: GameScreen;
  currentSol: 1 | 2 | 3 | 4;
  ageProfile: AgeProfile;
  resources: Resources;
  expression: QuackExpression;
  nasaData: NasaDataBundle;
  hangarConfig: HangarConfig;
  choiceHistory: ChoiceHistoryEntry[];
}

type TopicId = 'status' | 'physics' | 'nasa' | 'history' | 'custom';

function getLowestResource(resources: Resources): { key: ResourceKey; value: number } {
  const entries = (Object.keys(resources) as ResourceKey[]).map((key) => ({
    key,
    value: resources[key],
  }));
  entries.sort((a, b) => a.value - b.value);
  return entries[0];
}

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildPhysicsPunByProfile(
  ageProfile: AgeProfile,
  domain: 'gravity' | 'thermo' | 'light' | 'magnetism' | 'photons' | 'momentum',
  nasaData: NasaDataBundle
): string {
  const puns: Record<AgeProfile, Record<typeof domain, string>> = {
    explorers: {
      gravity:
        'Pato que pula em Marte vira super-pato: com só 38% da gravidade da Terra, um salto meu de 1 metro lá vira quase 3 metros!',
      thermo: `Brr! A ${nasaData.meda.nightTempC}°C (MEDA), até meu quack congela no ar — na física do calor, energia elétrica precisa virar calorzinho nos canos!`,
      light: `Alô-ô-ô? A luz corre a 300 mil km/s, mas Marte fica tão longe que leva ${nasaData.meda.oneWayRadioDelayMin} min pra ir e ${nasaData.meda.oneWayRadioDelayMin} min pra voltar — não dá pra pedir socorro de última hora!`,
      magnetism: `Sem escudo magnético gigante como o da Terra, a explosão solar ${nasaData.donkiFlare.classType} (DONKI) tenta dar um choque nas penas — ainda bem que água também barra radiação!`,
      photons: `As alfaces da Estufa Veggie (${nasaData.osdr.studyId}) fazem lanche de luz! Elas precisam de ${nasaData.osdr.ledHoursPerDay}h de LEDs pra soltar oxigênio pra gente respirar.`,
      momentum:
        'Foguete é igual pato nadando: joga combustível com força para trás para a 3ª Lei de Newton empurrar a nave para frente! Quanto mais peso, mais combustível!',
    },
    strategists: {
      gravity:
        'Com gravidade marciana de 3,71 m/s² (38% da Terra), a massa continua exigindo inércia e empuxo preciso — leve peso morto no foguete e o Δv cobra a conta!',
      thermo: `Termodinâmica cruel: com noites a ${nasaData.meda.nightTempC}°C registradas pelo sensor MEDA, cada Watt cortado em Energia acelera a perda de calor na Cratera Jezero.`,
      light: `Mesmo no limite cósmico da velocidade da luz (c ≈ 3×10⁸ m/s), a distância orbital impõe ${nasaData.meda.oneWayRadioDelayMin} min de latência só de ida — autonomia local é sobrevivência.`,
      magnetism: `Sem dipolo magnético global em Marte, prótons de uma fulguração ${nasaData.donkiFlare.classType} (${nasaData.donkiFlare.flrID}) atingem o solo; o hidrogênio da água é excelente blindagem passiva.`,
      photons: `Pela relação fótons/Watt do estudo ${nasaData.osdr.studyId}, a alface Outredgeous exige ${nasaData.osdr.ledHoursPerDay}h/dia de LEDs — enquanto a poeira τ=${nasaData.meda.dustOpacityTau} derruba os painéis solares.`,
      momentum:
        'A Equação de Tsiolkovsky não perdoa trocadilho barato: cada kg extra no Hangar reduz a margem estrutural e drena o orçamento da missão!',
    },
    educators: {
      gravity:
        'Sob g ≈ 3,71 m/s² (38% de g terrestre), reduz-se o peso aparente na superfície marciana, mas mantém-se integralmente a massa inercial nas manobras.',
      thermo: `Balanço térmico crítico (MEDA, Rodriguez-Manfredi et al.): a ${nasaData.meda.nightTempC}°C noturnos, qualquer colapso elétrico interrompe aquecedores resistivos e congela o circuito hídrico.`,
      light: `Latência eletromagnética inevitável (c = 299.792 km/s): ${nasaData.meda.oneWayRadioDelayMin} min one-way (~28 min RTT) torna impraticável o telecontrole em tempo real.`,
      magnetism: `Ausência de magnetosfera planetária expõe o habitat a eventos DONKI Classe ${nasaData.donkiFlare.classType} (${nasaData.donkiFlare.sourceLocation}); materiais hidrogenados como H₂O reduzem radiação secundária.`,
      photons: `O ensaio ISS Veggie (${nasaData.osdr.studyId}, Massa et al.) demonstra o acoplamento energético entre fotoperíodo de ${nasaData.osdr.ledHoursPerDay}h LED e geração fotovoltaica atenuada por τ=${nasaData.meda.dustOpacityTau}.`,
      momentum:
        'Conservação de momento linear e restrição orçamentária no Hangar ilustram o trade-off real entre massa útil (payload), Δv e redundância sistêmica.',
    },
  };

  return puns[ageProfile][domain];
}

function summarizeHistoryContext(
  choiceHistory: ChoiceHistoryEntry[],
  hangarConfig: HangarConfig,
  ageProfile: AgeProfile
): string {
  const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket);
  const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit);
  const instNames = INSTRUMENTS.filter((i) => hangarConfig.instruments.includes(i.id)).map(
    (i) => i.shortName
  );

  const hangarSummary = rocket
    ? `${rocket.name}${orbit ? ` + ${orbit.name}` : ''}${instNames.length ? ` (${instNames.join(' e ')})` : ''}`
    : 'Hangar ainda em montagem';

  if (choiceHistory.length === 0) {
    return ageProfile === 'explorers'
      ? `Seu histórico até agora: ${hangarSummary}, e ainda vamos começar o Sol 1!`
      : `Configuração atual: ${hangarSummary}. Nenhuma carta executada nos Sols ainda.`;
  }

  const last = choiceHistory[choiceHistory.length - 1];
  const riskyCount = choiceHistory.filter((c) => c.enteredDanger).length;
  const hybridCount = choiceHistory.filter((c) => c.category === 'Engenharia Híbrida').length;

  if (ageProfile === 'explorers') {
    return `No Sol ${last.sol}, você escolheu "${last.cardTitle}" (${last.cardId})${
      riskyCount > 0
        ? ` — e já passou ${riskyCount} vez(es) pela zona amarela/vermelha (<35%)!`
        : ' — mantendo suas penas bem seguras!'
    }`;
  }
  if (ageProfile === 'strategists') {
    return `Histórico (${choiceHistory.length}/4 Sols · ${hangarSummary}): última ação foi Sol ${last.sol} [${last.cardId}: ${last.cardTitle} — ${last.category}].${
      hybridCount > 0
        ? ` Você aplicou ${hybridCount} solução(ões) híbrida(s) de engenharia!`
        : riskyCount > 0
          ? ` Atenção: ${riskyCount} escolha(s) levou(aram) barras abaixo de 35%.`
          : ''
    }`;
  }
  return `Rastro da sessão (${choiceHistory.length}/4 decisões · ${hangarSummary}): última entrada em Sol ${last.sol} (${last.cardId} - "${last.cardTitle}", categoria ${last.category}; episódios <35%: ${riskyCount}).`;
}

function generateSmartQuackReply(
  topic: TopicId,
  userQuestion: string,
  screen: GameScreen,
  currentSol: 1 | 2 | 3 | 4,
  ageProfile: AgeProfile,
  resources: Resources,
  nasaData: NasaDataBundle,
  hangarConfig: HangarConfig,
  choiceHistory: ChoiceHistoryEntry[]
): string {
  const lowest = getLowestResource(resources);
  const lowestMeta = RESOURCE_META[lowest.key];
  const inDanger = lowest.value < 35;
  const q = normalizeText(userQuestion);
  const lastChoice = choiceHistory[choiceHistory.length - 1];
  const historyBrief = summarizeHistoryContext(choiceHistory, hangarConfig, ageProfile);
  const nasaLiveTag =
    nasaData.status === 'live'
      ? 'telemetria NASA AO VIVO'
      : nasaData.status === 'cache'
        ? 'cache NASA 24h'
        : 'acervo real NASA';

  // Guardrail check: never reveal which card to click
  if (
    q.includes('qual carta') ||
    q.includes('qual opcao') ||
    q.includes('qual eu clico') ||
    q.includes('qual escolher') ||
    q.includes('resposta') ||
    q.includes('a b ou c') ||
    q.includes('a, b ou c')
  ) {
    return `Quack-esperto! Um bom astronauta não cola da nave vizinha! 😉 ${historyBrief} Sua barra mais baixa agora é **${lowestMeta.label} (${lowest.value}%)**. ${buildPhysicsPunByProfile(
      ageProfile,
      currentSol === 1 ? 'light' : currentSol === 2 ? 'magnetism' : currentSol === 3 ? 'photons' : 'momentum',
      nasaData
    )}`;
  }

  // Explicit history analysis request
  if (
    topic === 'history' ||
    (topic === 'custom' &&
      (q.includes('historico') ||
        q.includes('minha escolha') ||
        q.includes('minhas escolhas') ||
        q.includes('o que eu fiz') ||
        q.includes('como estou')))
  ) {
    const advice = inDanger
      ? `Alerta nas penas! Depois da sua escolha${lastChoice ? ` ("${lastChoice.cardTitle}")` : ''}, **${lowestMeta.label}** caiu para **${lowest.value}%** — priorize recuperá-la sem zerar as outras!`
      : `Equilíbrio sólido até aqui! Seu menor medidor é **${lowestMeta.label} (${lowest.value}%)**.`;
    return `${historyBrief} ${advice} ${buildPhysicsPunByProfile(ageProfile, 'gravity', nasaData)}`;
  }

  // Greetings
  if (
    topic === 'custom' &&
    (/^(oi|ola|hey|e ai|bom dia|boa tarde|boa noite|quack|tudo bem|salve)/.test(q) ||
      q.includes('tudo bem'))
  ) {
    return `${
      ageProfile === 'explorers'
        ? `Quack-tástico falar com você! 🦆🚀`
        : ageProfile === 'strategists'
          ? `Quack! Canal de telemetria aberto (${nasaLiveTag})!`
          : `Saudações pedagógicas da Base Ares (${nasaLiveTag})!`
    } ${buildPhysicsPunByProfile(ageProfile, 'thermo', nasaData)} ${
      lastChoice ? `Vi que no Sol ${lastChoice.sol} você escolheu "${lastChoice.cardTitle}".` : ''
    }`;
  }

  // Duck / Mambo / Gravity
  if (
    topic === 'custom' &&
    (q.includes('pato') ||
      q.includes('quack') ||
      q.includes('mambo') ||
      q.includes('danca') ||
      q.includes('pena') ||
      q.includes('gravidade'))
  ) {
    return `${buildPhysicsPunByProfile(ageProfile, 'gravity', nasaData)} Fato NASA (${nasaLiveTag}): na ISS, astronautas treinam 2h/dia contra atrofia muscular em microgravidade — e aqui ${historyBrief}`;
  }

  // Stars & Constellations
  if (
    topic === 'custom' &&
    (q.includes('estrela') ||
      q.includes('constelacao') ||
      q.includes('ceu') ||
      q.includes('deneb') ||
      q.includes('orion'))
  ) {
    return `Olho vivo no telescópio! 🔭 Em Marte, a estrela polar do norte é **Deneb** (Cisne) por causa da inclinação de 25,19° do eixo marciano — e a foto atual no nosso módulo APOD é **"${nasaData.apod.title}" (${nasaData.apod.date})**! ${buildPhysicsPunByProfile(
      ageProfile,
      'light',
      nasaData
    )}`;
  }

  // ETs / Biofilms / Pipes / Water
  if (
    topic === 'custom' &&
    (q.includes('et') ||
      q.includes('alien') ||
      q.includes('carrapato') ||
      q.includes('biofilme') ||
      q.includes('agua') ||
      q.includes('cano') ||
      q.includes('duto'))
  ) {
    return `Os "Carrapatos ETs" são **biofilmes** reais estudados no **${nasaData.osdr.studyId}** (Zea et al., ISS): em microgravidade, bactérias formam camadas espessas nos dutos de reciclagem de água! ${
      lastChoice && lastChoice.sol === 1
        ? `No Sol 1 você reagiu com "${lastChoice.cardTitle}".`
        : ''
    } ${buildPhysicsPunByProfile(ageProfile, 'magnetism', nasaData)}`;
  }

  // Solar flare / Shield / Radiation / DONKI
  if (
    topic === 'custom' &&
    (q.includes('tempestade') ||
      q.includes('radiacao') ||
      q.includes('escudo') ||
      q.includes('donki') ||
      q.includes('x8') ||
      q.includes('explosao'))
  ) {
    return `Dado real **NASA DONKI** (${nasaLiveTag}): evento **${nasaData.donkiFlare.flrID}** Classe **${nasaData.donkiFlare.classType}** na região ${nasaData.donkiFlare.sourceLocation}! ${buildPhysicsPunByProfile(
      ageProfile,
      'magnetism',
      nasaData
    )} ${lastChoice ? `Seu último passo foi "${lastChoice.cardTitle}" (Escudo atual: ${resources.shield}%).` : ''}`;
  }

  // Veggie / Plants / Lettuce / Oxygen / LEDs
  if (
    topic === 'custom' &&
    (q.includes('planta') ||
      q.includes('alface') ||
      q.includes('estufa') ||
      q.includes('veggie') ||
      q.includes('oxigenio') ||
      q.includes('led') ||
      q.includes('ar'))
  ) {
    return `${buildPhysicsPunByProfile(ageProfile, 'photons', nasaData)} Hoje seu Suporte de Vida está em **${resources.lifeSupport}%** e Energia em **${resources.energy}%**.`;
  }

  // Energy / Batteries / Cold / Dust / MEDA
  if (
    topic === 'custom' &&
    (q.includes('energia') ||
      q.includes('bateria') ||
      q.includes('frio') ||
      q.includes('temperatura') ||
      q.includes('poeira') ||
      q.includes('painel') ||
      q.includes('meda'))
  ) {
    return `${buildPhysicsPunByProfile(ageProfile, 'thermo', nasaData)} Telemetria **${nasaData.meda.mission}**: opacidade de poeira **τ=${nasaData.meda.dustOpacityTau}** na ${nasaData.meda.location}. Sua Energia agora está em **${resources.energy}%**.`;
  }

  // Radio / Delay / Earth / Mars / Jezero
  if (
    topic === 'custom' &&
    (q.includes('radio') ||
      q.includes('sinal') ||
      q.includes('atraso') ||
      q.includes('demora') ||
      q.includes('terra') ||
      q.includes('jezero') ||
      q.includes('distancia'))
  ) {
    return `${buildPhysicsPunByProfile(ageProfile, 'light', nasaData)} Sua barra de Comunicações está em **${resources.comms}%**${
      hangarConfig.orbit === 'high' ? ' (ajudada pela sua Órbita Alta!)' : ''
    }.`;
  }

  // Rockets / Mass / Budget / Hangar
  if (
    topic === 'custom' &&
    (q.includes('foguete') ||
      q.includes('massa') ||
      q.includes('peso') ||
      q.includes('orcamento') ||
      q.includes('dinheiro') ||
      q.includes('orbita') ||
      q.includes('hangar'))
  ) {
    return `${buildPhysicsPunByProfile(ageProfile, 'momentum', nasaData)} ${historyBrief}`;
  }

  // Screen-level fallbacks & quick buttons
  if (screen === 'prologue' || screen === 'hangar') {
    if (topic === 'nasa') {
      return `Telemetria carregada (${nasaLiveTag}): **DONKI ${nasaData.donkiFlare.classType}** (${nasaData.donkiFlare.flrID}), **MEDA ${nasaData.meda.nightTempC}°C / τ=${nasaData.meda.dustOpacityTau}**, **OSDR ${nasaData.osdr.studyId}** (${nasaData.osdr.ledHoursPerDay}h LED) e **APOD "${nasaData.apod.title}"**!`;
    }
    if (topic === 'physics') {
      return `${buildPhysicsPunByProfile(ageProfile, 'momentum', nasaData)} ${historyBrief}`;
    }
    return `${historyBrief} ${buildPhysicsPunByProfile(ageProfile, 'gravity', nasaData)}`;
  }

  if (screen === 'victory') {
    if (topic === 'physics') {
      return `${buildPhysicsPunByProfile(ageProfile, 'gravity', nasaData)} ${historyBrief}`;
    }
    if (topic === 'nasa') {
      return `Passaporte validado com ${nasaLiveTag}: **DONKI ${nasaData.donkiFlare.classType}**, **OSDR ${nasaData.osdr.studyId}**, **MEDA ${nasaData.meda.nightTempC}°C** e foto **APOD "${nasaData.apod.title}" (${nasaData.apod.date})**!`;
    }
    return `Quack-parabéns! 🎉 ${historyBrief} Placar final das barras: Energia ${resources.energy}%, Suporte ${resources.lifeSupport}%, Escudo ${resources.shield}%, Rádio ${resources.comms}%. Clique no céu escuro para revelar Deneb e Órion!`;
  }

  // Command Center quick buttons: status / physics / nasa
  if (topic === 'status') {
    const moodText = inDanger
      ? `🚨 Penas em alerta máximo! **${lowestMeta.label}** caiu para **${lowest.value}%** (<35% zona de perigo!).`
      : `Equilíbrio firme nas penas! Seu menor medidor agora é **${lowestMeta.label} (${lowest.value}%)**.`;
    return `${moodText} ${historyBrief} Avalie qual sistema precisa de fôlego no Sol ${currentSol} sem zerar nenhum outro!`;
  }

  if (topic === 'nasa') {
    if (currentSol === 1) {
      return `Ciência real no Sol 1 (${nasaLiveTag}): no **${nasaData.osdr.studyId}** (Zea et al.), biofilmes espessos entopem dutos em microgravidade enquanto o **MEDA** mede **${nasaData.meda.nightTempC}°C** e **${nasaData.meda.oneWayRadioDelayMin} min** de atraso de rádio!`;
    }
    if (currentSol === 2) {
      return `Ciência real no Sol 2 (${nasaLiveTag}): explosão **${nasaData.donkiFlare.flrID}** Classe **${nasaData.donkiFlare.classType}** do catálogo **NASA DONKI**! ${
        lastChoice ? `Depois do Sol ${lastChoice.sol} ("${lastChoice.cardTitle}"), seu Escudo está em ${resources.shield}%.` : ''
      }`;
    }
    if (currentSol === 3) {
      return `Ciência real no Sol 3 (${nasaLiveTag}): a alface *Outredgeous* (**${nasaData.osdr.studyId}**) exige **${nasaData.osdr.ledHoursPerDay}h/dia de LEDs**, competindo com painéis sob poeira **τ=${nasaData.meda.dustOpacityTau}** (MEDA)!`;
    }
    return `Ciência real no Sol 4 (${nasaLiveTag}): pouso sob ventos de poeira na **${nasaData.meda.location}** exige sincronia orbital e enlace com atraso de **${nasaData.meda.oneWayRadioDelayMin} min**!`;
  }

  if (topic === 'physics') {
    const domainBySol: Record<1 | 2 | 3 | 4, 'light' | 'magnetism' | 'photons' | 'momentum'> = {
      1: 'light',
      2: 'magnetism',
      3: 'photons',
      4: 'momentum',
    };
    return `${buildPhysicsPunByProfile(ageProfile, domainBySol[currentSol], nasaData)} ${
      lastChoice
        ? `Pela sua decisão anterior ("${lastChoice.cardTitle}"), seu ponto mais sensível agora é **${lowestMeta.label} (${lowest.value}%)**.`
        : `Fique de olho em **${lowestMeta.label} (${lowest.value}%)**!`
    }`;
  }

  // Dynamic catch-all referencing history + profile physics pun + real NASA fact
  return `Quack-curioso você perguntar sobre "${userQuestion.trim().slice(0, 36)}"! 🦆 ${historyBrief} ${buildPhysicsPunByProfile(
    ageProfile,
    'gravity',
    nasaData
  )} (${nasaLiveTag}: DONKI ${nasaData.donkiFlare.classType} · MEDA ${nasaData.meda.nightTempC}°C).`;
}

export const QuackChatWidget: React.FC<QuackChatWidgetProps> = ({
  screen,
  currentSol,
  ageProfile,
  resources,
  expression,
  nasaData,
  hangarConfig,
  choiceHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const quickButtons = useMemo(() => {
    const base: { id: TopicId; label: string }[] =
      screen === 'command'
        ? [
            { id: 'status', label: 'Qual barra está em perigo?' },
            { id: 'physics', label: 'Física de Marte no Sol!' },
            { id: 'nasa', label: 'Dado real NASA agora!' },
          ]
        : [
            { id: 'status', label: 'Dica para essa etapa!' },
            { id: 'physics', label: 'Leis da física aqui?' },
            { id: 'nasa', label: 'Telemetria NASA carregada?' },
          ];

    if (choiceHistory.length > 0 || hangarConfig.rocket) {
      base.push({ id: 'history', label: 'Analisar minhas escolhas!' });
    }
    return base;
  }, [screen, choiceHistory.length, hangarConfig.rocket]);

  const greeting = useMemo(() => {
    const last = choiceHistory[choiceHistory.length - 1];
    const historyNote = last
      ? ` Vi sua última jogada no Sol ${last.sol}: "${last.cardTitle}"!`
      : '';
    if (ageProfile === 'explorers') {
      return `Quack! 🦆${historyNote} Pergunte sobre Marte, gravidade, ETs ou estrelas — sempre com um trocadilho de pato e ciência da NASA (${nasaData.meda.nightTempC}°C)!`;
    }
    if (ageProfile === 'strategists') {
      return `Telemetria ativa!${historyNote} Analiso seu histórico e explico física marciana (DONKI ${nasaData.donkiFlare.classType}, MEDA τ=${nasaData.meda.dustOpacityTau}) sem dar spoiler da carta!`;
    }
    return `Assistente Pedagógico Quack:${historyNote} Contextualizo o histórico da sessão com física planetária e dados reais (OSDR ${nasaData.osdr.studyId}, DONKI ${nasaData.donkiFlare.classType}, MEDA).`;
  }, [ageProfile, choiceHistory, nasaData]);

  const handleAsk = (topic: TopicId, labelText: string) => {
    playClickSound();
    const userMsgId = `${Date.now()}-u`;
    setMessages((prev) => [
      ...prev.slice(-8),
      { id: userMsgId, sender: 'user', text: labelText },
    ]);
    setIsThinking(true);

    window.setTimeout(() => {
      const reply = generateSmartQuackReply(
        topic,
        labelText,
        screen,
        currentSol,
        ageProfile,
        resources,
        nasaData,
        hangarConfig,
        choiceHistory
      );
      setMessages((prev) => [
        ...prev.slice(-8),
        { id: `${Date.now()}-q`, sender: 'quack', text: reply },
      ]);
      setIsThinking(false);
    }, 260);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue('');
    handleAsk('custom', trimmed);
  };

  return (
    <div className="fixed bottom-12 right-4 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsOpen(true);
          }}
          className="group flex items-center gap-2.5 rounded-full border border-orange-400/60 bg-white dark:bg-[#121C33] py-1.5 pl-2 pr-4 text-left shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-orange-400"
          aria-label="Abrir chat com o Comandante Quack"
        >
          <QuackMascot expression={expression} size={40} />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Falar com Quack
            </p>
            <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-300 leading-tight">
              {choiceHistory.length > 0
                ? `${choiceHistory.length} escolha(s) · Física NASA`
                : 'Dicas & Ciência NASA'}
            </p>
          </div>
          <MessageCircle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
        </button>
      ) : (
        <div className="w-[345px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#162038] px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <QuackMascot expression={expression} size={38} />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Comandante Quack
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Tutor de Física &amp; Histórico ({choiceHistory.length}/4)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Fechar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-64 space-y-2.5 overflow-y-auto p-3.5 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 p-2.5 leading-relaxed">
              {greeting}
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl p-2.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-6 bg-orange-100 text-orange-950 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-100 dark:border-orange-500/30'
                    : 'mr-4 bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/90 dark:text-slate-100 dark:border-slate-700/70'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isThinking && (
              <div className="mr-8 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-3 py-2 text-[11px] italic text-slate-500 dark:text-slate-400">
                Quack está cruzando seu histórico com a telemetria NASA...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0B1222] p-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {quickButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleAsk(btn.id, btn.label)}
                  className="rounded-lg border border-slate-300 bg-white text-sky-700 hover:border-sky-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-sky-200 dark:hover:border-sky-400/60 px-2.5 py-1.5 text-[11px] font-medium transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pergunte sobre Marte, gravidade, escolhas..."
                className="flex-1 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-orange-500 p-2 text-slate-950 hover:bg-orange-400"
                aria-label="Enviar pergunta"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
