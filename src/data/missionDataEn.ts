import {
  AgeProfile,
  GlossaryTerm,
  HotspotInfo,
  InstrumentOption,
  Language,
  OrbitOption,
  ResourceKey,
  RocketOption,
  SolScenario,
} from '../types/game';
import {
  AGE_PROFILES as AGE_PROFILES_PT,
  BASE_HOTSPOTS as BASE_HOTSPOTS_PT,
  CLASSROOM_DEBATE_QUESTIONS as CLASSROOM_DEBATE_QUESTIONS_PT,
  GLOSSARY_TERMS as GLOSSARY_TERMS_PT,
  INSTRUMENTS as INSTRUMENTS_PT,
  ORBITS as ORBITS_PT,
  PEER_REVIEWED_REFERENCES as PEER_REVIEWED_REFERENCES_PT,
  RESOURCE_META as RESOURCE_META_PT,
  ROCKETS as ROCKETS_PT,
  SOL_SCENARIOS as SOL_SCENARIOS_PT,
  SPACE_AVATARS as SPACE_AVATARS_PT,
  TEAM_ROLES as TEAM_ROLES_PT,
} from './missionData';

export const AGE_PROFILES_EN: {
  id: AgeProfile;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'explorers',
    label: 'Explorers (Ages 7–9)',
    shortLabel: 'Ages 7–9',
    description: 'Simple language, fun analogies, and 1-tap controls.',
  },
  {
    id: 'strategists',
    label: 'Strategists (Ages 10–12)',
    shortLabel: 'Ages 10–12',
    description: 'Real NASA data (-85°C, Class X8.7, 14 min) and trade-off strategy.',
  },
  {
    id: 'educators',
    label: 'Parents & Teachers',
    shortLabel: 'Educators',
    description: 'STEM context, scientific method, and classroom discussion guide.',
  },
];

export const TEAM_ROLES_EN = [
  { role: 'Mission Leader', focus: 'Coordinates the crew and resolves ties.' },
  { role: 'Science Officer', focus: 'Monitors Veggie Greenhouse, biofilms, and MEDA.' },
  { role: 'Comms Officer', focus: 'Manages the 14-min radio delay and orbital links.' },
  { role: 'Systems Engineer', focus: 'Protects Energy, Shield, and water pipes.' },
] as const;

export const SPACE_AVATARS_EN: {
  id: 'astra' | 'orbita' | 'cometa';
  name: string;
  specialty: string;
  accentColor: string;
}[] = [
  {
    id: 'astra',
    name: 'Guardian Astra',
    specialty: 'Botany & Life Support',
    accentColor: '#10B981',
  },
  {
    id: 'orbita',
    name: 'Pilot Orbit',
    specialty: 'Trajectory & Shields',
    accentColor: '#38BDF8',
  },
  {
    id: 'cometa',
    name: 'Engineer Comet',
    specialty: 'Power & Telemetry',
    accentColor: '#F59E0B',
  },
];

export const ROCKETS_EN: RocketOption[] = [
  {
    id: 'light',
    name: 'Light Rocket',
    costM: 35,
    maxMassKg: 1200,
    whatIsIt:
      'Agile launch vehicle costing $35M that leaves emergency budget in reserve, with a 1,200 kg total mass limit and lighter hull shielding.',
    summary: 'Saves budget ($25M+) and starts with +5% Energy, but caps payload (-5% Shield).',
    tradeoffNote: 'Cannot carry Veggie + DONKI together (1,300 kg > 1,200 kg), yet unlocks Sol 2 reserve bonus.',
    startingDelta: { energy: 5, shield: -5 },
  },
  {
    id: 'heavy',
    name: 'Heavy Rocket',
    costM: 50,
    maxMassKg: 2200,
    whatIsIt:
      'Reinforced heavy-lift rocket supporting up to 2,200 kg (fits any 2 instruments), but burns extra fuel at liftoff (-8% Energy) and reduces spare cash.',
    summary: 'Lifts any instrument pair (+5% Shield), but heavy fuel burn costs -8% Energy.',
    tradeoffNote: 'With Veggie + DONKI it spends all $100M ($0M left — no Sol 2 reserve bonus).',
    startingDelta: { shield: 5, energy: -8 },
  },
];

export const ORBITS_EN: OrbitOption[] = [
  {
    id: 'high',
    name: 'High Relay Orbit',
    whatIsIt:
      'Places relay satellites high above Mars for stronger Earth radio contact, with less natural planetary shielding from solar radiation.',
    summary: 'Stronger Earth radio link.',
    bonusLabel: '+15% Comms · -10% Shield',
    delta: { comms: 15, shield: -10 },
  },
  {
    id: 'low',
    name: 'Low Orbit',
    whatIsIt:
      'Keeps spacecraft closer to Mars where terrain and thin atmosphere offer better radiation protection, at the cost of shorter Earth comms windows.',
    summary: 'Stronger solar radiation protection.',
    bonusLabel: '+15% Shield · -10% Comms',
    delta: { shield: 15, comms: -10 },
  },
];

export const INSTRUMENTS_EN: InstrumentOption[] = [
  {
    id: 'veggie',
    name: 'Veggie Greenhouse OSDR OSD-120',
    shortName: 'Veggie Unit',
    massKg: 450,
    costM: 25,
    scienceBonus: 40,
    whatIsIt:
      'Real NASA plant chamber (OSD-120) running 16h/day LEDs to grow Outredgeous lettuce, generating oxygen and fresh food.',
    nasaRef: 'NASA OSDR OSD-120 (Massa et al., 2017)',
    startingDelta: { lifeSupport: 15 },
  },
  {
    id: 'meda',
    name: 'Perseverance MEDA Station',
    shortName: 'MEDA Station',
    massKg: 350,
    costM: 15,
    scienceBonus: 35,
    whatIsIt:
      'Weather analyzer from the Perseverance rover measuring -85°C Martian nights, dust storms (τ=0.85), and 14-min one-way radio delays.',
    nasaRef: 'Mars 2020 Perseverance MEDA',
    startingDelta: { energy: 10, comms: 5 },
  },
  {
    id: 'donki',
    name: 'DONKI Shield & Sensor',
    shortName: 'DONKI Shield',
    massKg: 500,
    costM: 25,
    scienceBonus: 25,
    whatIsIt:
      'Space-weather sensor linked to NASA DONKI to detect solar flares (such as Class X8.7) before they hit Ares Base.',
    nasaRef: 'NASA CCMC DONKI (/FLR)',
    startingDelta: { shield: 15 },
  },
];

export const RESOURCE_META_EN: Record<
  ResourceKey,
  { label: string; unit: string; shortLabel: string; colorClass: string; barBg: string }
> = {
  energy: {
    label: 'Energy',
    shortLabel: 'Energy',
    unit: '%',
    colorClass: 'text-amber-400',
    barBg: 'bg-amber-400',
  },
  lifeSupport: {
    label: 'Life Support',
    shortLabel: 'Life Sup.',
    unit: '%',
    colorClass: 'text-emerald-400',
    barBg: 'bg-emerald-400',
  },
  shield: {
    label: 'Shield',
    shortLabel: 'Shield',
    unit: '%',
    colorClass: 'text-sky-400',
    barBg: 'bg-sky-400',
  },
  comms: {
    label: 'Comms',
    shortLabel: 'Comms',
    unit: '%',
    colorClass: 'text-violet-400',
    barBg: 'bg-violet-400',
  },
};

export const SOL_SCENARIOS_EN: SolScenario[] = [
  {
    sol: 1,
    title: 'Pipe Biofilm Ticks & 14-Min Silence',
    actLabel: 'Sol 1 · Mystery & Tension',
    quackExpression: 'terror',
    methodStep: 'Observação',
    quackQuoteByProfile: {
      explorers:
        '“Quack! Look inside the water pipes! Sticky little germs called biofilms — our ‘Alien Ticks’ — are clogging everything! Outside it is -85°C and messages to Earth take 14 minutes each way!”',
      strategists:
        '“Quack! Don’t look behind you... Extremophile biofilms (‘Alien Ticks’ — NASA OSDR) are draining power and clogging our water loops! Outside is -85°C (MEDA) and Earth radio takes 14 min one-way (28 min round trip)!”',
      educators:
        '“Biological engineering alert: spaceflight biofilms (studied on the ISS via NASA OSDR) obstruct water recycling lines while Martian night drops to -85°C and Earth-Mars latency enforces a 28-minute round-trip delay.”',
    },
    nasaContextFact: 'Mars MEDA: -85°C night · 14 min one-way (28 min RTT) · NASA OSDR Biofilms',
    badge: {
      id: 'biofilm',
      title: 'Biofilm Hunter',
      subtitle: 'Cleared water pipes under deep-space radio delay',
      nasaConnection: 'Based on Zea et al. (ISS Biofilms) & Mars 2020 MEDA',
    },
    easterEggLabel: 'Curious alien peeks and blinks through the hatch',
    cards: [
      {
        id: 'A',
        category: 'Recovery',
        title: 'Act Locally — Thermal Flush',
        summaryByProfile: {
          explorers: 'Heat up the water pipes right now without waiting for Earth!',
          strategists:
            'Run an immediate thermal flush in the pipes without waiting 28 min for Earth.',
          educators:
            'Local autonomy: applies thermal shock to disrupt biofilms, trading shield and EVA radio margin.',
        },
        effects: { lifeSupport: 20, energy: 15, comms: -20, shield: -15 },
        scienceExplanationByProfile: {
          explorers:
            'You warmed up the water fast! The ‘Alien Ticks’ let go of the pipes, though our radio got tired!',
          strategists:
            'Thermal shock broke down the biofilm matrix locally without waiting 28 minutes for Earth, using extra shield margin.',
          educators:
            'Autonomous decision validated by the Scientific Method: under 28-min latency, local action prevented full water loop blockage.',
        },
      },
      {
        id: 'B',
        category: 'Containment',
        title: 'Wait for Earth Command',
        summaryByProfile: {
          explorers: 'Send a help signal and wait 28 minutes for Earth to reply.',
          strategists:
            'Preserves EVA supplies and waits for instructions (bonus if in High Relay Orbit).',
          educators:
            'Conservative protocol: preserves comms integrity while allowing steady power drain during orbital latency.',
        },
        effects: { comms: 15, shield: 10, energy: -30 },
        bonusNote: '+10% extra Comms if you chose High Relay Orbit!',
        scienceExplanationByProfile: {
          explorers:
            'Earth replied clearly, but while the message traveled across space, our batteries drained quite a bit!',
          strategists:
            'The Earth-Mars distance (~225 million km) imposes a 14-min one-way speed-of-light delay, draining batteries while waiting.',
          educators:
            'Demonstrates the physical impact of finite speed of light on telemetry: autonomous systems are vital under high latency.',
        },
      },
      {
        id: 'C',
        category: 'Hybrid Engineering',
        title: 'Local UV Filter',
        summaryByProfile: {
          explorers: 'Shine a special UV light inside the pipes to clean gently and steadily.',
          strategists:
            'Activates ultraviolet sterilization in water ducts, balancing power and radio cost.',
          educators:
            'Low-peak hybrid engineering: applies UV-C radiation in ducts to curb biofilms with distributed load.',
        },
        effects: { lifeSupport: 12, energy: -12, comms: -10 },
        scienceExplanationByProfile: {
          explorers:
            'The special UV light stopped the germs from growing without draining the battery!',
          strategists:
            'UV-C light lowers bacterial adhesion (like ISS tests) while keeping all 4 habitat bars balanced.',
          educators:
            'Balanced systems trade-off: continuous UV disinfection avoids thermal spikes and preserves habitat resilience.',
        },
      },
    ],
  },
  {
    sol: 2,
    title: 'Budget Freeze & Solar Storm',
    actLabel: 'Sol 2 · High Drama',
    quackExpression: 'drama',
    methodStep: 'Hipótese',
    earthTransmission:
      'Earth: “Hold tight, Ares Base! The committee froze funding and canceled spare parts!”',
    quackQuoteByProfile: {
      explorers:
        '“By my feathers! Earth ran out of money for spare parts and a giant wave from the Sun is heading right for us!”',
      strategists:
        '“By my feathers! Zero spare parts and a Class X8.7 solar flare (NASA DONKI) is slamming toward Mars!”',
      educators:
        '“Dual crisis: logistics budget freeze paired with a real Class X8.7 solar flare recorded in NASA DONKI.”',
    },
    nasaContextFact: 'NASA DONKI: Real Solar Flare (Class X8.7) · No spare hardware',
    badge: {
      id: 'solar',
      title: 'Solar Storm Guardian',
      subtitle: 'Protected Ares Base from a solar flare with zero spare parts',
      nasaConnection: 'Real space-weather tracking via NASA CCMC DONKI',
    },
    easterEggLabel: 'Flying saucer cruises across the orbital window',
    cards: [
      {
        id: 'A',
        category: 'Recovery',
        title: 'Max Magnetic Shield',
        summaryByProfile: {
          explorers: 'Turn the super shield up to max power to bounce the Sun’s rays!',
          strategists:
            'Boosts deflector field against Class X8.7 solar particles at heavy electrical cost.',
          educators:
            'Prioritizes active electromagnetic shielding (+25% Shield) at severe battery cost (-35% Energy).',
        },
        effects: { shield: 25, energy: -35 },
        scienceExplanationByProfile: {
          explorers:
            'The shield glowed bright and blocked the angry Sun, though our batteries almost fell asleep!',
          strategists:
            'Since Mars lacks a global magnetic field like Earth, artificial deflection demands huge electrical power.',
          educators:
            'Illustrates the absence of a planetary magnetosphere on Mars and the energy penalty of active proton shielding.',
        },
      },
      {
        id: 'B',
        category: 'Containment',
        title: 'Water Shelter & Eco Mode',
        summaryByProfile: {
          explorers: 'Everyone hides behind the water tanks and dims the lights!',
          strategists:
            'Uses water as a radiation barrier and cuts load (bonus if you saved Hangar budget!).',
          educators:
            'Passive hydrogen shielding via water tanks plus load shedding (bonus if Hangar budget was saved).',
        },
        effects: { energy: 15, lifeSupport: -30 },
        bonusNote: '+10% bonus Energy if you saved $15M+ in the Hangar!',
        scienceExplanationByProfile: {
          explorers:
            'Did you know water stops space radiation like a heavy blanket? Saved energy, though air got tight!',
          strategists:
            'Hydrogen atoms in water absorb cosmic radiation (a real NASA method!), though dimming systems lowers Life Support.',
          educators:
            'Real concept of passive shielding via hydrogen-rich materials (H₂O) and pre-launch budget margin management.',
        },
      },
      {
        id: 'C',
        category: 'Hybrid Engineering',
        title: 'Reorient Solar Arrays',
        summaryByProfile: {
          explorers: 'Tilt the solar panels sideways so the storm doesn’t fry them!',
          strategists:
            'Tilts solar panels edge-on to cut radiation damage without shutting down the habitat.',
          educators:
            'Geometric mitigation: reduces cross-sectional exposure to energetic particles while keeping partial power.',
        },
        effects: { shield: 15, energy: -15, lifeSupport: -10 },
        scienceExplanationByProfile: {
          explorers:
            'By tilting the panels sideways, the solar storm passed without breaking anything vital!',
          strategists:
            'Changing incidence angle protects solar cells from particle degradation during an X8.7 event.',
          educators:
            'Balanced engineering compromise: protects critical hardware by reducing exposed area with modest systemic penalty.',
        },
      },
    ],
  },
  {
    sol: 3,
    title: 'Zero-G Turbulence & Dark Greenhouse',
    actLabel: 'Sol 3 · Comedy & Chaos',
    quackExpression: 'dizzy',
    methodStep: 'Experimento',
    requiresMinigame: true,
    quackQuoteByProfile: {
      explorers:
        '“Quack-ouch! Felt like dancing mambo inside a tornado! Everything floated away and the Veggie Greenhouse went dark! Help me find the 3 hidden tools!”',
      strategists:
        '“Quack-ouch! Felt like dancing mambo in a hurricane! Tools floated everywhere and the Veggie Unit (16h LED — OSDR OSD-120) went dark! Find the 3 hidden tools!”',
      educators:
        '“Mechanical turbulence and blackout in the Veggie botanical chamber (16h LED photoperiod, OSDR OSD-120). Recover the 3 misplaced workshop instruments before choosing.”',
    },
    nasaContextFact: 'NASA OSDR OSD-120: Outredgeous Lettuce · 16h/day LEDs + Dust τ=0.85',
    badge: {
      id: 'botanist',
      title: 'Space Botanist',
      subtitle: 'Stabilized the cabin and saved the Veggie photosynthesis cycle',
      nasaConnection: 'Veggie hardware validation on ISS (Massa et al., 2017)',
    },
    easterEggLabel: 'UFO abducts a smiling space cow in the Martian sky',
    cards: [
      {
        id: 'A',
        category: 'Recovery',
        title: 'Save Veggie Harvest',
        summaryByProfile: {
          explorers: 'Turn on all the colorful lettuce lights for 16 hours so they make fresh air!',
          strategists:
            'Supplies full 16h/day LEDs (OSD-120) to save Outredgeous lettuce oxygen production.',
          educators:
            'Maintains full 16h LED photoperiod for photosynthesis and O₂ at high battery draw.',
        },
        effects: { lifeSupport: 25, energy: -30 },
        scienceExplanationByProfile: {
          explorers:
            'The lettuces grew bright green and made plenty of fresh air, but used lots of battery power!',
          strategists:
            'On the ISS, Outredgeous lettuce requires red, blue, and green LEDs for 16h/day to thrive and support crew well-being.',
          educators:
            'Reproduces real Veggie experimental parameters (OSDR OSD-120) and its electrical load on habitat energy.',
        },
      },
      {
        id: 'B',
        category: 'Containment',
        title: 'Clean Dust Off Solar Panels',
        summaryByProfile: {
          explorers: 'Step out quickly with a space duster to wipe red dust off the solar wings!',
          strategists:
            'Clears Martian dust (opacity τ=0.85) from solar arrays, restoring +30% Energy.',
          educators:
            'Restores photovoltaic efficiency attenuated by fine dust (MEDA τ=0.85), briefly pausing the greenhouse.',
        },
        effects: { energy: 30, lifeSupport: -25 },
        scienceExplanationByProfile: {
          explorers:
            'With dust off the panels, sunlight charged our batteries super fast again!',
          strategists:
            'Martian dust (measured by MEDA) blocks sunlight on arrays; cleaning them restores electrical generation.',
          educators:
            'Demonstrates atmospheric optical depth (τ=0.85) impact on solar power, seen on Spirit, Opportunity, and InSight.',
        },
      },
      {
        id: 'C',
        category: 'Hybrid Engineering',
        title: 'Pulsed LED Cycle',
        summaryByProfile: {
          explorers: 'Blink the plant lights super fast to save power while keeping plants happy!',
          strategists:
            'Uses pulsed LEDs in Veggie Greenhouse to sustain oxygen with lower energy draw.',
          educators:
            'Pulse-width modulation (PWM) on greenhouse LEDs: preserves photosynthesis at reduced instantaneous load.',
        },
        effects: { lifeSupport: 14, energy: -12, shield: -10 },
        scienceExplanationByProfile: {
          explorers:
            'Blinking at the right rhythm kept the lettuces happy and saved the batteries!',
          strategists:
            'Pulsed LEDs optimize photon absorption by leaves while lowering heat and power draw.',
          educators:
            'Efficient engineering solution: optimizes photons-per-Watt ratio to keep the greenhouse running during scarcity.',
        },
      },
    ],
  },
  {
    sol: 4,
    title: 'Orbital Window Rendezvous & Landing',
    actLabel: 'Sol 4 · Hope & Triumph',
    quackExpression: 'celebrate',
    methodStep: 'Conclusão',
    earthTransmission:
      'Earth: “You beat biofilms, budget cuts, and solar storms without giving up. Rescue ship has entered the orbital window!”',
    quackQuoteByProfile: {
      explorers:
        '“Woohoo! The rescue ship is up in the Martian sky! Let’s tune our final buttons carefully so it lands safely and brings us home!”',
      strategists:
        '“Fine-tune the final resources through the dust squall and guide the rescue ship down to Ares Base!”',
      educators:
        '“Mission conclusion phase: orbital rendezvous and precision landing under low-visibility dust winds in Jezero Crater.”',
    },
    nasaContextFact: 'Earth-Mars Orbital Window · Dust winds in Jezero Crater',
    badge: {
      id: 'commander',
      title: 'Mars Commander',
      subtitle: 'Completed all 4 Sols of Ares Base with scientific mastery',
      nasaConnection: 'Full integration: DONKI + OSDR + MEDA + APOD',
    },
    easterEggLabel: 'Friendly alien waves an Ares Base flag',
    cards: [
      {
        id: 'A',
        category: 'Recovery',
        title: 'Beacon & Max Radar',
        summaryByProfile: {
          explorers: 'Turn on all spotlights and space beacons so our rescue ship spots us!',
          strategists:
            'Fires optical beacon and high-power radar through dust, boosting Comms and Life Support.',
          educators:
            'Maximizes signal-to-noise ratio during final approach (+20% Comms, +15% Life Support), taxing shield and energy.',
        },
        effects: { lifeSupport: 15, comms: 20, shield: -25, energy: -15 },
        scienceExplanationByProfile: {
          explorers:
            'The rescue ship spotted our bright lights through the dust and swooped right in!',
          strategists:
            'Radar waves pierce dust clouds far better than regular cameras, guiding precision landings.',
          educators:
            'Applies active radar sensing for navigation under low atmospheric visibility.',
        },
      },
      {
        id: 'B',
        category: 'Containment',
        title: 'Slow Telemetry-Guided Descent',
        summaryByProfile: {
          explorers: 'Float down nice and slow following computer maps for a gentle touchdown.',
          strategists:
            'Protects the heat shield during entry, requiring longer Life Support endurance.',
          educators:
            'Conservative entry profile preserves structural shield (+15% Shield) at the expense of longer consumable use.',
        },
        effects: { shield: 15, lifeSupport: -25, energy: -15 },
        scienceExplanationByProfile: {
          explorers:
            'Coming down slowly kept the hull super safe, though it used extra air while waiting!',
          strategists:
            'Gentle entry angles cut thermal and mechanical stress on the spacecraft heat shield.',
          educators:
            'Illustrates the classic trade-off between reentry thermal load (shield) and mission duration (consumables).',
        },
      },
      {
        id: 'C',
        category: 'Hybrid Engineering',
        title: 'Orbital Phasing Approach',
        summaryByProfile: {
          explorers: 'Fly a graceful loop in space until the dust clears before touching down!',
          strategists:
            'Synchronizes rendezvous orbit with the rescue ship while keeping systems balanced.',
          educators:
            'Orbital phasing maneuver: strengthens comms link (+12%) and life support (+5%) with gentle energy and shield cost (-5%).',
        },
        effects: { comms: 12, lifeSupport: 5, energy: -5, shield: -5 },
        scienceExplanationByProfile: {
          explorers:
            'What a smooth space curve! The rescue ship landed right on Ares Base!',
          strategists:
            'Aligning orbital windows cuts landing errors and secures continuous contact with mission control.',
          educators:
            'Elegant finish: orbital synchronization minimizes thermal risk and maximizes telemetry windows.',
        },
      },
    ],
  },
];

export const BASE_HOTSPOTS_EN: HotspotInfo[] = [
  {
    id: 'veggie',
    label: 'Veggie Greenhouse',
    shortTag: '🔍 Veggie Greenhouse',
    relatedResource: 'lifeSupport',
    nasaDataset: 'NASA OSDR OSD-120 · 16h/day LEDs',
    summaryByProfile: {
      explorers:
        'Space lettuces grow here under purple and blue lights for 16 hours a day, making oxygen for the crew!',
      strategists:
        'Veggie Experiment (OSDR OSD-120): grows Outredgeous lettuce under 16h/day LEDs to supply food and O₂.',
      educators:
        'Bioregenerative Veggie unit (Massa et al., 2017): investigates photoperiod, microgravity, and space food security.',
    },
  },
  {
    id: 'pipes',
    label: 'Water Pipes',
    shortTag: '🔍 Water Pipes',
    relatedResource: 'lifeSupport',
    nasaDataset: 'NASA OSDR Biofilms (Zea et al.)',
    summaryByProfile: {
      explorers:
        'Pipes that recycle every drop of water! This is where ‘Alien Ticks’ (biofilms) try to hide.',
      strategists:
        'Closed-loop water system: bacteria form thicker biofilms in microgravity and can clog filters.',
      educators:
        'Based on Zea et al. (2018/2020): spaceflight biofilms display increased thickness and resilience in water recovery lines.',
    },
  },
  {
    id: 'solar',
    label: 'Solar Arrays',
    shortTag: '🔍 Solar Arrays',
    relatedResource: 'energy',
    nasaDataset: 'Mars 2020 MEDA · Dust τ=0.85 & -85°C',
    summaryByProfile: {
      explorers:
        'The shiny wings of our base! They sip sunlight to power everything, even in -85°C Martian nights!',
      strategists:
        'Martian photovoltaic arrays: attenuated by dust storms (τ=0.85) and vital for heating at -85°C.',
      educators:
        'MEDA data (Rodriguez-Manfredi et al., 2021): diurnal thermal swings (-85°C) and aerosol solar attenuation.',
    },
  },
  {
    id: 'antenna',
    label: 'Relay Antenna',
    shortTag: '🔍 Relay Antenna',
    relatedResource: 'comms',
    nasaDataset: 'NASA DONKI + 14-min Delay',
    summaryByProfile: {
      explorers:
        'Giant space ear talking to Earth! Since Mars is far away, each message takes 14 minutes just to arrive.',
      strategists:
        'Deep-space dish: radio waves travel at light speed for 14 min one-way and monitor DONKI solar flares.',
      educators:
        'Earth-Mars Deep Space Network link + CCMC DONKI space-weather telemetry for CME/flare alerts.',
    },
  },
];

export const GLOSSARY_TERMS_EN: Record<string, GlossaryTerm> = {
  jezero: {
    key: 'jezero',
    term: 'Jezero Crater',
    nasaSource: 'Mars 2020 Perseverance',
    definitionByProfile: {
      explorers: 'A giant crater on Mars that once held an ancient lake and where the Perseverance rover landed!',
      strategists: '45-km Martian crater featuring an ancient river delta, real landing site of Perseverance.',
      educators: 'Noachian 45-km paleolake basin explored by Mars 2020 for clay mineral preservation.',
    },
  },
  biofilmes: {
    key: 'biofilmes',
    term: 'Biofilms',
    nasaSource: 'NASA OSDR (Zea et al.)',
    definitionByProfile: {
      explorers: 'Tiny microbe teams that stick inside pipes like jelly — our ‘Alien Ticks’!',
      strategists: 'Microbial communities wrapped in sticky gel that grow inside spacecraft water pipes.',
      educators: 'Surface-attached microbial aggregates in extracellular polymeric matrix studied on ISS (Zea et al.).',
    },
  },
  x87: {
    key: 'x87',
    term: 'Class X8.7',
    nasaSource: 'NASA CCMC DONKI',
    definitionByProfile: {
      explorers: 'A gigantic energetic sneeze from the Sun that can scramble space radios!',
      strategists: 'Extreme X-class solar flare (strongest category), recorded by NASA in May 2024.',
      educators: 'Extreme X8.7 solar flare (peak X-ray flux > 8.7×10⁻⁴ W/m²) tracked via DONKI.',
    },
  },
  meda: {
    key: 'meda',
    term: 'MEDA (-85°C / τ=0.85)',
    nasaSource: 'Rodriguez-Manfredi et al., 2021',
    definitionByProfile: {
      explorers: 'The Mars rover’s weather station that measures freezing nights and red dust in the sky!',
      strategists: 'Perseverance sensor suite measuring wind, dust opacity (τ=0.85), and -85°C nights in Jezero Crater.',
      educators: 'Mars Environmental Dynamics Analyzer: characterizes radiation, pressure, temperature, and aerosol optical depth.',
    },
  },
  veggie: {
    key: 'veggie',
    term: 'Veggie Chamber (16h LED)',
    nasaSource: 'NASA OSDR OSD-120',
    definitionByProfile: {
      explorers: 'A space garden with colorful lights turned on 16 hours a day to grow fresh lettuce!',
      strategists: 'NASA plant growth chamber using 16h/day LEDs to grow Outredgeous lettuce without soil.',
      educators: 'Spaceflight botanical unit validated on ISS (Massa et al., 2017) with controlled spectral lighting.',
    },
  },
  kapton: {
    key: 'kapton',
    term: 'Kapton Tape',
    nasaSource: 'NASA Aerospace Engineering',
    definitionByProfile: {
      explorers: 'A super-tough golden tape that handles extreme heat and freezing cold in space!',
      strategists: 'Golden polyimide insulating film used on NASA spacecraft to protect cables from -269°C to +400°C.',
      educators: 'Thermally stable polyimide used in MLI blankets and spacecraft thermal repairs.',
    },
  },
};

export const CLASSROOM_DEBATE_QUESTIONS_EN = [
  {
    number: '01',
    question:
      'Why does a 14-minute radio delay change how engineers design rovers and bases on Mars?',
    concept: 'Speed of light, 28-minute round-trip latency, and autonomous onboard systems.',
  },
  {
    number: '02',
    question:
      'In the Hangar, why can’t we just take the biggest rocket and every single instrument without checking mass or budget?',
    concept: 'Rocket equation (mass × thrust) and real NASA mission budget trade-offs.',
  },
  {
    number: '03',
    question:
      'How do drinking water (radiation shielding) and lettuce (Veggie OSDR) solve two survival problems at once?',
    concept: 'Bioregenerative systems and dual-purpose resources in closed habitats.',
  },
];

export const PEER_REVIEWED_REFERENCES_EN = [
  {
    authors: 'Zea, L. et al. (2018 / 2020)',
    title: 'Spaceflight-Associated Biofilm Formation in Spacecraft Water Systems (ISS)',
    relevance: 'Scientific basis for the Sol 1 pipe biofilm (“Alien Ticks”) challenge.',
  },
  {
    authors: 'Massa, G. D. et al. (2017)',
    title: 'VEG-01: Veggie Hardware Validation on the International Space Station',
    relevance: 'Real 16h/day LED photoperiod parameter for Outredgeous lettuce in Sol 3.',
  },
  {
    authors: 'Rodriguez-Manfredi, J. A. et al. (2021)',
    title: 'The Mars Environmental Dynamics Analyzer, MEDA (Mars 2020)',
    relevance: 'Real night temperatures (-85°C), dust opacity (τ=0.85), and Martian telemetry.',
  },
];

export function getLocalizedMissionData(lang: Language) {
  if (lang === 'pt') {
    return {
      AGE_PROFILES: AGE_PROFILES_PT,
      TEAM_ROLES: TEAM_ROLES_PT,
      SPACE_AVATARS: SPACE_AVATARS_PT,
      ROCKETS: ROCKETS_PT,
      ORBITS: ORBITS_PT,
      INSTRUMENTS: INSTRUMENTS_PT,
      RESOURCE_META: RESOURCE_META_PT,
      SOL_SCENARIOS: SOL_SCENARIOS_PT,
      BASE_HOTSPOTS: BASE_HOTSPOTS_PT,
      GLOSSARY_TERMS: GLOSSARY_TERMS_PT,
      CLASSROOM_DEBATE_QUESTIONS: CLASSROOM_DEBATE_QUESTIONS_PT,
      PEER_REVIEWED_REFERENCES: PEER_REVIEWED_REFERENCES_PT,
    };
  }
  return {
    AGE_PROFILES: AGE_PROFILES_EN,
    TEAM_ROLES: TEAM_ROLES_EN,
    SPACE_AVATARS: SPACE_AVATARS_EN,
    ROCKETS: ROCKETS_EN,
    ORBITS: ORBITS_EN,
    INSTRUMENTS: INSTRUMENTS_EN,
    RESOURCE_META: RESOURCE_META_EN,
    SOL_SCENARIOS: SOL_SCENARIOS_EN,
    BASE_HOTSPOTS: BASE_HOTSPOTS_EN,
    GLOSSARY_TERMS: GLOSSARY_TERMS_EN,
    CLASSROOM_DEBATE_QUESTIONS: CLASSROOM_DEBATE_QUESTIONS_EN,
    PEER_REVIEWED_REFERENCES: PEER_REVIEWED_REFERENCES_EN,
  };
}
