import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Lock, User, Eye, EyeOff, KeyRound, ShieldCheck, X, Sparkles, Building2, BadgeAlert } from 'lucide-react';

export const EmployeeLoginModal: React.FC = () => {
  const {
    isEmployeeModalOpen,
    setIsEmployeeModalOpen,
    loginEmployee,
    employees,
    businessSettings
  } = useHospital();

  const [identifier, setIdentifier] = useState('KH-EMP-001');
  const [password, setPassword] = useState('khair123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isEmployeeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginEmployee(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const fillDemoAccount = (empId: string) => {
    setIdentifier(empId);
    setPassword('khair123');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Building2 className="w-36 h-36 text-white" />
          </div>

          <button
            onClick={() => setIsEmployeeModalOpen(false)}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white bg-emerald-950/60 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-800/80 rounded-xl border border-emerald-700/60 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Staff Portal Access
            </span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
            Employee Login
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Access OPD appointments queue, patient tokens & communication tools
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Identifier Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Employee ID / Email / Phone
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. KH-EMP-001 or frontdesk@khairhospital.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Login to Employee Portal
              </>
            )}
          </button>

          {/* Demo Employees Quick Selector */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Demo Staff Login Shortcuts:</span>
              <span className="text-emerald-800 font-semibold">(Default password: khair123)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {employees.slice(0, 4).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => fillDemoAccount(emp.employeeId)}
                  className="text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 p-2 rounded-lg transition cursor-pointer text-xs"
                >
                  <p className="font-bold text-slate-800 truncate">{emp.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{emp.employeeId} • {emp.designation.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
          For password resets or staff onboarding, contact {businessSettings.hospitalName} IT Desk.
        </div>
      </div>
    </div>
  );
};
