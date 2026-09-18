import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const isSm = size === 'sm';
  const boxSize = isSm ? 'w-10 h-10' : 'w-12 h-12';
  const textSize = isSm ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Stacked NH monogram */}
      <div className={`${boxSize} relative flex flex-col items-center justify-center bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          aria-label="Nature Harmony NH logo"
        >
          {/* Grey speckle fill */}
          <rect width="40" height="40" fill="#fafaf9" />
          <defs>
            <pattern id="nh-speckle" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#d6d3d1" />
              <circle cx="4" cy="4" r="0.4" fill="#d6d3d1" />
            </pattern>
          </defs>
          <rect width="40" height="40" fill="url(#nh-speckle)" />

          {/* Thin fancy N */}
          <text
            x="20"
            y="15.5"
            textAnchor="middle"
            fontSize="15"
            fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
            fontWeight="300"
            fill="#bfa06f"
            letterSpacing="-1"
          >
            N
          </text>

          {/* Divider line */}
          <line x1="12" y1="19" x2="28" y2="19" stroke="#bfa06f" strokeWidth="0.8" />

          {/* Thin fancy H */}
          <text
            x="20"
            y="32.5"
            textAnchor="middle"
            fontSize="15"
            fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
            fontWeight="300"
            fill="#bfa06f"
            letterSpacing="-1"
          >
            H
          </text>
        </svg>
      </div>

      {showText && (
        <span className={`${textSize} font-serif font-medium text-stone-800 tracking-tight`}>
          Nature Harmony
        </span>
      )}
    </div>
  );
}
