import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Appointment, CommunicationLog } from '../types';
import {
  Calendar, Clock, User, Phone, MessageSquare, Send, CheckCircle2,
  XCircle, Clock3, AlertCircle, Printer, Search, Filter, Plus, LogOut,
  Building2, Sparkles, MessageCircle, ChevronRight, Check, RefreshCw,
  Mail, Stethoscope, FileText, Share2, ShieldCheck, UserCheck, Smartphone
} from 'lucide-react';

export const EmployeePortal: React.FC = () => {
  const {
    loggedInEmployee,
    logoutEmployee,
    appointments,
    updateAppointmentStatus,
    updateAppointment,
    addCommunicationLog,
    addAppointment,
    doctors,
    departments,
    setIsEmployeePortalOpen,
    businessSettings
  } = useHospital();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');

  // Selected appointment for messaging modal or print modal
  const [selectedAppointmentForComm, setSelectedAppointmentForComm] = useState<Appointment | null>(null);
  const [selectedAppointmentForPrint, setSelectedAppointmentForPrint] = useState<Appointment | null>(null);
  const [isAddWalkInOpen, setIsAddWalkInOpen] = useState(false);

  // Communication Form State
  const [commChannel, setCommChannel] = useState<'WhatsApp' | 'SMS' | 'Call' | 'Note'>('WhatsApp');
  const [templateType, setTemplateType] = useState<'confirmation' | 'reminder' | 'delay' | 'custom'>('confirmation');
  const [customMsg, setCustomMsg] = useState('');
  const [sendingNotice, setSendingNotice] = useState<string | null>(null);

  // Walk-in OPD Appointment Form State
  const [walkInPatientName, setWalkInPatientName] = useState('');
  const [walkInAge, setWalkInAge] = useState<number>(30);
  const [walkInGender, setWalkInGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInDept, setWalkInDept] = useState(departments[0]?.name || 'Ophthalmology');
  const [walkInDoctor, setWalkInDoctor] = useState(doctors[0]?.name || 'Dr Farha Deeba');
  const [walkInDoctorId, setWalkInDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [walkInSlot, setWalkInSlot] = useState('10:00 AM - 11:00 AM');
  const [walkInSymptoms, setWalkInSymptoms] = useState('OPD Consultation / Routine Checkup');

  if (!loggedInEmployee) return null;

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || app.department === departmentFilter;
    const matchesDoctor = doctorFilter === 'All' || app.doctorName === doctorFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesDoctor;
  });

  // KPI counters
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;

  // Generate pre-formatted message based on template
  const getFormattedMessage = (app: Appointment) => {
    if (templateType === 'confirmation') {
      return `Dear ${app.patientName}, your OPD Token #${app.appointmentNumber} for ${app.doctorName} (${app.department}) at ${businessSettings.hospitalName} on ${app.date} (${app.timeSlot}) is CONFIRMED. Please arrive 15 mins before your time and present token at the counter. - Khair Hospital Basti`;
    }
    if (templateType === 'reminder') {
      return `Dear ${app.patientName}, this is a gentle reminder from ${businessSettings.hospitalName} for your appointment today with ${app.doctorName} (${app.department}), Token #${app.appointmentNumber} at ${app.timeSlot}. - Khair Hospital`;
    }
    if (templateType === 'delay') {
      return `Dear ${app.patientName}, ${app.doctorName} is currently attending an emergency in the Operation Theatre. Your consultation for Token #${app.appointmentNumber} will commence shortly. Thank you for your patience. - ${businessSettings.hospitalName}`;
    }
    return customMsg;
  };

  // Trigger WhatsApp communication
  const handleSendWhatsApp = (app: Appointment) => {
    const message = getFormattedMessage(app);
    // Sanitize phone number (strip spaces, ensure +91 or country code)
    let cleanPhone = app.phone.replace(/[^\d]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    // Log communication
    addCommunicationLog(app.id, 'WhatsApp', message);

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSendingNotice(`WhatsApp message opened for ${app.patientName}`);
    setTimeout(() => setSendingNotice(null), 3000);
  };

  // Log custom note or SMS
  const handleLogManualComm = (app: Appointment) => {
    const msg = templateType === 'custom' ? customMsg : getFormattedMessage(app);
    if (!msg.trim()) return;

    addCommunicationLog(app.id, commChannel, msg);
    setSendingNotice(`Logged ${commChannel} record for ${app.patientName}`);
    setCustomMsg('');
    setTimeout(() => setSendingNotice(null), 3000);
  };

  // Add Walk-in Appointment Submit
  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    const newApp = addAppointment({
      patientName: walkInPatientName,
      age: Number(walkInAge),
      gender: walkInGender,
      phone: walkInPhone,
      email: walkInEmail || `${walkInPatientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      department: walkInDept,
      doctorId: walkInDoctorId,
      doctorName: walkInDoctor,
      date: todayStr,
      timeSlot: walkInSlot,
      symptoms: walkInSymptoms
    });

    setIsAddWalkInOpen(false);
    setSelectedAppointmentForPrint(newApp);
    // Reset form
    setWalkInPatientName('');
    setWalkInPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* 1. Employee Header Banner */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 border-2 border-emerald-500 flex items-center justify-center text-white font-serif font-extrabold text-2xl shadow-inner shrink-0">
              {loggedInEmployee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Staff Member Active
                </span>
                <span className="text-emerald-300 text-xs font-semibold">
                  {loggedInEmployee.employeeId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {loggedInEmployee.name}
              </h1>
              <p className="text-xs text-emerald-200 font-sans">
                {loggedInEmployee.designation} • <span className="text-white font-semibold">{loggedInEmployee.department}</span> ({loggedInEmployee.shift} Shift)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddWalkInOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Walk-in OPD Patient
            </button>
            <button
              onClick={() => setIsEmployeePortalOpen(false)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer border border-emerald-700/60 flex items-center gap-1.5"
            >
              <span>Minimize Workspace</span>
            </button>
            <button
              onClick={logoutEmployee}
              className="bg-rose-900/80 hover:bg-rose-800 text-rose-100 text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer border border-rose-700/50 flex items-center gap-1.5"
              title="Logout from Employee Account"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Toast Notice */}
        {sendingNotice && (
          <div className="p-3 bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{sendingNotice}</span>
            </div>
            <button onClick={() => setSendingNotice(null)} className="text-emerald-200 hover:text-white">✕</button>
          </div>
        )}

        {/* 2. Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Appointments</p>
            <p className="text-2xl font-serif font-extrabold text-slate-900">{totalCount}</p>
            <p className="text-[11px] text-slate-500">In hospital database</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmed Slots</p>
            <p className="text-2xl font-serif font-extrabold text-emerald-700">{confirmedCount}</p>
            <p className="text-[11px] text-slate-500">Tokens issued & active</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Completed OPD</p>
            <p className="text-2xl font-serif font-extrabold text-blue-700">{completedCount}</p>
            <p className="text-[11px] text-slate-500">Consultation done</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-serif font-extrabold text-amber-700">{pendingCount}</p>
            <p className="text-[11px] text-slate-500">Awaiting confirmation</p>
          </div>
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Patient Name, Phone (+91...) or Token Number (KH-...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Doctor Filter */}
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* 4. Appointments Table / Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              OPD Appointments Queue ({filteredAppointments.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Real-time synchronization active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Doctor & Dept</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Patient Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                        {app.appointmentNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">{app.patientName}</p>
                        <p className="text-[11px] text-slate-500">
                          {app.age} Y, {app.gender} • <a href={`tel:${app.phone}`} className="text-slate-700 hover:text-emerald-800 font-semibold">{app.phone}</a>
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{app.doctorName}</p>
                        <p className="text-[11px] text-slate-500">{app.department}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{app.date}</p>
                        <p className="text-[11px] text-emerald-800 font-medium">{app.timeSlot}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            app.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : app.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Communication Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSendWhatsApp(app)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-bold px-2.5"
                            title="Send WhatsApp Confirmation / Reminder"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedAppointmentForComm(app);
                              setCommChannel('WhatsApp');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-1.5 rounded-lg transition cursor-pointer text-[11px] font-semibold border border-slate-200"
                            title="Open Message Customizer & Log"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>

                        {app.communicationLogs && app.communicationLogs.length > 0 && (
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">
                            {app.communicationLogs.length} msg(s) sent
                          </p>
                        )}
                      </td>

                      {/* Status & Print Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={app.status}
                            onChange={(e) => updateAppointmentStatus(app.id, e.target.value as Appointment['status'])}
                            className="bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 py-1 px-2 rounded-lg focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => setSelectedAppointmentForPrint(app)}
                            className="bg-slate-800 hover:bg-slate-900 text-white p-1.5 rounded-lg transition cursor-pointer text-[11px] font-bold flex items-center gap-1 px-2"
                            title="Print Token Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Token</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Patient Communication Modal / Drawer */}
      {selectedAppointmentForComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Patient Communication Hub
                </span>
                <h3 className="font-bold text-lg text-white">
                  Message {selectedAppointmentForComm.patientName}
                </h3>
                <p className="text-xs text-emerald-100">
                  Token #{selectedAppointmentForComm.appointmentNumber} • {selectedAppointmentForComm.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointmentForComm(null)}
                className="text-emerald-200 hover:text-white bg-emerald-950 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Channel Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Communication Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCommChannel('WhatsApp')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      commChannel === 'WhatsApp'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommChannel('SMS')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      commChannel === 'SMS'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-300" />
                    SMS Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommChannel('Note')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      commChannel === 'Note'
                        ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    Staff Note
                  </button>
                </div>
              </div>

              {/* Template Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick Message Templates
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTemplateType('confirmation')}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                      templateType === 'confirmation' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    ✅ Token Confirmation
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateType('reminder')}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                      templateType === 'reminder' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    ⏰ Appointment Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateType('delay')}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                      templateType === 'delay' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    🏥 Doctor Emergency / OT Delay
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateType('custom')}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                      templateType === 'custom' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    ✏️ Custom Message
                  </button>
                </div>
              </div>

              {/* Preview Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Message Content Preview
                </label>
                {templateType === 'custom' ? (
                  <textarea
                    rows={4}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type custom patient message or staff note..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                    {getFormattedMessage(selectedAppointmentForComm)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {commChannel === 'WhatsApp' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSendWhatsApp(selectedAppointmentForComm);
                      setSelectedAppointmentForComm(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    Open & Send via WhatsApp
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleLogManualComm(selectedAppointmentForComm);
                    setSelectedAppointmentForComm(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-3 rounded-xl text-xs cursor-pointer"
                >
                  Save to Patient Log
                </button>
              </div>

              {/* Communication History */}
              {selectedAppointmentForComm.communicationLogs && selectedAppointmentForComm.communicationLogs.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Recent Communication History
                  </h5>
                  <div className="max-h-36 overflow-y-auto space-y-2">
                    {selectedAppointmentForComm.communicationLogs.map((log) => (
                      <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-700">
                          <span className="text-emerald-800 font-bold">{log.channel} • {log.sentByEmployeeName}</span>
                          <span className="text-slate-400 text-[10px]">{log.sentAt}</span>
                        </div>
                        <p className="text-slate-600 font-sans">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Print Token Modal */}
      {selectedAppointmentForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1 border-b border-slate-200 pb-4">
              <h3 className="font-serif font-extrabold text-xl text-slate-900">
                {businessSettings.hospitalName}
              </h3>
              <p className="text-xs text-slate-600 font-medium">OPD Consultation Token Slip</p>
              <p className="text-[10px] text-slate-400">{businessSettings.address}, {businessSettings.city}</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">Token Number</span>
              <span className="text-2xl font-mono font-extrabold text-emerald-900">{selectedAppointmentForPrint.appointmentNumber}</span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Patient Name:</span>
                <span className="font-bold text-slate-900">{selectedAppointmentForPrint.patientName} ({selectedAppointmentForPrint.age} Y, {selectedAppointmentForPrint.gender})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Doctor:</span>
                <span className="font-bold text-slate-900">{selectedAppointmentForPrint.doctorName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-bold text-slate-900">{selectedAppointmentForPrint.department}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-bold text-emerald-800">{selectedAppointmentForPrint.date} ({selectedAppointmentForPrint.timeSlot})</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-[11px] text-slate-700">
              <p className="font-bold text-blue-700">Important Instructions:</p>
              <ul className="list-disc list-inside space-y-1 leading-relaxed">
                <li>Reach 15 minutes before booking time</li>
                <li>Make payment at hospital counter</li>
                <li>If you arrive late, consultation follows queue serial no</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                Print Token Slip
              </button>
              <button
                onClick={() => setSelectedAppointmentForPrint(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Walk-in OPD Appointment Modal */}
      {isAddWalkInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Staff OPD Desk
                </span>
                <h3 className="font-bold text-lg text-white">Add Walk-in Patient Appointment</h3>
              </div>
              <button
                onClick={() => setIsAddWalkInOpen(false)}
                className="text-emerald-200 hover:text-white bg-emerald-950 p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={walkInPatientName}
                    onChange={(e) => setWalkInPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98390 XXXXX"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    value={walkInAge}
                    onChange={(e) => setWalkInAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Gender *</label>
                  <select
                    value={walkInGender}
                    onChange={(e) => setWalkInGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select
                    value={walkInDept}
                    onChange={(e) => setWalkInDept(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Consulting Doctor</label>
                  <select
                    value={walkInDoctor}
                    onChange={(e) => {
                      setWalkInDoctor(e.target.value);
                      const d = doctors.find(doc => doc.name === e.target.value);
                      if (d) setWalkInDoctorId(d.id);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Chief Complaints / Symptoms</label>
                <input
                  type="text"
                  value={walkInSymptoms}
                  onChange={(e) => setWalkInSymptoms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddWalkInOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Generate Token & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
