import React from 'react';

export interface BoxColorTheme {
  bg: string;
  border: string;
  text: string;
  subtext: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  buttonBg: string;
  style: React.CSSProperties;
}

export const BOX_COLORS: BoxColorTheme[] = [
  {
    // Color 1 (Image 1: Dusty Rose / Soft Mauve Pink)
    bg: 'bg-[#D8A4A6]',
    border: 'border-[#C48D8F]',
    text: 'text-[#3D1618]',
    subtext: 'text-[#5E2B2E]',
    badgeBg: 'bg-[#3D1618]',
    badgeText: 'text-white',
    iconBg: 'bg-[#3D1618]/15 text-[#3D1618]',
    buttonBg: 'bg-[#3D1618] hover:bg-[#2B0E10] text-white',
    style: { backgroundColor: '#D8A4A6', borderColor: '#C48D8F', color: '#3D1618' }
  },
  {
    // Color 2 (Image 2: Pinkish Crimson Red)
    bg: 'bg-[#E83E8C]',
    border: 'border-[#D12270]',
    text: 'text-white',
    subtext: 'text-rose-100',
    badgeBg: 'bg-white',
    badgeText: 'text-[#E83E8C]',
    iconBg: 'bg-white/20 text-white',
    buttonBg: 'bg-slate-900 hover:bg-slate-950 text-white',
    style: { backgroundColor: '#E83E8C', borderColor: '#D12270', color: '#FFFFFF' }
  },
  {
    // Color 3 (Image 3: Soft Mint Green)
    bg: 'bg-[#B3EBB5]',
    border: 'border-[#98D89B]',
    text: 'text-[#0D381B]',
    subtext: 'text-[#1F5430]',
    badgeBg: 'bg-[#0D381B]',
    badgeText: 'text-white',
    iconBg: 'bg-[#0D381B]/15 text-[#0D381B]',
    buttonBg: 'bg-[#0D381B] hover:bg-[#072411] text-white',
    style: { backgroundColor: '#B3EBB5', borderColor: '#98D89B', color: '#0D381B' }
  },
  {
    // Color 4 (Image 4: Soft Lavender Purple)
    bg: 'bg-[#9980B9]',
    border: 'border-[#836A9E]',
    text: 'text-[#220D38]',
    subtext: 'text-[#3A1D5A]',
    badgeBg: 'bg-[#220D38]',
    badgeText: 'text-white',
    iconBg: 'bg-[#220D38]/15 text-[#220D38]',
    buttonBg: 'bg-[#220D38] hover:bg-[#140624] text-white',
    style: { backgroundColor: '#9980B9', borderColor: '#836A9E', color: '#220D38' }
  }
];

export const getBoxColor = (index: number): BoxColorTheme => {
  return BOX_COLORS[index % BOX_COLORS.length];
};
