import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Stethoscope, Search, Calendar, Clock, Phone } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const { doctors, departments, setIsAppointmentModalOpen, setSelectedDoctorForBooking } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || doc.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Medical Faculty & Specialists
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Our Senior Consultants & Surgeons
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Consult with experienced medical practitioners across laparoscopic surgery, gynecology, cardiology, orthopedics, pediatrics, and critical care.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor by name, qualification, or treatment..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
          />
        </div>

        {/* Department Select Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden font-medium text-slate-700"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 text-slate-900 shadow-xs hover:shadow-md transition-all overflow-hidden p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl object-cover object-top border border-slate-200 shadow-xs shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {doc.roomNo}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {doc.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-tight truncate text-slate-900">{doc.name}</h3>
                    <p className="text-xs font-semibold mt-0.5 leading-snug text-emerald-800">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{doc.qualification}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {doc.bio}
                </p>

                {/* Details Pills */}
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>OPD: <strong>{doc.opdSchedule}</strong></span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Mobile: <a href={`tel:${doc.phone}`} className="font-bold hover:underline text-slate-900">{doc.phone}</a></span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Experience: <strong className="text-slate-900">{doc.experience}</strong></span>
                    <span>OPD Fee: <strong className="font-bold text-sm text-slate-900">₹{doc.fee}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-5 mt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedDoctorForBooking(doc);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4" /> Book OPD Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
