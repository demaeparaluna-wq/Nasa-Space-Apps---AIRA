import { NasaApodData, NasaDataBundle, NasaFlareData } from '../types/game';

const CACHE_KEY = 'quack_nasa_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 5000;

const DONKI_URL =
  'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR?startDate=2024-05-10&endDate=2024-05-20';
const APOD_RANDOM_URL =
  'https://api.nasa.gov/planetary/apod?api_key=twkpRKCMz8Bmpr9PDLcTWwFHF6TdkmqhMPNLmQnJ&count=1';

export const JEZERO_FALLBACK_IMAGE =
  'https://images-assets.nasa.gov/image/PIA24428/PIA24428~medium.jpg';

export const VERIFIED_NASA_MEMORIES: NasaApodData[] = [
  {
    title: 'Cratera Jezero em Marte — Local de Pouso do Perseverance',
    url: 'https://images-assets.nasa.gov/image/PIA24428/PIA24428~medium.jpg',
    explanation:
      'Vista orbital da Cratera Jezero registrada pela NASA, destacando o antigo delta de rio onde o rover Perseverance e a estação MEDA estudam poeira e sinais de água passada.',
    date: '2021-02-18',
    copyright: 'NASA / JPL-Caltech',
    isFallback: true,
  },
  {
    title: 'Pôr do Sol Azul em Marte — Rover Curiosity',
    url: 'https://images-assets.nasa.gov/image/PIA19400/PIA19400~medium.jpg',
    explanation:
      'Em Marte, o pôr do sol é azulado! A poeira fina na atmosfera marciana espalha a luz vermelha ao redor e deixa o brilho próximo ao disco solar em tons frios de azul.',
    date: '2015-04-15',
    copyright: 'NASA / JPL-Caltech / MSSS',
    isFallback: true,
  },
  {
    title: 'Monte Sharp na Cratera Gale — Rover Curiosity',
    url: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
    explanation:
      'Camadas rochosas do Monte Sharp fotografadas em Marte revelam bilhões de anos de história climática e antigos lagos marcianos.',
    date: '2015-09-09',
    copyright: 'NASA / JPL-Caltech / MSSS',
    isFallback: true,
  },
  {
    title: 'Valles Marineris — O Grande Cânion de Marte',
    url: 'https://images-assets.nasa.gov/image/PIA00422/PIA00422~medium.jpg',
    explanation:
      'Mosaico real das sondas Viking mostrando o gigantesco sistema de cânions Valles Marineris, com mais de 4.000 km de extensão na superfície marciana.',
    date: '1998-05-01',
    copyright: 'NASA / JPL / USGS',
    isFallback: true,
  },
  {
    title: 'Nebulosa de Órion — Maternidade de Estrelas (Hubble)',
    url: 'https://images-assets.nasa.gov/image/PIA08653/PIA08653~medium.jpg',
    explanation:
      'Imagem clássica do Telescópio Espacial Hubble da NASA mostrando nuvens brilhantes de gás e poeira onde milhares de novas estrelas estão nascendo.',
    date: '2006-01-11',
    copyright: 'NASA / ESA / STScI',
    isFallback: true,
  },
];

export function pickRandomVerifiedMemory(excludeUrl?: string): NasaApodData {
  const pool = excludeUrl
    ? VERIFIED_NASA_MEMORIES.filter((item) => item.url !== excludeUrl)
    : VERIFIED_NASA_MEMORIES;
  const source = pool.length > 0 ? pool : VERIFIED_NASA_MEMORIES;
  return source[Math.floor(Math.random() * source.length)];
}

const FALLBACK_FLARE: NasaFlareData = {
  flrID: '2024-05-14T16:46:00-FLR-001',
  classType: 'X8.7',
  peakTime: '2024-05-14T16:51Z',
  sourceLocation: 'S18W89 (Região Ativa AR3664)',
  isFallback: true,
};

const CURATED_OSDR = {
  studyId: 'OSD-120',
  title: 'Estufa Veggie & Formação de Biofilmes em Microgravidade',
  ledHoursPerDay: 16,
  crop: 'Alface Outredgeous (Lactuca sativa)',
  biofilmFinding:
    'Micro-organismos formam biofilmes espessos em dutos de água espaciais (Zea et al., ISS)',
};

const CURATED_MEDA = {
  mission: 'Mars 2020 Perseverance — MEDA',
  location: 'Cratera Jezero, Marte',
  nightTempC: -85,
  dustOpacityTau: 0.85,
  oneWayRadioDelayMin: 14,
};

function readCache(): NasaDataBundle | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NasaDataBundle;
    if (!parsed || !parsed.fetchedAt) return null;
    const isFresh = Date.now() - parsed.fetchedAt < CACHE_TTL_MS;
    if (!isFresh) return null;
    return {
      ...parsed,
      status: parsed.donkiFlare.isFallback && parsed.apod.isFallback ? 'archived' : 'cache',
    };
  } catch {
    return null;
  }
}

function writeCache(bundle: NasaDataBundle) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(bundle));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) return null;
    return res;
  } catch {
    window.clearTimeout(timer);
    return null;
  }
}

interface RawDonkiFlare {
  flrID?: string;
  classType?: string;
  peakTime?: string;
  sourceLocation?: string;
}

interface RawApod {
  title?: string;
  url?: string;
  media_type?: string;
  explanation?: string;
  date?: string;
  copyright?: string;
}

export async function fetchRandomNasaApod(excludeUrl?: string): Promise<NasaApodData> {
  const res = await fetchWithTimeout(APOD_RANDOM_URL);
  if (res) {
    try {
      const json = (await res.json()) as RawApod | RawApod[];
      const items = Array.isArray(json) ? json : [json];
      const imageItem = items.find(
        (item) => item && item.media_type === 'image' && item.url && item.title
      );
      if (imageItem && imageItem.url && imageItem.title && imageItem.url !== excludeUrl) {
        return {
          title: imageItem.title,
          url: imageItem.url,
          explanation:
            imageItem.explanation ||
            'Registro astronômico real capturado através do acervo NASA Astronomy Picture of the Day.',
          date: imageItem.date || new Date().toISOString().slice(0, 10),
          copyright: imageItem.copyright,
          isFallback: false,
        };
      }
    } catch {
      // Silent fallback to verified NASA array
    }
  }
  return pickRandomVerifiedMemory(excludeUrl);
}

export function getArchivedFallbackBundle(): NasaDataBundle {
  return {
    status: 'archived',
    fetchedAt: Date.now(),
    donkiFlare: FALLBACK_FLARE,
    apod: VERIFIED_NASA_MEMORIES[0],
    osdr: CURATED_OSDR,
    meda: CURATED_MEDA,
  };
}

export async function loadResilientNasaData(): Promise<NasaDataBundle> {
  const cached = readCache();
  if (cached) {
    return cached;
  }

  let flareData: NasaFlareData = FALLBACK_FLARE;
  let apodData: NasaApodData = pickRandomVerifiedMemory();
  let liveHits = 0;

  const [donkiRes, randomApod] = await Promise.all([
    fetchWithTimeout(DONKI_URL),
    fetchRandomNasaApod(),
  ]);

  if (donkiRes) {
    try {
      const json = (await donkiRes.json()) as RawDonkiFlare[];
      if (Array.isArray(json) && json.length > 0) {
        const strongest =
          json.find((item) => item.classType?.startsWith('X8')) ||
          json.find((item) => item.classType?.startsWith('X')) ||
          json[0];
        if (strongest && strongest.flrID && strongest.classType) {
          flareData = {
            flrID: strongest.flrID,
            classType: strongest.classType,
            peakTime: strongest.peakTime || '2024-05-14T16:51Z',
            sourceLocation: strongest.sourceLocation || 'S18W89',
            isFallback: false,
          };
          liveHits += 1;
        }
      }
    } catch {
      // Silent fallback
    }
  }

  if (!randomApod.isFallback) {
    apodData = randomApod;
    liveHits += 1;
  }

  const bundle: NasaDataBundle = {
    status: liveHits > 0 ? 'live' : 'archived',
    fetchedAt: Date.now(),
    donkiFlare: flareData,
    apod: apodData,
    osdr: CURATED_OSDR,
    meda: CURATED_MEDA,
  };

  if (liveHits > 0) {
    writeCache(bundle);
  }

  return bundle;
}
