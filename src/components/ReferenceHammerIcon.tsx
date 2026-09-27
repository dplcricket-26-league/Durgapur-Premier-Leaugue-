import React from 'react';

interface ReferenceHammerIconProps {
  size?: number;
  className?: string;
}

export const ReferenceHammerIcon: React.FC<ReferenceHammerIconProps> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Deep gold/bronze metallic gradient matching the reference */}
        <linearGradient id="refGoldHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#C69214" />
          <stop offset="100%" stopColor="#8A610A" />
        </linearGradient>

        <linearGradient id="refGoldHandle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E5C158" />
          <stop offset="50%" stopColor="#C69214" />
          <stop offset="100%" stopColor="#7E5606" />
        </linearGradient>
      </defs>

      {/* Tilted Gavel matching the reference image's icon */}
      <g transform="rotate(-40 50 50)">
        {/* Handle Shaft */}
        <path
          d="M47 38 L53 38 L51 86 L49 86 Z"
          fill="url(#refGoldHandle)"
        />
        {/* Handle Pommel End */}
        <circle cx="50" cy="88" r="3.5" fill="#C69214" />

        {/* Center Connection Ring */}
        <rect x="44" y="34" width="12" height="6" rx="1.5" fill="#E5C158" />

        {/* Cylinder Gavel Head */}
        <rect
          x="28"
          y="22"
          width="44"
          height="14"
          rx="3"
          fill="url(#refGoldHead)"
        />

        {/* Left Striking Bevel Edge */}
        <path
          d="M28 20.5 L24 22 L24 36 L28 37.5 Z"
          fill="#F5D061"
        />

        {/* Right Striking Bevel Edge */}
        <path
          d="M72 20.5 L76 22 L76 36 L72 37.5 Z"
          fill="#8A610A"
        />

        {/* Sound Base Block / Anvil Block below gavel */}
        <rect
          x="24"
          y="74"
          width="36"
          height="6"
          rx="2"
          fill="#C69214"
          opacity="0.8"
        />
      </g>
    </svg>
  );
};
