import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { CheckCircle2, Clock, Sparkles, Check, FileText, Phone } from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { facilities, setIsAppointmentModalOpen } = useHospital();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Surgical & OT', 'Patient Support', 'Government Schemes', 'Digital Services', 'Community Health', 'Patient Comfort'];

  const filteredFacilities = filterCategory === 'All'
    ? facilities
    : facilities.filter(f => f.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* 1. Header & Layout Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
          <span>Facilities & Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
          Facilities & Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
          Khair Hospital offers a complete range of healthcare facilities under one roof, designed for comfort, convenience, and advanced care delivery.
        </p>
      </div>

      {/* 2. Overview Blocks */}
      <div className="space-y-6">
        {/* Top Two Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-xs space-y-3">
            <ul className="space-y-3 text-sm font-medium text-slate-800">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Modern Operation Theatres</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Wheelchair Access & Patient Support</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-xs space-y-3">
            <ul className="space-y-3 text-sm font-medium text-slate-800">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Ayushman Bharat Yojana</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Online Appointments</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Health Check-Up Camps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                <span>Clean & Comfortable Waiting Zones</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Two Highlight Cards: Supportive Services & Why Choose Khair Hospital */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supportive Services */}
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-lg">Supportive Services</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Online Appointment & Health Packages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Health check-up camps & outreach programs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wheelchair access & patient assistance</span>
              </li>
            </ul>
          </div>

          {/* Why Choose Khair Hospital */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white">
              <span className="text-xl">🏥</span>
              <h3 className="font-bold text-lg text-white">Why Choose Khair Hospital</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <span className="bg-emerald-500 text-slate-950 rounded-md px-1.5 py-0.5 text-xs font-bold">✓</span>
                <span>Experienced & qualified specialists</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="bg-emerald-500 text-slate-950 rounded-md px-1.5 py-0.5 text-xs font-bold">✓</span>
                <span>Advanced diagnostic and surgical technology</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="bg-emerald-500 text-slate-950 rounded-md px-1.5 py-0.5 text-xs font-bold">✓</span>
                <span>Patient-centric approach with transparency</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="bg-emerald-500 text-slate-950 rounded-md px-1.5 py-0.5 text-xs font-bold">✓</span>
                <span>Affordable treatment packages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="bg-emerald-500 text-slate-950 rounded-md px-1.5 py-0.5 text-xs font-bold">✓</span>
                <span>Hygienic, peaceful, and caring environment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Detailed Facilities Photo Gallery & Specs */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Detailed Facility Breakdown
            </h2>
            <p className="text-xs text-slate-500">Explore equipment images and operational highlights</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  filterCategory === cat
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Facility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white border border-slate-200 text-slate-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {fac.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-amber-300" />
                    {fac.availability}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base leading-snug text-slate-900">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-500">Key Specifications:</span>
                    <div className="space-y-1.5">
                      {fac.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer"
                >
                  Inquire Facility / OPD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
