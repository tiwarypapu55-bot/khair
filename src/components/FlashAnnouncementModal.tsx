import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { X, HeartPulse, Megaphone, Bell, Sparkles } from 'lucide-react';

export const FlashAnnouncementModal: React.FC = () => {
  const { flashAnnouncement, isFlashModalOpen, setIsFlashModalOpen, logoSettings, businessSettings } = useHospital();

  if (!isFlashModalOpen || !flashAnnouncement || !flashAnnouncement.enabled) {
    return null;
  }

  const handleClose = () => {
    setIsFlashModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      {/* Modal Card Box */}
      <div className="relative w-full max-w-xl bg-purple-50/70 rounded-2xl overflow-hidden shadow-2xl border border-purple-200/80 transition-all transform scale-100">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Logo Circle with 'H' or Icon */}
            {logoSettings?.headerLogoUrl ? (
              <img src={logoSettings.headerLogoUrl} alt="Logo" className="w-7 h-7 rounded-full object-cover bg-white p-0.5" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-900/90 text-purple-300 font-extrabold text-xs flex items-center justify-center shadow-xs border border-purple-400/40">
                H
              </div>
            )}
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight font-serif text-white flex items-center gap-2">
                {flashAnnouncement.title || 'Latest Announcement'}
              </h2>
            </div>
          </div>

          {/* Top Right Close Button */}
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Announcement Quote Box with Blue Left Accent Line */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 relative overflow-hidden flex flex-col justify-center items-center min-h-[120px]">
            {/* Blue Vertical Bar on Left Edge */}
            <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-r-full shadow-xs" />

            {/* Announcement Message Content */}
            <div className="w-full text-center px-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 font-sans sm:font-serif leading-relaxed">
                "{flashAnnouncement.message || 'Every Thursday - Consultation fee - Free.'}"
              </p>

              {flashAnnouncement.subText && (
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                  {flashAnnouncement.subText}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Action Button - Centered Pill Button with 'x Close' */}
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={handleClose}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-2 rounded-xl border border-slate-200/90 shadow-xs text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer hover:border-slate-300"
            >
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold">
                ✕
              </span>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
