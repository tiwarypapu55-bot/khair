import React from 'react';
import { useHospital, AdminTabType } from '../../context/HospitalContext';
import { Globe, LogOut } from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminTab, setAdminTab, setIsAdminMode, adminLogout } = useHospital();

  const adminNavItems: Array<{ id: AdminTabType; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'doctor-list', label: 'Doctor List' },
    { id: 'employee', label: 'Employee' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notice', label: 'Notice' },
    { id: 'events', label: 'Events' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Emerald Header Bar for Editorial Theme */}
      <header className="bg-emerald-900 text-white shadow-xs sticky top-0 z-50 border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Admin Dashboard Title Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white flex items-baseline gap-2">
              KHAIR ADMIN <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-emerald-300">Management</span>
            </h1>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {adminNavItems.map((item) => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950 text-white border border-emerald-700/50'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Exit Admin & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xs transition cursor-pointer border border-emerald-800"
              title="Return to Public Website"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xs transition cursor-pointer border border-rose-800/80"
              title="Log out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Bar */}
        <div className="md:hidden bg-emerald-950 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none border-t border-emerald-800/50">
          {adminNavItems.map((item) => {
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-xs text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                  isActive ? 'bg-white text-emerald-900' : 'text-emerald-200 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Page View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
