import type { InfoHubTab } from '../components/MissionInfoHubModal';
import { getLocalizedMissionData } from '../data/missionDataEn';
import { getProfileToneCopy } from '../data/toneCopy';
import { HANGAR_BUDGET_M } from '../data/missionData';
import {
  AgeProfile,
  GameScreen,
  HangarConfig,
  Language,
  ModalFeedbackState,
  NasaDataBundle,
  ResourceKey,
  Resources,
} from '../types/game';

export interface ScreenNarrationContext {
  lang: Language;
  screen: GameScreen;
  currentSol: 1 | 2 | 3 | 4;
  ageProfile: AgeProfile;
  resources: Resources;
  hangarConfig: HangarConfig;
  nasaData: NasaDataBundle;
  modalFeedback: ModalFeedbackState | null;
  infoHubTab?: InfoHubTab | null;
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

export function stopSpeech(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore browser speech cancel errors
  }
}

export function speakText(
  text: string,
  lang: Language,
  handlers: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  } = {}
): boolean {
  if (!isSpeechSupported() || !text.trim()) {
    handlers.onError?.();
    return false;
  }

  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang === 'pt' ? 'pt-BR' : 'en-US';
    utterance.lang = targetLang;
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      const exact = voices.find((v) =>
        v.lang.toLowerCase().startsWith(targetLang.toLowerCase())
      );
      const prefix = voices.find((v) =>
        v.lang.toLowerCase().startsWith(lang === 'pt' ? 'pt' : 'en')
      );
      if (exact) utterance.voice = exact;
      else if (prefix) utterance.voice = prefix;
    }

    utterance.onstart = () => handlers.onStart?.();
    utterance.onend = () => handlers.onEnd?.();
    utterance.onerror = () => handlers.onError?.();

    synth.speak(utterance);
    return true;
  } catch {
    handlers.onError?.();
    return false;
  }
}

function formatResourcesSummary(
  lang: Language,
  resources: Resources
): string {
  const isPt = lang === 'pt';
  const { RESOURCE_META } = getLocalizedMissionData(lang);
  const parts = (Object.keys(RESOURCE_META) as ResourceKey[]).map((key) => {
    const val = resources[key];
    const label = RESOURCE_META[key].label;
    const status =
      val <= 0
        ? isPt
          ? 'crítico zero por cento'
          : 'critical zero percent'
        : val < 35
          ? isPt
            ? 'em atenção abaixo de 35 por cento'
            : 'warning below 35 percent'
          : isPt
            ? 'seguro'
            : 'safe';
    return `${label}: ${val}% (${status})`;
  });

  return isPt
    ? `Status das 4 barras da Base Ares: ${parts.join('; ')}.`
    : `Status of the 4 Ares Base resource bars: ${parts.join('; ')}.`;
}

export function buildCurrentScreenNarration(ctx: ScreenNarrationContext): string {
  const {
    lang,
    screen,
    currentSol,
    ageProfile,
    resources,
    hangarConfig,
    nasaData,
    modalFeedback,
    infoHubTab,
  } = ctx;

  const isPt = lang === 'pt';
  const tone = getProfileToneCopy(lang, ageProfile);
  const { ROCKETS, ORBITS, INSTRUMENTS, SOL_SCENARIOS, RESOURCE_META } =
    getLocalizedMissionData(lang);

  // Highest visual priority: open Science & Classroom Info Hub modal
  if (infoHubTab) {
    if (isPt) {
      const tabDetailsPt: Record<InfoHubTab, string> = {
        about:
          'Sobre o Jogo e o Problema que Resolvemos. Explica como dados reais da NASA viram decisões narrativas do Prólogo ao Passaporte Final sem exigir conhecimento prévio.',
        explorer:
          'Laboratório de Ciência Real (Visão Explorador). Mostra como suas escolhas no Hangar e nos Sols se conectam às pesquisas da NASA.',
        technical:
          'Linhagem Técnica de Dados NASA. Detalha os conjuntos oficiais DONKI, OSDR estudo OSD-120, Mars 2020 MEDA e APOD ligados às mecânicas da missão.',
        parents:
          'Área dos Pais e Professores. Apresenta orientação de uso em grupo, 3 perguntas disparadoras para debate, perfis adaptativos e artigos científicos revisados por pares.',
      };
      return [
        `Janela aberta: Central Científica e Pedagógica da Base Ares — Aba ${tabDetailsPt[infoHubTab]}`,
        formatResourcesSummary(lang, resources),
        'Descrição visual da cena: Modal centralizado com quatro abas de navegação no topo, cartões informativos detalhados e botão para fechar na parte inferior.',
      ].join(' ');
    }

    const tabDetailsEn: Record<InfoHubTab, string> = {
      about:
        'About the Game and The Problem We Solve. Explains how live NASA telemetry turns into hands-on STEM story decisions from Prologue to Victory Passport with zero prior knowledge required.',
      explorer:
        'Real Science Lab (Explorer View). Visualizes how your Hangar and Sol choices connect directly to real NASA space missions.',
      technical:
        'Technical NASA Data Lineage and Mechanics. Details live and archived datasets from DONKI, OSDR study OSD-120, Mars 2020 MEDA, and APOD.',
      parents:
        'Parents and Teachers Area. Features classroom facilitation guidance, 3 discussion prompts, adaptive reading profiles, and peer-reviewed scientific literature.',
    };
    return [
      `Active dialog: Ares Base Science and Classroom Hub — ${tabDetailsEn[infoHubTab]}`,
      formatResourcesSummary(lang, resources),
      'Visual scene description: Centered dialog modal featuring four navigation tabs along the top, structured STEM cards, and a close button at the bottom.',
    ].join(' ');
  }

  // Next visual priority: Sol feedback / failure modal
  if (modalFeedback) {
    if (modalFeedback.type === 'failure') {
      const failedLabel = modalFeedback.failedResource
        ? RESOURCE_META[modalFeedback.failedResource].label
        : isPt
          ? 'Sistema crítico'
          : 'Critical system';
      const physicsDetail = modalFeedback.failurePhysicsByProfile?.[ageProfile] || '';

      if (isPt) {
        return [
          `Tela de Análise Pós-Falha do Sol ${modalFeedback.sol}. ${failedLabel} chegou a 0 por cento.`,
          `Fala do Comandante Quack: ${tone.modal.failureIntro} ${physicsDetail}`,
          formatResourcesSummary(lang, resources),
          'Descrição visual da cena: O Comandante Quack aparece com expressão assustada e penas arrepiadas dentro do capacete espacial, ao lado do diagnóstico científico e botões para tentar o Sol novamente ou reprojetar a nave no Hangar.',
        ].join(' ');
      }

      return [
        `Sol ${modalFeedback.sol} Post-Failure Analysis dialog. ${failedLabel} dropped to 0 percent.`,
        `Commander Quack says: ${tone.modal.failureIntro} ${physicsDetail}`,
        formatResourcesSummary(lang, resources),
        'Visual scene description: Commander Quack looks startled inside his space helmet next to the NASA physics breakdown and buttons to retry this Sol or return to the Engineering Hangar.',
      ].join(' ');
    }

    const scienceText =
      modalFeedback.chosenCard?.scienceExplanationByProfile[ageProfile] || '';
    if (isPt) {
      return [
        `Selo Desbloqueado no Sol ${modalFeedback.sol}: ${modalFeedback.badge?.title || ''}.`,
        `Fala educativa: ${tone.modal.scienceHeading} ${scienceText}`,
        formatResourcesSummary(lang, resources),
        'Descrição visual da cena: O Comandante Quack comemora com asas erguidas ou alerta se alguma barra ficou abaixo de 35 por cento, acompanhado dos deltas da carta e do selo da NASA.',
      ].join(' ');
    }

    return [
      `Badge Unlocked on Sol ${modalFeedback.sol}: ${modalFeedback.badge?.title || ''}.`,
      `Scientific explanation: ${tone.modal.scienceHeading} ${scienceText}`,
      formatResourcesSummary(lang, resources),
      'Visual scene description: Commander Quack celebrates with raised wings, or warns gently if any gauge fell below 35 percent, alongside the card resource deltas and NASA badge.',
    ].join(' ');
  }

  if (screen === 'splash') {
    if (isPt) {
      return [
        'Tela de Abertura: Missão Sol-4: Guardiões da Base Ares.',
        'Fala de boas-vindas: Bem-vindo à Base Ares — sincronizando telemetria da NASA com o Comandante Quack.',
        formatResourcesSummary(lang, resources),
        'Descrição visual da cena: Fundo branco limpo com uma nave espacial alienígena arredondada carregando telemetria e um pequeno extraterrestre verde piscando os olhos na cúpula de vidro no topo da nave.',
      ].join(' ');
    }
    return [
      'Splash Screen: Mission Sol-4: Guardians of Ares Base.',
      'Welcome message: Welcome to Ares Base — syncing NASA telemetry with Commander Quack.',
      formatResourcesSummary(lang, resources),
      'Visual scene description: A crisp white screen featuring a friendly rounded UFO spaceship with a blinking green alien peeking from the glass dome at the top above a telemetry progress bar.',
    ].join(' ');
  }

  if (screen === 'prologue') {
    const quackLine = isPt
      ? `${tone.prologue.quackCallBeforeJezero} Cratera Jezero ${tone.prologue.quackCallAfterJezero}`
      : `${tone.prologue.quackCallBeforeJezero} Jezero Crater ${tone.prologue.quackCallAfterJezero}`;

    if (isPt) {
      return [
        'Tela 1: O Chamado da Base Ares — Prólogo da Missão.',
        `Fala do Comandante Quack: ${quackLine}`,
        formatResourcesSummary(lang, resources),
        'Descrição visual da cena: Emblema laranja da Missão Sol-4 no topo, Comandante Quack assustado com capacete transparente em fundo marciano, seguido do painel de escolha Solo ou Equipe, três avatares espaciais e seletor de perfil de leitura.',
      ].join(' ');
    }
    return [
      'Screen 1: The Call from Ares Base — Mission Prologue.',
      `Commander Quack says: ${quackLine}`,
      formatResourcesSummary(lang, resources),
      'Visual scene description: The orange Mission Sol-4 patch at the top, Commander Quack trembling inside his space helmet at Jezero Crater, followed by Solo or Team crew identity controls, three space avatars, and reading profile cards.',
    ].join(' ');
  }

  if (screen === 'hangar') {
    const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket);
    const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit);
    const insts = INSTRUMENTS.filter((i) => hangarConfig.instruments.includes(i.id));
    const totalCost =
      (rocket?.costM || 0) + insts.reduce((acc, i) => acc + i.costM, 0);
    const totalMass =
      350 + insts.reduce((acc, i) => acc + i.massKg, 0);

    if (isPt) {
      return [
        'Tela 2: Hangar de Engenharia Pré-Lançamento.',
        `Briefing do Hangar: ${tone.hangar.subtitle} ${tone.hangar.boosterBody}`,
        `Parâmetros atuais de engenharia: Massa ${totalMass} kg${rocket ? ` de no máximo ${rocket.maxMassKg} kg no ${rocket.name}` : ''}; Orçamento $${totalCost}M de $${HANGAR_BUDGET_M}M; Órbita ${orbit?.name || 'não selecionada'}; ${insts.length} de 2 instrumentos selecionados.`,
        formatResourcesSummary(lang, resources),
        'Descrição visual da cena: Painéis medidores de Massa Total, Orçamento e Ciência Projetada no topo, cartões de escolha de Foguete Leve ou Pesado, grade de Órbita e 3 Instrumentos NASA, além de gaveta técnica expansível e botão de lançamento.',
      ].join(' ');
    }

    return [
      'Screen 2: Pre-Launch Engineering Hangar.',
      `Hangar briefing: ${tone.hangar.subtitle} ${tone.hangar.boosterBody}`,
      `Current engineering loadout: Payload mass ${totalMass} kg${rocket ? ` out of ${rocket.maxMassKg} kg max on ${rocket.name}` : ''}; Budget $${totalCost}M of $${HANGAR_BUDGET_M}M; Orbit ${orbit?.name || 'unselected'}; ${insts.length} of 2 instruments selected.`,
      formatResourcesSummary(lang, resources),
      'Visual scene description: Live Total Mass, Mission Budget, and Projected Science meters at the top, Light vs Heavy Rocket cards, interactive Orbit and 3 NASA Instrument tiles, technical explanation drawer, and launch button.',
    ].join(' ');
  }

  if (screen === 'command') {
    const scenario = SOL_SCENARIOS.find((s) => s.sol === currentSol)!;
    const quackSpeech = scenario.quackQuoteByProfile[ageProfile];
    const earthMsg =
      tone.command.earthTransmissionBySol[currentSol] || scenario.earthTransmission || '';

    if (isPt) {
      return [
        `Tela 3: Central de Comando · Sol ${currentSol} de 4 — ${scenario.title}.`,
        `Fala do Comandante Quack: ${quackSpeech}${earthMsg ? ` Transmissão da Terra: ${earthMsg}` : ''}`,
        formatResourcesSummary(lang, resources),
        `Descrição visual da cena: Painel de telemetria com as 4 barras de recursos da Base Ares, avatar teatral do Comandante Quack com expressão ${scenario.quackExpression}, ${
          currentSol === 3
            ? 'oficina em microgravidade com 3 ferramentas flutuantes escondidas antes das cartas de ação.'
            : 'e 3 cartas de decisão de engenharia lado a lado para enfrentar o desafio deste Sol.'
        }`,
      ].join(' ');
    }

    return [
      `Screen 3: Command Center · Sol ${currentSol} of 4 — ${scenario.title}.`,
      `Commander Quack says: ${quackSpeech}${earthMsg ? ` Earth transmission: ${earthMsg}` : ''}`,
      formatResourcesSummary(lang, resources),
      `Visual scene description: Telemetry board displaying the 4 Ares Base resource bars, theatrical Commander Quack avatar in ${scenario.quackExpression} expression, ${
        currentSol === 3
          ? 'the Zero-G Workshop scene with 3 floating hidden tools to recover before action cards unlock.'
          : 'and 3 engineering trade-off decision cards side by side.'
      }`,
    ].join(' ');
  }

  // Screen 5 Victory
  if (isPt) {
    return [
      `Tela 5: ${tone.victory.missionCompleteTag} — ${tone.victory.headline}`,
      `Fala do Comandante Quack: ${tone.victory.quackSpeech}`,
      formatResourcesSummary(lang, resources),
      `Descrição visual da cena: Palco espacial comemorativo sob o céu noturno estrelado de Marte com constelações clicáveis; o Comandante Quack, os astronautas e uma fila alegre de Carrapatos ETs dançam Mambo juntos. Abaixo aparecem o Passaporte Oficial da Missão e a foto astronômica real da NASA (${nasaData.apod.title}).`,
    ].join(' ');
  }

  return [
    `Screen 5: ${tone.victory.missionCompleteTag} — ${tone.victory.headline}`,
    `Commander Quack says: ${tone.victory.quackSpeech}`,
    formatResourcesSummary(lang, resources),
    `Visual scene description: A celebratory space stage beneath the interactive starry Martian night sky; Commander Quack, the crew avatars, and a cheerful parade of Alien Ticks dance the Mambo together. Below are the Official Mission Passport certificate and the NASA Astronomy Picture of the Day (${nasaData.apod.title}).`,
  ].join(' ');
}
