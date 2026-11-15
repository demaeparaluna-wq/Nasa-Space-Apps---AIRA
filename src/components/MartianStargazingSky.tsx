import React, { useState } from 'react';
import { Sparkles, Telescope } from 'lucide-react';
import { AgeProfile, Language } from '../types/game';
import { playToolPickupSound } from '../utils/sound';

export interface MartianConstellation {
  id: string;
  name: string;
  nameEn: string;
  hemisphere: string;
  hemisphereEn: string;
  mainStar: string;
  points: { x: number; y: number; label?: string }[];
  lines: [number, number][];
  factByProfile: Record<AgeProfile, string>;
  factByProfileEn: Record<AgeProfile, string>;
}

export const MARTIAN_CONSTELLATIONS: MartianConstellation[] = [
  {
    id: 'cygnus',
    name: 'Cisne (Cygnus)',
    nameEn: 'Cygnus (The Swan)',
    hemisphere: 'Hemisfério Norte Marciano · Polo Norte Celeste',
    hemisphereEn: 'Martian Northern Hemisphere · Celestial North Pole',
    mainStar: 'Deneb',
    points: [
      { x: 18, y: 18, label: 'Deneb' },
      { x: 24, y: 27 },
      { x: 30, y: 36 },
      { x: 16, y: 31 },
      { x: 32, y: 23 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 1],
      [1, 4],
    ],
    factByProfile: {
      explorers:
        'Em Marte, a estrela brilhante Deneb, no Cisne, é quase a “Estrela do Norte” que guia os astronautas à noite!',
      strategists:
        'Por causa da inclinação do eixo de Marte (25,19°), o polo norte celeste marciano aponta bem perto de Deneb, na constelação do Cisne.',
      educators:
        'Astronomia planetária real: diferentemente da Terra (Polaris), a orientação axial de Marte faz com que Deneb (α Cygni) atue próximo ao polo norte celeste.',
    },
    factByProfileEn: {
      explorers:
        'On Mars, bright star Deneb in Cygnus acts almost like the “North Star” guiding astronauts at night!',
      strategists:
        'Because of Mars’s axial tilt (25.19°), Mars’s north celestial pole points very close to Deneb in the constellation Cygnus.',
      educators:
        'Real planetary astronomy: unlike Earth (Polaris), Mars’s spin axis orientation places Deneb (α Cygni) near the Martian north celestial pole.',
    },
  },
  {
    id: 'orion',
    name: 'Órion (O Caçador)',
    nameEn: 'Orion (The Hunter)',
    hemisphere: 'Equatorial · Visível de Jezero',
    hemisphereEn: 'Equatorial · Visible from Jezero',
    mainStar: 'Betelgeuse & Rigel',
    points: [
      { x: 52, y: 18, label: 'Betelgeuse' },
      { x: 64, y: 20 },
      { x: 56, y: 30 },
      { x: 59, y: 31 },
      { x: 62, y: 32 },
      { x: 53, y: 44 },
      { x: 65, y: 42, label: 'Rigel' },
    ],
    lines: [
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [0, 1],
    ],
    factByProfile: {
      explorers:
        'As Três Marias de Órion também brilham no céu de Marte — e a estrela Betelgeuse é vermelhinha igual à areia marciana!',
      strategists:
        'Visto da Cratera Jezero (18°N), Órion cruza o céu noturno com a supergigante vermelha Betelgeuse e a azulada Rigel.',
      educators:
        'Constelação equatorial proeminente em Marte; o contraste espectral entre Betelgeuse (classe M) e Rigel (classe B) auxilia na calibração óptica de câmeras estelares.',
    },
    factByProfileEn: {
      explorers:
        'Orion’s three belt stars shine in the Martian sky too — and Betelgeuse glows reddish just like Martian sand!',
      strategists:
        'Seen from Jezero Crater (18°N), Orion crosses the night sky with red supergiant Betelgeuse and blue-white Rigel.',
      educators:
        'Prominent equatorial constellation from Mars; spectral contrast between Betelgeuse (M-type) and Rigel (B-type) assists star-tracker optical calibration.',
    },
  },
  {
    id: 'taurus',
    name: 'Touro & Plêiades',
    nameEn: 'Taurus & Pleiades',
    hemisphere: 'Hemisfério Norte / Eclíptica Marciana',
    hemisphereEn: 'Northern Sky / Martian Ecliptic',
    mainStar: 'Aldebaran',
    points: [
      { x: 78, y: 24, label: 'Aldebaran' },
      { x: 83, y: 21 },
      { x: 84, y: 27 },
      { x: 89, y: 16 },
      { x: 91, y: 30 },
      { x: 73, y: 14, label: 'Pleiades' },
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ],
    factByProfile: {
      explorers:
        'Perto do Touro brilha um grupinho de estrelinhas azuis chamadas Plêiades — parecem vagalumes no céu de Marte!',
      strategists:
        'A gigante laranja Aldebarã e o aglomerado aberto das Plêiades (M45) ficam facilmente visíveis após o pôr do sol azulado de Marte.',
      educators:
        'O aglomerado das Plêiades e Aldebarã situam-se próximos ao plano da eclíptica, servindo de referência para rastreadores estelares interplanetários.',
    },
    factByProfileEn: {
      explorers:
        'Near Taurus sparkles a cozy cluster of baby blue stars called the Pleiades — like fireflies in the Martian sky!',
      strategists:
        'Orange giant Aldebaran and the Pleiades open cluster (M45) appear clearly after Mars’s famous blue sunset.',
      educators:
        'The Pleiades cluster and Aldebaran lie near the ecliptic plane, serving as key waypoints for interplanetary star trackers.',
    },
  },
  {
    id: 'ursa-major',
    name: 'Ursa Maior',
    nameEn: 'Ursa Major (Big Dipper)',
    hemisphere: 'Hemisfério Norte Marciano',
    hemisphereEn: 'Martian Northern Sky',
    mainStar: 'Alioth & Dubhe',
    points: [
      { x: 14, y: 58 },
      { x: 21, y: 61 },
      { x: 26, y: 65 },
      { x: 32, y: 68 },
      { x: 33, y: 77 },
      { x: 42, y: 76 },
      { x: 41, y: 67 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
    ],
    factByProfile: {
      explorers:
        'No céu do norte de Marte dá pra desenhar a concha gigante da Ursa Maior ligando 7 estrelinhas brilhantes!',
      strategists:
        'As sete estrelas principais do Grande Carro mantêm exatamente o mesmo desenho vistas de Marte, pois estão a dezenas de anos-luz.',
      educators:
        'Devido às distâncias interestelares (~80 anos-luz), a paralaxe entre Terra e Marte (~1,5 UA) é imperceptível a olho nu, preservando o asterismo.',
    },
    factByProfileEn: {
      explorers:
        'High in Mars’s northern sky you can connect 7 bright stars to trace the giant Big Dipper ladle!',
      strategists:
        'The Big Dipper’s seven stars keep the exact same shape from Mars because they sit dozens of light-years away.',
      educators:
        'Given interstellar distances (~80 light-years), parallax between Earth and Mars (~1.5 AU) is negligible, preserving the asterism.',
    },
  },
  {
    id: 'crux',
    name: 'Cruzeiro do Sul (Crux)',
    nameEn: 'Southern Cross (Crux)',
    hemisphere: 'Hemisfério Sul Marciano',
    hemisphereEn: 'Martian Southern Hemisphere',
    mainStar: 'Acrux',
    points: [
      { x: 75, y: 56 },
      { x: 75, y: 78, label: 'Acrux' },
      { x: 69, y: 65 },
      { x: 82, y: 66 },
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
    factByProfile: {
      explorers:
        'Olhando para o sul de Marte, os exploradores brasileiros reconhecem na hora a cruz brilhante do Cruzeiro do Sul!',
      strategists:
        'Visível nas latitudes sul de Marte (como na bacia Hellas), o Cruzeiro do Sul ajuda a localizar o polo sul celeste marciano (próximo a Kappa Velorum).',
      educators:
        'Referência cultural e astronômica do hemisfério sul: observável a partir de latitudes austrais marcianas com a mesma geometria vista do Brasil.',
    },
    factByProfileEn: {
      explorers:
        'Looking south from Mars, explorers recognize the bright Southern Cross right away — the same star cross seen from Brazil!',
      strategists:
        'Visible from Mars’s southern latitudes (like Hellas Basin), Crux helps locate the Martian south celestial pole near Kappa Velorum.',
      educators:
        'Iconic southern-sky navigation reference: observable across southern Martian latitudes with identical geometry to Earth’s southern hemisphere.',
    },
  },
];

export interface SpawnedTwinkleStar {
  id: string;
  xPct: number;
  yPct: number;
  size: number;
  hue: 'amber' | 'sky' | 'white';
}

interface MartianStargazingBackdropProps {
  lang?: Language;
  stars: SpawnedTwinkleStar[];
  revealedIds: string[];
  onSkyClick: (xPct: number, yPct: number) => void;
}

export const MartianStargazingBackdrop: React.FC<MartianStargazingBackdropProps> = ({
  lang = 'en',
  stars,
  revealedIds,
  onSkyClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(4, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
    onSkyClick(xPct, yPct);
  };

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-0 cursor-crosshair overflow-hidden bg-[radial-gradient(ellipse_at_top,_#121E3D_0%,_#070B17_65%,_#050811_100%)]"
      aria-label={
        lang === 'pt'
          ? 'Céu estrelado de Marte — clique para observar estrelas e constelações'
          : 'Martian starry night sky — click to spawn twinkling stars and reveal constellations'
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, #e2e8f0 100%, transparent), radial-gradient(1.5px 1.5px at 28% 42%, #7dd3fc 100%, transparent), radial-gradient(1px 1px at 44% 12%, #fde68a 100%, transparent), radial-gradient(1.2px 1.2px at 67% 28%, #ffffff 100%, transparent), radial-gradient(1px 1px at 84% 19%, #bae6fd 100%, transparent), radial-gradient(1.5px 1.5px at 91% 52%, #fde047 100%, transparent), radial-gradient(1px 1px at 19% 77%, #ffffff 100%, transparent), radial-gradient(1.2px 1.2px at 62% 81%, #7dd3fc 100%, transparent)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((constellation) => (
          <g key={constellation.id} className="animate-constellation-reveal">
            {constellation.lines.map(([fromIdx, toIdx], idx) => {
              const p1 = constellation.points[fromIdx];
              const p2 = constellation.points[toIdx];
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#38BDF8"
                  strokeOpacity="0.45"
                  strokeWidth={1.35}
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        ))}
      </svg>

      {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((constellation) => (
        <div
          key={`bg-pts-${constellation.id}`}
          className="animate-constellation-reveal pointer-events-none absolute inset-0"
        >
          {constellation.points.map((pt, i) => (
            <span
              key={i}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                pt.label
                  ? 'h-2 w-2 bg-[#FDE047] shadow-[0_0_8px_rgba(253,224,71,0.85)]'
                  : 'h-1.5 w-1.5 bg-[#BAE6FD]/90'
              }`}
            />
          ))}
        </div>
      ))}

      {stars.map((star) => (
        <div
          key={star.id}
          className="animate-star-twinkle pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${star.xPct}%`, top: `${star.yPct}%` }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill={
              star.hue === 'amber'
                ? '#FDE047'
                : star.hue === 'sky'
                  ? '#7DD3FC'
                  : '#FFFFFF'
            }
          >
            <path d="M12 0 L14.8 9.2 L24 12 L14.8 14.8 L12 24 L9.2 14.8 L0 12 L9.2 9.2 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

interface MartianObservatoryCardProps {
  lang?: Language;
  ageProfile: AgeProfile;
  stars: SpawnedTwinkleStar[];
  revealedIds: string[];
  onSkyClick: (xPct: number, yPct: number) => void;
}

export const MartianObservatoryCard: React.FC<MartianObservatoryCardProps> = ({
  lang = 'en',
  ageProfile,
  stars,
  revealedIds,
  onSkyClick,
}) => {
  const [selectedConstellationId, setSelectedConstellationId] = useState<string | null>(null);
  const isPt = lang === 'pt';

  const activeConstellation =
    MARTIAN_CONSTELLATIONS.find((c) => c.id === selectedConstellationId) ||
    MARTIAN_CONSTELLATIONS.find((c) => c.id === revealedIds[revealedIds.length - 1]) ||
    null;

  const handlePanelSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(8, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    playToolPickupSound();
    onSkyClick(xPct, yPct);
  };

  return (
    <section className="rounded-2xl border border-sky-500/35 bg-[#0B1224] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Telescope className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {isPt
                ? 'Observação de Estrelas · Céu Noturno de Marte'
                : 'Stargazing · Martian Night Sky'}
            </h2>
            <p className="text-xs text-slate-300">
              {isPt
                ? 'Clique em pontos aleatórios no céu abaixo (ou no fundo da tela!) para fazer estrelas piscarem e revelar constelações reais vistas de Marte.'
                : 'Click random spots in the sky below (or the night background!) to spawn twinkling stars and reveal real constellations seen from Mars.'}
            </p>
          </div>
        </div>
        <span className="font-mono-tabular text-xs font-bold text-amber-300">
          {isPt ? 'Constelações' : 'Constellations'}: {revealedIds.length} / {MARTIAN_CONSTELLATIONS.length}
        </span>
      </div>

      <div
        onClick={handlePanelSkyClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSkyClick(25 + Math.random() * 50, 20 + Math.random() * 55);
          }
        }}
        className="relative aspect-[16/10] min-h-[260px] sm:aspect-auto sm:h-[440px] lg:h-[500px] w-full cursor-crosshair overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(ellipse_at_bottom,_#2B141A_0%,_#0B142B_55%,_#050812_100%)] select-none"
        aria-label={
          isPt
            ? 'Clique no céu marciano para acender estrelas e descobrir constelações'
            : 'Click the Martian sky to light stars and reveal constellations'
        }
      >
        <svg
          viewBox="0 0 800 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 inset-x-0 h-14 sm:h-20 w-full"
        >
          <path
            d="M0 90 L0 58 Q140 34 260 56 T540 48 T800 54 L800 90 Z"
            fill="#1D0E12"
            fillOpacity="0.9"
          />
        </svg>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((c) => (
            <g key={c.id} className="animate-constellation-reveal">
              {c.lines.map(([a, b], idx) => (
                <line
                  key={idx}
                  x1={c.points[a].x}
                  y1={c.points[a].y}
                  x2={c.points[b].x}
                  y2={c.points[b].y}
                  stroke="#38BDF8"
                  strokeOpacity={activeConstellation?.id === c.id ? '0.9' : '0.62'}
                  strokeWidth={activeConstellation?.id === c.id ? 2.2 : 1.6}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          ))}
        </svg>

        {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((c) => {
          const isSelected = activeConstellation?.id === c.id;
          return (
            <div
              key={`obs-pts-${c.id}`}
              className="animate-constellation-reveal pointer-events-none absolute inset-0"
            >
              {c.points.map((p, i) => (
                <div
                  key={i}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={`block rounded-full ${
                      p.label
                        ? isSelected
                          ? 'h-3.5 w-3.5 bg-[#FDE047] shadow-[0_0_12px_rgba(253,224,71,0.95)] ring-2 ring-[#FDE047]/45'
                          : 'h-3 w-3 bg-[#FDE047] shadow-[0_0_9px_rgba(253,224,71,0.85)] ring-2 ring-[#FDE047]/30'
                        : 'h-2 w-2 bg-[#E0F2FE] shadow-[0_0_6px_rgba(224,242,254,0.65)]'
                    }`}
                  />
                  {p.label && (
                    <span className="hidden sm:block absolute left-3 top-1.5 whitespace-nowrap text-[10px] font-semibold tracking-wide text-amber-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {p.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((c) => {
          const anchor = c.points[0];
          const clampedLeft =
            c.id === 'taurus' ? 82 : Math.max(12, Math.min(88, anchor.x));
          const clampedTop =
            c.id === 'taurus' ? 35 : Math.max(6, anchor.y - 8);
          const isSelected = activeConstellation?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playToolPickupSound();
                setSelectedConstellationId(c.id);
              }}
              aria-pressed={isSelected}
              style={{ left: `${clampedLeft}%`, top: `${clampedTop}%` }}
              className={`absolute -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                isSelected
                  ? 'border-amber-300 bg-[#0F1D3A]/95 text-amber-200 shadow-lg'
                  : 'border-sky-400/50 bg-[#0A1328]/85 text-sky-200 hover:border-amber-300 hover:text-amber-200'
              }`}
            >
              {isPt ? c.name : c.nameEn}
            </button>
          );
        })}

        {stars.map((star) => (
          <div
            key={star.id}
            className="animate-star-twinkle pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${star.xPct}%`, top: `${star.yPct}%` }}
          >
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              fill={
                star.hue === 'amber'
                  ? '#FDE047'
                  : star.hue === 'sky'
                    ? '#7DD3FC'
                    : '#FFFFFF'
              }
            >
              <path d="M12 0 L14.8 9.2 L24 12 L14.8 14.8 L12 24 L9.2 14.8 L0 12 L9.2 9.2 Z" />
            </svg>
          </div>
        ))}

        {revealedIds.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border border-sky-400/30 bg-[#0A1328]/80 px-4 py-2 text-xs font-semibold text-sky-200">
              <Sparkles className="mr-1.5 inline h-4 w-4 text-amber-300" />
              {isPt
                ? 'Toque em qualquer ponto escuro do céu para observar estrelas!'
                : 'Tap anywhere in the dark Martian sky to observe stars!'}
            </div>
          </div>
        )}
      </div>

      {activeConstellation && (
        <div className="rounded-xl border border-slate-800 bg-[#080F20] p-4 text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-amber-300">
              ✨ {isPt ? activeConstellation.name : activeConstellation.nameEn} ·{' '}
              {isPt ? 'Estrela principal' : 'Lead star'}: {activeConstellation.mainStar}
            </span>
            <span className="text-[11px] text-sky-300">
              {isPt ? activeConstellation.hemisphere : activeConstellation.hemisphereEn}
            </span>
          </div>
          <p className="leading-relaxed text-slate-200">
            {isPt
              ? activeConstellation.factByProfile[ageProfile]
              : activeConstellation.factByProfileEn[ageProfile]}
          </p>
        </div>
      )}
    </section>
  );
};
