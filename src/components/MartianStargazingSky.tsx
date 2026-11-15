import React, { useState } from 'react';
import { Sparkles, Telescope } from 'lucide-react';
import { AgeProfile } from '../types/game';
import { playToolPickupSound } from '../utils/sound';

export interface MartianConstellation {
  id: string;
  name: string;
  hemisphere: string;
  mainStar: string;
  points: { x: number; y: number; label?: string }[];
  lines: [number, number][];
  factByProfile: Record<AgeProfile, string>;
}

export const MARTIAN_CONSTELLATIONS: MartianConstellation[] = [
  {
    id: 'cygnus',
    name: 'Cisne (Cygnus)',
    hemisphere: 'Hemisfério Norte Marciano · Polo Norte Celeste',
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
  },
  {
    id: 'orion',
    name: 'Órion (O Caçador)',
    hemisphere: 'Equatorial · Visível de Jezero',
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
  },
  {
    id: 'taurus',
    name: 'Touro & Plêiades',
    hemisphere: 'Hemisfério Norte / Eclíptica Marciana',
    mainStar: 'Aldebarã',
    points: [
      { x: 78, y: 24, label: 'Aldebarã' },
      { x: 83, y: 21 },
      { x: 84, y: 27 },
      { x: 89, y: 16 },
      { x: 91, y: 30 },
      { x: 73, y: 14, label: 'Plêiades' },
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
  },
  {
    id: 'ursa-major',
    name: 'Ursa Maior',
    hemisphere: 'Hemisfério Norte Marciano',
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
  },
  {
    id: 'crux',
    name: 'Cruzeiro do Sul (Crux)',
    hemisphere: 'Hemisfério Sul Marciano',
    mainStar: 'Estrela de Magalhães (Acrux)',
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
  stars: SpawnedTwinkleStar[];
  revealedIds: string[];
  onSkyClick: (xPct: number, yPct: number) => void;
}

/**
 * Full-screen deep Martian night sky behind Screen 5.
 * Clicking any open spot in the sky spawns twinkling CSS-animated stars and reveals constellations.
 */
export const MartianStargazingBackdrop: React.FC<MartianStargazingBackdropProps> = ({
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
      aria-label="Céu estrelado de Marte — clique para observar estrelas e constelações"
    >
      {/* Subtle ambient distant starfield */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, #e2e8f0 100%, transparent), radial-gradient(1.5px 1.5px at 28% 42%, #7dd3fc 100%, transparent), radial-gradient(1px 1px at 44% 12%, #fde68a 100%, transparent), radial-gradient(1.2px 1.2px at 67% 28%, #ffffff 100%, transparent), radial-gradient(1px 1px at 84% 19%, #bae6fd 100%, transparent), radial-gradient(1.5px 1.5px at 91% 52%, #fde047 100%, transparent), radial-gradient(1px 1px at 19% 77%, #ffffff 100%, transparent), radial-gradient(1.2px 1.2px at 62% 81%, #7dd3fc 100%, transparent)',
        }}
      />

      {/* Revealed Real Martian Constellations drawn across the background sky */}
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
                  strokeWidth="0.22"
                  strokeDasharray="0.7 0.5"
                />
              );
            })}
            {constellation.points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={pt.label ? 0.55 : 0.35}
                fill={pt.label ? '#FDE047' : '#BAE6FD'}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Clicked Twinkling Stars */}
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
  ageProfile: AgeProfile;
  stars: SpawnedTwinkleStar[];
  revealedIds: string[];
  onSkyClick: (xPct: number, yPct: number) => void;
}

/**
 * Interactive Night Sky Observatory panel on Screen 5 so players on mobile or desktop
 * also have an unobstructed, dedicated starry Martian sky viewport to click and explore constellations.
 */
export const MartianObservatoryCard: React.FC<MartianObservatoryCardProps> = ({
  ageProfile,
  stars,
  revealedIds,
  onSkyClick,
}) => {
  const [selectedConstellationId, setSelectedConstellationId] = useState<string | null>(null);

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
    <section className="rounded-2xl border border-sky-500/35 bg-[#0B1224]/90 p-5 sm:p-6 backdrop-blur-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Telescope className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-lg font-extrabold text-white">
              Observação de Estrelas · Céu Noturno de Marte
            </h2>
            <p className="text-xs text-slate-300">
              Clique em pontos aleatórios no céu abaixo (ou no fundo da tela!) para fazer estrelas piscarem e revelar constelações reais vistas de Marte.
            </p>
          </div>
        </div>
        <span className="font-mono-tabular text-xs font-bold text-amber-300">
          Constelações: {revealedIds.length} / {MARTIAN_CONSTELLATIONS.length}
        </span>
      </div>

      {/* Dedicated Clickable Martian Sky Dome */}
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
        className="relative h-64 sm:h-72 w-full cursor-crosshair overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(ellipse_at_bottom,_#2B141A_0%,_#0B142B_55%,_#050812_100%)] select-none"
        aria-label="Clique no céu marciano para acender estrelas e descobrir constelações"
      >
        {/* Martian red horizon silhouette */}
        <svg
          viewBox="0 0 800 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 inset-x-0 h-14 w-full"
        >
          <path
            d="M0 90 L0 58 Q140 34 260 56 T540 48 T800 54 L800 90 Z"
            fill="#1D0E12"
            fillOpacity="0.9"
          />
        </svg>

        {/* Constellation SVG overlay */}
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
                  strokeOpacity="0.7"
                  strokeWidth="0.35"
                />
              ))}
              {c.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={p.label ? 0.95 : 0.6}
                  fill={p.label ? '#FDE047' : '#E0F2FE'}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Constellation Name Labels */}
        {MARTIAN_CONSTELLATIONS.filter((c) => revealedIds.includes(c.id)).map((c) => {
          const anchor = c.points[0];
          return (
            <button
              key={c.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedConstellationId(c.id);
              }}
              style={{ left: `${anchor.x}%`, top: `${Math.max(8, anchor.y - 6)}%` }}
              className="absolute -translate-x-1/2 rounded-md border border-sky-400/50 bg-[#0A1328]/85 px-2 py-0.5 text-[10px] font-bold text-sky-200 hover:border-amber-300 hover:text-amber-200"
            >
              {c.name}
            </button>
          );
        })}

        {/* Twinkling CSS-animated clicked stars */}
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
              Toque em qualquer ponto escuro do céu para observar estrelas!
            </div>
          </div>
        )}
      </div>

      {/* Revealed Constellation Scientific Detail */}
      {activeConstellation && (
        <div className="rounded-xl border border-slate-800 bg-[#080F20] p-4 text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-amber-300">
              ✨ {activeConstellation.name} · Estrela principal: {activeConstellation.mainStar}
            </span>
            <span className="text-[11px] text-sky-300">{activeConstellation.hemisphere}</span>
          </div>
          <p className="leading-relaxed text-slate-200">
            {activeConstellation.factByProfile[ageProfile]}
          </p>
        </div>
      )}
    </section>
  );
};
