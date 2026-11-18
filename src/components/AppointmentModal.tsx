import React, { useState, useEffect, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { X, Calendar, Clock, CheckCircle2, Printer, Stethoscope, AlertCircle, MapPin, IndianRupee } from 'lucide-react';
import { Appointment } from '../types';
import {
  getBookingDateBounds,
  isDateWithinAllowedWindow,
  generateSlotsFromSchedule,
  getAllowedBookingDateOptions,
  isDoctorAvailableOnDate,
  TimeSlotOption,
} from '../utils/scheduleSlots';

const BOOKING_GUIDELINES = [
  '1. Reach Before 15 min Before booking time',
  '2. Make payment at hospital Counter',
  '3. If you will arrive Late you will be consulted according to Serial no of Patients Queue.',
];

export const AppointmentModal: React.FC = () => {
  const {
    isAppointmentModalOpen, setIsAppointmentModalOpen,
    selectedDoctorForBooking, setSelectedDoctorForBooking,
    doctors, departments, addAppointment
  } = useHospital();

  const { minDate, maxDate } = useMemo(() => getBookingDateBounds(), [isAppointmentModalOpen]);

  const [department, setDepartment] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<string>(() => getBookingDateBounds().minDate);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const availableDoctors = useMemo(
    () => doctors.filter(d => !department || d.department === department),
    [doctors, department]
  );

  const chosenDoc = useMemo(
    () => doctors.find(d => d.id === doctorId) || null,
    [doctors, doctorId]
  );

  // Sync initial department & doctor when modal opens or selectedDoctorForBooking changes
  useEffect(() => {
    if (!isAppointmentModalOpen) return;
    setFormError('');

    if (selectedDoctorForBooking) {
      setDepartment(selectedDoctorForBooking.department);
      setDoctorId(selectedDoctorForBooking.id);
    } else {
      const defaultDept = department || (departments[0]?.name ?? '');
      if (defaultDept && !department) {
        setDepartment(defaultDept);
      }
      const docsInDept = doctors.filter(d => !defaultDept || d.department === defaultDept);
      if (docsInDept.length > 0 && (!doctorId || !docsInDept.some(d => d.id === doctorId))) {
        setDoctorId(docsInDept[0].id);
      }
    }
  }, [isAppointmentModalOpen, selectedDoctorForBooking, departments, doctors]);

  const dateOptions = useMemo(() => {
    const schedule = chosenDoc?.opdSchedule || 'Mon - Sat: 10:00 AM - 02:00 PM';
    return getAllowedBookingDateOptions(schedule);
  }, [chosenDoc]);

  // Ensure selected date stays within the 2-day booking window and prefers a date with available OPD slots
  useEffect(() => {
    if (!isAppointmentModalOpen) return;

    const currentValid = isDateWithinAllowedWindow(date);
    const currentOpt = dateOptions.find(opt => opt.dateStr === date);

    if (!currentValid || (chosenDoc && currentOpt && !currentOpt.isDoctorAvailable)) {
      const firstAvailable = dateOptions.find(opt => opt.isDoctorAvailable);
      if (firstAvailable) {
        setDate(firstAvailable.dateStr);
      } else if (!currentValid) {
        setDate(minDate);
      }
    }
  }, [isAppointmentModalOpen, chosenDoc, dateOptions, minDate]);

  const availableSlots = useMemo(() => {
    if (!chosenDoc || !date || !isDateWithinAllowedWindow(date)) return [];
    if (chosenDoc.status === 'On Leave') return [];
    return generateSlotsFromSchedule(chosenDoc.opdSchedule, date);
  }, [chosenDoc, date]);

  // Keep timeSlot synchronized with the selected doctor's OPD schedule for the chosen date
  useEffect(() => {
    if (availableSlots.length === 0) {
      setTimeSlot('');
      return;
    }
    const stillExists = availableSlots.some(s => s.value === timeSlot);
    if (!stillExists) {
      setTimeSlot(availableSlots[0].value);
    }
  }, [availableSlots]);

  const handleDateChange = (newDate: string) => {
    setFormError('');
    if (!newDate) {
      setDate(minDate);
      return;
    }
    if (!isDateWithinAllowedWindow(newDate)) {
      setFormError(`Appointments are allowed for the next 2 days only (${minDate} to ${maxDate}).`);
      const clamped = newDate < minDate ? minDate : maxDate;
      setDate(clamped);
      return;
    }
    setDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!patientName.trim() || !phone.trim() || !doctorId) {
      setFormError('Please fill in all required patient and doctor details.');
      return;
    }

    if (!chosenDoc) {
      setFormError('Please select a valid specialist doctor.');
      return;
    }

    if (chosenDoc.status === 'On Leave') {
      setFormError(`${chosenDoc.name} is currently On Leave. Please select another doctor.`);
      return;
    }

    if (!isDateWithinAllowedWindow(date)) {
      setFormError(`Appointments are allowed for the next 2 days only (${minDate} to ${maxDate}).`);
      return;
    }

    if (!isDoctorAvailableOnDate(chosenDoc.opdSchedule, date)) {
      setFormError(`${chosenDoc.name} has no OPD schedule on the selected date. Please choose an available date.`);
      return;
    }

    if (!timeSlot || !availableSlots.some(s => s.value === timeSlot)) {
      setFormError('Please select an available OPD time slot according to the doctor’s appointment schedule.');
      return;
    }

    const newApp = addAppointment({
      patientName: patientName.trim(),
      age: Number(age),
      gender,
      phone: phone.trim(),
      email: email.trim() || 'patient@khairhospital.in',
      department: chosenDoc.department,
      doctorId,
      doctorName: chosenDoc.name,
      date,
      timeSlot,
      symptoms: symptoms.trim() || 'Routine OPD Consultation'
    });

    setBookedAppointment(newApp);
  };

  const handleClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedDoctorForBooking(null);
    setBookedAppointment(null);
    setPatientName('');
    setPhone('');
    setEmail('');
    setSymptoms('');
    setFormError('');
  };

  if (!isAppointmentModalOpen) return null;

  const groupedSlots = availableSlots.reduce<Record<string, TimeSlotOption[]>>((acc, slot) => {
    if (!acc[slot.sessionLabel]) acc[slot.sessionLabel] = [];
    acc[slot.sessionLabel].push(slot);
    return acc;
  }, {});

  const isSelectedDateWithinWindow = isDateWithinAllowedWindow(date);
  const isDoctorOffOnSelectedDate = chosenDoc ? !isDoctorAvailableOnDate(chosenDoc.opdSchedule, date) : false;

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
              <p className="text-xs text-blue-200">Khair Hospital • Next 2 Days Booking Window</p>
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

            {/* Appointment Booking Guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2">
              <h5 className="font-bold text-amber-900 text-sm sm:text-base">Appointment Booking Guidelines</h5>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {BOOKING_GUIDELINES.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Appointment Booking Guidelines Notice directly at place of booking */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Appointment Booking Guidelines</span>
              </div>
              <div className="space-y-1 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                {BOOKING_GUIDELINES.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Department & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    const nextDept = e.target.value;
                    setDepartment(nextDept);
                    setFormError('');
                    const docsInDept = doctors.filter(d => d.department === nextDept);
                    if (docsInDept.length > 0) {
                      setDoctorId(docsInDept[0].id);
                    } else {
                      setDoctorId('');
                    }
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
                  onChange={(e) => {
                    setDoctorId(e.target.value);
                    setFormError('');
                  }}
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

            {/* Selected Doctor Appointment Schedule Card */}
            {chosenDoc && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>Appointment Schedule — {chosenDoc.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      chosenDoc.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : chosenDoc.status === 'On Leave'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {chosenDoc.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{chosenDoc.opdSchedule}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {chosenDoc.roomNo}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <IndianRupee className="w-3 h-3 text-slate-500" />
                    OPD Fee: ₹{chosenDoc.fee} (Pay at Counter)
                  </span>
                </div>
                {chosenDoc.status === 'On Leave' && (
                  <p className="text-rose-700 font-semibold pt-1">
                    Doctor is currently On Leave and unavailable for OPD booking.
                  </p>
                )}
              </div>
            )}

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
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
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

            {/* Appointment Date (Strict 2-day Window) */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Appointment Date *
                </label>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  Allowed Window: Next 2 Days Only
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {dateOptions.map((opt) => {
                  const isSelected = date === opt.dateStr;
                  const disabled = !opt.isDoctorAvailable || chosenDoc?.status === 'On Leave';
                  return (
                    <button
                      key={opt.dateStr}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDateChange(opt.dateStr)}
                      className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                        disabled
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/40'
                      }`}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wide">
                        {opt.label}
                      </div>
                      <div className={`text-xs font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                        {opt.dayName}, {opt.displayDate}
                      </div>
                      {disabled && (
                        <div className="text-[10px] text-rose-500 font-medium mt-0.5">
                          No OPD Slots
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                required
              />
            </div>

            {/* Time Slot Strictly from Appointment Schedule */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Schedule Time Slot *
                </label>
                {chosenDoc && (
                  <span className="text-[11px] text-slate-500">
                    Based on doctor&apos;s OPD schedule
                  </span>
                )}
              </div>

              {chosenDoc?.status === 'On Leave' ? (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  Doctor is currently On Leave. No OPD time slots are available.
                </div>
              ) : !isSelectedDateWithinWindow ? (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  Please choose a date within today and the next 2 days.
                </div>
              ) : isDoctorOffOnSelectedDate ? (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  No OPD scheduled for {chosenDoc?.name} on this day ({chosenDoc?.opdSchedule}). Please pick another allowed date.
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  All OPD slots for today have concluded. Please select Tomorrow or Day After.
                </div>
              ) : (
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white font-medium"
                  required
                >
                  {Object.keys(groupedSlots).map((sessionLabel) => (
                    <optgroup key={sessionLabel} label={sessionLabel}>
                      {groupedSlots[sessionLabel].map(slot => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
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
                disabled={availableSlots.length === 0 || chosenDoc?.status === 'On Leave'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
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
