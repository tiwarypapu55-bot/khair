import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, FileText, Printer, Stethoscope } from 'lucide-react';
import { Appointment } from '../types';

export const AppointmentModal: React.FC = () => {
  const {
    isAppointmentModalOpen, setIsAppointmentModalOpen,
    selectedDoctorForBooking, setSelectedDoctorForBooking,
    doctors, departments, addAppointment
  } = useHospital();

  const [department, setDepartment] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (selectedDoctorForBooking) {
      setDepartment(selectedDoctorForBooking.department);
      setDoctorId(selectedDoctorForBooking.id);
    } else if (departments.length > 0 && !department) {
      setDepartment(departments[0].name);
    }
  }, [selectedDoctorForBooking, departments]);

  const availableDoctors = doctors.filter(d => !department || d.department === department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !doctorId) return;

    const chosenDoc = doctors.find(d => d.id === doctorId);
    const newApp = addAppointment({
      patientName,
      age: Number(age),
      gender,
      phone,
      email: email || 'patient@khairhospital.in',
      department: chosenDoc ? chosenDoc.department : department,
      doctorId,
      doctorName: chosenDoc ? chosenDoc.name : 'Consultant Doctor',
      date,
      timeSlot,
      symptoms: symptoms || 'Routine OPD Consultation'
    });

    setBookedAppointment(newApp);
  };

  const handleClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedDoctorForBooking(null);
    setBookedAppointment(null);
  };

  if (!isAppointmentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Calendar className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Book OPD Appointment</h3>
              <p className="text-xs text-blue-200">Khair Hospital • Immediate Confirmation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {bookedAppointment ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">OPD Appointment Confirmed!</h4>
              <p className="text-sm text-slate-600 mt-1">Please show this token at the OPD reception on your appointment date.</p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-left space-y-3 font-mono text-xs sm:text-sm">
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-slate-500 font-sans">Token Number:</span>
                <span className="font-bold text-blue-700 text-base">{bookedAppointment.appointmentNumber}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-slate-500 font-sans">Patient:</span>
                <span className="font-semibold text-slate-800">{bookedAppointment.patientName} ({bookedAppointment.age} Y, {bookedAppointment.gender})</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-slate-500 font-sans">Doctor:</span>
                <span className="font-semibold text-slate-800">{bookedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-slate-500 font-sans">Department:</span>
                <span className="font-semibold text-slate-800">{bookedAppointment.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Date & Time Slot:</span>
                <span className="font-semibold text-emerald-700">{bookedAppointment.date} ({bookedAppointment.timeSlot})</span>
              </div>
            </div>

            {/* Important Notes as per Screenshot 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
              <h5 className="font-bold text-blue-600 text-sm sm:text-base">Important Notes</h5>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                <li>Reach 15 minutes before booking time</li>
                <li>Make payment at hospital counter</li>
                <li>If you arrive late, you will be consulted according to serial no of patients queue</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Token
              </button>
              <button
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Department & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    const docsInDept = doctors.filter(d => d.department === e.target.value);
                    if (docsInDept.length > 0) setDoctorId(docsInDept[0].id);
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                  required
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Select Doctor *
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                  required
                >
                  <option value="">-- Choose Specialist --</option>
                  {availableDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Age & Gender *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={1}
                    max={110}
                    className="w-16 text-xs sm:text-sm border border-slate-300 rounded-xl px-2 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    required
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-2 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                  >
                    <option value="Male">M</option>
                    <option value="Female">F</option>
                    <option value="Other">O</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98390 XXXXX"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Preferred Appointment Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                >
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Brief Description of Issue / Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Abdominal pain, fever, joint swelling..."
                rows={2}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Confirm & Generate OPD Token
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
