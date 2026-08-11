import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Pause, Play, Phone, Mail, Globe, 
  CheckCircle2, Calendar, Eye, Sparkles, HeartPulse, Building2 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

import bannerFacilities from '../assets/images/khair_banner_facilities_1786209223428.jpg';
import bannerEyecare from '../assets/images/khair_banner_eyecare_1786209242082.jpg';
import bannerWelcome from '../assets/images/khair_banner_welcome_1786209260002.jpg';

interface SlideItem {
  id: number;
  tagline: string;
  title: string;
  highlightText?: string;
  hindiSlogan?: string;
  description?: string;
  bgImage: string;
  badge: string;
  leftList?: string[];
  rightList?: string[];
  serviceBox?: string[];
  accentColor: string;
}

export const HeroSlider: React.FC = () => {
  const { setIsAppointmentModalOpen, setCurrentTab, sliderSettings, businessSettings } = useHospital();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter only active slides
  const activeSlides = sliderSettings.filter(s => s.isActive);
  const slides = activeSlides.length > 0 ? activeSlides : sliderSettings;

  // Ensure currentSlide is within bounds if slider length changes
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 shadow-xs pb-6">

      {/* 1. 100% FULL WIDTH EDGE-TO-EDGE BANNER SHOWCASE */}
      <div 
        className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-300 shadow-md group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active Banner Image Frame - 100% Full Width Edge-to-Edge */}
        <div className="relative w-full min-h-[260px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
          {slides.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.bgImage}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
              }`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        {/* Navigation Arrows on Edges */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-emerald-800 text-white flex items-center justify-center border border-white/40 transition cursor-pointer shadow-xl backdrop-blur-xs"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-emerald-800 text-white flex items-center justify-center border border-white/40 transition cursor-pointer shadow-xl backdrop-blur-xs"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Top Badge Tag & Play/Pause Control Bar */}
        <div className="absolute top-4 right-4 sm:right-6 z-30 flex items-center gap-2">
          <span className="bg-emerald-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-500 shadow-md uppercase tracking-wider backdrop-blur-xs">
            {current.badge || `Banner #${currentSlide + 1}`}
          </span>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 transition cursor-pointer shadow-md"
            title={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4 pt-4">

        {/* 2. BANNER SELECTOR STRIP (Quick Tabs for Banners) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Select Banner ({slides.length}):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                  idx === currentSlide
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-amber-400' : 'bg-slate-400'}`} />
                <span>Banner #{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. NON-OVERLAPPING DETAILS & HELPLINE PANEL BELOW IMAGE */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-5">
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {current.tagline}
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-white leading-tight">
                  {current.title}
                </h1>
                {current.highlightText && (
                  <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                    {current.highlightText}
                  </p>
                )}
              </div>

              {/* Hindi Slogan if available */}
              {current.hindiSlogan && (
                <div className="bg-emerald-950/80 border-l-4 border-emerald-400 p-3 rounded-r-xs">
                  <p className="text-base sm:text-lg font-serif italic text-emerald-200">
                    "{current.hindiSlogan}"
                  </p>
                </div>
              )}

              {/* Description quote */}
              {current.description && !current.hindiSlogan && (
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {current.description}
                </p>
              )}

              {/* Bullet Points */}
              {current.leftList && current.rightList && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-medium text-slate-200">
                  <div className="space-y-2">
                    {current.leftList.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {current.rightList.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Services Box */}
              {current.serviceBox && (
                <div className="bg-emerald-950 border border-emerald-800/80 p-4 rounded-xl space-y-2 max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block border-b border-emerald-800/80 pb-1">
                    OUR CORE CLINICAL SERVICES
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-white pt-1">
                    {current.serviceBox.map((srv, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-lg shadow-md transition-transform hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book OPD Slot
                </button>

                <button
                  onClick={() => setCurrentTab('doctors')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-2"
                >
                  <HeartPulse className="w-4 h-4 text-emerald-400" /> Specialist Faculty
                </button>
              </div>
            </div>

            {/* Right Quick Contact Card */}
            <div className="lg:col-span-4 w-full">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Khair Hospital Basti
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Direct Helpline & Desk</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Call for emergency admission, ambulance, or doctor inquiry.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs font-mono pt-1">
                  <a href={`tel:${businessSettings.landlinePhone}`} className="flex items-center gap-2.5 text-slate-200 hover:text-emerald-300 transition">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{businessSettings.landlinePhone}</span>
                  </a>
                  <a href={`tel:${businessSettings.primaryPhone}`} className="flex items-center gap-2.5 text-slate-200 hover:text-emerald-300 transition font-bold text-sm">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{businessSettings.primaryPhone}</span>
                  </a>
                  <a href={`https://${businessSettings.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-slate-200 hover:text-emerald-300 transition">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{businessSettings.website}</span>
                  </a>
                  <a href={`mailto:${businessSettings.email}`} className="flex items-center gap-2.5 text-slate-200 hover:text-emerald-300 transition">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{businessSettings.email}</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setCurrentTab('facilities')}
                    className="w-full text-center text-xs font-bold text-emerald-400 hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    View All Facilities & Units →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Contact Details Strip - Soft Steel Blue (#92b5d8) from Image 1 */}
      <div className="bg-[#92b5d8] text-slate-950 text-xs py-2.5 px-4 sm:px-8 border-t border-[#7fa4c9] mt-4 font-medium shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-bold text-slate-950">
              <Phone className="w-3.5 h-3.5 text-emerald-950" />
              {businessSettings.primaryPhone} / {businessSettings.landlinePhone}
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-900 font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-800" />
              {businessSettings.website}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-900 font-semibold">
              <Mail className="w-3.5 h-3.5 text-slate-800" />
              {businessSettings.email}
            </span>
          </div>
          <div className="text-[11px] text-slate-950 uppercase font-extrabold tracking-wider bg-white/40 px-3 py-1 rounded-full border border-white/60">
            24x7 Emergency Helpline: {businessSettings.emergencyHelpline}
          </div>
        </div>
      </div>
    </div>
  );
};
