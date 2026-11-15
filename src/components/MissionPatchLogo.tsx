import React from 'react';
import { Language } from '../types/game';

interface MissionPatchLogoProps {
  size?: number;
  className?: string;
  lang?: Language;
}

/**
 * Official Orange Mission Patch for Mission Sol-4: Guardians of Ares Base
 */
export const MissionPatchLogo: React.FC<MissionPatchLogoProps> = ({
  size = 112,
  className = '',
  lang = 'en',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const topArcId = `patch-top-${uid}`;
  const bottomArcId = `patch-bottom-${uid}`;
  const innerClipId = `patch-clip-${uid}`;
  const marsGradId = `patch-mars-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      className={`select-none shrink-0 drop-shadow-[0_6px_22px_rgba(249,115,22,0.35)] ${className}`}
      role="img"
      aria-label={
        lang === 'pt'
          ? 'Logo Oficial Missão Sol-4: Guardiões da Base Ares'
          : 'Official Patch Mission Sol-4: Guardians of Ares Base'
      }
    >
      <defs>
        <path id={topArcId} d="M 23,110 A 87,87 0 1,1 197,110" />
        <path id={bottomArcId} d="M 23,110 A 87,87 0 0,0 197,110" />
        <clipPath id={innerClipId}>
          <circle cx="110" cy="110" r="72.5" />
        </clipPath>
        <radialGradient id={marsGradId} cx="75%" cy="68%" r="65%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="55%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </radialGradient>
      </defs>

      {/* Outer Dark Frame */}
      <circle cx="110" cy="110" r="106" fill="#0B1221" stroke="#FDBA74" strokeOpacity="0.2" strokeWidth="1.5" />

      {/* Thick Orange Mission Patch Ring (r=74..104) */}
      <circle cx="110" cy="110" r="89" fill="#0B1221" stroke="#EA580C" strokeWidth="30" />
      <circle cx="110" cy="110" r="104" fill="none" stroke="#F97316" strokeWidth="2" />

      {/* Outer Dashed Yellow Stitch Line */}
      <circle
        cx="110"
        cy="110"
        r="100.5"
        fill="none"
        stroke="#FACC15"
        strokeWidth="1.8"
        strokeDasharray="4.5 3.5"
      />

      {/* Inner Space & Mars Backdrop */}
      <g clipPath={`url(#${innerClipId})`}>
        <rect x="30" y="30" width="160" height="160" fill="#0B1221" />
        {/* Mars Curve */}
        <circle cx="152" cy="145" r="62" fill={`url(#${marsGradId})`} />
        <ellipse cx="144" cy="132" rx="14" ry="7" fill="#9A3412" fillOpacity="0.4" />
        <ellipse cx="164" cy="152" rx="8" ry="4" fill="#9A3412" fillOpacity="0.35" />

        {/* Stars */}
        <circle cx="64" cy="70" r="2" fill="#FFFFFF" />
        <circle cx="80" cy="54" r="1.6" fill="#BAE6FD" />
        <circle cx="146" cy="62" r="2.2" fill="#FDE047" />
        <circle cx="158" cy="82" r="1.5" fill="#FFFFFF" />
        <circle cx="58" cy="114" r="1.6" fill="#FFFFFF" />
        <circle cx="132" cy="51" r="1.3" fill="#FFFFFF" />

        {/* Comandante Quack inside the Patch */}
        {/* Space suit shoulders */}
        <rect x="86" y="132" width="48" height="36" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
        <rect x="92" y="132" width="36" height="6" rx="3" fill="#F97316" />
        <circle cx="104" cy="148" r="3.5" fill="#F97316" />
        <circle cx="115" cy="148" r="2" fill="#38BDF8" />

        {/* Glass Helmet */}
        <circle cx="110" cy="105" r="28" fill="#0F172A" fillOpacity="0.35" stroke="#E2E8F0" strokeWidth="2.5" />
        {/* Feather tuft */}
        <path d="M106 83 C104 75, 110 74, 111 81 C114 74, 119 77, 115 84 Z" fill="#FDE047" />
        {/* Duck head */}
        <circle cx="110" cy="106" r="20" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
        {/* Cheeks */}
        <ellipse cx="96" cy="111" rx="3.5" ry="2.2" fill="#FB7185" fillOpacity="0.6" />
        <ellipse cx="124" cy="111" rx="3.5" ry="2.2" fill="#FB7185" fillOpacity="0.6" />
        {/* Eyes */}
        <circle cx="102" cy="103" r="2.8" fill="#0F172A" />
        <circle cx="118" cy="103" r="2.8" fill="#0F172A" />
        <circle cx="103" cy="102" r="0.9" fill="#FFFFFF" />
        <circle cx="119" cy="102" r="0.9" fill="#FFFFFF" />
        {/* Beak */}
        <ellipse cx="110" cy="113" rx="7" ry="4" fill="#F97316" />
        {/* Helmet highlight */}
        <path d="M89 96 C93 86, 102 82, 110 82" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      </g>

      {/* Solid Yellow Inner Border separating Space Core from Orange Ring */}
      <circle
        cx="110"
        cy="110"
        r="74"
        fill="none"
        stroke="#FACC15"
        strokeWidth="2.5"
      />

      {/* Curved Top & Bottom Mission Patch Text — Centered on Orange Ring Midline (r=87) */}
      <text
        fill="#FFFFFF"
        fontSize="14.2"
        fontWeight="800"
        letterSpacing="1.8"
        fontFamily="Outfit, sans-serif"
        dominantBaseline="central"
      >
        <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
          {lang === 'pt' ? 'MISSÃO SOL-4' : 'MISSION SOL-4'}
        </textPath>
      </text>

      <text
        fill="#FFFFFF"
        fontSize={lang === 'pt' ? '10.6' : '9.8'}
        fontWeight="700"
        letterSpacing="1.3"
        fontFamily="Outfit, sans-serif"
        dominantBaseline="central"
      >
        <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
          {lang === 'pt' ? 'GUARDIÕES DA BASE ARES' : 'GUARDIANS OF ARES BASE'}
        </textPath>
      </text>

      {/* Left & Right Accent Stars Centered Vertically Inside Orange Ring (r=87) */}
      <path
        d="M23 104.5 L24.6 108.3 L28.7 108.6 L25.5 111.3 L26.5 115.3 L23 113.1 L19.5 115.3 L20.5 111.3 L17.3 108.6 L21.4 108.3 Z"
        fill="#FACC15"
      />
      <path
        d="M197 104.5 L198.6 108.3 L202.7 108.6 L199.5 111.3 L200.5 115.3 L197 113.1 L193.5 115.3 L194.5 111.3 L191.3 108.6 L195.4 108.3 Z"
        fill="#FACC15"
      />
    </svg>
  );
};
