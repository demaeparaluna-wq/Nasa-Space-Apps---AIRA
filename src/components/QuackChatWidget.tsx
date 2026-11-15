import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { RESOURCE_META } from '../data/missionData';
import {
  AgeProfile,
  GameScreen,
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
}

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

function generateSmartQuackReply(
  topic: 'status' | 'physics' | 'nasa' | 'custom',
  userQuestion: string,
  screen: GameScreen,
  currentSol: 1 | 2 | 3 | 4,
  ageProfile: AgeProfile,
  resources: Resources,
  nasaData: NasaDataBundle
): string {
  const lowest = getLowestResource(resources);
  const lowestMeta = RESOURCE_META[lowest.key];
  const inDanger = lowest.value < 35;
  const q = normalizeText(userQuestion);

  // Guardrail check: if player asks directly which card to click
  if (
    q.includes('qual carta') ||
    q.includes('qual opcao') ||
    q.includes('qual eu clico') ||
    q.includes('qual escolher') ||
    q.includes('resposta') ||
    q.includes('a b ou c') ||
    q.includes('a, b ou c')
  ) {
    return `Quack-esperto! Um bom astronauta não cola da nave vizinha! 😉 Posso te dar uma pista científica: sua barra mais baixa agora é **${lowestMeta.label} (${lowest.value}%)**. Compare qual ação protege esse sistema sem zerar os outros — você consegue!`;
  }

  // Conversational greetings & playful duck/mambo banter
  if (
    topic === 'custom' &&
    (/^(oi|ola|hey|e ai|bom dia|boa tarde|boa noite|quack|tudo bem|salve)/.test(q) ||
      q.includes('tudo bem'))
  ) {
    return ageProfile === 'explorers'
      ? `Quack-tástico falar com você! 🦆🚀 Aqui na Cratera Jezero faz um friozinho de ${nasaData.meda.nightTempC}°C — ainda bem que meu traje tem penas térmicas! Quer saber alguma curiosidade de Marte ou olhar suas barras?`
      : `Quack! Saudações da Base Ares! Sabia que um dia em Marte (chamado de "Sol") dura 24 horas e 39 minutos? Estou de bico atento nos seus sistemas (${lowestMeta.label} está em ${lowest.value}%). Sobre o que quer conversar?`;
  }

  if (
    topic === 'custom' &&
    (q.includes('pato') || q.includes('quack') || q.includes('mambo') || q.includes('danca') || q.includes('pena'))
  ) {
    return `Pelas minhas penas aerodinâmicas! 🦆✨ No espaço quase não tem gravidade para patinar, então o jeito é dançar mambo em microgravidade! Fato real da NASA: na Estação Espacial (ISS), os astronautas precisam de 2 horas de exercício por dia para não perder massa muscular enquanto flutuam!`;
  }

  // Stars & Constellations
  if (
    topic === 'custom' &&
    (q.includes('estrela') || q.includes('constelacao') || q.includes('ceu') || q.includes('deneb') || q.includes('orion'))
  ) {
    return `Olho vivo no telescópio, pato-astrônomo! 🔭 Sabia que no céu de Marte a estrela polar do norte não é Polaris como na Terra, e sim **Deneb** (na constelação do Cisne), porque o eixo de Marte é inclinado em 25,19°? E em Marte o pôr do sol é azulado por causa da poeira fina!`;
  }

  // ETs / Biofilms / Pipes / Water
  if (
    topic === 'custom' &&
    (q.includes('et') || q.includes('alien') || q.includes('carrapato') || q.includes('biofilme') || q.includes('agua') || q.includes('cano') || q.includes('duto'))
  ) {
    return `Quack! Os famosos "Carrapatos ETs" têm nome científico de verdade: **biofilmes**! 🦠 Na pesquisa real **NASA OSDR (Zea et al.)**, cientistas descobriram que bactérias formam camadas grudentas mais espessas em microgravidade dentro dos canos de reciclagem de água da ISS!`;
  }

  // Solar flare / Shield / Radiation / DONKI
  if (
    topic === 'custom' &&
    (q.includes('tempestade') || q.includes('radiacao') || q.includes('escudo') || q.includes('donki') || q.includes('x8') || q.includes('explosao'))
  ) {
    return `Penas ao alto! ☀️🛡️ A explosão solar **Classe ${nasaData.donkiFlare.classType}** foi registrada de verdade pelo sistema **NASA CCMC DONKI**! Como Marte não tem um campo magnético gigante como a Terra, a água dos tanques ajuda de verdade a bloquear radiação por ser rica em hidrogênio!`;
  }

  // Veggie / Plants / Lettuce / Oxygen / LEDs
  if (
    topic === 'custom' &&
    (q.includes('planta') || q.includes('alface') || q.includes('estufa') || q.includes('veggie') || q.includes('oxigenio') || q.includes('led') || q.includes('ar'))
  ) {
    return `Quack-alface fresquinha no espaço! 🥬 Na missão real **Veggie (${nasaData.osdr.studyId})**, astronautas cultivaram alface *Outredgeous* usando **${nasaData.osdr.ledHoursPerDay} horas por dia de LEDs** vermelhos, azuis e verdes! Além de gerar oxigênio, cuidar de plantas melhora o humor da tripulação!`;
  }

  // Energy / Batteries / Cold / Dust / MEDA
  if (
    topic === 'custom' &&
    (q.includes('energia') || q.includes('bateria') || q.includes('frio') || q.includes('temperatura') || q.includes('poeira') || q.includes('painel') || q.includes('meda'))
  ) {
    return `Brr! Bateu o bico só de pensar: segundo a estação **MEDA** do robô Perseverance, à noite na Cratera Jezero faz **${nasaData.meda.nightTempC}°C**! ⚡ E a poeira fina marciana (opacidade τ=${nasaData.meda.dustOpacityTau}) cobre os painéis solares — por isso manter Energia acima de 35% é vital para o aquecimento!`;
  }

  // Radio / Delay / Earth / Mars / Jezero
  if (
    topic === 'custom' &&
    (q.includes('radio') || q.includes('sinal') || q.includes('atraso') || q.includes('demora') || q.includes('terra') || q.includes('jezero') || q.includes('distancia'))
  ) {
    return `Alôôô... eco espacial! 📡 Mesmo viajando à velocidade da luz (300.000 km/s!), um recado de rádio leva cerca de **${nasaData.meda.oneWayRadioDelayMin} minutos para ir e ${nasaData.meda.oneWayRadioDelayMin} para voltar** (28 min no total)! Por isso na **Cratera Jezero** a nave precisa pensar rápido sozinha!`;
  }

  // Rockets / Mass / Budget / Hangar
  if (
    topic === 'custom' &&
    (q.includes('foguete') || q.includes('massa') || q.includes('peso') || q.includes('orcamento') || q.includes('dinheiro') || q.includes('orbita') || q.includes('hangar'))
  ) {
    return `Engenharia de peso — literalmente! 🚀 Na física de foguetes, cada quilograma extra exige muito mais combustível para escapar da gravidade da Terra (11,2 km/s!). E economizar orçamento no Hangar cria uma reserva estratégica para emergências em Marte!`;
  }

  // Screen-level fallbacks & quick buttons
  if (screen === 'prologue' || screen === 'hangar') {
    if (topic === 'nasa') {
      return `Tudo aqui usa telemetria real da NASA: explosões solares do **DONKI (${nasaData.donkiFlare.classType})**, frio de **${nasaData.meda.nightTempC}°C** do **MEDA** e a estufa **Veggie (${nasaData.osdr.studyId})**! Escolha equipamentos que equilibrem peso e verba!`;
    }
    if (ageProfile === 'explorers') {
      return `Quack! Aqui no Hangar, pense como quem arruma uma mochila para acampar em Marte: não dá para levar tudo se passar do peso do foguete ou do dinheirinho de $100M!`;
    }
    return `Dica de engenharia do Quack: observe a massa total (350 kg da cápsula + 2 instrumentos) e o teto de $100M. Sobrar dinheiro no Hangar ajuda muito no Sol 2!`;
  }

  if (screen === 'victory') {
    return `Quack-parabéns! 🎉 Vocês finalizaram os 4 Sols com Energia ${resources.energy}%, Suporte ${resources.lifeSupport}%, Escudo ${resources.shield}% e Rádio ${resources.comms}%. Clique no céu noturno para revelar constelações reais de Marte como Deneb (a estrela polar marciana)!`;
  }

  // Command Center quick buttons: status / physics / nasa
  if (topic === 'status') {
    const moodText = inDanger
      ? `🚨 Pato em alerta máximo! **${lowestMeta.label}** caiu para **${lowest.value}%** (zona de perigo!).`
      : `Tudo sob controle das penas, mas o menor medidor agora é **${lowestMeta.label} (${lowest.value}%)**.`;
    return `${moodText} Lembre-se: nenhuma carta é gratuita na engenharia — avalie qual sistema precisa de fôlego agora sem deixar outro zerar!`;
  }

  if (topic === 'nasa') {
    if (currentSol === 1) {
      return `Ciência real no Sol 1: **biofilmes** (OSDR) entopem dutos em microgravidade enquanto o **MEDA** registra **${nasaData.meda.nightTempC}°C** e **${nasaData.meda.oneWayRadioDelayMin} min** de atraso de rádio só de ida!`;
    }
    if (currentSol === 2) {
      return `Ciência real no Sol 2: explosão solar **Classe ${nasaData.donkiFlare.classType}** do catálogo **NASA DONKI**! Sem campo magnético global em Marte, até água potável ajuda como escudo de hidrogênio!`;
    }
    if (currentSol === 3) {
      return `Ciência real no Sol 3: a alface *Outredgeous* da **Estufa Veggie (${nasaData.osdr.studyId})** precisa de **16h/dia de LEDs**, disputando energia com painéis sujos de poeira marciana (τ=${nasaData.meda.dustOpacityTau})!`;
    }
    return `Ciência real no Sol 4: durante ventos de poeira na **Cratera Jezero**, radares e sincronização orbital são essenciais para pouso seguro!`;
  }

  if (topic === 'physics') {
    const solPhysics: Record<1 | 2 | 3 | 4, string> = {
      1: `Por que 28 minutos de espera? Ondas de rádio viajam a 300.000 km/s, mas Marte está tão longe que 14 min vão e 14 min voltam! Seu menor sistema agora é **${lowestMeta.label} (${lowest.value}%)**.`,
      2: `Por que a tempestade solar preocupa? Sem magnetosfera em Marte, prótons solares atingem a base! Escudos ativos gastam muita Energia, enquanto água e inclinação de painéis protegem de outra forma.`,
      3: `Por que energia vs. plantas? LEDs por 16h/dia consomem bastante eletricidade para manter a fotossíntese, mas poeira sobre os painéis reduz o carregamento solar.`,
      4: `Por que pouso na poeira é difícil? Radares enxergam através da poeira gastando Energia/Escudo; pousos lentos protegem o casco mas consomem mais oxigênio e água!`,
    };
    return solPhysics[currentSol];
  }

  // Intelligent custom catch-all that echoes user input + shares NASA fact + pun
  return `Quack-interessante você falar sobre "${userQuestion.trim().slice(0, 36)}"! 🦆 Pelo meu radar espacial, seu medidor mais sensível agora é **${lowestMeta.label} (${lowest.value}%)**. Curiosidade da NASA: em Marte a gravidade é só 38% da Terra — você pularia quase 3 vezes mais alto por lá!`;
}

export const QuackChatWidget: React.FC<QuackChatWidgetProps> = ({
  screen,
  currentSol,
  ageProfile,
  resources,
  expression,
  nasaData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const quickButtons = useMemo(() => {
    if (screen === 'command') {
      return [
        { id: 'status' as const, label: 'Qual barra está em perigo?' },
        { id: 'physics' as const, label: 'Por que isso acontece na física?' },
        { id: 'nasa' as const, label: 'Curiosidade real da NASA!' },
      ];
    }
    return [
      { id: 'status' as const, label: 'Dica para essa etapa!' },
      { id: 'physics' as const, label: 'Como funciona a física aqui?' },
      { id: 'nasa' as const, label: 'Quais dados da NASA são reais?' },
    ];
  }, [screen]);

  const greeting = useMemo(() => {
    if (ageProfile === 'explorers') {
      return 'Quack! 🦆 Pode tocar num botão ou me perguntar qualquer coisa sobre Marte, ETs e estrelas — sempre com um trocadilho de pato!';
    }
    if (ageProfile === 'strategists') {
      return 'Telemetria ativa! Pergunte sobre física, NASA, estrelas ou suas barras — prometo dar boas dicas sem dar spoiler da carta!';
    }
    return 'Assistente Pedagógico Quack: respondo perguntas abertas sobre ciência espacial (DONKI, OSDR, MEDA), diagnostico as barras e estimulo o pensamento crítico.';
  }, [ageProfile]);

  const handleAsk = (topic: 'status' | 'physics' | 'nasa' | 'custom', labelText: string) => {
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
        nasaData
      );
      setMessages((prev) => [
        ...prev.slice(-8),
        { id: `${Date.now()}-q`, sender: 'quack', text: reply },
      ]);
      setIsThinking(false);
    }, 280);
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
              Dicas &amp; Ciência NASA
            </p>
          </div>
          <MessageCircle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
        </button>
      ) : (
        <div className="w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#162038] px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <QuackMascot expression={expression} size={38} />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Comandante Quack
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Tutor Espacial Interativo
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
                Quack está consultando os sensores da NASA...
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
                placeholder="Pergunte sobre Marte, ETs, estrelas..."
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
