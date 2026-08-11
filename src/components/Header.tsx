import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { KhairLogo } from './KhairLogo';
import {
  Phone, Clock, MapPin, ShieldAlert, Calendar, LayoutDashboard,
  Menu, X, HeartPulse, Stethoscope, Award, Megaphone, UserCheck, ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab, setCurrentTab, setIsAdminMode, setIsAppointmentModalOpen,
    businessSettings, logoSettings, flashAnnouncement, setIsFlashModalOpen,
    setIsEmployeeModalOpen, loggedInEmployee, setIsEmployeePortalOpen
  } = useHospital();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'news-events', label: 'News & Events' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full bg-white shadow-xs border-b border-gray-100 sticky top-0 z-40">
      {/* Flash Announcement Ticker Banner */}
      {flashAnnouncement?.enabled && flashAnnouncement?.showTickerBanner && (
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white text-xs font-bold py-1.5 px-4 sm:px-8 border-b border-purple-700/60 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2 truncate cursor-pointer" onClick={() => setIsFlashModalOpen(true)}>
              <span className="shrink-0 bg-yellow-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full animate-pulse tracking-wider flex items-center gap-1 shadow-xs">
                <Megaphone className="w-3 h-3 text-slate-950" />
                FLASH
              </span>
              <p className="truncate text-purple-100 text-[11px] sm:text-xs font-semibold">
                "{flashAnnouncement.message}"
              </p>
            </div>
            <button
              onClick={() => setIsFlashModalOpen(true)}
              className="shrink-0 bg-white/15 hover:bg-white/25 text-white px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer border border-purple-400/30 flex items-center gap-1"
            >
              <span>View Announcement</span>
              <span className="text-[10px]">➔</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Utility Header - Light Steel Blue (#92b5d8) from Image 1 */}
      <div className="bg-[#92b5d8] text-slate-950 text-xs font-semibold py-2 px-4 sm:px-8 border-b border-[#7fa4c9] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-950">
            <span className="flex items-center gap-1.5 font-bold text-slate-950">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-rose-700" />
              Emergency: <a href={`tel:${businessSettings.primaryPhone}`} className="hover:underline font-extrabold text-slate-950">{businessSettings.primaryPhone}</a> / <a href={`tel:${businessSettings.landlinePhone}`} className="hover:underline text-slate-950 font-extrabold">{businessSettings.landlinePhone}</a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-900">
              <Clock className="w-3.5 h-3.5 text-emerald-950" />
              OPD Timings: {businessSettings.opdTimings}
            </span>
            <a
              href={businessSettings.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=Khair+Hospital+Bansi+Road+Katra+Basti+Uttar+Pradesh"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-slate-900 hover:text-emerald-950 font-bold hover:underline transition"
              title="Open Location in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
              {businessSettings.address}, {businessSettings.city}
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            {flashAnnouncement?.enabled && (
              <button
                onClick={() => setIsFlashModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-purple-200 border border-purple-800 px-2.5 py-1 rounded-xs font-bold text-[11px] tracking-wide transition cursor-pointer shadow-xs"
                title="View Latest Announcement"
              >
                <Megaphone className="w-3 h-3 text-yellow-300 animate-bounce" />
                <span>Latest Announcement</span>
              </button>
            )}

            {businessSettings.ayushmanEnabled && (
              <span className="hidden lg:inline-block bg-emerald-950 text-emerald-100 px-2.5 py-0.5 rounded-xs text-[11px] font-bold tracking-wider uppercase border border-emerald-900 shadow-2xs">
                Ayushman Bharat Empaneled
              </span>
            )}
            {loggedInEmployee ? (
              <button
                onClick={() => setIsEmployeePortalOpen(true)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs"
                title={`Open Staff Portal (${loggedInEmployee.name})`}
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>Staff Portal ({loggedInEmployee.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-950 text-emerald-300 px-3 py-1 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs border border-emerald-800/60"
                title="Employee Login with Password"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Employee Login</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAdminMode(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-1 rounded-xs font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs"
              title="Open Hospital Admin Panel"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-100">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {logoSettings.headerLogoUrl ? (
            <img src={logoSettings.headerLogoUrl} alt="Logo" className="w-11 h-11 object-contain rounded-full shadow-xs group-hover:scale-105 transition-transform shrink-0" />
          ) : (
            <KhairLogo className="w-11 h-11 shadow-xs group-hover:scale-105 transition-transform shrink-0" />
          )}

          {logoSettings.showTextNextToLogo && (
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-emerald-900 flex items-center gap-1">
                {businessSettings.hospitalName}
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                {businessSettings.tagline}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`py-1 transition-colors cursor-pointer text-sm font-medium ${
                  isActive
                    ? 'text-emerald-900 font-bold underline underline-offset-8 decoration-emerald-700 decoration-2'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book OPD
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="sm:hidden bg-emerald-900 text-white p-2 rounded-xs"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xs text-sm font-bold uppercase tracking-wider transition ${
                currentTab === item.id
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setIsAppointmentModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xs shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              Book OPD Appointment
            </button>
            
            {loggedInEmployee ? (
              <button
                onClick={() => {
                  setIsEmployeePortalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xs shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                Staff Portal ({loggedInEmployee.name.split(' ')[0]})
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEmployeeModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-emerald-300 font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xs shadow-xs border border-emerald-800"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Employee Login
              </button>
            )}

            <button
              onClick={() => {
                setIsAdminMode(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xs shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
