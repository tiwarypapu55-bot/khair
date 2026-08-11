import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Stethoscope, Users, Image as ImageIcon, FileText, Calendar,
  MessageSquare, Clock, CheckCircle2, ArrowRight, Activity, Plus
} from 'lucide-react';

export const AdminHome: React.FC = () => {
  const {
    doctors, employees, gallery, notices, events, feedbacks, appointments,
    setAdminTab
  } = useHospital();

  const pendingFeedbacks = feedbacks.filter(f => f.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Banner */}
      <div className="bg-emerald-900 text-white rounded-xs p-6 sm:p-8 border border-emerald-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">
            Khair Hospital Executive Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Hospital Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Oversee medical staff rosters, clinical notices, photo gallery assets, community health outreach, and patient feedback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAdminTab('doctor-list')}
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
          <button
            onClick={() => setAdminTab('notice')}
            className="bg-emerald-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs transition cursor-pointer border border-emerald-700 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Post Notice
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Doctors Metric */}
        <div
          onClick={() => setAdminTab('doctor-list')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{doctors.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Doctors</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Active Faculty</p>
        </div>

        {/* Employee Metric */}
        <div
          onClick={() => setAdminTab('employee')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{employees.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Staff Roster</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Nurses & Techs</p>
        </div>

        {/* Gallery Metric */}
        <div
          onClick={() => setAdminTab('gallery')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{gallery.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Gallery</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Campus Visuals</p>
        </div>

        {/* Notice Metric */}
        <div
          onClick={() => setAdminTab('notice')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{notices.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Notices</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Bulletins</p>
        </div>

        {/* Events Metric */}
        <div
          onClick={() => setAdminTab('events')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{events.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Events</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Camps & Drives</p>
        </div>

        {/* Feedback Metric */}
        <div
          onClick={() => setAdminTab('feedback')}
          className="editorial-card p-5 rounded-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">{feedbacks.length}</span>
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mt-3">Feedback</h3>
          <p className="text-[10px] text-emerald-800 font-bold mt-0.5">
            {pendingFeedbacks.length} Pending
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent OPD Appointments */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent OPD Appointments</h3>
              <p className="text-xs text-slate-500">Live patient token queue logged today</p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
              Total: {appointments.length}
            </span>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No appointments booked yet.</p>
            ) : (
              appointments.slice(0, 5).map((app) => (
                <div key={app.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{app.appointmentNumber}</span>
                      <span className="font-semibold text-slate-900">{app.patientName}</span>
                      <span className="text-slate-500">({app.gender}, {app.age} Y)</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Doctor: <strong className="text-slate-800">{app.doctorName}</strong> ({app.department})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[11px] block">
                      {app.date}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{app.timeSlot}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patient Feedbacks Inbox */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Patient Feedback</h3>
              <p className="text-xs text-slate-500">Inquiries submitted via contact form</p>
            </div>
            <button
              onClick={() => setAdminTab('feedback')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Inbox →
            </button>
          </div>

          <div className="space-y-3">
            {feedbacks.slice(0, 4).map((fb) => (
              <div key={fb.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fb.patientName}</span>
                  <span className="text-amber-500 font-bold">{"★".repeat(fb.rating)}</span>
                </div>
                <p className="text-slate-700 line-clamp-2 leading-relaxed">"{fb.message}"</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                  <span>{fb.department}</span>
                  <span className={`font-semibold ${fb.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {fb.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
