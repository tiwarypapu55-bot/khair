import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Stethoscope, Calendar, CheckCircle2, ChevronRight, Bed } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { departments, setIsAppointmentModalOpen, setSelectedDoctorForBooking, doctors } = useHospital();
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || '');

  const currentDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptDoctors = doctors.filter(d => d.department === currentDept?.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Clinical Specialties
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Specialized Departments & Clinical Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive multi-specialty clinical care backed by experienced senior surgeons, critical care specialists, and advanced diagnostic infrastructure.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">
            Select Department
          </h3>
          <div className="space-y-2">
            {departments.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full text-left p-4 rounded-2xl transition flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md font-bold'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-emerald-700'
                    }`}>
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{dept.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-80" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Department Detailed Showcase */}
        {currentDept && (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Banner Image & Head info */}
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72">
              <img
                src={currentDept.image}
                alt={currentDept.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Clinical Department</span>
                  <h2 className="text-2xl font-extrabold">{currentDept.name}</h2>
                  <p className="text-xs text-slate-200">Head of Dept: <strong>{currentDept.headOfDepartment}</strong></p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <Bed className="w-4 h-4 text-emerald-400" />
                  Capacity: {currentDept.bedCapacity} Beds
                </div>
              </div>
            </div>

            {/* Overview & Treatments */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-l-3 border-emerald-600 pl-3">
                Department Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentDept.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 border-l-3 border-emerald-600 pl-3">
                Common Procedures & Treatments Offered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentDept.commonTreatments.map((treatment, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 text-slate-800 border border-slate-200 p-3 rounded-2xl text-xs font-semibold shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{treatment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Specialist Doctors */}
            {deptDoctors.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 border-l-3 border-amber-600 pl-3">
                  Department Consultants ({deptDoctors.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deptDoctors.map((doc) => (
                    <div key={doc.id} className="bg-white border border-slate-200 text-slate-900 p-4 rounded-3xl flex items-center gap-3 shadow-xs">
                      <img src={doc.image} alt={doc.name} className="w-14 h-16 rounded-xl object-cover object-top shrink-0 border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm truncate text-slate-900">{doc.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{doc.specialization}</p>
                        <button
                          onClick={() => {
                            setSelectedDoctorForBooking(doc);
                            setIsAppointmentModalOpen(true);
                          }}
                          className="mt-1.5 text-[11px] font-bold bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1 rounded-lg transition"
                        >
                          Book OPD Slot →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="text-xs">
                <span>Intercom Ext: <strong>{currentDept.phoneExt}</strong></span> • 
                <span> Helpline: <strong>+91 9628897004</strong></span>
              </div>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Book Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
