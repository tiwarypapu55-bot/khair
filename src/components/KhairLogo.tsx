import React from 'react';

interface LogoProps {
  className?: string;
}

export const KhairLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 bg-white rounded-full p-1 shadow-xs border border-slate-200 overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background light circle */}
        <circle cx="50" cy="50" r="48" fill="#F8FAFC" />

        {/* Top-Right Yellow Swoosh Arc */}
        <path
          d="M 28 20 A 36 36 0 0 1 84 55 A 36 36 0 0 0 28 20 Z"
          fill="url(#yellowSwoosh)"
        />

        {/* Bottom-Left Blue/Purple Swoosh Arc */}
        <path
          d="M 72 80 A 36 36 0 0 1 16 45 A 36 36 0 0 0 72 80 Z"
          fill="url(#purpleSwoosh)"
        />

        {/* Outer Ring Accents */}
        <path
          d="M 22 28 C 35 12, 68 10, 82 28 C 68 18, 38 18, 22 28 Z"
          fill="#F59E0B"
        />
        <path
          d="M 78 72 C 65 88, 32 90, 18 72 C 32 82, 62 82, 78 72 Z"
          fill="#4F46E5"
        />

        {/* Monogram "K" in Golden Yellow */}
        <text
          x="31"
          y="64"
          fill="#D97706"
          fontSize="38"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          K
        </text>

        {/* Monogram "H" in Indigo/Purple */}
        <text
          x="53"
          y="64"
          fill="#4338CA"
          fontSize="38"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          H
        </text>

        <defs>
          <linearGradient id="yellowSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="purpleSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
