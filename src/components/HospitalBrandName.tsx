import React from 'react';

interface HospitalBrandNameProps {
  name: string;
  className?: string;
}

/**
 * Renders the hospital name in the official KH logo color combination:
 * - First word ("KHAIR") in metallic golden amber (#D97706 / #F59E0B)
 * - Remaining words ("HOSPITAL") in royal indigo-violet (#4338CA / #4F46E5)
 */
export const HospitalBrandName: React.FC<HospitalBrandNameProps> = ({
  name,
  className = '',
}) => {
  const trimmed = (name || 'KHAIR HOSPITAL').trim();
  const parts = trimmed.split(/\s+/);
  const firstWord = parts[0] || 'KHAIR';
  const restWords = parts.slice(1).join(' ');

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-1.5 ${className}`}>
      <span
        className="bg-gradient-to-b from-[#EAB308] via-[#D97706] to-[#B45309] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(180,83,9,0.12)]"
      >
        {firstWord}
      </span>
      {restWords && (
        <span
          className="bg-gradient-to-b from-[#5B6EE1] via-[#4338CA] to-[#312E81] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(49,46,129,0.12)]"
        >
          {restWords}
        </span>
      )}
    </span>
  );
};
