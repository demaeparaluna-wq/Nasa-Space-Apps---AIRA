import {
  AgeProfile,
  GlossaryTerm,
  HotspotInfo,
  InstrumentOption,
  OrbitOption,
  ResourceKey,
  RocketOption,
  SolScenario,
} from '../types/game';

export const BASE_CAPSULE_MASS_KG = 350;
export const HANGAR_BUDGET_M = 100;

export const AGE_PROFILES: {
  id: AgeProfile;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'explorers',
    label: 'Exploradores (7–9 anos)',
    shortLabel: '7–9 anos',
    description: 'Linguagem simples, analogias fofas e botões de 1 toque.',
  },
  {
    id: 'strategists',
    label: 'Estrategistas (10–12 anos)',
    shortLabel: '10–12 anos',
    description: 'Dados reais da NASA (-85°C, Classe X8.7, 14 min) e estratégia.',
  },
  {
    id: 'educators',
    label: 'Pais & Professores',
    shortLabel: 'Educadores',
    description: 'Contexto STEM, método científico e guia de debate escolar.',
  },
];

export const TEAM_ROLES = [
  { role: 'Líder de Missão', focus: 'Coordena a equipe e decide nos impasses.' },
  { role: 'Ciência', focus: 'Monitora Estufa Veggie, biofilmes e MEDA.' },
  { role: 'Comunicações', focus: 'Gerencia o atraso de 14 min e órbitas.' },
  { role: 'Sistemas', focus: 'Protege Energia, Escudo e dutos de água.' },
] as const;

export const SPACE_AVATARS: {
  id: 'astra' | 'orbita' | 'cometa';
  name: string;
  specialty: string;
  accentColor: string;
}[] = [
  {
    id: 'astra',
    name: 'Guardiã Astra',
    specialty: 'Botânica & Suporte de Vida',
    accentColor: '#10B981',
  },
  {
    id: 'orbita',
    name: 'Piloto Órbita',
    specialty: 'Trajetória & Escudos',
    accentColor: '#38BDF8',
  },
  {
    id: 'cometa',
    name: 'Engenheiro Cometa',
    specialty: 'Energia & Telemetria',
    accentColor: '#F59E0B',
  },
];

export const ROCKETS: RocketOption[] = [
  {
    id: 'light',
    name: 'Foguete Leve',
    costM: 35,
    maxMassKg: 1200,
    whatIsIt:
      'Veículo ágil que custa menos ($35M) e deixa dinheiro extra guardado para emergências na missão, mas carrega até 1.200 kg no total e tem fuselagem mais leve.',
    summary: 'Economiza verba ($25M+) e inicia com +5% Energia, mas limita carga pesada (-5% Escudo).',
    tradeoffNote: 'Não suporta Veggie + DONKI juntos (1.300 kg > 1.200 kg), mas garante reserva para o Sol 2.',
    startingDelta: { energy: 5, shield: -5 },
  },
  {
    id: 'heavy',
    name: 'Foguete Pesado',
    costM: 50,
    maxMassKg: 2200,
    whatIsIt:
      'Foguete reforçado que suporta até 2.200 kg (permite qualquer dupla de instrumentos), mas queima mais combustível no lançamento (-8% Energia) e reduz a verba livre.',
    summary: 'Leva qualquer dupla de instrumentos (+5% Escudo), mas consome mais combustível (-8% Energia).',
    tradeoffNote: 'Com Veggie + DONKI usa todos os $100M ($0M livre — sem bônus extra no Sol 2).',
    startingDelta: { shield: 5, energy: -8 },
  },
];

export const ORBITS: OrbitOption[] = [
  {
    id: 'high',
    name: 'Órbita Alta de Relé',
    whatIsIt:
      'Posiciona satélites bem longe da superfície de Marte para manter sinal de rádio estável com a Terra, mas com menos proteção natural contra radiação.',
    summary: 'Sinal de rádio mais forte com a Terra.',
    bonusLabel: '+15% Comunicações · -10% Escudo',
    delta: { comms: 15, shield: -10 },
  },
  {
    id: 'low',
    name: 'Órbita Baixa',
    whatIsIt:
      'Mantém a nave mais próxima do planeta e protegida pelo relevo e atmosfera tênue, mas reduz o tempo de janela para falar com a Terra.',
    summary: 'Maior proteção contra radiação solar.',
    bonusLabel: '+15% Escudo · -10% Comunicações',
    delta: { shield: 15, comms: -10 },
  },
];

export const INSTRUMENTS: InstrumentOption[] = [
  {
    id: 'veggie',
    name: 'Estufa Veggie OSDR OSD-120',
    shortName: 'Estufa Veggie',
    massKg: 450,
    costM: 25,
    scienceBonus: 40,
    whatIsIt:
      'Câmara real da NASA (estudo OSD-120) com LEDs ligados 16h/dia para cultivar alface Outredgeous, gerando oxigênio e alimento fresco.',
    nasaRef: 'NASA OSDR OSD-120 (Massa et al., 2017)',
    startingDelta: { lifeSupport: 15 },
  },
  {
    id: 'meda',
    name: 'Estação MEDA Perseverance',
    shortName: 'Estação MEDA',
    massKg: 350,
    costM: 15,
    scienceBonus: 35,
    whatIsIt:
      'Estação meteorológica do rover Perseverance que mede o frio noturno de -85°C, tempestades de poeira (τ=0,85) e atrasos de rádio de 14 min.',
    nasaRef: 'Mars 2020 Perseverance MEDA',
    startingDelta: { energy: 10, comms: 5 },
  },
  {
    id: 'donki',
    name: 'Escudo & Antena DONKI',
    shortName: 'Escudo DONKI',
    massKg: 500,
    costM: 25,
    scienceBonus: 25,
    whatIsIt:
      'Sensor espacial conectado ao sistema DONKI da NASA que detecta explosões solares (como a Classe X8.7) antes que atinjam a Base Ares.',
    nasaRef: 'NASA CCMC DONKI (/FLR)',
    startingDelta: { shield: 15 },
  },
];

export const RESOURCE_META: Record<
  ResourceKey,
  { label: string; unit: string; shortLabel: string; colorClass: string; barBg: string }
> = {
  energy: {
    label: 'Energia',
    shortLabel: 'Energia',
    unit: '%',
    colorClass: 'text-amber-400',
    barBg: 'bg-amber-400',
  },
  lifeSupport: {
    label: 'Suporte de Vida',
    shortLabel: 'Suporte',
    unit: '%',
    colorClass: 'text-emerald-400',
    barBg: 'bg-emerald-400',
  },
  shield: {
    label: 'Escudo',
    shortLabel: 'Escudo',
    unit: '%',
    colorClass: 'text-sky-400',
    barBg: 'bg-sky-400',
  },
  comms: {
    label: 'Comunicações',
    shortLabel: 'Rádio',
    unit: '%',
    colorClass: 'text-violet-400',
    barBg: 'bg-violet-400',
  },
};

export const SOL_SCENARIOS: SolScenario[] = [
  {
    sol: 1,
    title: 'Os Carrapatos nos Dutos & Silêncio de 14 Min',
    actLabel: 'Sol 1 · Terror & Mistério',
    quackExpression: 'terror',
    methodStep: 'Observação',
    quackQuoteByProfile: {
      explorers:
        '“Quack! Olha lá nos canos de água! Uns bichinhos pegajosos chamados biofilmes — nossos ‘Carrapatos ETs’ — estão entupindo tudo! Lá fora faz -85°C e o recado pra Terra demora 14 minutinhos!”',
      strategists:
        '“Quack! Não olhe para trás... Biofilmes extremófilos (‘Carrapatos ETs’ — NASA OSDR) estão sugando energia e entupindo os dutos! Lá fora faz -85°C (MEDA) e o sinal leva 14 min só de ida (28 min ida e volta)!”',
      educators:
        '“Alerta de engenharia biológica: biofilmes espaciais (estudados na ISS via NASA OSDR) obstruem filtros de água enquanto a noite marciana atinge -85°C e a latência Terra-Marte impõe 28 min de espera por resposta.”',
    },
    nasaContextFact: 'Mars MEDA: -85°C noturno · 14 min só ida (28 min ida/volta) · NASA OSDR Biofilmes',
    badge: {
      id: 'biofilm',
      title: 'Caçador de Biofilmes',
      subtitle: 'Desobstruiu os dutos de água sob atraso de comunicação',
      nasaConnection: 'Baseado em Zea et al. (ISS Biofilms) e Mars 2020 MEDA',
    },
    easterEggLabel: 'ET curioso espia e pisca pela escotilha',
    cards: [
      {
        id: 'A',
        category: 'Recuperação',
        title: 'Agir Sozinho — Purga Térmica',
        summaryByProfile: {
          explorers: 'Aquecer os canos agora mesmo sem esperar a Terra responder.',
          strategists:
            'Executa purga térmica imediata nos dutos sem aguardar os 28 min de rádio.',
          educators:
            'Autonomia local: utiliza calor residual para romper biofilmes, sacrificando margem de escudo e rádio EVA.',
        },
        effects: { lifeSupport: 20, energy: 15, comms: -20, shield: -15 },
        scienceExplanationByProfile: {
          explorers:
            'Você esquentou a água rapidinho! Os ‘Carrapatos ETs’ soltaram dos canos, mas o rádio ficou cansado.',
          strategists:
            'O choque térmico rompeu a matriz do biofilme sem depender do atraso de 28 min até a Terra, consumindo reserva do escudo.',
          educators:
            'Decisão autônoma validada pelo Método Científico: frente à latência de 28 min, a ação local evitou o bloqueio total do sistema hídrico.',
        },
      },
      {
        id: 'B',
        category: 'Contenção',
        title: 'Esperar Comando da Terra',
        summaryByProfile: {
          explorers: 'Mandar um pedido de ajuda e esperar 28 minutos pela resposta da Terra.',
          strategists:
            'Preserva suprimentos EVA e aguarda instruções (bônus se estiver em Órbita Alta).',
          educators:
            'Protocolo conservador: mantém integridade de comunicações, mas permite drenagem energética contínua durante o delay orbital.',
        },
        effects: { comms: 15, shield: 10, energy: -30 },
        bonusNote: '+10% Comunicações extra se escolheu Órbita Alta!',
        scienceExplanationByProfile: {
          explorers:
            'A Terra respondeu direitinho, mas enquanto a mensagem viajava pelo espaço, as baterias gastaram bastante energia!',
          strategists:
            'A distância Marte-Terra (225 milhões de km em média) impõe 14 min só de ida no sinal de luz, drenando energia durante a espera.',
          educators:
            'Ilustra o impacto físico da velocidade finita da luz na telemetria espacial: sistemas autônomos são vitais quando a latência é alta.',
        },
      },
      {
        id: 'C',
        category: 'Engenharia Híbrida',
        title: 'Filtro UV Local',
        summaryByProfile: {
          explorers: 'Usar uma luz especial (UV) nos canos para limpar devagar e com equilíbrio.',
          strategists:
            'Ativa esterilização ultravioleta nos dutos equilibrando consumo de energia e rádio.',
          educators:
            'Solução híbrida de baixo pico de carga: aplica radiação UV-C nos condutos para conter biofilmes com impacto distribuído.',
        },
        effects: { lifeSupport: 12, energy: -12, comms: -10 },
        scienceExplanationByProfile: {
          explorers:
            'A luz mágica UV impediu os bichinhos de crescerem sem gastar muita bateria!',
          strategists:
            'Luz UV-C reduz a adesão bacteriana (como nos testes da ISS) mantendo os 4 sistemas equilibrados.',
          educators:
            'Excelente compromisso sistêmico: a desinfecção UV contínua evita picos térmicos e preserva a resiliência da base.',
        },
      },
    ],
  },
  {
    sol: 2,
    title: 'Corte de Orçamento & Tempestade Solar',
    actLabel: 'Sol 2 · Drama Mexicano',
    quackExpression: 'drama',
    methodStep: 'Hipótese',
    earthTransmission:
      'Terra: “¡Ay, caramba, Base Ares! O comitê congelou a verba e cancelou peças extras!”',
    quackQuoteByProfile: {
      explorers:
        '“Pelas minhas penas! A Terra ficou sem dinheiro pra mandar peças e uma super onda do Sol está chegando bem aqui!”',
      strategists:
        '“Pelas minhas penas! Sem peças extras e uma explosão solar Classe X8.7 (NASA DONKI) vindo direto para Marte!”',
      educators:
        '“Crise dupla: restrição orçamentária logística combinada a uma ejeção solar real Classe X8.7 registrada no catálogo NASA DONKI.”',
    },
    nasaContextFact: 'NASA DONKI: Explosão Solar Real (Classe X8.7) · Sem peças sobressalentes',
    badge: {
      id: 'solar',
      title: 'Guardião das Tempestades Solares',
      subtitle: 'Protegeu a Base Ares da explosão solar sem peças extras',
      nasaConnection: 'Monitoramento real de clima espacial via NASA CCMC DONKI',
    },
    easterEggLabel: 'Disco voador cruza a janela orbital',
    cards: [
      {
        id: 'A',
        category: 'Recuperação',
        title: 'Escudo Magnético Máximo',
        summaryByProfile: {
          explorers: 'Ligar o super escudo na força máxima para rebater os raios do Sol!',
          strategists:
            'Eleva o campo defletor contra partículas solares Classe X8.7 com alto custo elétrico.',
          educators:
            'Prioriza blindagem eletromagnética ativa (+25% Escudo) à custa de drenagem severa das baterias (-35% Energia).',
        },
        effects: { shield: 25, energy: -35 },
        scienceExplanationByProfile: {
          explorers:
            'O escudo brilhou forte e bloqueou o Sol bravo, mas as baterias quase dormiram!',
          strategists:
            'Como Marte não tem campo magnético global como a Terra, gerar proteção artificial exige altíssima potência elétrica.',
          educators:
            'Demonstra a ausência de magnetosfera protetora em Marte e o custo energético da blindagem ativa contra prótons solares.',
        },
      },
      {
        id: 'B',
        category: 'Contenção',
        title: 'Abrigo de Água & Modo Econômico',
        summaryByProfile: {
          explorers: 'Todo mundo se esconde atrás dos tanques de água e desliga as luzes!',
          strategists:
            'Usa água como barreira contra radiação e poupa energia (bônus se economizou verba no Hangar!).',
          educators:
            'Blindagem passiva com hidrogênio da água e corte de carga elétrica (bônus se houve economia de orçamento no Hangar).',
        },
        effects: { energy: 15, lifeSupport: -30 },
        bonusNote: '+10% Energia bônus se poupou orçamento no Hangar!',
        scienceExplanationByProfile: {
          explorers:
            'Sabia que a água segura a radiação igual um cobertor pesado? Economizou energia, mas o ar ficou apertado!',
          strategists:
            'Átomos de hidrogênio na água absorvem radiação cósmica (técnica real da NASA!), mas desligar sistemas reduz o Suporte de Vida.',
          educators:
            'Conceito real de blindagem passiva por materiais ricos em hidrogênio (H₂O) e gestão de reserva orçamentária pré-lançamento.',
        },
      },
      {
        id: 'C',
        category: 'Engenharia Híbrida',
        title: 'Reorientar Painéis',
        summaryByProfile: {
          explorers: 'Virar os painéis de ladinho para não queimar com a tempestade do Sol.',
          strategists:
            'Inclina os painéis solares para reduzir dano de radiação sem desligar o habitat.',
          educators:
            'Mitigação geométrica: reduz seção transversal exposta às partículas energéticas preservando parcialmente a geração.',
        },
        effects: { shield: 15, energy: -15, lifeSupport: -10 },
        scienceExplanationByProfile: {
          explorers:
            'Virando os painéis de ladinho, a tempestade passou sem quebrar nada importante!',
          strategists:
            'Alterar o ângulo de incidência protege as células fotovoltaicas contra degradação por partículas da explosão X8.7.',
          educators:
            'Engenharia de compromisso equilibrada: protege ativos críticos reduzindo área exposta com menor penalidade sistêmica.',
        },
      },
    ],
  },
  {
    sol: 3,
    title: 'Turbulência em Microgravidade & Estufa no Escuro',
    actLabel: 'Sol 3 · Comédia & Caos',
    quackExpression: 'dizzy',
    methodStep: 'Experimento',
    requiresMinigame: true,
    quackQuoteByProfile: {
      explorers:
        '“Quack-ai! Parecia que estávamos dançando mambo num furacão! Tudo saiu voando e a Estufa Veggie apagou! Me ajuda a pegar as 3 ferramentas flutuando!”',
      strategists:
        '“Quack-ai! Parecia que estávamos dançando mambo num furacão! Tudo voou e a Estufa Veggie (16h LED — OSDR OSD-120) ficou no escuro! Clique nas 3 ferramentas flutuando!”',
      educators:
        '“Instabilidade mecânica e apagão na câmara botânica Veggie (fotoperíodo de 16h LED, estudo OSDR OSD-120). Estabilize os 3 instrumentos flutuantes antes de decidir.”',
    },
    nasaContextFact: 'NASA OSDR OSD-120: Alface Outredgeous · 16h/dia de luz LED + Poeira τ=0,85',
    badge: {
      id: 'botanist',
      title: 'Botânico Espacial',
      subtitle: 'Estabilizou a cabine e salvou o ciclo fotossintético Veggie',
      nasaConnection: 'Validação de hardware Veggie na ISS (Massa et al., 2017)',
    },
    easterEggLabel: 'OVNI abduz uma vaquinha espacial sorridente',
    cards: [
      {
        id: 'A',
        category: 'Recuperação',
        title: 'Salvar Colheita Veggie',
        summaryByProfile: {
          explorers: 'Ligar todas as luzes coloridas das alfaces por 16 horas para elas respirarem!',
          strategists:
            'Fornece as 16h/dia de LEDs (OSD-120) para salvar o oxigênio da alface Outredgeous.',
          educators:
            'Mantém o fotoperíodo completo de 16h LED para fotossíntese e O₂, exigindo alto consumo das baterias.',
        },
        effects: { lifeSupport: 25, energy: -30 },
        scienceExplanationByProfile: {
          explorers:
            'As alfaces ficaram verdinhas e deram bastante ar fresco, mas usaram muita energia das tomadas!',
          strategists:
            'Na ISS, a alface Outredgeous precisa de LEDs vermelho, azul e verde por 16h/dia para crescer saudável e apoiar o bem-estar da tripulação.',
          educators:
            'Reproduz os parâmetros experimentais reais do sistema Veggie (OSDR OSD-120) e seu peso no balanço energético do habitat.',
        },
      },
      {
        id: 'B',
        category: 'Contenção',
        title: 'Limpar Poeira dos Painéis',
        summaryByProfile: {
          explorers: 'Sair rapidinho com o espanador espacial para tirar a poeira vermelha do sol!',
          strategists:
            'Remove poeira marciana (opacidade τ=0,85) dos painéis solares recuperando +30% Energia.',
          educators:
            'Recupera eficiência fotovoltaica reduzida pela poeira fina (MEDA τ=0,85), pausando temporariamente a estufa.',
        },
        effects: { energy: 30, lifeSupport: -25 },
        scienceExplanationByProfile: {
          explorers:
            'Sem poeira em cima dos painéis, o Sol voltou a carregar as baterias rapidinho!',
          strategists:
            'A poeira de Marte (medida pelo instrumento MEDA) bloqueia a luz solar nos painéis; limpá-los restaura a geração elétrica.',
          educators:
            'Evidencia o impacto da opacidade atmosférica (τ=0,85) na geração solar em Marte, como observado nas missões Spirit, Opportunity e InSight.',
        },
      },
      {
        id: 'C',
        category: 'Engenharia Híbrida',
        title: 'Ciclo LED Pulsado',
        summaryByProfile: {
          explorers: 'Piscar as luzes das plantas bem rápido para economizar bateria e cuidar da estufa.',
          strategists:
            'Alterna pulsos de LED na Estufa Veggie para manter oxigênio com menos gasto de energia.',
          educators:
            'Modulação por largura de pulso (PWM) nos LEDs da estufa: preserva fotossíntese com menor demanda instantânea.',
        },
        effects: { lifeSupport: 14, energy: -12, shield: -10 },
        scienceExplanationByProfile: {
          explorers:
            'Piscando no ritmo certinho, as plantas nem perceberam e a energia não acabou!',
          strategists:
            'LEDs pulsados otimizam a absorção de fótons pelas folhas reduzindo o calor e o gasto elétrico.',
          educators:
            'Solução de engenharia eficiente: otimiza a relação fótons/Watt mantendo a estufa operacional durante escassez.',
        },
      },
    ],
  },
  {
    sol: 4,
    title: 'Reencontro na Janela Orbital & Pouso Final',
    actLabel: 'Sol 4 · Esperança & Triunfo',
    quackExpression: 'celebrate',
    methodStep: 'Conclusão',
    earthTransmission:
      'Terra: “Vocês enfrentaram biofilmes, cortes de verba e tempestades sem desistir. A nave de resgate entrou na janela orbital!”',
    quackQuoteByProfile: {
      explorers:
        '“Uhuul! A nave amiga chegou lá no céu de Marte! Vamos ajustar os últimos botões com cuidado para pousar e voltar pra casa!”',
      strategists:
        '“Ajuste os últimos recursos na tempestade de poeira final e guie a nave de resgate até a Base Ares!”',
      educators:
        '“Fase de conclusão da missão: acoplamento e pouso final sob baixa visibilidade por ventos de poeira na Cratera Jezero.”',
    },
    nasaContextFact: 'Janela Orbital Terra-Marte · Ventos de poeira na Cratera Jezero',
    badge: {
      id: 'commander',
      title: 'Comandante de Marte',
      subtitle: 'Completou os 4 Sols da Base Ares com espírito científico',
      nasaConnection: 'Integração completa: DONKI + OSDR + MEDA + APOD',
    },
    easterEggLabel: 'ET simpático acena a bandeira da Base Ares',
    cards: [
      {
        id: 'A',
        category: 'Recuperação',
        title: 'Farol & Radar Máximo',
        summaryByProfile: {
          explorers: 'Acender todos os holofotes e buzinas espaciais para a nave amiga nos achar!',
          strategists:
            'Liga farol óptico e radar de alta potência na poeira, reforçando Rádio e Suporte.',
          educators:
            'Maximiza razão sinal-ruído na aproximação final (+20% Comunicações, +15% Suporte), sobrecarregando escudo e energia.',
        },
        effects: { lifeSupport: 15, comms: 20, shield: -25, energy: -15 },
        scienceExplanationByProfile: {
          explorers:
            'A nave viu nossas luzes brilhando na poeira e conseguiu se aproximar bem rápido!',
          strategists:
            'Sinais de radar penetram nuvens de poeira melhor que câmeras comuns, guiando o pouso de precisão.',
          educators:
            'Aplica sensoriamento ativo por radar para navegação em condições de baixa visibilidade atmosférica.',
        },
      },
      {
        id: 'B',
        category: 'Contenção',
        title: 'Pouso Lento Guiado por Telemetria',
        summaryByProfile: {
          explorers: 'Descer bem devagarinho seguindo os mapas do computador para não bater.',
          strategists:
            'Protege o escudo durante a entrada atmosférica, exigindo mais tempo de suporte de vida.',
          educators:
            'Trajetória conservadora preserva integridade estrutural (+15% Escudo) à custa de maior tempo de consumo vital.',
        },
        effects: { shield: 15, lifeSupport: -25, energy: -15 },
        scienceExplanationByProfile: {
          explorers:
            'Descer devagar deixou o casco bem seguro, mas gastou mais ar esperando!',
          strategists:
            'Entradas suaves reduzem o estresse térmico e mecânico no escudo térmico da nave.',
          educators:
            'Demonstra o compromisso clássico entre carga térmica de reentrada (escudo) e duração de missão (consumíveis).',
        },
      },
      {
        id: 'C',
        category: 'Engenharia Híbrida',
        title: 'Aproximação em Órbita',
        summaryByProfile: {
          explorers: 'Fazer uma curva elegante no espaço até a poeira baixar antes de pousar!',
          strategists:
            'Sincroniza a órbita de encontro com a nave de resgate mantendo equilíbrio de sistemas.',
          educators:
            'Manobra orbital de espera (phasing): melhora o enlace de comunicações (+15%) com custo moderado em energia e escudo.',
        },
        effects: { comms: 15, energy: -12, shield: -12 },
        scienceExplanationByProfile: {
          explorers:
            'A curva espacial foi perfeita! A nave chegou certinho na Base Ares!',
          strategists:
            'Alinhar janelas orbitais reduz erros de pouso e garante contato contínuo com o controle da missão.',
          educators:
            'Conclusão elegante: a sincronização orbital minimiza riscos térmicos e maximiza a janela de telemetria.',
        },
      },
    ],
  },
];

export const BASE_HOTSPOTS: HotspotInfo[] = [
  {
    id: 'veggie',
    label: 'Estufa Veggie',
    shortTag: '🔍 Estufa Veggie',
    relatedResource: 'lifeSupport',
    nasaDataset: 'NASA OSDR OSD-120 · LEDs 16h/dia',
    summaryByProfile: {
      explorers:
        'Aqui crescem alfaces espaciais sob luzes roxas e azuis por 16 horas, fabricando oxigênio para a tripulação!',
      strategists:
        'Experimento Veggie (OSDR OSD-120): cultiva alface Outredgeous com 16h/dia de LED para produzir alimento e O₂.',
      educators:
        'Sistema biorregenerativo Veggie (Massa et al., 2017): estuda fotoperíodo, microgravidade e segurança alimentar espacial.',
    },
  },
  {
    id: 'pipes',
    label: 'Dutos & Água',
    shortTag: '🔍 Dutos & Água',
    relatedResource: 'lifeSupport',
    nasaDataset: 'NASA OSDR Biofilmes (Zea et al.)',
    summaryByProfile: {
      explorers:
        'Canos que reciclam toda a água da base! É aqui que os ‘Carrapatos ETs’ (biofilmes) tentam se esconder.',
      strategists:
        'Sistema fechado de água: bactérias formam biofilmes espessos em microgravidade e podem entupir filtros.',
      educators:
        'Baseado em Zea et al. (2018/2020): biofilmes espaciais exibem maior espessura e resistência em sistemas de reciclagem hídrica.',
    },
  },
  {
    id: 'solar',
    label: 'Painéis Solares',
    shortTag: '🔍 Painéis Solares',
    relatedResource: 'energy',
    nasaDataset: 'Mars 2020 MEDA · Poeira τ=0,85 & -85°C',
    summaryByProfile: {
      explorers:
        'As asas brilhantes da base! Elas bebem luz do Sol para carregar tudo, mesmo no frio de -85°C!',
      strategists:
        'Geração fotovoltaica marciana: sofre redução com tempestades de poeira (τ=0,85) e exige aquecimento a -85°C.',
      educators:
        'Dados MEDA (Rodriguez-Manfredi et al., 2021): variabilidade diurna térmica (-85°C) e atenuação solar por aerossóis.',
    },
  },
  {
    id: 'antenna',
    label: 'Antena Relé',
    shortTag: '🔍 Antena Relé',
    relatedResource: 'comms',
    nasaDataset: 'NASA DONKI + Atraso de 14 min',
    summaryByProfile: {
      explorers:
        'Orelhão gigante que conversa com a Terra! Como Marte fica bem longe, cada recado demora 14 minutinhos para chegar.',
      strategists:
        'Antena de espaço profundo: o sinal viaja à velocidade da luz por 14 min só de ida e monitora explosões solares DONKI.',
      educators:
        'Enlace Terra-Marte (Deep Space Network) + telemetria de clima espacial CCMC DONKI para alertas de ejeções de massa coronal.',
    },
  },
];

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  jezero: {
    key: 'jezero',
    term: 'Cratera Jezero',
    nasaSource: 'Mars 2020 Perseverance',
    definitionByProfile: {
      explorers: 'Um buraco gigante em Marte onde existiu um lago antigo e onde pousou o robô Perseverance!',
      strategists: 'Cratera de 45 km em Marte com um antigo delta de rio, local real de pouso do rover Perseverance.',
      educators: 'Bacia lacustre noachiana de 45 km investigada pela missão Mars 2020 por sua preservação de minerais argilosos.',
    },
  },
  biofilmes: {
    key: 'biofilmes',
    term: 'Biofilmes',
    nasaSource: 'NASA OSDR (Zea et al.)',
    definitionByProfile: {
      explorers: 'Grupinhos de micróbios que grudam nos canos como uma gelatina — nossos ‘Carrapatos ETs’!',
      strategists: 'Comunidades de micróbios protegidas por uma camada pegajosa que cresce nos dutos de água da estação espacial.',
      educators: 'Agregados microbianos aderidos a superfícies úmidas em matriz polimérica extracelular estudados na ISS (Zea et al.).',
    },
  },
  x87: {
    key: 'x87',
    term: 'Classe X8.7',
    nasaSource: 'NASA CCMC DONKI',
    definitionByProfile: {
      explorers: 'Um espirro gigantesco do Sol cheio de energia que pode bagunçar os rádios espaciais!',
      strategists: 'Explosão solar de categoria X (a mais forte da escala), registrada pela NASA em maio de 2024.',
      educators: 'Fulguração solar extrema de classe X8.7 (pico de fluxo de raios-X > 8,7×10⁻⁴ W/m²) monitorada pela rede DONKI.',
    },
  },
  meda: {
    key: 'meda',
    term: 'MEDA (-85°C / τ=0,85)',
    nasaSource: 'Rodriguez-Manfredi et al., 2021',
    definitionByProfile: {
      explorers: 'A estação do tempo do robô em Marte que mede o frio congelante e a quantidade de poeira no ar!',
      strategists: 'Conjunto de sensores do Perseverance que mede vento, poeira (τ=0,85) e noites de -85°C na Cratera Jezero.',
      educators: 'Mars Environmental Dynamics Analyzer: caracteriza radiação, pressão, temperatura e opacidade óptica de poeira.',
    },
  },
  veggie: {
    key: 'veggie',
    term: 'Estufa Veggie (16h LED)',
    nasaSource: 'NASA OSDR OSD-120',
    definitionByProfile: {
      explorers: 'Uma hortinha espacial com luzes coloridas ligadas 16 horas por dia para criar alface no espaço!',
      strategists: 'Câmara de cultivo da NASA que usa LEDs por 16h/dia para cultivar alface Outredgeous sem solo tradicional.',
      educators: 'Unidade botânica espacial validada na ISS (Massa et al., 2017) com iluminação espectral controlada.',
    },
  },
  kapton: {
    key: 'kapton',
    term: 'Fita Kapton',
    nasaSource: 'Engenharia Aeroespacial NASA',
    definitionByProfile: {
      explorers: 'Uma fita dourada super resistente que aguenta muito calor e muito frio no espaço!',
      strategists: 'Filme isolante dourado (poliimida) usado em naves da NASA para proteger cabos de -269°C a +400°C.',
      educators: 'Poliimida termoestável usada em mantas MLI (Multi-Layer Insulation) e reparos térmicos em espaçonaves.',
    },
  },
};

export const CLASSROOM_DEBATE_QUESTIONS = [
  {
    number: '01',
    question:
      'Por que o atraso de 14 minutos no sinal de rádio muda a forma como engenheiros projetam robôs e bases em Marte?',
    concept: 'Velocidade da luz, latência de 28 min (ida e volta) e autonomia de sistemas.',
  },
  {
    number: '02',
    question:
      'No Hangar, por que não podemos colocar o foguete mais pesado e todos os instrumentos sem estourar massa ou orçamento?',
    concept: 'Equação de foguetes (massa × empuxo) e restrições reais de orçamento em missões NASA.',
  },
  {
    number: '03',
    question:
      'Como água potável (blindagem contra radiação) e alfaces (Estufa Veggie OSDR) resolvem dois problemas de sobrevivência ao mesmo tempo?',
    concept: 'Sistemas regenerativos e dupla função de recursos em habitats fechados.',
  },
];

export const TECHNICAL_LINEAGE_ROWS = [
  {
    api: 'CCMC DONKI (/FLR)',
    parameter: 'Explosão Solar (Classe M/X)',
    fallback: 'Evento Classe X8.7 (2024-05-14)',
    impact: 'Severidade da radiação e escudo no Sol 2',
  },
  {
    api: 'NASA OSDR (OSD-120)',
    parameter: '16h/dia LEDs Veggie + Biofilme',
    fallback: 'Alface Outredgeous / Zea et al.',
    impact: 'Biofilmes no Sol 1 e Estufa no Sol 3',
  },
  {
    api: 'Mars 2020 MEDA',
    parameter: '-85°C, poeira τ=0,85 e 14 min rádio',
    fallback: 'Cratera Jezero (Perseverance)',
    impact: 'Autonomia térmica e atraso no Sol 1',
  },
  {
    api: 'NASA APOD (API Key)',
    parameter: 'Foto Astronômica do Dia',
    fallback: 'Cratera Jezero Orbital (PIA24428)',
    impact: 'Lembrança espacial ao vivo na Tela 5',
  },
];

export const PEER_REVIEWED_REFERENCES = [
  {
    authors: 'Zea, L. et al. (2018 / 2020)',
    title: 'Spaceflight-Associated Biofilm Formation in Spacecraft Water Systems (ISS)',
    relevance: 'Base científica para o desafio dos biofilmes (“Carrapatos ETs”) nos dutos do Sol 1.',
  },
  {
    authors: 'Massa, G. D. et al. (2017)',
    title: 'VEG-01: Veggie Hardware Validation on the International Space Station',
    relevance: 'Parâmetro real de 16h/dia de LEDs para cultivo de alface Outredgeous no Sol 3.',
  },
  {
    authors: 'Rodriguez-Manfredi, J. A. et al. (2021)',
    title: 'The Mars Environmental Dynamics Analyzer, MEDA (Mars 2020)',
    relevance: 'Dados de temperatura noturna (-85°C), opacidade de poeira (τ=0,85) e telemetria.',
  },
];
