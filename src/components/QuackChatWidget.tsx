import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GripHorizontal,
  Maximize2,
  MessageCircle,
  Minus,
  Send,
  X,
} from 'lucide-react';
import { getLocalizedMissionData } from '../data/missionDataEn';
import {
  AgeProfile,
  ChoiceHistoryEntry,
  GameScreen,
  HangarConfig,
  Language,
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
  lang?: Language;
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
  lang: Language,
  ageProfile: AgeProfile,
  domain: 'gravity' | 'thermo' | 'light' | 'magnetism' | 'photons' | 'momentum',
  nasaData: NasaDataBundle
): string {
  if (lang === 'en') {
    const punsEn: Record<AgeProfile, Record<typeof domain, string>> = {
      explorers: {
        gravity:
          'A duck jumping on Mars becomes a super-duck: with just 38% of Earth’s gravity, my 1-meter hop turns into nearly 3 meters!',
        thermo: `Brr! At ${nasaData.meda.nightTempC}°C (MEDA), even my quack freezes mid-air — in heat physics, electric power keeps water pipes cozy!`,
        light: `Hellooo? Light zooms at 300,000 km/s, yet Mars is so far it takes ${nasaData.meda.oneWayRadioDelayMin} min each way — zero time for last-second Earth rescues!`,
        magnetism: `Without a giant Earth-style magnetic shield, a ${nasaData.donkiFlare.classType} solar flare (DONKI) tries to zap our feathers — good thing clean water blocks radiation too!`,
        photons: `Our Veggie lettuces (${nasaData.osdr.studyId}) snack on light! They need ${nasaData.osdr.ledHoursPerDay}h of colorful LEDs to make fresh oxygen for us.`,
        momentum:
          'A rocket swims like a duck in space: pushing fuel backward makes Newton’s 3rd Law push the ship forward! More weight means more fuel needed!',
      },
      strategists: {
        gravity:
          'Under Mars gravity of 3.71 m/s² (38% Earth), inertial mass still rules orbital burns — pack dead weight and Δv makes you pay!',
        thermo: `Brutal thermodynamics: with ${nasaData.meda.nightTempC}°C nights logged by MEDA, every Watt cut from Energy speeds up heat loss inside Jezero Crater.`,
        light: `Even at the cosmic speed limit of light (c ≈ 3×10⁸ m/s), orbital distance imposes ${nasaData.meda.oneWayRadioDelayMin} min one-way latency — local autonomy is survival.`,
        magnetism: `With no global magnetic dipole on Mars, protons from a ${nasaData.donkiFlare.classType} flare (${nasaData.donkiFlare.flrID}) strike the surface; hydrogen in water makes stellar shielding.`,
        photons: `In ${nasaData.osdr.studyId}, Outredgeous lettuce demands ${nasaData.osdr.ledHoursPerDay}h/day of LED photons — competing directly with dust-dimmed solar panels (τ=${nasaData.meda.dustOpacityTau}).`,
        momentum:
          'Tsiolkovsky’s Rocket Equation shows zero mercy: every extra kilogram in the Hangar squeezes mass margins and drains mission budget!',
      },
      educators: {
        gravity:
          'At g ≈ 3.71 m/s² (38% of Earth gravity), surface weight drops while inertial mass remains unchanged during propulsion maneuvers.',
        thermo: `Critical thermal balance (MEDA, Rodriguez-Manfredi et al.): at ${nasaData.meda.nightTempC}°C Martian nights, electrical loss shuts off resistive heaters and freezes closed-loop water.`,
        light: `Electromagnetic latency (c = 299,792 km/s): ${nasaData.meda.oneWayRadioDelayMin} min one-way (~28 min RTT) renders real-time teleoperation impossible.`,
        magnetism: `Lack of planetary magnetosphere exposes habitats to DONKI Class ${nasaData.donkiFlare.classType} solar particle events; hydrogen-rich H₂O attenuates secondary radiation.`,
        photons: `ISS Veggie research (${nasaData.osdr.studyId}, Massa et al.) demonstrates energy coupling between a ${nasaData.osdr.ledHoursPerDay}h LED photoperiod and τ=${nasaData.meda.dustOpacityTau} dusty solar generation.`,
        momentum:
          'Conservation of linear momentum and Hangar budget caps model real-world trade-offs among payload mass, Δv, and subsystem redundancy.',
      },
    };
    return punsEn[ageProfile][domain];
  }

  const punsPt: Record<AgeProfile, Record<typeof domain, string>> = {
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
      magnetism: `Ausência de magnetosfera planetária expõe o habitat a eventos DONKI Classe ${nasaData.donkiFlare.classType}; materiais hidrogenados como H₂O reduzem radiação secundária.`,
      photons: `O ensaio ISS Veggie (${nasaData.osdr.studyId}, Massa et al.) demonstra o acoplamento energético entre fotoperíodo de ${nasaData.osdr.ledHoursPerDay}h LED e geração fotovoltaica atenuada por τ=${nasaData.meda.dustOpacityTau}.`,
      momentum:
        'Conservação de momento linear e restrição orçamentária no Hangar ilustram o trade-off real entre massa útil (payload), Δv e redundância sistêmica.',
    },
  };

  return punsPt[ageProfile][domain];
}

function summarizeHistoryContext(
  lang: Language,
  choiceHistory: ChoiceHistoryEntry[],
  hangarConfig: HangarConfig,
  ageProfile: AgeProfile
): string {
  const { ROCKETS, ORBITS, INSTRUMENTS } = getLocalizedMissionData(lang);
  const rocket = ROCKETS.find((r) => r.id === hangarConfig.rocket);
  const orbit = ORBITS.find((o) => o.id === hangarConfig.orbit);
  const instNames = INSTRUMENTS.filter((i) => hangarConfig.instruments.includes(i.id)).map(
    (i) => i.shortName
  );

  if (lang === 'en') {
    const hangarSummary = rocket
      ? `${rocket.name}${orbit ? ` + ${orbit.name}` : ''}${instNames.length ? ` (${instNames.join(' & ')})` : ''}`
      : 'Hangar still in assembly';

    if (choiceHistory.length === 0) {
      return ageProfile === 'explorers'
        ? `Your log so far: ${hangarSummary}, and Sol 1 is up next!`
        : `Current loadout: ${hangarSummary}. No Sol decisions executed yet.`;
    }

    const last = choiceHistory[choiceHistory.length - 1];
    const riskyCount = choiceHistory.filter((c) => c.enteredDanger).length;
    const hybridCount = choiceHistory.filter((c) => c.category === 'Hybrid Engineering').length;

    if (ageProfile === 'explorers') {
      return `On Sol ${last.sol}, you picked "${last.cardTitle}" (${last.cardId})${
        riskyCount > 0
          ? ` — and entered the danger zone (<35%) ${riskyCount} time(s)!`
          : ' — keeping all feathers safe!'
      }`;
    }
    if (ageProfile === 'strategists') {
      return `Mission log (${choiceHistory.length}/4 Sols · ${hangarSummary}): last move Sol ${last.sol} [${last.cardId}: ${last.cardTitle} — ${last.category}].${
        hybridCount > 0
          ? ` You used ${hybridCount} hybrid engineering solution(s)!`
          : riskyCount > 0
            ? ` Caution: ${riskyCount} choice(s) pushed bars below 35%.`
            : ''
      }`;
    }
    return `Session trace (${choiceHistory.length}/4 decisions · ${hangarSummary}): latest Sol ${last.sol} (${last.cardId} - "${last.cardTitle}", ${last.category}; <35% events: ${riskyCount}).`;
  }

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
  lang: Language,
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
  const { RESOURCE_META } = getLocalizedMissionData(lang);
  const lowest = getLowestResource(resources);
  const lowestMeta = RESOURCE_META[lowest.key];
  const inDanger = lowest.value < 35;
  const q = normalizeText(userQuestion);
  const lastChoice = choiceHistory[choiceHistory.length - 1];
  const historyBrief = summarizeHistoryContext(lang, choiceHistory, hangarConfig, ageProfile);
  const isPt = lang === 'pt';

  const nasaLiveTag = isPt
    ? nasaData.status === 'live'
      ? 'telemetria NASA AO VIVO'
      : nasaData.status === 'cache'
        ? 'cache NASA 24h'
        : 'acervo real NASA'
    : nasaData.status === 'live'
      ? 'LIVE NASA telemetry'
      : nasaData.status === 'cache'
        ? '24h NASA cache'
        : 'archived real NASA data';

  // Spoiler guardrail
  if (
    q.includes('qual carta') ||
    q.includes('qual opcao') ||
    q.includes('qual eu clico') ||
    q.includes('qual escolher') ||
    q.includes('resposta') ||
    q.includes('which card') ||
    q.includes('what card') ||
    q.includes('which option') ||
    q.includes('answer') ||
    q.includes('a b or c') ||
    q.includes('a b ou c')
  ) {
    return isPt
      ? `Quack-esperto! Um bom astronauta não cola da nave vizinha! 😉 ${historyBrief} Sua barra mais baixa agora é **${lowestMeta.label} (${lowest.value}%)**. ${buildPhysicsPunByProfile(
          lang,
          ageProfile,
          currentSol === 1 ? 'light' : currentSol === 2 ? 'magnetism' : currentSol === 3 ? 'photons' : 'momentum',
          nasaData
        )}`
      : `Smart-quack try! A true astronaut never peeks at the next ship's test! 😉 ${historyBrief} Your lowest bar right now is **${lowestMeta.label} (${lowest.value}%)**. ${buildPhysicsPunByProfile(
          lang,
          ageProfile,
          currentSol === 1 ? 'light' : currentSol === 2 ? 'magnetism' : currentSol === 3 ? 'photons' : 'momentum',
          nasaData
        )}`;
  }

  // History analysis
  if (
    topic === 'history' ||
    (topic === 'custom' &&
      (q.includes('historico') ||
        q.includes('minha escolha') ||
        q.includes('history') ||
        q.includes('my choice') ||
        q.includes('how am i')))
  ) {
    if (isPt) {
      const advice = inDanger
        ? `Alerta nas penas! Depois da sua escolha${lastChoice ? ` ("${lastChoice.cardTitle}")` : ''}, **${lowestMeta.label}** caiu para **${lowest.value}%** — priorize recuperá-la sem zerar as outras!`
        : `Equilíbrio sólido até aqui! Seu menor medidor é **${lowestMeta.label} (${lowest.value}%)**.`;
      return `${historyBrief} ${advice} ${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)}`;
    }
    const advice = inDanger
      ? `Feather alert! After your move${lastChoice ? ` ("${lastChoice.cardTitle}")` : ''}, **${lowestMeta.label}** dropped to **${lowest.value}%** — recover it without draining another system!`
      : `Steady balance so far! Your lowest gauge is **${lowestMeta.label} (${lowest.value}%)**.`;
    return `${historyBrief} ${advice} ${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)}`;
  }

  // Greetings
  if (
    topic === 'custom' &&
    (/^(oi|ola|hey|hi|hello|bom dia|boa tarde|quack|salve)/.test(q) || q.includes('how are you'))
  ) {
    return isPt
      ? `${ageProfile === 'explorers' ? 'Quack-tástico falar com você! 🦆🚀' : 'Quack! Canal de telemetria aberto!'} ${buildPhysicsPunByProfile(lang, ageProfile, 'thermo', nasaData)} ${lastChoice ? `Vi que no Sol ${lastChoice.sol} você escolheu "${lastChoice.cardTitle}".` : ''}`
      : `${ageProfile === 'explorers' ? 'Quack-tastic to talk with you! 🦆🚀' : 'Quack! Telemetry channel open!'} ${buildPhysicsPunByProfile(lang, ageProfile, 'thermo', nasaData)} ${lastChoice ? `I saw on Sol ${lastChoice.sol} you picked "${lastChoice.cardTitle}".` : ''}`;
  }

  // Duck / gravity / stars / biofilms / flare / veggie / energy / comms / rocket keywords
  if (
    topic === 'custom' &&
    (q.includes('pato') || q.includes('duck') || q.includes('quack') || q.includes('mambo') || q.includes('gravity') || q.includes('gravidade'))
  ) {
    return `${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)} (${nasaLiveTag}) — ${historyBrief}`;
  }

  if (
    topic === 'custom' &&
    (q.includes('star') || q.includes('estrela') || q.includes('constel') || q.includes('sky') || q.includes('ceu') || q.includes('deneb') || q.includes('orion'))
  ) {
    return isPt
      ? `Olho vivo no telescópio! 🔭 Em Marte, a estrela polar do norte é **Deneb** (Cisne) pela inclinação de 25,19° — e a foto APOD atual é **"${nasaData.apod.title}" (${nasaData.apod.date})**! ${buildPhysicsPunByProfile(lang, ageProfile, 'light', nasaData)}`
      : `Eyes on the telescope! 🔭 On Mars, the northern pole star is **Deneb** (Cygnus) due to Mars's 25.19° axial tilt — and our current APOD photo is **"${nasaData.apod.title}" (${nasaData.apod.date})**! ${buildPhysicsPunByProfile(lang, ageProfile, 'light', nasaData)}`;
  }

  if (
    topic === 'custom' &&
    (q.includes('et') || q.includes('alien') || q.includes('tick') || q.includes('carrapato') || q.includes('biofilm') || q.includes('pipe') || q.includes('water') || q.includes('agua'))
  ) {
    return isPt
      ? `Os "Carrapatos ETs" são **biofilmes** reais estudados no **${nasaData.osdr.studyId}** (Zea et al., ISS): em microgravidade, bactérias formam camadas nos dutos de água! ${buildPhysicsPunByProfile(lang, ageProfile, 'magnetism', nasaData)}`
      : `The “Alien Ticks” are real **biofilms** studied in **${nasaData.osdr.studyId}** (Zea et al., ISS): in microgravity, bacteria build sticky layers inside spacecraft water pipes! ${buildPhysicsPunByProfile(lang, ageProfile, 'magnetism', nasaData)}`;
  }

  if (
    topic === 'custom' &&
    (q.includes('storm') || q.includes('flare') || q.includes('tempestade') || q.includes('radiat') || q.includes('shield') || q.includes('escudo') || q.includes('donki'))
  ) {
    return `${isPt ? 'Dado real' : 'Real'} **NASA DONKI** (${nasaLiveTag}): **${nasaData.donkiFlare.flrID}** Class **${nasaData.donkiFlare.classType}**! ${buildPhysicsPunByProfile(lang, ageProfile, 'magnetism', nasaData)}`;
  }

  if (
    topic === 'custom' &&
    (q.includes('plant') || q.includes('lettuce') || q.includes('alface') || q.includes('veggie') || q.includes('oxygen') || q.includes('led'))
  ) {
    return `${buildPhysicsPunByProfile(lang, ageProfile, 'photons', nasaData)} (${RESOURCE_META.lifeSupport.label}: **${resources.lifeSupport}%**, ${RESOURCE_META.energy.label}: **${resources.energy}%**).`;
  }

  if (
    topic === 'custom' &&
    (q.includes('energy') || q.includes('energia') || q.includes('battery') || q.includes('cold') || q.includes('frio') || q.includes('dust') || q.includes('poeira') || q.includes('meda'))
  ) {
    return `${buildPhysicsPunByProfile(lang, ageProfile, 'thermo', nasaData)} **MEDA**: dust τ=${nasaData.meda.dustOpacityTau} (${RESOURCE_META.energy.label}: **${resources.energy}%**).`;
  }

  if (
    topic === 'custom' &&
    (q.includes('radio') || q.includes('comms') || q.includes('delay') || q.includes('atraso') || q.includes('earth') || q.includes('terra'))
  ) {
    return `${buildPhysicsPunByProfile(lang, ageProfile, 'light', nasaData)} (${RESOURCE_META.comms.label}: **${resources.comms}%**).`;
  }

  if (
    topic === 'custom' &&
    (q.includes('rocket') || q.includes('foguete') || q.includes('mass') || q.includes('budget') || q.includes('hangar'))
  ) {
    return `${buildPhysicsPunByProfile(lang, ageProfile, 'momentum', nasaData)} ${historyBrief}`;
  }

  // Screen-level fallbacks & quick buttons
  if (screen === 'prologue' || screen === 'hangar') {
    if (topic === 'nasa') {
      return isPt
        ? `Telemetria (${nasaLiveTag}): **DONKI ${nasaData.donkiFlare.classType}**, **MEDA ${nasaData.meda.nightTempC}°C / τ=${nasaData.meda.dustOpacityTau}**, **OSDR ${nasaData.osdr.studyId}** (${nasaData.osdr.ledHoursPerDay}h LED) e **APOD "${nasaData.apod.title}"**!`
        : `Loaded telemetry (${nasaLiveTag}): **DONKI ${nasaData.donkiFlare.classType}**, **MEDA ${nasaData.meda.nightTempC}°C / τ=${nasaData.meda.dustOpacityTau}**, **OSDR ${nasaData.osdr.studyId}** (${nasaData.osdr.ledHoursPerDay}h LED), and **APOD "${nasaData.apod.title}"**!`;
    }
    if (topic === 'physics') {
      return `${buildPhysicsPunByProfile(lang, ageProfile, 'momentum', nasaData)} ${historyBrief}`;
    }
    return `${historyBrief} ${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)}`;
  }

  if (screen === 'victory') {
    if (topic === 'physics') {
      return `${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)} ${historyBrief}`;
    }
    if (topic === 'nasa') {
      return isPt
        ? `Passaporte validado (${nasaLiveTag}): **DONKI ${nasaData.donkiFlare.classType}**, **OSDR ${nasaData.osdr.studyId}**, **MEDA ${nasaData.meda.nightTempC}°C** e foto **APOD "${nasaData.apod.title}"**!`
        : `Passport verified (${nasaLiveTag}): **DONKI ${nasaData.donkiFlare.classType}**, **OSDR ${nasaData.osdr.studyId}**, **MEDA ${nasaData.meda.nightTempC}°C**, and **APOD "${nasaData.apod.title}"**!`;
    }
    return isPt
      ? `Quack-parabéns! 🎉 ${historyBrief} Clique no céu escuro para revelar Deneb e Órion!`
      : `Quack-congrats! 🎉 ${historyBrief} Click the dark night sky to reveal Deneb and Orion!`;
  }

  if (topic === 'status') {
    if (isPt) {
      const moodText = inDanger
        ? `🚨 Penas em alerta máximo! **${lowestMeta.label}** caiu para **${lowest.value}%** (<35% zona de perigo!).`
        : `Equilíbrio firme nas penas! Seu menor medidor agora é **${lowestMeta.label} (${lowest.value}%)**.`;
      return `${moodText} ${historyBrief}`;
    }
    const moodText = inDanger
      ? `🚨 Feathers on high alert! **${lowestMeta.label}** dropped to **${lowest.value}%** (<35% danger zone!).`
      : `Steady feathers! Your lowest gauge right now is **${lowestMeta.label} (${lowest.value}%)**.`;
    return `${moodText} ${historyBrief}`;
  }

  if (topic === 'nasa') {
    if (currentSol === 1) {
      return isPt
        ? `Sol 1 (${nasaLiveTag}): no **${nasaData.osdr.studyId}**, biofilmes entopem dutos em microgravidade enquanto o **MEDA** mede **${nasaData.meda.nightTempC}°C** e **${nasaData.meda.oneWayRadioDelayMin} min** de atraso!`
        : `Sol 1 (${nasaLiveTag}): in **${nasaData.osdr.studyId}**, biofilms clog microgravity pipes while **MEDA** logs **${nasaData.meda.nightTempC}°C** and a **${nasaData.meda.oneWayRadioDelayMin}-min** radio delay!`;
    }
    if (currentSol === 2) {
      return isPt
        ? `Sol 2 (${nasaLiveTag}): explosão **${nasaData.donkiFlare.flrID}** Classe **${nasaData.donkiFlare.classType}** do catálogo **NASA DONKI**!`
        : `Sol 2 (${nasaLiveTag}): solar flare **${nasaData.donkiFlare.flrID}** Class **${nasaData.donkiFlare.classType}** from **NASA DONKI**!`;
    }
    if (currentSol === 3) {
      return isPt
        ? `Sol 3 (${nasaLiveTag}): a alface Outredgeous (**${nasaData.osdr.studyId}**) exige **${nasaData.osdr.ledHoursPerDay}h/dia de LEDs**, competindo com painéis sob poeira **τ=${nasaData.meda.dustOpacityTau}**!`
        : `Sol 3 (${nasaLiveTag}): Outredgeous lettuce (**${nasaData.osdr.studyId}**) needs **${nasaData.osdr.ledHoursPerDay}h/day LEDs**, competing with solar panels under **τ=${nasaData.meda.dustOpacityTau}** dust!`;
    }
    return isPt
      ? `Sol 4 (${nasaLiveTag}): pouso sob ventos de poeira na Cratera Jezero exige sincronia orbital e link com atraso de **${nasaData.meda.oneWayRadioDelayMin} min**!`
      : `Sol 4 (${nasaLiveTag}): landing through Jezero dust gusts demands orbital phasing across a **${nasaData.meda.oneWayRadioDelayMin}-min** radio lag!`;
  }

  if (topic === 'physics') {
    const domainBySol: Record<1 | 2 | 3 | 4, 'light' | 'magnetism' | 'photons' | 'momentum'> = {
      1: 'light',
      2: 'magnetism',
      3: 'photons',
      4: 'momentum',
    };
    return `${buildPhysicsPunByProfile(lang, ageProfile, domainBySol[currentSol], nasaData)} (${lowestMeta.label}: **${lowest.value}%**)`;
  }

  return isPt
    ? `Quack-curioso você perguntar sobre "${userQuestion.trim().slice(0, 36)}"! 🦆 ${historyBrief} ${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)}`
    : `Quack-curious question about "${userQuestion.trim().slice(0, 36)}"! 🦆 ${historyBrief} ${buildPhysicsPunByProfile(lang, ageProfile, 'gravity', nasaData)}`;
}

export const QuackChatWidget: React.FC<QuackChatWidgetProps> = ({
  lang = 'en',
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Draggable free position anywhere inside the viewport corners/edges
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thinkingTimerRef = useRef<number | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
    moved: boolean;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    originLeft: 0,
    originTop: 0,
    moved: false,
  });

  const clampPosition = (left: number, top: number) => {
    const el = containerRef.current;
    const width = el?.offsetWidth || 210;
    const height = el?.offsetHeight || 56;
    const maxLeft = Math.max(8, window.innerWidth - width - 8);
    const maxTop = Math.max(54, window.innerHeight - height - 42);
    return {
      left: Math.max(8, Math.min(maxLeft, left)),
      top: Math.max(54, Math.min(maxTop, top)),
    };
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragState.current.active) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.hypot(dx, dy) > 5) {
        dragState.current.moved = true;
      }
      setPos(clampPosition(dragState.current.originLeft + dx, dragState.current.originTop + dy));
    };

    const handleUp = () => {
      dragState.current.active = false;
    };

    const handleResize = () => {
      setPos((prev) => (prev ? clampPosition(prev.left, prev.top) : null));
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('resize', handleResize);
      if (thinkingTimerRef.current !== null) {
        window.clearTimeout(thinkingTimerRef.current);
      }
    };
  }, []);

  // Re-clamp if opening/closing/minimizing changes box height/width
  useEffect(() => {
    if (!pos) return;
    const id = window.requestAnimationFrame(() => {
      setPos((prev) => (prev ? clampPosition(prev.left, prev.top) : null));
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen, isMinimized]);

  const startDrag = (e: React.PointerEvent) => {
    // Only drag with primary button / touch, ignore inputs/buttons marked no-drag
    if ((e.target as HTMLElement).closest('[data-no-drag="true"]')) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originLeft: rect.left,
      originTop: rect.top,
      moved: false,
    };
  };

  const isPt = lang === 'pt';

  const quickButtons = useMemo(() => {
    const base: { id: TopicId; label: string }[] =
      screen === 'command'
        ? isPt
          ? [
              { id: 'status', label: 'Qual barra está em perigo?' },
              { id: 'physics', label: 'Física de Marte no Sol!' },
              { id: 'nasa', label: 'Dado real NASA agora!' },
            ]
          : [
              { id: 'status', label: 'Which bar is in danger?' },
              { id: 'physics', label: 'Mars physics right now!' },
              { id: 'nasa', label: 'Real NASA data now!' },
            ]
        : isPt
          ? [
              { id: 'status', label: 'Dica para essa etapa!' },
              { id: 'physics', label: 'Leis da física aqui?' },
              { id: 'nasa', label: 'Telemetria NASA carregada?' },
            ]
          : [
              { id: 'status', label: 'Tip for this stage!' },
              { id: 'physics', label: 'Physics laws here?' },
              { id: 'nasa', label: 'Loaded NASA telemetry?' },
            ];

    if (choiceHistory.length > 0 || hangarConfig.rocket) {
      base.push({
        id: 'history',
        label: isPt ? 'Analisar minhas escolhas!' : 'Analyze my choices!',
      });
    }
    return base;
  }, [screen, choiceHistory.length, hangarConfig.rocket, isPt]);

  const greeting = useMemo(() => {
    const last = choiceHistory[choiceHistory.length - 1];
    if (isPt) {
      const historyNote = last ? ` Vi sua última jogada no Sol ${last.sol}: "${last.cardTitle}"!` : '';
      if (ageProfile === 'explorers') {
        return `Quack! 🦆${historyNote} Me arraste para qualquer canto da tela e pergunte sobre Marte, gravidade ou ETs (${nasaData.meda.nightTempC}°C)!`;
      }
      if (ageProfile === 'strategists') {
        return `Telemetria ativa!${historyNote} Analiso seu histórico e explico física marciana (DONKI ${nasaData.donkiFlare.classType}, MEDA τ=${nasaData.meda.dustOpacityTau}) sem spoiler!`;
      }
      return `Assistente Pedagógico Quack:${historyNote} Contextualizo o histórico com física planetária e dados reais (OSDR ${nasaData.osdr.studyId}, MEDA).`;
    }

    const historyNote = last ? ` I saw your Sol ${last.sol} move: "${last.cardTitle}"!` : '';
    if (ageProfile === 'explorers') {
      return `Quack! 🦆${historyNote} Drag me to any corner and ask about Mars, gravity, aliens, or stars (${nasaData.meda.nightTempC}°C)!`;
    }
    if (ageProfile === 'strategists') {
      return `Telemetry live!${historyNote} I analyze your mission log and Mars physics (DONKI ${nasaData.donkiFlare.classType}, MEDA τ=${nasaData.meda.dustOpacityTau}) without spoilers!`;
    }
    return `Educator Assistant Quack:${historyNote} Connects session choices with planetary physics and real NASA datasets (OSDR ${nasaData.osdr.studyId}, MEDA).`;
  }, [ageProfile, choiceHistory, nasaData, isPt]);

  const handleAsk = (topic: TopicId, labelText: string) => {
    playClickSound();
    const userMsgId = `${Date.now()}-u`;
    setMessages((prev) => [
      ...prev.slice(-8),
      { id: userMsgId, sender: 'user', text: labelText },
    ]);
    setIsThinking(true);

    if (thinkingTimerRef.current !== null) {
      window.clearTimeout(thinkingTimerRef.current);
    }

    thinkingTimerRef.current = window.setTimeout(() => {
      thinkingTimerRef.current = null;
      const reply = generateSmartQuackReply(
        lang,
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

  const positionStyle: React.CSSProperties = pos
    ? { left: `${pos.left}px`, top: `${pos.top}px` }
    : { right: '16px', bottom: '48px' };

  return (
    <div ref={containerRef} style={positionStyle} className="fixed z-40 touch-none">
      {!isOpen ? (
        <button
          type="button"
          onPointerDown={startDrag}
          onClick={() => {
            if (dragState.current.moved) return;
            playClickSound();
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="group flex cursor-grab active:cursor-grabbing items-center gap-2 rounded-full border border-orange-400/60 bg-white dark:bg-[#121C33] py-1.5 pl-2 pr-3.5 text-left shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-orange-400"
          aria-label={
            isPt
              ? 'Abrir ou arrastar chat com o Comandante Quack'
              : 'Open or drag Commander Quack chat'
          }
        >
          <QuackMascot expression={expression} size={38} />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {isPt ? 'Falar com Quack' : 'Ask Quack'}
            </p>
            <p className="text-[10px] font-semibold text-orange-600 dark:text-orange-300 leading-tight">
              {choiceHistory.length > 0
                ? isPt
                  ? `${choiceHistory.length} escolha(s) · Arraste`
                  : `${choiceHistory.length} move(s) · Drag me`
                : isPt
                  ? 'Física NASA · Arrastável'
                  : 'NASA Physics · Draggable'}
            </p>
          </div>
          <MessageCircle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
        </button>
      ) : isMinimized ? (
        <div
          onPointerDown={startDrag}
          className="flex cursor-grab active:cursor-grabbing items-center gap-2 rounded-full border border-orange-400/60 bg-white dark:bg-[#162038] py-1 pl-2 pr-2 shadow-2xl"
        >
          <QuackMascot expression={expression} size={30} />
          <span className="text-xs font-bold text-slate-900 dark:text-white pr-1">
            {isPt ? 'Quack (Minimizado)' : 'Quack (Minimized)'}
          </span>
          <button
            type="button"
            data-no-drag="true"
            onClick={() => {
              playClickSound();
              setIsMinimized(false);
            }}
            className="rounded-full p-1 text-sky-600 hover:bg-slate-100 dark:text-sky-300 dark:hover:bg-slate-800"
            aria-label={isPt ? 'Expandir chat' : 'Expand chat'}
            title={isPt ? 'Expandir' : 'Expand'}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            data-no-drag="true"
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isPt ? 'Fechar chat' : 'Close chat'}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-[345px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A] shadow-2xl overflow-hidden">
          <div
            onPointerDown={startDrag}
            className="flex cursor-grab active:cursor-grabbing items-center justify-between border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#162038] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
              <QuackMascot expression={expression} size={34} />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {isPt ? 'Comandante Quack' : 'Commander Quack'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {isPt
                    ? `Arraste p/ mover · Histórico (${choiceHistory.length}/4)`
                    : `Drag header to move · Log (${choiceHistory.length}/4)`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1" data-no-drag="true">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsMinimized(true);
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={isPt ? 'Minimizar chat' : 'Minimize chat'}
                title={isPt ? 'Minimizar' : 'Minimize'}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={isPt ? 'Fechar chat' : 'Close chat'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-60 space-y-2.5 overflow-y-auto p-3.5 text-xs touch-auto">
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
                {isPt
                  ? 'Quack está cruzando seu histórico com a telemetria NASA...'
                  : 'Quack is cross-checking your log with NASA telemetry...'}
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
                placeholder={
                  isPt
                    ? 'Pergunte sobre Marte, gravidade, escolhas...'
                    : 'Ask about Mars, gravity, choices...'
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 px-2.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-orange-500 p-2 text-slate-950 hover:bg-orange-400"
                aria-label={isPt ? 'Enviar pergunta' : 'Send question'}
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
