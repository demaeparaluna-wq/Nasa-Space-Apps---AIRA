import React from 'react';
import { QuackExpression } from '../types/game';

interface QuackMascotProps {
  expression: QuackExpression;
  size?: number;
  className?: string;
}

export const QuackMascot: React.FC<QuackMascotProps> = ({
  expression,
  size = 136,
  className = '',
}) => {
  const animClass =
    expression === 'terror'
      ? 'animate-quack-tremble'
      : expression === 'drama'
        ? 'animate-quack-drama'
        : expression === 'dizzy'
          ? 'animate-quack-dizzy'
          : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Comandante Quack com expressão ${expression}`}
    >
      <svg
        viewBox="0 0 180 180"
        width={size}
        height={size}
        className="overflow-visible"
        role="img"
      >
        <defs>
          <radialGradient id="helmetGlass" cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.32" />
            <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.32" />
          </radialGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Orbiting dizzy stars or celebrate confetti */}
        {expression === 'dizzy' && (
          <g className="animate-spin-slow" style={{ transformOrigin: '90px 44px' }}>
            <path
              d="M36 30 L39 36 L45 37 L40 41 L41 47 L36 44 L31 47 L32 41 L27 37 L33 36 Z"
              fill="#FACC15"
            />
            <path
              d="M90 10 L92 15 L97 16 L93 19 L94 24 L90 21 L86 24 L87 19 L83 16 L88 15 Z"
              fill="#FDE047"
            />
            <path
              d="M142 32 L145 37 L150 38 L146 42 L147 47 L142 44 L137 47 L138 42 L134 38 L139 37 Z"
              fill="#F59E0B"
            />
          </g>
        )}

        {expression === 'celebrate' && (
          <g>
            <circle cx="24" cy="40" r="3.5" fill="#F97316" />
            <circle cx="154" cy="36" r="3.5" fill="#10B981" />
            <rect x="30" y="92" width="6" height="6" rx="1.5" fill="#38BDF8" transform="rotate(25 33 95)" />
            <rect x="144" y="88" width="6" height="6" rx="1.5" fill="#FACC15" transform="rotate(-20 147 91)" />
            <path
              d="M148 54 L150 59 L155 60 L151 63 L152 68 L148 65 L144 68 L145 63 L141 60 L146 59 Z"
              fill="#FDE047"
            />
          </g>
        )}

        {/* Orange webbed boots */}
        <ellipse cx="70" cy="164" rx="14" ry="7" fill="#F97316" />
        <ellipse cx="110" cy="164" rx="14" ry="7" fill="#F97316" />

        {/* Space Suit Body */}
        <rect
          x="52"
          y="114"
          width="76"
          height="46"
          rx="20"
          fill="url(#suitGrad)"
          stroke="#CBD5E1"
          strokeWidth="2.5"
        />

        {/* Suit Orange Shoulder Trim & Collar Ring */}
        <rect x="56" y="112" width="68" height="10" rx="5" fill="#F97316" />
        <rect x="64" y="128" width="52" height="24" rx="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.8" />
        <circle cx="80" cy="140" r="5" fill="#F97316" />
        <circle cx="96" cy="137" r="2.6" fill="#38BDF8" />
        <circle cx="105" cy="137" r="2.6" fill="#10B981" />
        <rect x="93" y="143" width="15" height="3" rx="1.5" fill="#94A3B8" />

        {/* Left Arm / Wing */}
        {expression === 'drama' ? (
          <path
            d="M54 122 C30 96, 34 52, 62 46 C67 45, 70 53, 62 60 C50 70, 48 96, 62 115 Z"
            fill="#FACC15"
            stroke="#EAB308"
            strokeWidth="2"
          />
        ) : (
          <g>
            <path
              d="M54 122 C36 126, 30 144, 42 150 C50 153, 56 144, 58 134 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <circle cx="41" cy="146" r="6" fill="#FDE047" />
          </g>
        )}

        {/* Right Arm / Wing */}
        {expression === 'drama' ? (
          <path
            d="M126 122 C150 96, 146 52, 118 46 C113 45, 110 53, 118 60 C130 70, 132 96, 118 115 Z"
            fill="#FACC15"
            stroke="#EAB308"
            strokeWidth="2"
          />
        ) : expression === 'celebrate' ? (
          <g className="animate-quack-wave">
            <path
              d="M124 122 C142 104, 152 84, 142 74 C136 69, 128 76, 126 88 L120 112 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <circle cx="141" cy="77" r="7" fill="#FDE047" />
          </g>
        ) : (
          <g>
            <path
              d="M126 122 C144 126, 150 144, 138 150 C130 153, 124 144, 122 134 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <circle cx="139" cy="146" r="6" fill="#FDE047" />
          </g>
        )}

        {/* Helmet Back Ring */}
        <circle
          cx="90"
          cy="72"
          r="50"
          fill="#0F172A"
          fillOpacity="0.35"
          stroke="#94A3B8"
          strokeWidth="3.5"
        />

        {/* Duck Feather Tuft */}
        <path
          d={
            expression === 'terror'
              ? 'M82 32 C76 16, 86 14, 90 27 C94 12, 105 16, 98 31 C106 22, 110 28, 100 35 Z'
              : 'M84 34 C82 22, 90 20, 91 30 C95 20, 102 24, 97 34 Z'
          }
          fill="#FDE047"
          stroke="#EAB308"
          strokeWidth="1.5"
        />

        {/* Duck Head */}
        <circle cx="90" cy="74" r="36" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="83" rx="6.5" ry="4" fill="#FB7185" fillOpacity="0.55" />
        <ellipse cx="116" cy="83" rx="6.5" ry="4" fill="#FB7185" fillOpacity="0.55" />

        {/* Facial Expressions */}
        {expression === 'terror' && (
          <g>
            {/* Wide terrified eyes */}
            <circle cx="74" cy="68" r="8.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="106" cy="68" r="8.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="74" cy="68" r="3.2" fill="#0F172A" />
            <circle cx="106" cy="68" r="3.2" fill="#0F172A" />
            {/* Raised worried eyebrows */}
            <path d="M64 56 Q73 52 81 57" fill="none" stroke="#92400E" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M99 57 Q107 52 116 56" fill="none" stroke="#92400E" strokeWidth="2.4" strokeLinecap="round" />
            {/* Sweat drop */}
            <path
              d="M123 54 C123 54, 128 62, 128 65 C128 68, 125.8 70, 123 70 C120.2 70, 118 68, 118 65 C118 62, 123 54, 123 54 Z"
              fill="#38BDF8"
            />
            {/* Trembling open beak */}
            <ellipse cx="90" cy="87" rx="13" ry="8" fill="#F97316" stroke="#C2410C" strokeWidth="1.8" />
            <ellipse cx="90" cy="89" rx="8" ry="4.5" fill="#7C2D12" />
          </g>
        )}

        {expression === 'drama' && (
          <g>
            {/* Mexican telenovela dramatic eyebrows */}
            <path d="M63 59 Q74 50 82 61" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <path d="M98 56 Q108 46 117 57" fill="none" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
            {/* Dramatic closed eyes */}
            <path d="M66 69 Q74 75 82 69" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M98 69 Q106 75 114 69" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            {/* Tiny drama tear */}
            <circle cx="115" cy="74" r="2.2" fill="#38BDF8" />
            {/* Dramatic "O" beak */}
            <ellipse cx="90" cy="86" rx="12" ry="6.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.8" />
            <circle cx="90" cy="88" r="3.5" fill="#7C2D12" />
          </g>
        )}

        {expression === 'dizzy' && (
          <g>
            {/* Spiral @ @ eyes */}
            <g className="animate-spin-slow" style={{ transformOrigin: '74px 68px' }}>
              <circle cx="74" cy="68" r="7.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
              <path
                d="M74 68 m0 -1 a1.5 1.5 0 1 1 -1.5 1.5 a3 3 0 1 1 3 3 a4.5 4.5 0 1 1 -4.5 -4.5"
                fill="none"
                stroke="#0F172A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
            <g className="animate-spin-slow" style={{ transformOrigin: '106px 68px' }}>
              <circle cx="106" cy="68" r="7.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
              <path
                d="M106 68 m0 -1 a1.5 1.5 0 1 1 -1.5 1.5 a3 3 0 1 1 3 3 a4.5 4.5 0 1 1 -4.5 -4.5"
                fill="none"
                stroke="#0F172A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
            {/* Wavy dizzy beak */}
            <ellipse cx="90" cy="86" rx="13" ry="6.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.8" />
            <path d="M81 86 Q85 83 90 86 T99 86" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {expression === 'celebrate' && (
          <g>
            {/* Happy curved eye + winking eye */}
            <path d="M66 69 Q74 61 82 69" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M98 68 Q106 63 114 68" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M100 69 Q106 72 112 69" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            {/* Happy smiling beak */}
            <path
              d="M76 83 Q90 77 104 83 Q102 94 90 94 Q78 94 76 83 Z"
              fill="#F97316"
              stroke="#C2410C"
              strokeWidth="1.8"
            />
            <path d="M80 84 Q90 90 100 84" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Transparent Glass Dome Overlay & Specular Highlight */}
        <circle cx="90" cy="72" r="50" fill="url(#helmetGlass)" stroke="#E2E8F0" strokeWidth="2.5" />
        <path
          d="M54 52 C60 36, 76 28, 92 28"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
        <circle cx="50" cy="61" r="2.2" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
    </div>
  );
};
