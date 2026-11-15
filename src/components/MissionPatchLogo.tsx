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
        <path id={topArcId} d="M 38,110 A 72,72 0 1,1 182,110" />
        <path id={bottomArcId} d="M 32,114 A 78,78 0 0,0 188,114" />
        <clipPath id={innerClipId}>
          <circle cx="110" cy="110" r="65" />
        </clipPath>
        <radialGradient id={marsGradId} cx="75%" cy="68%" r="65%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="55%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </radialGradient>
      </defs>

      {/* Outer Dark Frame */}
      <circle cx="110" cy="110" r="105" fill="#0B1221" stroke="#FDBA74" strokeOpacity="0.25" strokeWidth="2" />

      {/* Thick Orange Mission Patch Ring */}
      <circle cx="110" cy="110" r="88" fill="#0B1221" stroke="#EA580C" strokeWidth="26" />
      <circle cx="110" cy="110" r="100" fill="none" stroke="#F97316" strokeWidth="3" />

      {/* Dashed Inner Stitch Line */}
      <circle
        cx="110"
        cy="110"
        r="73"
        fill="none"
        stroke="#FED7AA"
        strokeWidth="2.2"
        strokeDasharray="5 5"
      />

      {/* Inner Space & Mars Backdrop */}
      <g clipPath={`url(#${innerClipId})`}>
        <rect x="35" y="35" width="150" height="150" fill="#0B1221" />
        {/* Mars Curve */}
        <circle cx="152" cy="145" r="60" fill={`url(#${marsGradId})`} />
        <ellipse cx="144" cy="132" rx="14" ry="7" fill="#9A3412" fillOpacity="0.4" />
        <ellipse cx="164" cy="152" rx="8" ry="4" fill="#9A3412" fillOpacity="0.35" />

        {/* Stars */}
        <circle cx="66" cy="70" r="2" fill="#FFFFFF" />
        <circle cx="80" cy="56" r="1.5" fill="#BAE6FD" />
        <circle cx="146" cy="64" r="2.2" fill="#FDE047" />
        <circle cx="158" cy="82" r="1.5" fill="#FFFFFF" />
        <circle cx="62" cy="114" r="1.5" fill="#FFFFFF" />
        <circle cx="132" cy="53" r="1.2" fill="#FFFFFF" />

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

      {/* Curved Top & Bottom Mission Patch Text */}
      <text
        fill="#FFFFFF"
        fontSize="14.5"
        fontWeight="800"
        letterSpacing="1.8"
        fontFamily="Outfit, sans-serif"
      >
        <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
          {lang === 'pt' ? 'MISSÃO SOL-4' : 'MISSION SOL-4'}
        </textPath>
      </text>

      <text
        fill="#FFF7ED"
        fontSize={lang === 'pt' ? '10.2' : '9.4'}
        fontWeight="700"
        letterSpacing="1.2"
        fontFamily="Outfit, sans-serif"
      >
        <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
          {lang === 'pt' ? 'GUARDIÕES DA BASE ARES' : 'GUARDIANS OF ARES BASE'}
        </textPath>
      </text>

      {/* Left & Right Accent Stars on Ring */}
      <path
        d="M23 107 L25 111 L29 111 L26 114 L27 118 L23 116 L19 118 L20 114 L17 111 L21 111 Z"
        fill="#FDE047"
      />
      <path
        d="M197 107 L199 111 L203 111 L200 114 L201 118 L197 116 L193 118 L194 114 L191 111 L195 111 Z"
        fill="#FDE047"
      />
    </svg>
  );
};
