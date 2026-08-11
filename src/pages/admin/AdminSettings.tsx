import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { SliderSetting } from '../../types';
import { INITIAL_LOGO_SETTINGS } from '../../data/initialData';
import {
  Building2, Sliders, Image as ImageIcon, Save, Plus, Trash2,
  CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, HeartPulse,
  Phone, Mail, MapPin, Globe, Clock, Sparkles, ArrowUp, ArrowDown, Upload, Edit3, RotateCcw
} from 'lucide-react';
import { FileUploadInput } from '../../components/FileUploadInput';

export const AdminSettings: React.FC = () => {
  const {
    businessSettings, updateBusinessSettings,
    sliderSettings, addSlider, updateSlider, deleteSlider, toggleSliderStatus, reorderSliders,
    logoSettings, updateLogoSettings, isSupabaseConnected
  } = useHospital();

  const [activeSubTab, setActiveSubTab] = useState<'business' | 'slider' | 'logo' | 'database'>('business');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSqlCopied, setShowSqlCopied] = useState(false);

  const supabaseSqlScript = `-- ============================================================
-- KHAIR HOSPITAL - CLOUD DATABASE SCHEMA
-- Copy and run this script in SQL Editor Console
-- Fully Idempotent DDL - Resolves Security & Function Constraints
-- ============================================================

-- Enable pgcrypto extension for gen_random_uuid() support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop legacy function with CASCADE so event triggers won't block execution
DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE;

-- ============================================================
-- 1. DOCTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  qualification TEXT,
  department TEXT NOT NULL,
  specialization TEXT,
  experience TEXT,
  image TEXT,
  opd_schedule TEXT,
  fee NUMERIC DEFAULT 0,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  bio TEXT,
  room_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public insert/update/delete on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public full access on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable read access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable insert access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable update access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable delete access for all users on doctors" ON public.doctors;

CREATE POLICY "Enable read access for all users on doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on doctors" ON public.doctors FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on doctors" ON public.doctors FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on doctors" ON public.doctors FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 2. EMPLOYEES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT UNIQUE,
  name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  phone TEXT,
  email TEXT,
  join_date TEXT,
  shift TEXT DEFAULT 'General',
  status TEXT DEFAULT 'Active',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public insert/update/delete on employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public full access on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable read access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable insert access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable update access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable delete access for all users on employees" ON public.employees;

CREATE POLICY "Enable read access for all users on employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on employees" ON public.employees FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on employees" ON public.employees FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on employees" ON public.employees FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 3. NOTICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT,
  date TEXT,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'Normal',
  target_audience TEXT DEFAULT 'All Patients & Visitors',
  doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public insert/update/delete on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public full access on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable read access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable insert access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable update access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable delete access for all users on notices" ON public.notices;

CREATE POLICY "Enable read access for all users on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on notices" ON public.notices FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on notices" ON public.notices FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on notices" ON public.notices FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 4. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  description TEXT,
  organizer TEXT,
  max_seats INTEGER DEFAULT 100,
  registered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Upcoming',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on events" ON public.events;
DROP POLICY IF EXISTS "Allow public insert/update/delete on events" ON public.events;
DROP POLICY IF EXISTS "Allow public full access on events" ON public.events;
DROP POLICY IF EXISTS "Enable read access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable insert access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable update access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable delete access for all users on events" ON public.events;

CREATE POLICY "Enable read access for all users on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on events" ON public.events FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on events" ON public.events FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on events" ON public.events FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 5. GALLERY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  caption TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public insert/update/delete on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public full access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable read access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable insert access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable update access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable delete access for all users on gallery" ON public.gallery;

CREATE POLICY "Enable read access for all users on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on gallery" ON public.gallery FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on gallery" ON public.gallery FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on gallery" ON public.gallery FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 6. FEEDBACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  patient_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  rating INTEGER DEFAULT 5,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'Pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow public insert/update/delete on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow public full access on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable read access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable insert access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable update access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable delete access for all users on feedbacks" ON public.feedbacks;

CREATE POLICY "Enable read access for all users on feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on feedbacks" ON public.feedbacks FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on feedbacks" ON public.feedbacks FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 7. APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  appointment_number TEXT UNIQUE,
  patient_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  email TEXT,
  department TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  date TEXT,
  time_slot TEXT,
  status TEXT DEFAULT 'Confirmed',
  symptoms TEXT,
  communication_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public insert/update/delete on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public full access on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable read access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable update access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable delete access for all users on appointments" ON public.appointments;

CREATE POLICY "Enable read access for all users on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on appointments" ON public.appointments FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on appointments" ON public.appointments FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on appointments" ON public.appointments FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 8. HOSPITAL SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hospital_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hospital_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Allow public insert/update/delete on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Allow public full access on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable read access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable insert access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable update access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable delete access for all users on hospital_settings" ON public.hospital_settings;

CREATE POLICY "Enable read access for all users on hospital_settings" ON public.hospital_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on hospital_settings" ON public.hospital_settings FOR INSERT WITH CHECK (key IS NOT NULL);
CREATE POLICY "Enable update access for all users on hospital_settings" ON public.hospital_settings FOR UPDATE USING (key IS NOT NULL) WITH CHECK (key IS NOT NULL);
CREATE POLICY "Enable delete access for all users on hospital_settings" ON public.hospital_settings FOR DELETE USING (key IS NOT NULL);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setShowSqlCopied(true);
    setTimeout(() => setShowSqlCopied(false), 3000);
  };

  // Business Form State
  const [bizForm, setBizForm] = useState({ ...businessSettings });
  
  // Mission points state array as multiline text for easy editing
  const [missionText, setMissionText] = useState(businessSettings.missionPoints.join('\n'));

  // Logo Form State
  const [logoForm, setLogoForm] = useState({ ...logoSettings });

  useEffect(() => {
    setLogoForm({ ...logoSettings });
  }, [logoSettings]);

  // Slider Modal / Form State
  const [isAddingSlider, setIsAddingSlider] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  const initialSlideState: Omit<SliderSetting, 'id'> = {
    tagline: 'Multi-Specialty & Healthcare',
    title: 'KHAIR HOSPITAL',
    highlightText: 'Advanced Care',
    hindiSlogan: 'आपकी सेहत, हमारी प्राथमिकता',
    description: 'Providing world-class medical treatment and compassionate care in Basti.',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600',
    badge: 'Specialty Services',
    leftList: ['24x7 Emergency', 'Modern Modular OT'],
    rightList: ['Expert Doctors', 'ICU & Trauma Unit'],
    serviceBox: ['OPD Services', 'IPD Services', 'Pathology'],
    accentColor: 'from-emerald-600 to-teal-700',
    isActive: true
  };

  const [slideForm, setSlideForm] = useState<Omit<SliderSetting, 'id'>>(initialSlideState);
  const [leftListText, setLeftListText] = useState('');
  const [rightListText, setRightListText] = useState('');
  const [serviceBoxText, setServiceBoxText] = useState('');

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

  // Open Edit Slide Modal
  const openEditSlide = (slide: SliderSetting) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      tagline: slide.tagline,
      title: slide.title,
      highlightText: slide.highlightText || '',
      hindiSlogan: slide.hindiSlogan || '',
      description: slide.description || '',
      bgImage: slide.bgImage,
      badge: slide.badge,
      leftList: slide.leftList || [],
      rightList: slide.rightList || [],
      serviceBox: slide.serviceBox || [],
      accentColor: slide.accentColor,
      isActive: slide.isActive
    });
    setLeftListText((slide.leftList || []).join('\n'));
    setRightListText((slide.rightList || []).join('\n'));
    setServiceBoxText((slide.serviceBox || []).join('\n'));
    setIsAddingSlider(true);
  };

  // Move slide up or down
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sliderSettings.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSlides = [...sliderSettings];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    reorderSliders(newSlides);
    showNotification('Banner order updated successfully!');
  };

  // Save Slider
  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSlideId && sliderSettings.length >= 4) {
      alert('Maximum 4 hero banners allowed. Please edit or replace an existing banner.');
      return;
    }

    const leftArr = leftListText.split('\n').map(s => s.trim()).filter(Boolean);
    const rightArr = rightListText.split('\n').map(s => s.trim()).filter(Boolean);
    const serviceArr = serviceBoxText.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...slideForm,
      leftList: leftArr.length > 0 ? leftArr : undefined,
      rightList: rightArr.length > 0 ? rightArr : undefined,
      serviceBox: serviceArr.length > 0 ? serviceArr : undefined
    };

    if (editingSlideId) {
      updateSlider(editingSlideId, payload);
      showNotification('Hero banner updated successfully!');
    } else {
      addSlider(payload);
      showNotification('New hero slider banner added successfully!');
    }

    setIsAddingSlider(false);
    setEditingSlideId(null);
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
            Hero Sliders
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
          <button
            onClick={() => setActiveSubTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeSubTab === 'database' ? 'bg-white text-emerald-900' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Cloud Database
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

      {/* TAB 4: CLOUD DATABASE & SCHEMA */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xs border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  Hospital Cloud Database Status
                </h3>
                <p className="text-xs text-slate-500">Live multi-device database synchronization & RLS security configuration.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isSupabaseConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                  {isSupabaseConnected ? 'Connected & Synced' : 'Ready / Standing By'}
                </span>
                <button
                  onClick={copySqlToClipboard}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {showSqlCopied ? 'Copied SQL Script!' : 'Copy SQL DDL Script'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xs p-4 space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Cloud Database Endpoint</span>
                <code className="bg-white border border-slate-300 px-3 py-1.5 rounded-xs block font-mono text-emerald-900 font-bold overflow-x-auto">
                  https://fgkfkktuxbunvawerllm.supabase.co
                </code>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xs p-4 space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Publishable API Key</span>
                <code className="bg-white border border-slate-300 px-3 py-1.5 rounded-xs block font-mono text-slate-800 overflow-x-auto">
                  sb_publishable_svpR6q_BvmoBaGhWoHPpCw_FC_iqg5V
                </code>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Synced Database Tables</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {['doctors', 'employees', 'notices', 'events', 'gallery', 'feedbacks', 'appointments', 'hospital_settings'].map((tbl) => (
                  <div key={tbl} className="bg-emerald-50/50 border border-emerald-200 rounded-xs p-3 flex items-center justify-between">
                    <span className="font-bold font-mono text-emerald-950">{tbl}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xs p-4 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Row Level Security (RLS) Policy
              </div>
              <p>
                All 8 hospital tables have Row Level Security enabled. Click <strong>"Copy SQL DDL Script"</strong> above and paste into the Database Console SQL Editor if you ever need to reset or run migrations manually.
              </p>
            </div>
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

      {/* TAB 2: HERO SLIDER SETTINGS */}
      {activeSubTab === 'slider' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xs border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900">Hero Slider Banners</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  sliderSettings.length >= 4 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {sliderSettings.length} / 4 Configured
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload up to 4 banner images and customize slogans, highlights, and bullet points for the homepage slider.
              </p>
            </div>

            {sliderSettings.length < 4 ? (
              <button
                onClick={() => {
                  setEditingSlideId(null);
                  setSlideForm(initialSlideState);
                  setLeftListText(initialSlideState.leftList?.join('\n') || '');
                  setRightListText(initialSlideState.rightList?.join('\n') || '');
                  setServiceBoxText(initialSlideState.serviceBox?.join('\n') || '');
                  setIsAddingSlider(true);
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Banner ({sliderSettings.length + 1}/4)
              </button>
            ) : (
              <div className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-2 rounded-xs border border-amber-200 flex items-center gap-1.5 shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Max 4 Banners Active
              </div>
            )}
          </div>

          {/* Slider Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sliderSettings.map((slide, idx) => (
              <div
                key={slide.id}
                className={`bg-white rounded-xs border transition shadow-xs overflow-hidden flex flex-col justify-between ${
                  slide.isActive ? 'border-slate-300' : 'border-slate-200 opacity-75'
                }`}
              >
                {/* Banner Header & Order Controls */}
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-900 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-xs">
                      Banner #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                      {slide.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      onClick={() => moveSlide(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-xs bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveSlide(idx, 'down')}
                      disabled={idx === sliderSettings.length - 1}
                      className="p-1.5 rounded-xs bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleSliderStatus(slide.id)}
                      className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer border ${
                        slide.isActive ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-700 text-slate-200 border-slate-800'
                      }`}
                    >
                      {slide.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {slide.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>

                {/* Banner Image Preview - 100% Clear, Bright & Sharp */}
                <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                  <img
                    src={slide.bgImage}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    {slide.badge}
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

                {/* Direct File Upload Component for Quick Image Change */}
                <div className="p-4 bg-slate-50 border-t border-b border-slate-200 space-y-2">
                  <FileUploadInput
                    label="📷 Quick Upload / Change Banner Image"
                    value={slide.bgImage}
                    onChange={(newVal) => {
                      if (newVal) {
                        updateSlider(slide.id, { bgImage: newVal });
                        showNotification(`Banner #${idx + 1} image changed successfully!`);
                      }
                    }}
                    helpText="Upload a JPG/PNG file or paste image URL to instantly update this banner."
                  />
                </div>

                {/* Details Summary */}
                <div className="p-4 space-y-2 text-xs flex-1 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Text</span>
                    <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 text-[11px]">
                      {slide.badge}
                    </span>
                  </div>

                  {slide.description && (
                    <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                      {slide.description}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => openEditSlide(slide)}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Full Details
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete Banner #${idx + 1}?`)) {
                        deleteSlider(slide.id);
                        showNotification(`Banner #${idx + 1} deleted.`);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-800 p-1.5 rounded-xs hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Slots up to 4 */}
            {Array.from({ length: Math.max(0, 4 - sliderSettings.length) }).map((_, emptyIdx) => {
              const slotNumber = sliderSettings.length + emptyIdx + 1;
              return (
                <div
                  key={`empty-slot-${slotNumber}`}
                  className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xs p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[320px]"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-700 text-base">
                      Banner Slot #{slotNumber} (Available)
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Upload a new hero banner image and set title & details for Slot #{slotNumber}.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSlideId(null);
                      setSlideForm({
                        ...initialSlideState,
                        title: 'KHAIR HOSPITAL'
                      });
                      setLeftListText(initialSlideState.leftList?.join('\n') || '');
                      setRightListText(initialSlideState.rightList?.join('\n') || '');
                      setServiceBoxText(initialSlideState.serviceBox?.join('\n') || '');
                      setIsAddingSlider(true);
                    }}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5 mt-2"
                  >
                    <Plus className="w-4 h-4" /> Add Banner for Slot #{slotNumber}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add / Edit Slide Modal */}
          {isAddingSlider && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xs border border-slate-200 max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {editingSlideId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                  </h3>
                  <button
                    onClick={() => setIsAddingSlider(false)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Title</label>
                      <input
                        type="text"
                        value={slideForm.title}
                        onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Tagline</label>
                      <input
                        type="text"
                        value={slideForm.tagline}
                        onChange={e => setSlideForm({ ...slideForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Highlight Heading</label>
                      <input
                        type="text"
                        value={slideForm.highlightText || ''}
                        onChange={e => setSlideForm({ ...slideForm, highlightText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={slideForm.badge}
                        onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <FileUploadInput
                    label="Hero Banner Background Image (Upload JPG / PNG or URL)"
                    value={slideForm.bgImage}
                    onChange={(val) => setSlideForm({ ...slideForm, bgImage: val })}
                    required
                    helpText="Upload banner image (JPG, PNG, WEBP) or enter image URL."
                  />

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Hindi Slogan (Optional)</label>
                    <input
                      type="text"
                      value={slideForm.hindiSlogan || ''}
                      onChange={e => setSlideForm({ ...slideForm, hindiSlogan: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Description</label>
                    <textarea
                      rows={2}
                      value={slideForm.description || ''}
                      onChange={e => setSlideForm({ ...slideForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Left Bullet Items (1 per line)</label>
                      <textarea
                        rows={3}
                        value={leftListText}
                        onChange={e => setLeftListText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Right Bullet Items (1 per line)</label>
                      <textarea
                        rows={3}
                        value={rightListText}
                        onChange={e => setRightListText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={slideForm.isActive}
                        onChange={e => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded-xs"
                      />
                      Active on Homepage
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSlider(false)}
                        className="px-4 py-2 border border-slate-300 rounded-xs text-slate-700 font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" /> Save Banner
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                    <h1 className="text-xl font-serif font-bold tracking-tight text-emerald-900">
                      {bizForm.hospitalName}
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
