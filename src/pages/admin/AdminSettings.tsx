import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { INITIAL_LOGO_SETTINGS } from '../../data/initialData';
import {
  Building2, Sliders, Image as ImageIcon, Save,
  CheckCircle2, HeartPulse,
  Phone, Mail, MapPin, Globe, Clock, Sparkles, Lock, ShieldCheck, RotateCcw
} from 'lucide-react';
import { FileUploadInput } from '../../components/FileUploadInput';
import { HospitalBrandName } from '../../components/HospitalBrandName';

export const AdminSettings: React.FC = () => {
  const {
    businessSettings, updateBusinessSettings,
    sliderSettings,
    logoSettings, updateLogoSettings
  } = useHospital();

  const [activeSubTab, setActiveSubTab] = useState<'business' | 'slider' | 'logo'>('business');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  // Business Form State
  const [bizForm, setBizForm] = useState({ ...businessSettings });
  
  // Mission points state array as multiline text for easy editing
  const [missionText, setMissionText] = useState(businessSettings.missionPoints.join('\n'));

  // Logo Form State
  const [logoForm, setLogoForm] = useState({ ...logoSettings });

  useEffect(() => {
    setLogoForm({ ...logoSettings });
  }, [logoSettings]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Save Business Settings
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMissionPoints = missionText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateBusinessSettings({
      ...bizForm,
      missionPoints: updatedMissionPoints
    });
    showNotification('Business settings updated successfully!');
  };

  // Save Logo Settings
  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    updateLogoSettings(logoForm);
    showNotification('Logo and brand settings updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-xs p-6 border border-emerald-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">
            System Configuration
          </span>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Hospital Settings Management
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Configure contact details, hero banners, brand logo, emergency numbers, and vision/mission statements.
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex bg-emerald-950 p-1 rounded-xs border border-emerald-800">
          <button
            onClick={() => setActiveSubTab('business')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeSubTab === 'business' ? 'bg-white text-emerald-900' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Business
          </button>
          <button
            onClick={() => setActiveSubTab('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeSubTab === 'slider' ? 'bg-white text-emerald-900' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hero Sliders</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs ml-1 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Static
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('logo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeSubTab === 'logo' ? 'bg-white text-emerald-900' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Logo & Brand
          </button>
        </div>
      </div>

      {/* Notification Bar */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xs text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* TAB 1: BUSINESS SETTINGS */}
      {activeSubTab === 'business' && (
        <form onSubmit={handleSaveBusiness} className="space-y-6">
          {/* Basic Identity & Contact Info */}
          <div className="bg-white rounded-xs border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Hospital General Profile</h3>
                <p className="text-xs text-slate-500">Identity, phone numbers, and location details shown across website header & footer.</p>
              </div>
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Business Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={bizForm.hospitalName}
                  onChange={e => setBizForm({ ...bizForm, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Tagline (English)</label>
                <input
                  type="text"
                  value={bizForm.tagline}
                  onChange={e => setBizForm({ ...bizForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Slogan (Hindi)</label>
                <input
                  type="text"
                  value={bizForm.taglineHindi || ''}
                  onChange={e => setBizForm({ ...bizForm, taglineHindi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Mobile Phone</label>
                <input
                  type="text"
                  value={bizForm.primaryPhone}
                  onChange={e => setBizForm({ ...bizForm, primaryPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Secondary Mobile Phone</label>
                <input
                  type="text"
                  value={bizForm.secondaryPhone}
                  onChange={e => setBizForm({ ...bizForm, secondaryPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Landline Phone</label>
                <input
                  type="text"
                  value={bizForm.landlinePhone}
                  onChange={e => setBizForm({ ...bizForm, landlinePhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Official Email</label>
                <input
                  type="email"
                  value={bizForm.email}
                  onChange={e => setBizForm({ ...bizForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Website URL</label>
                <input
                  type="text"
                  value={bizForm.website}
                  onChange={e => setBizForm({ ...bizForm, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">24x7 Emergency Helpline</label>
                <input
                  type="text"
                  value={bizForm.emergencyHelpline}
                  onChange={e => setBizForm({ ...bizForm, emergencyHelpline: e.target.value })}
                  className="w-full px-3 py-2 border border-rose-300 bg-rose-50/50 rounded-xs text-rose-900 font-bold focus:ring-2 focus:ring-rose-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">OPD Timings</label>
                <input
                  type="text"
                  value={bizForm.opdTimings}
                  onChange={e => setBizForm({ ...bizForm, opdTimings: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Google Maps Direction URL</label>
                <input
                  type="text"
                  value={bizForm.googleMapsUrl || ''}
                  onChange={e => setBizForm({ ...bizForm, googleMapsUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/?api=1&query=..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Address Line</label>
                <input
                  type="text"
                  value={bizForm.address}
                  onChange={e => setBizForm({ ...bizForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">City / State / Pin Code</label>
                <input
                  type="text"
                  value={`${bizForm.city}, ${bizForm.statePin}`}
                  onChange={e => {
                    const parts = e.target.value.split(',');
                    setBizForm({
                      ...bizForm,
                      city: parts[0] ? parts[0].trim() : bizForm.city,
                      statePin: parts[1] ? parts[1].trim() : bizForm.statePin
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Ayushman Bharat Toggle */}
            <div className="p-4 bg-emerald-50 rounded-xs border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">Ayushman Bharat Panel Accreditation</h4>
                  <p className="text-[11px] text-emerald-800">Display Ayushman Bharat & Cashless Insurance badge across website headers.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bizForm.ayushmanEnabled}
                  onChange={e => setBizForm({ ...bizForm, ayushmanEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
              </label>
            </div>
          </div>

          {/* Director's Message & Vision Mission */}
          <div className="bg-white rounded-xs border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Director's Message, Vision & Mission Statements
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Director's Name & Title</label>
                  <input
                    type="text"
                    value={bizForm.directorName}
                    onChange={e => setBizForm({ ...bizForm, directorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Director's Designation</label>
                  <input
                    type="text"
                    value={bizForm.directorDesignation}
                    onChange={e => setBizForm({ ...bizForm, directorDesignation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <FileUploadInput
                  label="Director's Photo (Upload JPG, PNG or Paste Image URL)"
                  value={bizForm.directorPhotoUrl || ''}
                  onChange={(val) => setBizForm({ ...bizForm, directorPhotoUrl: val })}
                  helpText="Upload or select photo for Director. It will automatically be displayed at the left corner of Director's Message on the homepage."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Director's Message (Full Text)</label>
                <textarea
                  rows={6}
                  value={bizForm.directorMessage}
                  onChange={e => setBizForm({ ...bizForm, directorMessage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-sans text-slate-700 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={bizForm.visionText}
                  onChange={e => setBizForm({ ...bizForm, visionText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mission Points (Enter 1 point per line)
                </label>
                <textarea
                  rows={4}
                  value={missionText}
                  onChange={e => setMissionText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Business Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: HERO SLIDER SETTINGS (LOCKED IN STATIC MODE TILL NEXT COMMAND) */}
      {activeSubTab === 'slider' && (
        <div className="space-y-6">
          {/* Static Mode Information Alert */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xs shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Static Banners Active & Provision for Changing Banners Inactive (Till Next Command)</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              As commanded, all 4 hero banners presently uploaded have been made permanent static banners. The provision for uploading new banners, editing titles/slogans/images, reordering, deleting, or toggling visibility has been made inactive until the next command.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xs border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900">Hero Slider Banners</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" /> 4 Static Banners Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  Changing Inactive
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                The 4 hospital banners below are permanently loaded on the homepage in static presentation mode.
              </p>
            </div>

            <button
              disabled
              className="bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs border border-slate-300 shadow-none cursor-not-allowed flex items-center gap-1.5 shrink-0"
              title="Banner addition is inactive till next command"
            >
              <Lock className="w-4 h-4 text-slate-400" /> Add Banner (Inactive)
            </button>
          </div>

          {/* Static Slider Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sliderSettings.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white rounded-xs border border-slate-300 transition shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Banner Header & Locked Status */}
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-900 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-xs">
                      Static Banner #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                      {slide.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-emerald-800 text-white border border-emerald-900 shadow-2xs">
                      <Lock className="w-3 h-3 text-amber-300" /> Active (Static)
                    </span>
                  </div>
                </div>

                {/* Banner Image Preview - 100% Clear & Sharp */}
                <div className="relative h-48 bg-slate-900 overflow-hidden border-b border-slate-200">
                  <img
                    src={slide.bgImage}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/85 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 border border-white/20">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>{slide.badge}</span>
                  </div>
                </div>

                {/* Banner Info Strip */}
                <div className="p-3 bg-slate-900 text-white space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    {slide.tagline}
                  </span>
                  <h4 className="font-serif font-bold text-white text-sm truncate">
                    {slide.title}
                  </h4>
                  {slide.highlightText && (
                    <p className="text-xs text-amber-300 font-semibold truncate">
                      {slide.highlightText}
                    </p>
                  )}
                </div>

                {/* Static Banner Notice replacing Upload Control */}
                <div className="p-3.5 bg-slate-50 border-t border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Image locked as static: <span className="font-semibold text-slate-900">Static Banner #{idx + 1}</span></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-amber-100 text-amber-900 border border-amber-300">
                    Upload Inactive
                  </span>
                </div>

                {/* Details Summary */}
                <div className="p-4 space-y-2 text-xs flex-1 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Text</span>
                    <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 text-[11px]">
                      {slide.badge}
                    </span>
                  </div>

                  {slide.hindiSlogan && (
                    <div className="p-2 bg-emerald-50/70 border-l-2 border-emerald-600 rounded-r-xs text-emerald-950 font-serif text-[11px] italic">
                      "{slide.hindiSlogan}"
                    </div>
                  )}

                  {slide.description && (
                    <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                      {slide.description}
                    </p>
                  )}

                  {slide.leftList && slide.rightList && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-700 font-medium">
                      {slide.leftList.slice(0, 2).map((item, i) => (
                        <div key={i} className="truncate">• {item}</div>
                      ))}
                      {slide.rightList.slice(0, 2).map((item, i) => (
                        <div key={i} className="truncate">• {item}</div>
                      ))}
                    </div>
                  )}

                  {slide.serviceBox && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {slide.serviceBox.map((srv, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-xs font-semibold text-slate-700">
                          {srv}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer - Made Inactive */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <button
                    disabled
                    className="bg-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-xs border border-slate-300 cursor-not-allowed flex items-center gap-1.5"
                    title="Banner editing is inactive till next command"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Edit Details (Inactive)
                  </button>

                  <button
                    disabled
                    className="text-slate-400 p-1.5 rounded-xs cursor-not-allowed flex items-center gap-1 text-xs font-bold"
                    title="Banner deletion is inactive till next command"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Delete (Inactive)
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: LOGO & BRANDING SETTINGS */}
      {activeSubTab === 'logo' && (
        <form onSubmit={handleSaveLogo} className="space-y-6">
          <div className="bg-white rounded-xs border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Hospital Branding & Emblem Settings</h3>
                <p className="text-xs text-slate-500">Customize header logo emblem, footer logo image, and brand typography rules.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateLogoSettings(INITIAL_LOGO_SETTINGS);
                    setLogoForm({ ...INITIAL_LOGO_SETTINGS });
                    showNotification('Restored original Khair Hospital logo emblem!');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs border border-slate-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-800" /> Restore Original Logo
                </button>
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Logo Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <FileUploadInput
                  label="Header Logo Emblem (Upload JPG, PNG, SVG or URL)"
                  value={logoForm.headerLogoUrl}
                  onChange={(val) => setLogoForm({ ...logoForm, headerLogoUrl: val })}
                  helpText="Upload custom logo file (JPG, PNG, WEBP, SVG) or leave empty for standard emblem."
                />
              </div>

              <div>
                <FileUploadInput
                  label="Footer Logo Emblem (Upload JPG, PNG, SVG or URL)"
                  value={logoForm.footerLogoUrl}
                  onChange={(val) => setLogoForm({ ...logoForm, footerLogoUrl: val })}
                  helpText="Upload footer logo file or leave empty for standard emblem."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Theme Color (Hex Code)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logoForm.primaryBrandColor || '#064e3b'}
                    onChange={e => setLogoForm({ ...logoForm, primaryBrandColor: e.target.value })}
                    className="w-10 h-10 border border-slate-300 rounded-xs cursor-pointer"
                  />
                  <input
                    type="text"
                    value={logoForm.primaryBrandColor}
                    onChange={e => setLogoForm({ ...logoForm, primaryBrandColor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={logoForm.showTextNextToLogo}
                    onChange={e => setLogoForm({ ...logoForm, showTextNextToLogo: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Display Hospital Name Text Next to Logo</h4>
                  <p className="text-[11px] text-slate-500">Shows "KHAIR HOSPITAL • Basti" alongside logo symbol in navbar.</p>
                </div>
              </div>
            </div>

            {/* Live Header Logo Preview */}
            <div className="p-5 bg-slate-100 rounded-xs border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Header Preview</span>
              <div className="bg-white p-4 rounded-xs shadow-xs border border-slate-200 flex items-center gap-3">
                {logoForm.headerLogoUrl ? (
                  <img src={logoForm.headerLogoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-sm bg-emerald-900 text-white flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                )}
                {logoForm.showTextNextToLogo && (
                  <div>
                    <h1 className="text-xl font-serif font-extrabold tracking-tight">
                      <HospitalBrandName name={bizForm.hospitalName} />
                    </h1>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                      {bizForm.tagline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
