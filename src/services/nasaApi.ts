import { NasaApodData, NasaDataBundle, NasaFlareData } from '../types/game';

const CACHE_KEY = 'quack_nasa_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 4000;

// Circuit Breaker configuration: trip on 1st failure, stay OPEN for 5 minutes
const CIRCUIT_FAILURE_THRESHOLD = 1;
const CIRCUIT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const DONKI_URL =
  'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR?startDate=2024-05-10&endDate=2024-05-20';
const APOD_RANDOM_URL =
  'https://api.nasa.gov/planetary/apod?api_key=twkpRKCMz8Bmpr9PDLcTWwFHF6TdkmqhMPNLmQnJ&count=6';

export const JEZERO_FALLBACK_IMAGE =
  'https://images-assets.nasa.gov/image/PIA24428/PIA24428~medium.jpg';

const NON_PHOTO_URL_PATTERN =
  /(?:^|[^a-z])(nasa[-_]?logo|meatball|worm[-_]?logo|emblem|insignia|mission[-_]?patch|agency[-_]?seal|official[-_]?seal|logo|seal|patch|badge|icon|favicon|banner|placeholder|default[-_]?image|no[-_]?image|brand(?:ing)?)(?:[^a-z]|$)/i;
const NON_PHOTO_EXT_PATTERN = /\.(svg|gif|ico)(?:[?#].*)?$/i;
const VIDEO_HOST_PATTERN = /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;
const NON_PHOTO_TITLE_PATTERN =
  /\b(nasa\s*logo|logo\s*(of\s*)?nasa|meatball|nasa\s*worm|agency\s*seal|official\s*seal|mission\s*patch|emblem|insignia|anniversary\s*logo|placeholder|brand\s*mark)\b/i;
const NON_PHOTO_EXPLANATION_PATTERN =
  /\b(official\s+nasa\s+logo|nasa\s+meatball|nasa\s+worm\s+logo|agency\s+insignia)\b/i;

export type NasaEndpointKey = 'donki' | 'apod';
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface EndpointCircuitStatus {
  state: CircuitState;
  failureCount: number;
  openedAt: number | null;
  lastFailureReason?: string;
}

const circuitBreakers: Record<NasaEndpointKey, EndpointCircuitStatus> = {
  donki: { state: 'CLOSED', failureCount: 0, openedAt: null },
  apod: { state: 'CLOSED', failureCount: 0, openedAt: null },
};

// In-memory session cache & deduplication (works cleanly even when localStorage/HTTP cache are disabled)
let memoryBundleCache: NasaDataBundle | null = null;
let inFlightBundlePromise: Promise<NasaDataBundle> | null = null;
const memoryApodPool: NasaApodData[] = [];
const rejectedApodUrls = new Set<string>();

export const VERIFIED_NASA_MEMORIES: readonly NasaApodData[] = Object.freeze([
  Object.freeze({
    title: 'Cratera Jezero em Marte — Local de Pouso do Perseverance',
    url: 'https://images-assets.nasa.gov/image/PIA24428/PIA24428~medium.jpg',
    explanation:
      'Vista orbital da Cratera Jezero registrada pela NASA, destacando o antigo delta de rio onde o rover Perseverance e a estação MEDA estudam poeira e sinais de água passada.',
    date: '2021-02-18',
    copyright: 'NASA / JPL-Caltech',
    isFallback: true,
  }),
  Object.freeze({
    title: 'Pôr do Sol Azul em Marte — Rover Curiosity',
    url: 'https://images-assets.nasa.gov/image/PIA19400/PIA19400~medium.jpg',
    explanation:
      'Em Marte, o pôr do sol é azulado! A poeira fina na atmosfera marciana espalha a luz vermelha ao redor e deixa o brilho próximo ao disco solar em tons frios de azul.',
    date: '2015-04-15',
    copyright: 'NASA / JPL-Caltech / MSSS',
    isFallback: true,
  }),
  Object.freeze({
    title: 'Monte Sharp na Cratera Gale — Rover Curiosity',
    url: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
    explanation:
      'Camadas rochosas do Monte Sharp fotografadas em Marte revelam bilhões de anos de história climática e antigos lagos marcianos.',
    date: '2015-09-09',
    copyright: 'NASA / JPL-Caltech / MSSS',
    isFallback: true,
  }),
  Object.freeze({
    title: 'Valles Marineris — O Grande Cânion de Marte',
    url: 'https://images-assets.nasa.gov/image/PIA00422/PIA00422~medium.jpg',
    explanation:
      'Mosaico real das sondas Viking mostrando o gigantesco sistema de cânions Valles Marineris, com mais de 4.000 km de extensão na superfície marciana.',
    date: '1998-05-01',
    copyright: 'NASA / JPL / USGS',
    isFallback: true,
  }),
  Object.freeze({
    title: 'Nebulosa de Órion — Maternidade de Estrelas (Hubble)',
    url: 'https://images-assets.nasa.gov/image/PIA08653/PIA08653~medium.jpg',
    explanation:
      'Imagem clássica do Telescópio Espacial Hubble da NASA mostrando nuvens brilhantes de gás e poeira onde milhares de novas estrelas estão nascendo.',
    date: '2006-01-11',
    copyright: 'NASA / ESA / STScI',
    isFallback: true,
  }),
]);

const FALLBACK_FLARE: NasaFlareData = Object.freeze({
  flrID: '2024-05-14T16:46:00-FLR-001',
  classType: 'X8.7',
  peakTime: '2024-05-14T16:51Z',
  sourceLocation: 'S18W89 (Região Ativa AR3664)',
  isFallback: true,
});

const CURATED_OSDR = Object.freeze({
  studyId: 'OSD-120',
  title: 'Estufa Veggie & Formação de Biofilmes em Microgravidade',
  ledHoursPerDay: 16,
  crop: 'Alface Outredgeous (Lactuca sativa)',
  biofilmFinding:
    'Micro-organismos formam biofilmes espessos em dutos de água espaciais (Zea et al., ISS)',
});

const CURATED_MEDA = Object.freeze({
  mission: 'Mars 2020 Perseverance — MEDA',
  location: 'Cratera Jezero, Marte',
  nightTempC: -85,
  dustOpacityTau: 0.85,
  oneWayRadioDelayMin: 14,
});

export const LocalFallback: Readonly<NasaDataBundle> = Object.freeze({
  status: 'archived',
  fetchedAt: 0,
  donkiFlare: FALLBACK_FLARE,
  apod: VERIFIED_NASA_MEMORIES[0],
  osdr: CURATED_OSDR,
  meda: CURATED_MEDA,
});

function createLocalFallbackBundle(): NasaDataBundle {
  return {
    status: LocalFallback.status,
    fetchedAt: Date.now(),
    donkiFlare: { ...LocalFallback.donkiFlare },
    apod: { ...LocalFallback.apod },
    osdr: { ...LocalFallback.osdr },
    meda: { ...LocalFallback.meda },
  };
}

export function isEnvironmentOffline(explicitOffline?: boolean): boolean {
  if (explicitOffline) return true;
  if (typeof fetch !== 'function') return true;
  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return true;
    }
  } catch {
    // Ignore restricted navigator access
  }
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const offlineFlag = params.get('offline') || params.get('nasa');
      if (offlineFlag === '1' || offlineFlag === 'true' || offlineFlag === 'offline') {
        return true;
      }
    }
  } catch {
    // Ignore restricted location access
  }
  return false;
}

function evaluateCircuitState(endpoint: NasaEndpointKey, now = Date.now()): CircuitState {
  const breaker = circuitBreakers[endpoint];
  if (
    breaker.state === 'OPEN' &&
    breaker.openedAt !== null &&
    now - breaker.openedAt >= CIRCUIT_COOLDOWN_MS
  ) {
    breaker.state = 'HALF_OPEN';
  }
  return breaker.state;
}

function canAttemptEndpoint(endpoint: NasaEndpointKey, explicitOffline?: boolean): boolean {
  if (isEnvironmentOffline(explicitOffline)) {
    return false;
  }
  const state = evaluateCircuitState(endpoint);
  return state === 'CLOSED' || state === 'HALF_OPEN';
}

function recordEndpointSuccess(endpoint: NasaEndpointKey): void {
  circuitBreakers[endpoint] = {
    state: 'CLOSED',
    failureCount: 0,
    openedAt: null,
    lastFailureReason: undefined,
  };
}

function recordEndpointFailure(endpoint: NasaEndpointKey, reason: string): void {
  const breaker = circuitBreakers[endpoint];
  const nextFailures = breaker.failureCount + 1;
  const shouldTrip =
    breaker.state === 'HALF_OPEN' || nextFailures >= CIRCUIT_FAILURE_THRESHOLD;

  circuitBreakers[endpoint] = {
    state: shouldTrip ? 'OPEN' : 'CLOSED',
    failureCount: nextFailures,
    openedAt: shouldTrip ? Date.now() : breaker.openedAt,
    lastFailureReason: reason,
  };
}

export function getCircuitBreakerSnapshot(): Record<NasaEndpointKey, EndpointCircuitStatus> {
  evaluateCircuitState('donki');
  evaluateCircuitState('apod');
  return {
    donki: { ...circuitBreakers.donki },
    apod: { ...circuitBreakers.apod },
  };
}

export function resetCircuitBreakers(): void {
  circuitBreakers.donki = { state: 'CLOSED', failureCount: 0, openedAt: null };
  circuitBreakers.apod = { state: 'CLOSED', failureCount: 0, openedAt: null };
}

export function markApodUrlRejected(url?: string): void {
  if (url) {
    rejectedApodUrls.add(url);
  }
}

export function isValidSpacePhotoUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  if (rejectedApodUrls.has(trimmed)) return false;
  if (NON_PHOTO_EXT_PATTERN.test(trimmed)) return false;
  if (VIDEO_HOST_PATTERN.test(trimmed)) return false;
  if (NON_PHOTO_URL_PATTERN.test(trimmed)) return false;
  return true;
}

function isValidApodMetadata(
  item: { url?: string; title?: string; explanation?: string; media_type?: string } | null | undefined,
  requireImageMediaType: boolean,
  excludeUrl?: string
): boolean {
  if (!item || !item.url || !item.title) return false;
  if (requireImageMediaType && item.media_type !== 'image') return false;
  if (excludeUrl && item.url === excludeUrl) return false;
  if (!isValidSpacePhotoUrl(item.url)) return false;
  if (NON_PHOTO_TITLE_PATTERN.test(item.title)) return false;
  if (item.explanation && NON_PHOTO_EXPLANATION_PATTERN.test(item.explanation)) return false;
  return true;
}

export function pickRandomVerifiedMemory(excludeUrl?: string): NasaApodData {
  const pool = VERIFIED_NASA_MEMORIES.filter(
    (item) => item.url !== excludeUrl && !rejectedApodUrls.has(item.url)
  );
  const source = pool.length > 0 ? pool : VERIFIED_NASA_MEMORIES;
  const chosen = source[Math.floor(Math.random() * source.length)];
  return { ...chosen };
}

function shouldSkipPersistentCache(explicitSkip?: boolean): boolean {
  if (explicitSkip) return true;
  try {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    const nocache = params.get('nocache') || params.get('cache');
    return nocache === '1' || nocache === 'true' || nocache === 'off';
  } catch {
    return false;
  }
}

function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return null;
    }
    const storage = window.localStorage;
    if (!storage) return null;
    const probeKey = '__sol4_storage_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

function sanitizeCachedBundle(bundle: NasaDataBundle): NasaDataBundle {
  const validApod = isValidApodMetadata(bundle.apod, false)
    ? bundle.apod
    : pickRandomVerifiedMemory();
  return {
    ...bundle,
    apod: validApod,
    status: bundle.donkiFlare.isFallback && validApod.isFallback ? 'archived' : 'cache',
  };
}

function readCache(skipPersistentCache = false): NasaDataBundle | null {
  // Tier 1: In-memory session cache (survives blocked localStorage / incognito / disabled HTTP cache)
  if (memoryBundleCache && Date.now() - memoryBundleCache.fetchedAt < CACHE_TTL_MS) {
    if (isValidApodMetadata(memoryBundleCache.apod, false)) {
      return memoryBundleCache;
    }
    memoryBundleCache = {
      ...memoryBundleCache,
      apod: pickRandomVerifiedMemory(),
    };
    return memoryBundleCache;
  }

  if (shouldSkipPersistentCache(skipPersistentCache)) {
    return null;
  }

  // Tier 2: Guarded localStorage 24h cache
  try {
    const storage = getSafeLocalStorage();
    if (!storage) return null;
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NasaDataBundle;
    if (!parsed || !parsed.fetchedAt || !parsed.donkiFlare || !parsed.apod) return null;
    const isFresh = Date.now() - parsed.fetchedAt < CACHE_TTL_MS;
    if (!isFresh) return null;
    const sanitized = sanitizeCachedBundle(parsed);
    memoryBundleCache = sanitized;
    return sanitized;
  } catch {
    return null;
  }
}

function writeCache(bundle: NasaDataBundle, skipPersistentCache = false): void {
  memoryBundleCache = bundle;
  if (shouldSkipPersistentCache(skipPersistentCache)) {
    return;
  }
  try {
    const storage = getSafeLocalStorage();
    if (!storage) return;
    storage.setItem(CACHE_KEY, JSON.stringify(bundle));
  } catch {
    // Ignore storage quota, incognito, or blocked third-party storage cleanly
  }
}

export function clearNasaCache(): void {
  memoryBundleCache = null;
  memoryApodPool.length = 0;
  try {
    const storage = getSafeLocalStorage();
    storage?.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage denial cleanly
  }
}

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response | null> {
  if (typeof fetch !== 'function') return null;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer =
    controller && typeof window !== 'undefined'
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;
  try {
    const res = await fetch(url, controller ? { signal: controller.signal } : undefined);
    if (timer !== null) window.clearTimeout(timer);
    if (!res.ok) return null;
    return res;
  } catch {
    if (timer !== null) window.clearTimeout(timer);
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

function takeFromMemoryApodPool(excludeUrl?: string): NasaApodData | null {
  while (memoryApodPool.length > 0) {
    const candidate = memoryApodPool.shift()!;
    if (isValidApodMetadata(candidate, false, excludeUrl)) {
      return candidate;
    }
  }
  return null;
}

export async function fetchRandomNasaApod(excludeUrl?: string): Promise<NasaApodData> {
  const pooled = takeFromMemoryApodPool(excludeUrl);
  if (pooled) {
    return pooled;
  }

  // Circuit Breaker & Offline Gate: skip network fetch completely when OPEN or offline
  if (!canAttemptEndpoint('apod')) {
    return pickRandomVerifiedMemory(excludeUrl);
  }

  const res = await fetchWithTimeout(APOD_RANDOM_URL);
  if (!res) {
    recordEndpointFailure('apod', 'network-error-or-timeout');
    return pickRandomVerifiedMemory(excludeUrl);
  }

  try {
    const json = (await res.json()) as RawApod | RawApod[];
    const items = Array.isArray(json) ? json : [json];
    const validPhotos: NasaApodData[] = items
      .filter((item) => isValidApodMetadata(item, true, excludeUrl))
      .map((item) => ({
        title: item.title!,
        url: item.url!,
        explanation:
          item.explanation ||
          'Registro astronômico real capturado através do acervo NASA Astronomy Picture of the Day.',
        date: item.date || new Date().toISOString().slice(0, 10),
        copyright: item.copyright,
        isFallback: false,
      }));

    if (validPhotos.length > 0) {
      recordEndpointSuccess('apod');
      const [selected, ...rest] = validPhotos;
      if (rest.length > 0) {
        memoryApodPool.push(...rest.slice(0, 5));
      }
      return selected;
    }

    recordEndpointFailure('apod', 'no-valid-space-photo-candidates');
  } catch {
    recordEndpointFailure('apod', 'invalid-apod-json');
  }

  return pickRandomVerifiedMemory(excludeUrl);
}

export function getArchivedFallbackBundle(): NasaDataBundle {
  return createLocalFallbackBundle();
}

export async function loadResilientNasaData(options?: {
  skipPersistentCache?: boolean;
  forceLocalFallback?: boolean;
}): Promise<NasaDataBundle> {
  const skipPersistentCache = Boolean(options?.skipPersistentCache);
  const forceLocalFallback = Boolean(options?.forceLocalFallback);

  if (isEnvironmentOffline(forceLocalFallback)) {
    return createLocalFallbackBundle();
  }

  const cached = readCache(skipPersistentCache);
  if (cached) {
    return cached;
  }

  const attemptDonki = canAttemptEndpoint('donki', forceLocalFallback);
  const attemptApod = canAttemptEndpoint('apod', forceLocalFallback);

  // If both endpoint circuits are OPEN, return LocalFallback immediately without any fetch()
  if (!attemptDonki && !attemptApod) {
    return createLocalFallbackBundle();
  }

  // Deduplicate concurrent boot/StrictMode fetches in memory
  if (inFlightBundlePromise) {
    return inFlightBundlePromise;
  }

  inFlightBundlePromise = (async () => {
    const fallbackBundle = createLocalFallbackBundle();
    let flareData: NasaFlareData = fallbackBundle.donkiFlare;
    let apodData: NasaApodData = pickRandomVerifiedMemory();
    let liveHits = 0;

    const [donkiRes, randomApod] = await Promise.all([
      attemptDonki ? fetchWithTimeout(DONKI_URL) : Promise.resolve(null),
      attemptApod ? fetchRandomNasaApod() : Promise.resolve(pickRandomVerifiedMemory()),
    ]);

    if (attemptDonki) {
      if (!donkiRes) {
        recordEndpointFailure('donki', 'network-error-or-timeout');
      } else {
        try {
          const json = (await donkiRes.json()) as RawDonkiFlare[];
          if (Array.isArray(json) && json.length > 0) {
            const strongest =
              json.find((item) => item.classType?.startsWith('X8')) ||
              json.find((item) => item.classType?.startsWith('X')) ||
              json[0];
            if (strongest && strongest.flrID && strongest.classType) {
              recordEndpointSuccess('donki');
              flareData = {
                flrID: strongest.flrID,
                classType: strongest.classType,
                peakTime: strongest.peakTime || '2024-05-14T16:51Z',
                sourceLocation: strongest.sourceLocation || 'S18W89',
                isFallback: false,
              };
              liveHits += 1;
            } else {
              recordEndpointFailure('donki', 'empty-or-malformed-donki-record');
            }
          } else {
            recordEndpointFailure('donki', 'empty-donki-payload');
          }
        } catch {
          recordEndpointFailure('donki', 'invalid-donki-json');
        }
      }
    }

    if (!randomApod.isFallback && isValidApodMetadata(randomApod, false)) {
      apodData = randomApod;
      liveHits += 1;
    }

    if (liveHits === 0) {
      return createLocalFallbackBundle();
    }

    const bundle: NasaDataBundle = {
      status: 'live',
      fetchedAt: Date.now(),
      donkiFlare: flareData,
      apod: apodData,
      osdr: { ...LocalFallback.osdr },
      meda: { ...LocalFallback.meda },
    };

    writeCache(bundle, skipPersistentCache);
    return bundle;
  })();

  try {
    return await inFlightBundlePromise;
  } finally {
    inFlightBundlePromise = null;
  }
}
