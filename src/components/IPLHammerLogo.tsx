import React from 'react';

interface IPLHammerLogoProps {
  className?: string;
  size?: number;
}

export const IPLHammerLogo: React.FC<IPLHammerLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Golden metallic gradient */}
        <linearGradient id="iplGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Silver steel chrome gradient */}
        <linearGradient id="iplSilverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Electric Royal Blue gradient */}
        <linearGradient id="iplBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Shield Outer Gold Stroke */}
        <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Royal Crest Shield Background */}
      <path
        d="M60 6C82 6 104 12 104 28C104 68 82 102 60 114C38 102 16 68 16 28C16 12 38 6 60 6Z"
        fill="url(#iplBlueGradient)"
        stroke="url(#shieldBorder)"
        strokeWidth="3.5"
        filter="url(#goldGlow)"
      />

      {/* Inner Decorative Arch */}
      <path
        d="M60 12C78 12 96 17 96 30C96 64 78 94 60 105C42 94 24 64 24 30C24 17 42 12 60 12Z"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Cricket Seam Swoosh Behind Hammer */}
      <path
        d="M26 44C38 68 76 78 94 62"
        stroke="url(#iplGoldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />

      {/* Stylized IPL Auction Gavel / Hammer */}
      {/* Wooden/Golden Grip Handle */}
      <g transform="rotate(-36 60 60)">
        {/* Handle Shaft */}
        <path
          d="M57 32L63 32L62 96L58 96Z"
          fill="url(#iplGoldGradient)"
          stroke="#451A03"
          strokeWidth="1"
        />

        {/* Handle Rings / Grip Textures */}
        <line x1="57" y1="72" x2="63" y2="72" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="57" y1="78" x2="63" y2="78" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="57" y1="84" x2="63" y2="84" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Handle Pommel End */}
        <circle cx="60" cy="98" r="4.5" fill="url(#iplGoldGradient)" stroke="#78350F" strokeWidth="1" />

        {/* Heavy Metal Hammer Head */}
        {/* Center Collar */}
        <rect
          x="53"
          y="28"
          width="14"
          height="12"
          rx="2"
          fill="url(#iplGoldGradient)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Barrel Cylinder Main Body */}
        <rect
          x="34"
          y="20"
          width="52"
          height="20"
          rx="4"
          fill="url(#iplSilverGradient)"
          stroke="url(#iplGoldGradient)"
          strokeWidth="2"
          filter="url(#goldGlow)"
        />

        {/* Striking Faces (Left & Right Flanges) */}
        <path
          d="M34 18L30 19C28.5 19.5 28 21 28 23L28 37C28 39 28.5 40.5 30 41L34 42Z"
          fill="url(#iplGoldGradient)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <path
          d="M86 18L90 19C91.5 19.5 92 21 92 23L92 37C92 39 91.5 40.5 90 41L86 42Z"
          fill="url(#iplGoldGradient)"
          stroke="#78350F"
          strokeWidth="1.2"
        />

        {/* Central Crown / Star emblem on hammer */}
        <circle cx="60" cy="30" r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
      </g>

      {/* Mini Cricket Ball Accent on bottom */}
      <circle cx="60" cy="92" r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M54 92C57 90 63 90 66 92" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 1" />

      {/* DPL Star Accent */}
      <polygon
        points="60,2 62,7 67,7 63,10 65,15 60,12 55,15 57,10 53,7 58,7"
        fill="#FDE047"
        stroke="#CA8A04"
        strokeWidth="0.8"
      />
    </svg>
  );
};
