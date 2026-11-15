import { AgeProfile, InstrumentId, Language, OrbitId, RocketId } from '../types/game';

export interface ProfileToneCopy {
  prologue: {
    eyebrow: string;
    quackCallBeforeJezero: string;
    quackCallAfterJezero: string;
    crewSubtitle: string;
    howToStep1: string;
    howToStep2: string;
    howToStep3: string;
  };
  hangar: {
    subtitle: string;
    boosterTitle: string;
    boosterBody: string;
    inspectPlaceholder: string;
    missingTitle: string;
    physicsLockTitle: string;
    overMassDetail: (rocketName: string) => string;
    overBudgetDetail: string;
    rockets: Record<RocketId, { summary: string; whatIsIt: string; tradeoffNote: string }>;
    orbits: Record<OrbitId, { summary: string; whatIsIt: string }>;
    instruments: Record<InstrumentId, { whatIsIt: string }>;
  };
  command: {
    dangerAlert: string;
    reserveBonus: (saved: number) => string;
    reserveEmpty: string;
    reservePartial: (saved: number) => string;
    workshopTitle: string;
    workshopSubtitle: (found: number) => string;
    helpPromptTitle: string;
    helpEncouragement: string;
    helpBody: string;
    chooseActionTitle: string;
    chooseActionWarning: string;
    earthTransmissionBySol: Partial<Record<1 | 2 | 3 | 4, string>>;
  };
  modal: {
    failureTag: (sol: number) => string;
    failureIntro: string;
    closeCallPrefix: string;
    closeCallSuffix: string;
    scienceHeading: string;
  };
  victory: {
    missionCompleteTag: string;
    headline: string;
    quackSpeech: string;
    crowdNote: string;
    goldSummary: string;
    heroicSummary: string;
    survivorSummary: string;
    notGoldHeading: string;
    notGoldHeavyTip: string;
    notGoldGeneralTip: string;
    shareClosing: string;
  };
}

const TONE_COPY_PT: Record<AgeProfile, ProfileToneCopy> = {
  explorers: {
    prologue: {
      eyebrow: 'Chamado Espacial de Socorro!',
      quackCallBeforeJezero:
        '“Quack! Alô, amigos da Terra?! Aqui é o Comandante Quack na',
      quackCallAfterJezero:
        '— a casa do robô Perseverance em Marte! O frio lá fora vai chegar a -85°C, os computadores estão piscando e uns bichinhos pegajosos entupiram nossos canos de água! Montem uma nave de resgate bem rápido pra salvar a Base Ares!”',
      crewSubtitle:
        'Escolha seu nome, seu astronauta e o jeito de contar a história antes de entrar no Hangar.',
      howToStep1:
        'Monte o foguete com $100M, escolha o caminho no espaço (órbita) e 2 ferramentas legais sem deixar pesado demais!',
      howToStep2:
        'Em cada Sol (dia em Marte), pense com carinho: nenhuma barrinha pode chegar a 0% ou a base desliga!',
      howToStep3:
        'Termine os 4 dias com todas as 4 barras em 35% ou mais para ganhar o Troféu Ouro e dançar Mambo com a turma!',
    },
    hangar: {
      subtitle: 'Monte seu super-foguete de resgate para voar da Terra até Marte!',
      boosterTitle: 'Mochila de Ferramentas da Nave:',
      boosterBody:
        'Os 2 equipamentos que você escolher (Estufa Veggie, Estação MEDA ou Escudo DONKI) vão viajar dentro do foguete para deixar a Base Ares muito mais forte logo no começo!',
      inspectPlaceholder:
        'Toque ou passe o mouse nos quadradinhos acima para descobrir o que cada peça faz na aventura.',
      missingTitle: 'Falta escolher peças do foguete!',
      physicsLockTitle: 'Ops! A física espacial segurou a decolagem!',
      overMassDetail: (rocketName) =>
        `O ${rocketName} é levinho e não consegue erguer Estufa Veggie (450 kg) + Escudo DONKI (500 kg) + cápsula (350 kg = 1.300 kg). Troque um item pela Estação MEDA (350 kg) ou use o Foguete Pesado!`,
      overBudgetDetail:
        'Passou do cofrinho de $100M! Troque para o Foguete Leve ($35M) ou leve a Estação MEDA ($15M) para sobrar dinheiro.',
      rockets: {
        light: {
          summary: 'Gasta menos ($35M) e dá +5% de Energia, mas leva menos peso (-5% Escudo).',
          whatIsIt:
            'Um foguete rapidinho e econômico! Ele guarda dinheiro no cofrinho para o Sol 2, mas não consegue carregar as duas peças mais pesadas juntas.',
          tradeoffNote: 'Não ergue Veggie + DONKI juntos (passa de 1.200 kg), mas garante bônus no Sol 2!',
        },
        heavy: {
          summary: 'Aguenta qualquer dupla pesada (+5% Escudo), mas gasta mais bateria (-8% Energia).',
          whatIsIt:
            'Um foguetão super forte que leva até 2.200 kg! Como é bem grande, queima mais combustível na partida e deixa menos dinheiro sobrando.',
          tradeoffNote: 'Com Veggie + DONKI gasta todo o cofrinho ($0M livre no Sol 2).',
        },
      },
      orbits: {
        high: {
          summary: 'Sinal de rádio fortão para conversar com a Terra.',
          whatIsIt:
            'O satélite fica bem alto em Marte para mandar mensagens bem claras para a Terra, mas pega um pouquinho mais de vento do Sol.',
        },
        low: {
          summary: 'Escudo natural bem perto do planeta Marte.',
          whatIsIt:
            'A nave voa pertinho de Marte e usa o planeta como abrigo contra raios do Sol, mas tem janelas menores para falar no rádio.',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'Uma hortinha espacial com luzes coloridas ligadas 16h por dia para plantar alface gostosa e fazer ar fresco!',
        },
        meda: {
          whatIsIt:
            'A estação de clima do robô Perseverance que avisa quando vai fazer -85°C de frio e poeira vermelha no ar!',
        },
        donki: {
          whatIsIt:
            'Um radar mágico da NASA que enxerga tempestades gigantes do Sol antes delas chegarem em Marte!',
        },
      },
    },
    command: {
      dangerAlert:
        'Ai, quack! Uma barrinha caiu abaixo de 35%! Cuide dela logo para não chegar a 0%!',
      reserveBonus: (saved) =>
        `💰 Cofrinho cheio: sobrou $${saved}M no Hangar — a Carta B ganha +10% de Energia extra!`,
      reserveEmpty:
        '⚠️ Cofrinho vazio ($0M livres) — a Carta B não ganha energia bônus hoje.',
      reservePartial: (saved) =>
        `💡 Sobrou $${saved}M no cofrinho (precisava de $15M+ para ganhar energia extra na Carta B).`,
      workshopTitle: 'Oficina Flutuante: Ache as 3 Ferramentas Escondidas!',
      workshopSubtitle: (found) =>
        `Tudo saiu voando sem gravidade! Clique nas 3 ferramentas escondidas na oficina (${found}/3).`,
      helpPromptTitle: 'Chamar o Robô de Busca (-8% Suporte de Vida)?',
      helpEncouragement:
        'Na vida e no espaço, pedir ajuda quando a gente precisa é sinal de coragem! Até os astronautas da NASA trabalham em time.',
      helpBody:
        'Se você aceitar a ajuda, os drones ligam uma lanterna brilhante mostrando onde estão as 3 ferramentas, usando -8% de Suporte de Vida. Quer usar a lanterna ou procurar mais um pouquinho?',
      chooseActionTitle: 'Escolha 1 Plano para Ajudar o Comandante Quack',
      chooseActionWarning: 'Olho nas barrinhas: escolhas muito arriscadas podem zerar a base!',
      earthTransmissionBySol: {
        2: 'Terra: “¡Ay, caramba, Base Ares! Acabou a verba para mandar peças extras agora!”',
        4: 'Terra: “Vocês foram incríveis contra bichinhos dos canos e tempestades! A nave de resgate chegou!”',
      },
    },
    modal: {
      failureTag: (sol) => `Alerta Vermelho · Fim do Sol ${sol}`,
      failureIntro:
        'O que houve? Uma das barrinhas chegou a 0%! Mas não tem problema: na NASA a gente descobre o motivo e tenta de novo!',
      closeCallPrefix: 'Ufa, foi por um fio!',
      closeCallSuffix:
        'ficou abaixo de 35% por causa da troca desta carta. Vamos recuperar no próximo dia!',
      scienceHeading: 'O que a ciência da NASA nos ensina com isso?',
    },
    victory: {
      missionCompleteTag: 'MISSÃO COMPLETA: SALVAMOS O COMANDANTE QUACK! 🚀🦆',
      headline: '🎉 Resgate Feito & Grande Festa Mambo em Marte! 🎶',
      quackSpeech:
        '“Vocês vieram da Terra e me salvaram! Sorriam e acenem, e lembrem sempre: quando o espaço apertar, continue a nadar! Quack! Agora é hora de dançar antes de voltar para casa!”',
      crowdNote:
        'Comandante Quack, os Guardiões no palco e todos os Carrapatos ETs estão dançando Mambo juntos!',
      goldSummary:
        'Nota máxima de Guardião! Todas as 4 barras terminaram em 35% ou mais!',
      heroicSummary:
        'Resgate de muita coragem! Veja abaixo quais barras ficaram baixinhas para tentar o Troféu Ouro depois.',
      survivorSummary:
        'Vocês venceram os 4 dias em Marte! Confira o que diminuiu as barras para buscar o Troféu Ouro na próxima.',
      notGoldHeading: 'Por que faltou um pouquinho para o Troféu Ouro?',
      notGoldHeavyTip:
        'Dica amigável: o Foguete Pesado gastou -8% de Energia logo na saída e deixou menos dinheiro no cofrinho para o Sol 2.',
      notGoldGeneralTip:
        'Dica amigável: experimente as cartas equilibradas (Carta C) e aproveite os bônus de Órbita e Cofrinho do Hangar!',
      shareClosing:
        '“Quando o espaço apertar, continue a nadar! Quack!” — Consegue bater minha pontuação na Base Ares?',
    },
  },

  strategists: {
    prologue: {
      eyebrow: 'Protocolo Tático · Crise na Base Ares',
      quackCallBeforeJezero:
        '“Quack! Controle da Terra, recebam telemetria de emergência na',
      quackCallAfterJezero:
        '— área de pouso do rover Perseverance! Os sensores acusam -85°C à noite, biofilmes obstruindo os dutos de água e atraso de rádio de 14 min só de ida. Configurem a nave de resgate antes que os sistemas colapsem!”',
      crewSubtitle:
        'Defina os operadores, o perfil tático e o avatar de comando para liberar o Hangar.',
      howToStep1:
        'Gerencie $100M de orçamento e o limite de massa (kg) ao combinar Foguete, Órbita e 2 Instrumentos.',
      howToStep2:
        'Cada decisão nos 4 Sols envolve trade-offs reais de engenharia: se qualquer sistema atingir 0%, a missão falha.',
      howToStep3:
        'Mantenha todas as 4 barras >= 35% ao fim do Sol 4 para conquistar o título Guardião Ouro.',
    },
    hangar: {
      subtitle:
        'Projete o veículo de suprimentos e resgate rumo à Cratera Jezero sob restrição de massa e orçamento.',
      boosterTitle: 'Kits de Upgrade Orbital & Superfície:',
      boosterBody:
        'Os 2 instrumentos embarcados (Estufa Veggie OSDR OSD-120, Estação MEDA Perseverance ou Escudo DONKI) reforçam os módulos da Base Ares com bônus iniciais mensuráveis.',
      inspectPlaceholder:
        'Passe o mouse ou toque em qualquer módulo acima para analisar especificações, massa e trade-offs.',
      missingTitle: 'Configuração incompleta para lançamento!',
      physicsLockTitle: 'Trava Física de Engenharia — Lançamento Bloqueado',
      overMassDetail: (rocketName) =>
        `O ${rocketName} excedeu seu limite estrutural (Veggie 450 kg + DONKI 500 kg + cápsula 350 kg = 1.300 kg). Substitua um instrumento pelo MEDA (350 kg) ou troque para o Foguete Pesado ($50M, até 2.200 kg com -8% Energia).`,
      overBudgetDetail:
        'Orçamento acima do teto de $100M. Otimize para o Foguete Leve ($35M) ou integre a Estação MEDA ($15M).',
      rockets: {
        light: {
          summary: 'Economiza verba ($25M+) e inicia com +5% Energia, mas limita carga (-5% Escudo).',
          whatIsIt:
            'Veículo ágil de $35M que preserva reserva financeira para emergências no Sol 2, com teto de 1.200 kg de massa total.',
          tradeoffNote: 'Não comporta Veggie + DONKI juntos (1.300 kg > 1.200 kg), mas destrava bônus no Sol 2.',
        },
        heavy: {
          summary: 'Suporta qualquer dupla de instrumentos (+5% Escudo), mas consome -8% Energia na partida.',
          whatIsIt:
            'Lançador pesado de $50M e 2.200 kg de capacidade útil, porém com maior queima inicial de combustível e menor reserva.',
          tradeoffNote: 'Com Veggie + DONKI consome todos os $100M ($0M livre — sem bônus no Sol 2).',
        },
      },
      orbits: {
        high: {
          summary: 'Enlace de rádio mais estável com a Terra.',
          whatIsIt:
            'Órbita alta de relé que amplia a janela de telemetria com a Terra (+15% Rádio), reduzindo a blindagem natural do planeta (-10% Escudo).',
        },
        low: {
          summary: 'Maior proteção contra radiação solar.',
          whatIsIt:
            'Órbita baixa protegida pelo relevo e atmosfera tênue de Marte (+15% Escudo), encurtando a janela de contato direto (-10% Rádio).',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'Câmara botânica real da NASA (OSDR OSD-120) com LEDs 16h/dia para cultivar alface Outredgeous e gerar oxigênio (+15% Suporte).',
        },
        meda: {
          whatIsIt:
            'Estação meteorológica do rover Perseverance que monitora -85°C noturnos, poeira (τ=0,85) e comunicações (+10% Energia, +5% Rádio).',
        },
        donki: {
          whatIsIt:
            'Sensor de clima espacial ligado à API NASA DONKI para alertar sobre explosões solares Classe X8.7 (+15% Escudo).',
        },
      },
    },
    command: {
      dangerAlert:
        'Alerta Tático: um sistema crítico caiu abaixo de 35%! Se chegar a 0%, o habitat colapsa.',
      reserveBonus: (saved) =>
        `💰 Reserva Estratégica do Hangar: $${saved}M poupados — Carta B ganha +10% Energia extra!`,
      reserveEmpty:
        '⚠️ Reserva de Emergência Zerada ($0M livres de $100M) — Carta B sem bônus extra.',
      reservePartial: (saved) =>
        `💡 Reserva atual: $${saved}M poupados (meta de $15M+ para ativar o bônus extra da Carta B).`,
      workshopTitle: 'Oficina em Microgravidade: Recupere as 3 Ferramentas',
      workshopSubtitle: (found) =>
        `Localize os 3 equipamentos camuflados na oficina da Base Ares para destravar as decisões do Sol 3 (${found}/3).`,
      helpPromptTitle: 'Acionar Scanner UV dos Drones (-8% Suporte de Vida)?',
      helpEncouragement:
        'Na engenharia espacial, saber acionar apoio externo no momento certo evita falhas em cadeia — nenhuma missão da NASA opera isolada.',
      helpBody:
        'Confirmar assistência destaca as 3 ferramentas com coordenadas visuais, ao custo tático de -8% em Suporte de Vida. Deseja ativar o scanner ou continuar a varredura manual?',
      chooseActionTitle: 'Selecione Sua Ação Tática de Engenharia (1 Carta)',
      chooseActionWarning: 'Analise os deltas: escolhas desequilibradas podem zerar um sistema.',
      earthTransmissionBySol: {
        2: 'Terra: “¡Ay, caramba, Base Ares! O comitê congelou a verba e cancelou peças sobressalentes!”',
        4: 'Terra: “Vocês superaram biofilmes, cortes de verba e tempestades Classe X8.7. A nave de resgate entrou na janela orbital!”',
      },
    },
    modal: {
      failureTag: (sol) => `Falha Crítica · Colapso no Sol ${sol}`,
      failureIntro:
        'Diagnóstico de falha: sua decisão zerou um sistema vital. Na engenharia da NASA, analisamos a causa física antes de recalibrar a estratégia.',
      closeCallPrefix: 'Margem crítica!',
      closeCallSuffix:
        'caiu abaixo de 35% devido ao custo de trade-off desta carta. Planeje a recuperação no próximo Sol!',
      scienceHeading: 'Por que isso aconteceu na ciência real da NASA?',
    },
    victory: {
      missionCompleteTag: 'MISSÃO CONCLUÍDA: COMANDANTE QUACK RESGATADO! 🚀🦆',
      headline: '🎉 Resgate Confirmado & Celebração Mambo na Base Ares! 🎶',
      quackSpeech:
        '“Operação executada com precisão — vocês cruzaram o espaço e garantiram nosso resgate! Sorriam e acenem, e lembrem: quando o espaço apertar, continue a nadar! Quack!”',
      crowdNote:
        'Comandante Quack, os Guardiões no palco e a platéia de Carrapatos ETs comemoram em ritmo Mambo!',
      goldSummary:
        'Maestria em Engenharia Sistêmica: todos os 4 indicadores fecharam em 35% ou mais!',
      heroicSummary:
        'Sobrevivência Heroica! Confira o diagnóstico de trade-offs abaixo para buscar o Título Ouro (>35% em tudo).',
      survivorSummary:
        'Missão concluída nos 4 Sols! Analise abaixo o que pressionou suas barras para alcançar o Título Ouro.',
      notGoldHeading: 'Diagnóstico: por que a nave não atingiu o Título Ouro?',
      notGoldHeavyTip:
        'Fator Hangar: o Foguete Pesado consumiu -8% de Energia na decolagem e reduziu a margem financeira do Sol 2.',
      notGoldGeneralTip:
        'Ajuste Tático: combine cartas híbridas (Carta C) com os bônus de Órbita e reserva de $15M+ no Hangar.',
      shareClosing:
        '“Quando o espaço apertar, continue a nadar! Quack!” — Você consegue superar meu placar estratégico com dados reais da NASA?',
    },
  },

  educators: {
    prologue: {
      eyebrow: 'Roteiro Pedagógico STEM · Cratera Jezero',
      quackCallBeforeJezero:
        '“Transmissão prioritária da',
      quackCallAfterJezero:
        '(sítio da missão Mars 2020 Perseverance): registramos queda térmica noturna para -85°C, adesão de biofilmes nos dutos hidráulicos e latência Terra-Marte de 14 min só de ida (28 min RTT). Preparem a arquitetura da missão de apoio.”',
      crewSubtitle:
        'Configure o modo individual ou em grupos rotativos (ideal para debate em sala) e selecione o perfil de leitura.',
      howToStep1:
        'Fase 1 — Engenharia ($100M): modele massa útil, orçamento e ganhos científicos entre Foguete, Órbita e 2 Instrumentos NASA.',
      howToStep2:
        'Fase 2 — Método Científico (4 Sols): cada carta testa hipóteses com trade-offs sistêmicos; zerar qualquer variável encerra a tentativa.',
      howToStep3:
        'Fase 3 — Avaliação (>= 35%): conclua os 4 Sols em equilíbrio para atingir o nível Ouro e explorar as referências científicas.',
    },
    hangar: {
      subtitle:
        'Análise de engenharia pré-lançamento: equilibre carga útil (kg), orçamento ($100M) e telemetria para a Cratera Jezero.',
      boosterTitle: 'Módulos Científicos & Acoplamento Sistêmico:',
      boosterBody:
        'Os 2 instrumentos selecionados (Estufa Veggie OSDR OSD-120, Estação MEDA ou Monitoramento DONKI) ilustram como cargas científicas reais alteram os parâmetros de suporte vital, energia, proteção radiativa e enlace.',
      inspectPlaceholder:
        'Passe o cursor ou clique nos módulos acima para inspecionar referências científicas, parâmetros de massa e compromissos de projeto.',
      missingTitle: 'Parâmetros obrigatórios pendentes antes da decolagem',
      physicsLockTitle: 'Restrição Física de Engenharia — Análise de Inviabilidade',
      overMassDetail: (rocketName) =>
        `A configuração atual excede o limite de carga útil do ${rocketName} (Veggie 450 kg + DONKI 500 kg + cápsula 350 kg = 1.300 kg). Discuta com os estudantes a troca para MEDA (350 kg) ou a transição para o Foguete Pesado ($50M, teto de 2.200 kg a -8% Energia).`,
      overBudgetDetail:
        'O somatório ultrapassou a restrição orçamentária de $100M. Avalie a substituição pelo Foguete Leve ($35M) ou pela Estação MEDA ($15M).',
      rockets: {
        light: {
          summary: 'Menor custo ($35M, +5% Energia inicial) com teto restrito de carga (1.200 kg, -5% Escudo).',
          whatIsIt:
            'Veículo de menor massa estrutural: preserva reserva orçamentária para contingências no Sol 2, exigindo seleção criteriosa de carga útil científica.',
          tradeoffNote: 'Inviabiliza Veggie + DONKI simultâneos (1.300 kg > 1.200 kg), favorecendo reserva de contingência.',
        },
        heavy: {
          summary: 'Alta capacidade de carga (2.200 kg, +5% Escudo) com penalidade de propelente (-8% Energia).',
          whatIsIt:
            'Lançador pesado capaz de acomodar qualquer par de instrumentos, evidenciando o custo energético e financeiro do excesso de massa em missões interplanetárias.',
          tradeoffNote: 'Com Veggie + DONKI consome 100% dos $100M ($0M de reserva para o Sol 2).',
        },
      },
      orbits: {
        high: {
          summary: 'Prioriza enlace de telemetria com a Terra (+15% Comunicações).',
          whatIsIt:
            'Órbita de relé elevada que maximiza visibilidade com a Deep Space Network (DSN), reduzindo a atenuação atmosférica/planetária de partículas (-10% Escudo).',
        },
        low: {
          summary: 'Prioriza atenuação de radiação solar (+15% Escudo).',
          whatIsIt:
            'Órbita baixa beneficiada pela proximidade da massa planetária de Marte, reduzindo a janela contínua de transmissão com a Terra (-10% Comunicações).',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'Unidade botânica validada na ISS (NASA OSDR OSD-120, Massa et al., 2017): fotoperíodo de 16h/dia em LED para cultivo de alface Outredgeous e regeneração de O₂.',
        },
        meda: {
          whatIsIt:
            'Mars Environmental Dynamics Analyzer (Mars 2020): caracteriza temperaturas noturnas (-85°C), opacidade de aerossóis (τ=0,85) e suporte operacional.',
        },
        donki: {
          whatIsIt:
            'Integração ao banco Space Weather Database Of Notifications, Knowledge, Information (NASA CCMC DONKI) para detecção de ejeções solares Classe X8.7.',
        },
      },
    },
    command: {
      dangerAlert:
        'Atenção pedagógica: uma variável de suporte caiu abaixo da margem segura de 35%. Se atingir 0%, ocorrerá falha sistêmica.',
      reserveBonus: (saved) =>
        `💰 Gestão de Contingência ($${saved}M poupados no Hangar): Carta B recebe bônus de +10% em Energia!`,
      reserveEmpty:
        '⚠️ Contingência Zerada ($0M disponíveis de $100M) — Carta B opera sem reserva energética adicional.',
      reservePartial: (saved) =>
        `💡 Reserva residual de $${saved}M (eram necessários $15M+ para habilitar o bônus energético da Carta B).`,
      workshopTitle: 'Experimento Prático (Sol 3): Recuperação de Instrumentos em Microgravidade',
      workshopSubtitle: (found) =>
        `Localize os 3 instrumentos dispersos na oficina da Base Ares para habilitar a etapa de decisão experimental (${found}/3).`,
      helpPromptTitle: 'Acionar Assistência por Scanner UV (-8% Suporte de Vida)?',
      helpEncouragement:
        'Reflexão socioemocional e científica: reconhecer limites operacionais e acionar colaboração faz parte da cultura de segurança da NASA.',
      helpBody:
        'O acionamento dos drones de busca fornece pistas espaciais destacadas para os 3 itens mediante custo de -8% em Suporte de Vida. Deseja utilizar a assistência ou continuar a inspeção autônoma?',
      chooseActionTitle: 'Deliberação de Engenharia — Selecione 1 Hipótese de Ação',
      chooseActionWarning: 'Observe o balanço sistêmico antes de confirmar a decisão.',
      earthTransmissionBySol: {
        2: 'Controle da Terra: “Contingência orçamentária decretada — não haverá envio adicional de sobressalentes nesta janela.”',
        4: 'Controle da Terra: “Superada a fase crítica de biofilmes, radiação X8.7 e microgravidade, o módulo de resgate ingressou na órbita de encontro.”',
      },
    },
    modal: {
      failureTag: (sol) => `Análise de Falha · Interrupção no Sol ${sol}`,
      failureIntro:
        'Por que falhou? Uma variável essencial atingiu 0%. Na prática de engenharia da NASA, falhas orientam a revisão de hipóteses e o redesenho experimental.',
      closeCallPrefix: 'Margem crítica atingida:',
      closeCallSuffix:
        'ficou abaixo de 35% em função do trade-off selecionado. Recomenda-se priorizar recomposição no Sol seguinte.',
      scienceHeading: 'Fundamentação Científica e Contexto NASA',
    },
    victory: {
      missionCompleteTag: 'MISSÃO CONCLUÍDA: RESGATE VALIDADO NA BASE ARES 🚀🦆',
      headline: '🎉 Ciclo Científico Concluído & Celebração Mambo em Marte! 🎶',
      quackSpeech:
        '“Missão concluída com êxito — da modelagem no Hangar à análise de dados reais até o pouso final! Sorriam e acenem, e lembrem aos estudantes: quando o espaço apertar, continue a nadar! Quack!”',
      crowdNote:
        'Comandante Quack, a tripulação no palco e os “Carrapatos ETs” (biofilmes) encerram a atividade celebrando o aprendizado STEM!',
      goldSummary:
        'Desempenho Ouro em Engenharia Sistêmica: todas as 4 variáveis mantiveram margem igual ou superior a 35%!',
      heroicSummary:
        'Conclusão em Limiar Crítico! Utilize o diagnóstico abaixo com os alunos para debater quais trade-offs reduziram a margem de segurança (<35%).',
      survivorSummary:
        'Todos os 4 Sols foram superados! O relatório abaixo destaca quais decisões comprometeram a margem ideal (>35%) para discussão em grupo.',
      notGoldHeading: 'Diagnóstico Pedagógico: por que o nível Ouro não foi alcançado?',
      notGoldHeavyTip:
        'Impacto do Hangar: a escolha do Foguete Pesado impôs -8% iniciais em Energia e reduziu a folga financeira para o Sol 2.',
      notGoldGeneralTip:
        'Sugestão de debate: compare decisões extremas com alternativas híbridas (Carta C) e o efeito da combinação Órbita + Reserva.',
      shareClosing:
        '“Quando o espaço apertar, continue a nadar! Quack!” — Convide outro grupo ou turma para comparar estratégias com dados reais da NASA!',
    },
  },
};

const TONE_COPY_EN: Record<AgeProfile, ProfileToneCopy> = {
  explorers: {
    prologue: {
      eyebrow: 'Space Rescue Call!',
      quackCallBeforeJezero: '“Quack! Hello, friends on Earth?! This is Commander Quack at',
      quackCallAfterJezero:
        '— where the Perseverance rover lives! Outside it is freezing to -85°C, our computers are blinking, and sticky little germs clogged our water pipes! Build a rescue rocket fast to save Ares Base!”',
      crewSubtitle:
        'Pick your name, your space buddy, and how we tell the story before entering the Hangar.',
      howToStep1:
        'Build a rocket with $100M, pick a space path (orbit), and 2 cool tools without making it too heavy!',
      howToStep2:
        'On each Martian Sol (day), choose carefully: no meter can hit 0% or the base shuts down!',
      howToStep3:
        'Finish all 4 days with every meter at 35% or higher to win Gold and dance the Mambo with the crew!',
    },
    hangar: {
      subtitle: 'Build your awesome rescue rocket to fly from Earth to Mars!',
      boosterTitle: 'Rocket Tool Backpack:',
      boosterBody:
        'The 2 gadgets you pack (Veggie Garden, MEDA Weather Station, or DONKI Shield) ride inside your rocket to give Ares Base a super boost right from the start!',
      inspectPlaceholder:
        'Hover or tap any square above to discover what each gadget does on our adventure.',
      missingTitle: 'Pick all your rocket parts first!',
      physicsLockTitle: 'Whoops! Space physics paused our launch!',
      overMassDetail: (rocketName) =>
        `The ${rocketName} is light and cannot lift Veggie (450 kg) + DONKI (500 kg) + capsule (350 kg = 1,300 kg). Swap one for the MEDA Station (350 kg) or switch to the Heavy Rocket!`,
      overBudgetDetail:
        'That went over our $100M piggy bank! Switch to the Light Rocket ($35M) or pack the MEDA Station ($15M) so we have cash left.',
      rockets: {
        light: {
          summary: 'Costs less ($35M) and gives +5% Energy, but carries less weight (-5% Shield).',
          whatIsIt:
            'A speedy, budget-friendly rocket! It saves coins in our piggy bank for Sol 2, though it cannot carry the two heaviest tools together.',
          tradeoffNote: 'Cannot lift Veggie + DONKI together (>1,200 kg), yet unlocks the Sol 2 bonus!',
        },
        heavy: {
          summary: 'Lifts any two gadgets (+5% Shield), but burns extra fuel at liftoff (-8% Energy).',
          whatIsIt:
            'A super-strong rocket that lifts up to 2,200 kg! Because it is huge, it uses extra battery at liftoff and leaves less pocket money.',
          tradeoffNote: 'With Veggie + DONKI it spends every dollar ($0M spare in Sol 2).',
        },
      },
      orbits: {
        high: {
          summary: 'Super-clear radio signal to talk with Earth.',
          whatIsIt:
            'Places our satellite high above Mars for a loud, clear radio link home, with slightly less planetary shelter from sun rays.',
        },
        low: {
          summary: 'Cozy shield hugging close to Mars.',
          whatIsIt:
            'Keeps our ship close to Mars so the planet helps block solar storms, though Earth radio windows are shorter.',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'A space garden with glowing lights turned on 16h a day to grow crunchy lettuce and make fresh air!',
        },
        meda: {
          whatIsIt:
            'The Perseverance rover’s weather kit that warns us about -85°C freezing nights and swirling red dust!',
        },
        donki: {
          whatIsIt:
            'A NASA space-weather radar that spots giant sun sneezes before they reach Mars!',
        },
      },
    },
    command: {
      dangerAlert:
        'Uh-oh, quack! A meter dropped below 35%! Help it recover soon so it never hits 0%!',
      reserveBonus: (saved) =>
        `💰 Piggy bank full: $${saved}M saved in the Hangar — Card B gets +10% bonus Energy!`,
      reserveEmpty:
        '⚠️ Piggy bank empty ($0M left) — Card B gets no bonus energy today.',
      reservePartial: (saved) =>
        `💡 $${saved}M left in the piggy bank (needed $15M+ for Card B’s extra energy boost).`,
      workshopTitle: 'Floating Workshop: Find the 3 Hidden Tools!',
      workshopSubtitle: (found) =>
        'Everything floated away in zero gravity! Tap the 3 hidden tools in the workshop (${found}/3).'
          .replace('${found}', String(found)),
      helpPromptTitle: 'Call the Search Robot (-8% Life Support)?',
      helpEncouragement:
        'In space and in life, asking for help when you need it is super brave! Even NASA astronauts work as a team.',
      helpBody:
        'If you ask for help, our little drones turn on a bright spotlight showing where the 3 tools are hiding, costing -8% Life Support. Want the spotlight or keep looking a bit more?',
      chooseActionTitle: 'Pick 1 Plan to Help Commander Quack',
      chooseActionWarning: 'Watch the bars: risky moves can drain a meter to zero!',
      earthTransmissionBySol: {
        2: 'Earth: “¡Ay, caramba, Ares Base! Our budget froze and no spare parts can ship right now!”',
        4: 'Earth: “You beat pipe germs, budget cuts, and solar storms! Your rescue ship has arrived!”',
      },
    },
    modal: {
      failureTag: (sol) => `Red Alert · Sol ${sol} Ended`,
      failureIntro:
        'What happened? One meter hit 0%! No worries — at NASA we figure out why and try again smarter!',
      closeCallPrefix: 'Phew, close call!',
      closeCallSuffix:
        'dipped under 35% from that card’s trade-off. Let’s boost it back up tomorrow!',
      scienceHeading: 'What does real NASA science teach us here?',
    },
    victory: {
      missionCompleteTag: 'MISSION COMPLETE: WE SAVED COMMANDER QUACK! 🚀🦆',
      headline: '🎉 Rescue Complete & Grand Mars Mambo Party! 🎶',
      quackSpeech:
        '“You flew all the way from Earth and saved me! Smile and wave, and remember: when space gets tough, just keep swimming! Quack! Now let’s dance before flying home!”',
      crowdNote:
        'Commander Quack, the Guardians on stage, and all the Alien Ticks are dancing the Mambo together!',
      goldSummary:
        'Top Guardian Score! All 4 meters finished at 35% or higher!',
      heroicSummary:
        'Super brave rescue! Check below to see which meters dipped low so you can chase the Gold Trophy next time.',
      survivorSummary:
        'You beat all 4 Martian days! See what lowered your meters below to aim for Gold on your next flight.',
      notGoldHeading: 'Why was it just shy of the Gold Trophy?',
      notGoldHeavyTip:
        'Friendly tip: the Heavy Rocket burned -8% Energy at liftoff and left fewer coins for Sol 2.',
      notGoldGeneralTip:
        'Friendly tip: try balanced cards (Card C) and combine Hangar Orbit + Piggy Bank bonuses!',
      shareClosing:
        '“When space gets tough, just keep swimming! Quack!” — Can you beat my Ares Base score?',
    },
  },

  strategists: {
    prologue: {
      eyebrow: 'Tactical Briefing · Ares Base Crisis',
      quackCallBeforeJezero:
        '“Quack! Earth Control, incoming emergency telemetry from',
      quackCallAfterJezero:
        '— Perseverance rover’s landing site! Sensors report -85°C nights, biofilms clogging water loops, and a 14-min one-way radio delay. Assemble and launch the rescue ship before systems fail!”',
      crewSubtitle:
        'Set crew roster, tactical reading profile, and command avatar to unlock the Hangar.',
      howToStep1:
        'Balance your $100M budget and payload mass limit (kg) across Rocket, Orbit, and 2 NASA Instruments.',
      howToStep2:
        'Every choice across 4 Sols has real engineering trade-offs: if any gauge hits 0%, the mission fails.',
      howToStep3:
        'Keep all 4 gauges at >= 35% through Sol 4 to earn Gold Guardian status.',
    },
    hangar: {
      subtitle:
        'Engineer the supply & rescue spacecraft for Jezero Crater under strict mass and budget constraints.',
      boosterTitle: 'Orbital & Surface Upgrade Kits:',
      boosterBody:
        'Your 2 chosen instruments (Veggie OSDR OSD-120, Perseverance MEDA, or DONKI Shield) upgrade existing Ares Base hardware with measurable starting bonuses.',
      inspectPlaceholder:
        'Hover or tap any module above to inspect technical specs, payload mass, and engineering trade-offs.',
      missingTitle: 'Required launch selections incomplete!',
      physicsLockTitle: 'Engineering Physics Lock — Launch Blocked',
      overMassDetail: (rocketName) =>
        `The ${rocketName} exceeded its payload limit (Veggie 450 kg + DONKI 500 kg + capsule 350 kg = 1,300 kg). Swap one instrument for MEDA (350 kg) or upgrade to the Heavy Rocket ($50M, lifts 2,200 kg at -8% Energy).`,
      overBudgetDetail:
        'Total cost exceeded the $100M ceiling. Switch to the Light Rocket ($35M) or equip the MEDA Station ($15M).',
      rockets: {
        light: {
          summary: 'Saves budget ($25M+) and starts at +5% Energy, but caps payload (-5% Shield).',
          whatIsIt:
            'Agile $35M launch vehicle preserving cash reserves for Sol 2 contingencies, capped at 1,200 kg total mass.',
          tradeoffNote: 'Cannot carry Veggie + DONKI together (1,300 kg > 1,200 kg), yet unlocks Sol 2 reserve bonus.',
        },
        heavy: {
          summary: 'Lifts any instrument pair (+5% Shield), but heavy fuel burn costs -8% Energy.',
          whatIsIt:
            'Reinforced $50M launcher supporting up to 2,200 kg payload, with higher fuel burn at liftoff and tighter cash.',
          tradeoffNote: 'With Veggie + DONKI it spends all $100M ($0M left — no Sol 2 reserve bonus).',
        },
      },
      orbits: {
        high: {
          summary: 'Stronger Earth radio link.',
          whatIsIt:
            'High relay orbit maximizing Earth telemetry windows (+15% Comms) with lower natural planetary radiation shielding (-10% Shield).',
        },
        low: {
          summary: 'Stronger solar radiation protection.',
          whatIsIt:
            'Low orbit sheltered by Mars’s terrain and thin atmosphere (+15% Shield), shortening direct Earth comms windows (-10% Comms).',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'Real NASA plant chamber (OSDR OSD-120) running 16h/day LEDs to grow Outredgeous lettuce and generate oxygen (+15% Life Support).',
        },
        meda: {
          whatIsIt:
            'Perseverance weather suite tracking -85°C nights, dust opacity (τ=0.85), and radio support (+10% Energy, +5% Comms).',
        },
        donki: {
          whatIsIt:
            'Space-weather sensor linked to NASA DONKI to detect Class X8.7 solar flares ahead of impact (+15% Shield).',
        },
      },
    },
    command: {
      dangerAlert:
        'Tactical Warning: a critical system dropped below 35%! If any gauge reaches 0%, the base fails.',
      reserveBonus: (saved) =>
        `💰 Hangar Strategic Reserve: $${saved}M saved — Card B earns +10% extra Energy!`,
      reserveEmpty:
        '⚠️ Emergency Reserve Empty ($0M left of $100M) — Card B gets no extra bonus.',
      reservePartial: (saved) =>
        `💡 Current reserve: $${saved}M saved ($15M+ required to unlock Card B’s extra Energy boost).`,
      workshopTitle: 'Zero-G Workshop: Recover the 3 Lost Tools',
      workshopSubtitle: (found) =>
        `Locate all 3 camouflaged tools inside the Ares Base workshop to unlock Sol 3 decisions (${found}/3).`,
      helpPromptTitle: 'Deploy Drone UV Scanner (-8% Life Support)?',
      helpEncouragement:
        'In space engineering, knowing when to call for backup prevents cascading failures — no NASA mission runs solo.',
      helpBody:
        'Confirming assistance highlights all 3 tools with location cues at a tactical cost of -8% Life Support. Activate the scanner or keep searching manually?',
      chooseActionTitle: 'Select Your Tactical Engineering Action (1 Card)',
      chooseActionWarning: 'Check the deltas: unbalanced picks can drain a system to 0%.',
      earthTransmissionBySol: {
        2: 'Earth: “¡Ay, caramba, Ares Base! Budget freeze enacted — no spare parts will launch this window!”',
        4: 'Earth: “You overcame biofilms, budget cuts, and Class X8.7 flares. The rescue ship has entered orbital window!”',
      },
    },
    modal: {
      failureTag: (sol) => `Critical Failure · Sol ${sol} Lost`,
      failureIntro:
        'Failure diagnosis: your decision drained a vital system to zero. In NASA engineering, we analyze the physics before recalibrating our strategy.',
      closeCallPrefix: 'Close call!',
      closeCallSuffix:
        'fell below 35% due to this card’s trade-off cost. Recover those reserves in the next Sol!',
      scienceHeading: 'Why did this happen in real NASA science?',
    },
    victory: {
      missionCompleteTag: 'MISSION COMPLETE: COMMANDER QUACK RESCUED! 🚀🦆',
      headline: '🎉 Rescue Confirmed & Grand Mars Mambo Celebration! 🎶',
      quackSpeech:
        '“Precision execution — you crossed deep space and pulled off the rescue! Smile and wave, and remember: when space gets tough, just keep swimming! Quack!”',
      crowdNote:
        'Commander Quack, the Guardians on stage, and the Alien Ticks crowd celebrate in Mambo rhythm!',
      goldSummary:
        'Systems Engineering Mastery: every gauge finished at 35% or above!',
      heroicSummary:
        'Heroic Survival! Review the trade-off breakdown below to aim for Gold (>35% across all gauges).',
      survivorSummary:
        'You survived all 4 Sols! Check what pressured your gauges below so you can chase Gold.',
      notGoldHeading: 'Diagnosis: why didn’t the ship earn Gold Status?',
      notGoldHeavyTip:
        'Hangar Factor: the Heavy Rocket burned -8% Energy at liftoff and reduced spare cash for Sol 2.',
      notGoldGeneralTip:
        'Tactical Tip: balance hybrid cards (Card C) with Orbit and $15M+ Hangar Reserve bonuses!',
      shareClosing:
        '“When space gets tough, just keep swimming! Quack!” — Can you beat my tactical score using real NASA data?',
    },
  },

  educators: {
    prologue: {
      eyebrow: 'STEM Pedagogical Scenario · Jezero Crater',
      quackCallBeforeJezero: '“Priority telemetry from',
      quackCallAfterJezero:
        '(Mars 2020 Perseverance landing basin): sensors log -85°C nocturnal lows, biofilm fouling in closed-loop water lines, and a 14-min one-way Earth-Mars radio delay (28-min RTT). Configure your support architecture.”',
      crewSubtitle:
        'Configure individual or rotating-team roles (ideal for classroom discussion) and select your reading profile.',
      howToStep1:
        'Phase 1 — Systems Engineering ($100M): model payload mass, budget ceiling, and scientific return across Rocket, Orbit, and 2 NASA Instruments.',
      howToStep2:
        'Phase 2 — Scientific Method (4 Sols): each card tests a hypothesis with systemic trade-offs; depleting any variable to 0% ends the run.',
      howToStep3:
        'Phase 3 — Assessment (>= 35%): maintain all 4 subsystems in safe margin to earn Gold and review peer-reviewed NASA references.',
    },
    hangar: {
      subtitle:
        'Pre-launch systems analysis: balance payload mass (kg), $100M budget, and telemetry architecture for Jezero Crater.',
      boosterTitle: 'Scientific Payloads & Subsystem Coupling:',
      boosterBody:
        'The 2 chosen instruments (Veggie OSDR OSD-120, Perseverance MEDA, or DONKI Space Weather) demonstrate how real flight hardware shifts initial margins across life support, power, shielding, and comms.',
      inspectPlaceholder:
        'Hover or select any module above to examine scientific references, mass parameters, and engineering trade-offs.',
      missingTitle: 'Required engineering parameters incomplete prior to launch',
      physicsLockTitle: 'Engineering Physics Constraint — Feasibility Check',
      overMassDetail: (rocketName) =>
        `Current payload exceeds the ${rocketName} structural limit (Veggie 450 kg + DONKI 500 kg + capsule 350 kg = 1,300 kg). Discuss swapping one payload for MEDA (350 kg) or stepping up to the Heavy Rocket ($50M, 2,200 kg cap at -8% Energy).`,
      overBudgetDetail:
        'Combined hardware cost exceeded the $100M budget cap. Evaluate switching to the Light Rocket ($35M) or MEDA Station ($15M).',
      rockets: {
        light: {
          summary: 'Lower cost ($35M, +5% initial Energy) with a strict payload ceiling (1,200 kg, -5% Shield).',
          whatIsIt:
            'Lower-mass launch vehicle that preserves contingency funding for Sol 2 while requiring disciplined payload mass selection.',
          tradeoffNote: 'Precludes Veggie + DONKI together (1,300 kg > 1,200 kg), preserving Sol 2 contingency reserve.',
        },
        heavy: {
          summary: 'High payload capacity (2,200 kg, +5% Shield) with propellant mass penalty (-8% Energy).',
          whatIsIt:
            'Heavy-lift vehicle accommodating any instrument pair, illustrating the energetic and financial cost of mass in interplanetary flight.',
          tradeoffNote: 'Pairing Veggie + DONKI exhausts 100% of the $100M budget ($0M reserve in Sol 2).',
        },
      },
      orbits: {
        high: {
          summary: 'Prioritizes Earth telemetry link (+15% Comms).',
          whatIsIt:
            'High relay orbit maximizing Deep Space Network (DSN) visibility while reducing planetary shielding against energetic particles (-10% Shield).',
        },
        low: {
          summary: 'Prioritizes solar particle attenuation (+15% Shield).',
          whatIsIt:
            'Low orbit benefiting from Mars’s planetary mass and tenuous atmosphere, at the expense of shorter direct Earth comms passes (-10% Comms).',
        },
      },
      instruments: {
        veggie: {
          whatIsIt:
            'ISS-validated botanical hardware (NASA OSDR OSD-120, Massa et al., 2017): 16h/day spectral LED photoperiod for Outredgeous lettuce and O₂ regeneration.',
        },
        meda: {
          whatIsIt:
            'Mars Environmental Dynamics Analyzer (Mars 2020): measures -85°C nocturnal temperatures, aerosol optical depth (τ=0.85), and operational telemetry.',
        },
        donki: {
          whatIsIt:
            'Space-weather integration with NASA CCMC DONKI for early detection of Class X8.7 solar particle events.',
        },
      },
    },
    command: {
      dangerAlert:
        'Pedagogical Alert: a life-critical variable fell below the 35% safety margin. Reaching 0% triggers systemic failure.',
      reserveBonus: (saved) =>
        `💰 Contingency Management ($${saved}M preserved in Hangar): Card B earns a +10% Energy bonus!`,
      reserveEmpty:
        '⚠️ Contingency Depleted ($0M available of $100M) — Card B operates with no extra energy buffer.',
      reservePartial: (saved) =>
        `💡 Residual reserve of $${saved}M ($15M+ was required to enable Card B’s energy contingency bonus).`,
      workshopTitle: 'Hands-On Experiment (Sol 3): Zero-G Tool Recovery',
      workshopSubtitle: (found) =>
        `Locate the 3 displaced workshop instruments inside Ares Base to unlock the experimental decision phase (${found}/3).`,
      helpPromptTitle: 'Activate UV Search Drone Assistance (-8% Life Support)?',
      helpEncouragement:
        'Socio-emotional & STEM note: recognizing operational limits and requesting team support is core to NASA mission safety culture.',
      helpBody:
        'Deploying search drones highlights all 3 items with spatial cues at a -8% Life Support cost. Confirm assistance now or continue autonomous search?',
      chooseActionTitle: 'Engineering Deliberation — Select 1 Action Hypothesis',
      chooseActionWarning: 'Evaluate subsystem deltas carefully before committing.',
      earthTransmissionBySol: {
        2: 'Earth Control: “Budgetary contingency enacted — no additional spare hardware will ship during this launch window.”',
        4: 'Earth Control: “Having mitigated biofilms, Class X8.7 radiation, and zero-g disruption, the rescue module has entered rendezvous orbit.”',
      },
    },
    modal: {
      failureTag: (sol) => `Failure Analysis · Sol ${sol} Halted`,
      failureIntro:
        'Root-cause diagnosis: a critical subsystem reached 0%. In NASA engineering practice, failures inform hypothesis revision and redesign.',
      closeCallPrefix: 'Safety margin breached:',
      closeCallSuffix:
        'dropped below 35% due to this card’s trade-off. Prioritize subsystem recovery in the next Sol.',
      scienceHeading: 'Scientific Foundation & NASA Context',
    },
    victory: {
      missionCompleteTag: 'MISSION COMPLETE: ARES BASE RESCUE VALIDATED 🚀🦆',
      headline: '🎉 Scientific Cycle Complete & Mars Mambo Celebration! 🎶',
      quackSpeech:
        '“Mission accomplished — from Hangar modeling to real NASA telemetry analysis through final landing! Smile and wave, and remind students: when space gets tough, just keep swimming! Quack!”',
      crowdNote:
        'Commander Quack, the stage crew, and the “Alien Ticks” (biofilms) close the session celebrating STEM inquiry!',
      goldSummary:
        'Gold Systems Engineering Performance: all 4 subsystems remained at or above the 35% safety threshold!',
      heroicSummary:
        'Critical-Threshold Completion! Use the breakdown below with learners to discuss which trade-offs reduced safety margins (<35%).',
      survivorSummary:
        'All 4 Sols completed! Review below which decisions lowered subsystem margins below the 35% Gold benchmark.',
      notGoldHeading: 'Pedagogical Diagnosis: why did the run miss Gold Status?',
      notGoldHeavyTip:
        'Hangar Impact: the Heavy Rocket imposed an initial -8% Energy cost and reduced Sol 2 contingency reserve.',
      notGoldGeneralTip:
        'Discussion prompt: compare high-swing actions against hybrid mitigation (Card C) and Orbit + Reserve synergies.',
      shareClosing:
        '“When space gets tough, just keep swimming! Quack!” — Invite another group or class to compare strategies using real NASA data!',
    },
  },
};

export function getProfileToneCopy(lang: Language, profile: AgeProfile): ProfileToneCopy {
  const catalog = lang === 'pt' ? TONE_COPY_PT : TONE_COPY_EN;
  return catalog[profile] || catalog.explorers;
}
