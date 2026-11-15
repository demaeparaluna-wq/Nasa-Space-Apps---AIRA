export type AgeProfile = 'explorers' | 'strategists' | 'educators';

export type PlayMode = 'solo' | 'team';

export type AvatarId = 'astra' | 'orbita' | 'cometa';

export type QuackExpression = 'terror' | 'drama' | 'dizzy' | 'celebrate';

export type GameScreen = 'splash' | 'prologue' | 'hangar' | 'command' | 'victory';

export type ResourceKey = 'energy' | 'lifeSupport' | 'shield' | 'comms';

export interface Resources {
  energy: number;
  lifeSupport: number;
  shield: number;
  comms: number;
}

export interface ResourceDelta {
  energy?: number;
  lifeSupport?: number;
  shield?: number;
  comms?: number;
}

export type RocketId = 'light' | 'heavy';
export type OrbitId = 'high' | 'low';
export type InstrumentId = 'veggie' | 'meda' | 'donki';

export interface HangarConfig {
  rocket: RocketId | null;
  orbit: OrbitId | null;
  instruments: InstrumentId[];
}

export interface RocketOption {
  id: RocketId;
  name: string;
  costM: number;
  maxMassKg: number;
  whatIsIt: string;
  summary: string;
  tradeoffNote: string;
}

export interface OrbitOption {
  id: OrbitId;
  name: string;
  whatIsIt: string;
  summary: string;
  bonusLabel: string;
  delta: ResourceDelta;
}

export interface InstrumentOption {
  id: InstrumentId;
  name: string;
  shortName: string;
  massKg: number;
  costM: number;
  scienceBonus: number;
  whatIsIt: string;
  nasaRef: string;
  startingDelta: ResourceDelta;
}

export type BadgeId = 'biofilm' | 'solar' | 'botanist' | 'commander';

export interface BadgeInfo {
  id: BadgeId;
  title: string;
  subtitle: string;
  nasaConnection: string;
}

export type ScientificMethodStep =
  | 'Observação'
  | 'Hipótese'
  | 'Experimento'
  | 'Conclusão';

export interface SolCard {
  id: 'A' | 'B' | 'C';
  category: string;
  title: string;
  summaryByProfile: Record<AgeProfile, string>;
  effects: ResourceDelta;
  bonusNote?: string;
  scienceExplanationByProfile: Record<AgeProfile, string>;
}

export interface SolScenario {
  sol: 1 | 2 | 3 | 4;
  title: string;
  actLabel: string;
  quackExpression: QuackExpression;
  methodStep: ScientificMethodStep;
  earthTransmission?: string;
  quackQuoteByProfile: Record<AgeProfile, string>;
  nasaContextFact: string;
  badge: BadgeInfo;
  easterEggLabel: string;
  requiresMinigame?: boolean;
  cards: SolCard[];
}

export interface HotspotInfo {
  id: 'veggie' | 'pipes' | 'solar' | 'antenna';
  label: string;
  shortTag: string;
  summaryByProfile: Record<AgeProfile, string>;
  nasaDataset: string;
  relatedResource: ResourceKey;
}

export interface GlossaryTerm {
  key: string;
  term: string;
  definitionByProfile: Record<AgeProfile, string>;
  nasaSource: string;
}

export type NasaDataSourceStatus = 'live' | 'cache' | 'archived';

export interface NasaFlareData {
  flrID: string;
  classType: string;
  peakTime: string;
  sourceLocation: string;
  isFallback: boolean;
}

export interface NasaApodData {
  title: string;
  url: string;
  explanation: string;
  date: string;
  copyright?: string;
  isFallback: boolean;
}

export interface NasaDataBundle {
  status: NasaDataSourceStatus;
  fetchedAt: number;
  donkiFlare: NasaFlareData;
  apod: NasaApodData;
  osdr: {
    studyId: string;
    title: string;
    ledHoursPerDay: number;
    crop: string;
    biofilmFinding: string;
  };
  meda: {
    mission: string;
    location: string;
    nightTempC: number;
    dustOpacityTau: number;
    oneWayRadioDelayMin: number;
  };
}

export interface ModalFeedbackState {
  type: 'badge' | 'failure';
  sol: 1 | 2 | 3 | 4;
  badge?: BadgeInfo;
  chosenCard?: SolCard;
  appliedDelta: ResourceDelta;
  failedResource?: ResourceKey;
  failurePhysicsByProfile?: Record<AgeProfile, string>;
}

export interface ChoiceHistoryEntry {
  sol: 1 | 2 | 3 | 4;
  solTitle: string;
  cardId: 'A' | 'B' | 'C';
  cardTitle: string;
  category: string;
  appliedDelta: ResourceDelta;
  resultingResources: Resources;
  enteredDanger: boolean;
}
