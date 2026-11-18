import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { KhairLogo } from './KhairLogo';
import { HospitalBrandName } from './HospitalBrandName';
import { UserCheck, LayoutDashboard } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentTab, setIsAdminMode, setIsEmployeeModalOpen, loggedInEmployee, setIsEmployeePortalOpen, logoSettings, businessSettings } = useHospital();

  return (
    <footer className="w-full relative overflow-hidden shadow-2xl text-slate-900 font-sans">
      {/* Top Accent Stripe Bar */}
      <div 
        className="h-3 w-full"
        style={{
          background: 'repeating-linear-gradient(135deg, #022c7a 0px, #022c7a 32px, #38bdf8 32px, #38bdf8 64px, #0f172a 64px, #0f172a 96px)'
        }}
      />

      {/* Main Footer Body with Golden Yellow & Blue Geometric Background matching reference image */}
      <div 
        className="pt-12 pb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #f59e0b 80%, #d97706 100%)'
        }}
      >
        {/* Geometric angled paper overlays matching the sky-blue & dark-blue shapes in reference image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div 
            className="absolute -top-12 left-1/4 w-96 h-[500px] bg-sky-200/60 mix-blend-multiply transform -rotate-12 rounded-3xl backdrop-blur-xs border border-sky-300/40"
          />
          <div 
            className="absolute top-10 right-10 w-80 h-[450px] bg-sky-100/70 transform rotate-45 rounded-2xl border border-white/50"
          />
          <div 
            className="absolute -bottom-20 -right-10 w-96 h-96 bg-sky-600/80 transform rotate-12 rounded-3xl"
          />
          <div 
            className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-900/40 transform -rotate-45 rounded-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          {/* 3 Columns Grid Container in Light Backdrop Glass Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg border border-white/60 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8 border-b border-slate-300/80">
              
              {/* Column 1: KHAIR HOSPITAL Brand */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  {/* Logo emblem */}
                  {logoSettings?.footerLogoUrl ? (
                    <img src={logoSettings.footerLogoUrl} alt="Logo" className="w-12 h-12 shrink-0 object-contain rounded-full bg-white p-0.5 shadow-md border border-slate-200" />
                  ) : (
                    <KhairLogo className="w-12 h-12 shrink-0 shadow-md" />
                  )}
                  <div>
                    <h3 className="text-2xl font-serif font-black tracking-wider uppercase">
                      <HospitalBrandName name={businessSettings?.hospitalName || 'KHAIR HOSPITAL'} />
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/80">
                      {businessSettings?.tagline || 'EXCELLENCE IN HEALTHCARE • BASTI'}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans max-w-md font-medium">
                  Providing exceptional healthcare services with compassion and excellence across Basti and Eastern Uttar Pradesh.
                </p>

                <div className="pt-1">
                  <span className="text-emerald-900 font-bold text-xs sm:text-sm tracking-wide block bg-emerald-100/80 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300/60 inline-block">
                    24x7 Casualty • Eye Care • Laparoscopic Surgery
                  </span>
                </div>
              </div>

              {/* Column 2: QUICK LINKS */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-slate-950 font-bold text-sm uppercase tracking-wider border-b border-slate-300 pb-2">
                  QUICK LINKS
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                  <li>
                    <button
                      onClick={() => setCurrentTab('home')}
                      className="hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-emerald-700">›</span> Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('home')}
                      className="hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-emerald-700">›</span> About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('gallery')}
                      className="hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-emerald-700">›</span> Gallery
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-emerald-700">›</span> Contact
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: SERVICES */}
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-slate-950 font-bold text-sm uppercase tracking-wider border-b border-slate-300 pb-2">
                  SERVICES
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>Emergency Care</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>General & Laparoscopic Surgery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>Ophthalmology & Eye Diagnostics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>Rehabilitation & Post-Operative Care</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Copyright & Portals Bar */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-800 font-medium">
              <p className="font-semibold text-slate-900">
                © {new Date().getFullYear()} KHAIR HOSPITAL. All Rights Reserved.
              </p>

              <div className="flex items-center gap-3 sm:gap-3.5 flex-wrap text-xs">
                <span className="text-slate-700">Developed by <strong className="text-slate-950 font-bold">Digital Communique</strong></span>
                <span className="text-slate-400 hidden sm:inline">|</span>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {loggedInEmployee ? (
                    <button
                      onClick={() => setIsEmployeePortalOpen(true)}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs"
                      title={`Open Staff Portal (${loggedInEmployee.name})`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                      <span>Staff Portal ({loggedInEmployee.name.split(' ')[0]})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEmployeeModalOpen(true)}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-950 text-emerald-300 px-3 py-1.5 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs border border-emerald-800/60"
                      title="Employee Login with Password"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Employee Login</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsAdminMode(true)}
                    className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs"
                    title="Open Hospital Admin Panel"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
