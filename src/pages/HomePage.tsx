import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { HeroSlider } from '../components/HeroSlider';
import drMushtaqImg from '../assets/images/dr_mushtaq_khan_1786250783424.jpg';
import {
  Calendar, Stethoscope, HeartPulse, Award,
  Users, Activity, CheckCircle2, Clock, MapPin, Phone,
  Sparkles, Building2, Eye, FileText, Send, Mail, Globe,
  ShieldCheck, Scissors, HeartHandshake, Quote, Check, Info,
  AlertCircle, Lock, UserCheck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setCurrentTab, setIsAppointmentModalOpen, setIsAdminMode, setIsEmployeeModalOpen,
    doctors, addFeedback, setSelectedDoctorForBooking, businessSettings
  } = useHospital();

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.phone || !feedbackForm.message) return;

    addFeedback({
      patientName: feedbackForm.name,
      phone: feedbackForm.phone,
      email: feedbackForm.email || 'N/A',
      rating: 5,
      category: feedbackForm.subject || 'General Feedback',
      comment: feedbackForm.message
    });

    setFeedbackSubmitted(true);
    setFeedbackForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setFeedbackSubmitted(false), 6000);
  };

  return (
    <div className="space-y-12 pb-16 bg-slate-50 font-sans">
      {/* 1. Top Interactive Hero Banner Slider */}
      <HeroSlider />

      {/* 2. WE OFFER Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Patients First
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                WE OFFER ACCESSIBLE & AFFORDABLE HEALTHCARE
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              {/* Ayushman Bharat */}
              <div className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    Ayushman Bharat
                  </h3>
                  <p className="text-[11px] text-slate-300">Yojana Beneficiary</p>
                </div>
              </div>

              {/* Emergency Care */}
              <div className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    Emergency Care
                  </h3>
                  <p className="text-[11px] text-slate-300">24x7 Ambulance</p>
                </div>
              </div>

              {/* Online Appointment */}
              <div 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-white px-4 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    Online Booking
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-semibold">Book OPD Slot →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Your Vision, Our Mission (About Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block rounded-full">
                Welcome to Khair Hospital, Basti
              </span>
              
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Your Vision, Our Mission
              </h2>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                At Khair Hospital, Basti, we are dedicated to delivering compassionate healthcare supported by modern and advanced medical technology. Established with the goal of making world-class healthcare accessible to everyone, Khair Hospital is widely trusted for eye care and Multi-Speciality treatments across Eastern Uttar Pradesh.
              </p>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Our team of expert doctors and trained healthcare professionals ensures every patient receives personalized care in a safe, hygienic, and comfortable environment.
              </p>

              {/* Quote box */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl mt-4 shadow-xs">
                <p className="font-serif italic text-base sm:text-lg font-semibold">
                  “Your health and comfort are our utmost priority — we heal with heart and treat with technology.”
                </p>
              </div>
            </div>

            {/* Key Highlights Card */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Trusted Healthcare</span>
              </div>
              <h3 className="text-xl font-serif font-bold">Key Highlights</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>35+ Years Senior General Surgery Experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Super-Specialty Phaco & Laser Eye Surgery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Minimal Invasive Laparoscopic Surgery Unit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>24x7 Ambulance, Emergency & Pathology Lab</span>
                </li>
              </ul>
              
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setCurrentTab('about')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer"
                >
                  Read Full Hospital Profile →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Our Vision & Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Our Vision Card */}
          <div className="p-6 sm:p-8 rounded-3xl space-y-4 bg-white border border-slate-200 text-slate-900 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                👩‍⚕️
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest block text-emerald-800">
                  Future Horizon
                </span>
                <h3 className="text-xl font-serif font-bold">Our Vision</h3>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-700 pt-2">
              {businessSettings.visionText}
            </p>
          </div>

          {/* Our Mission Card */}
          <div className="p-6 sm:p-8 rounded-3xl space-y-4 bg-white border border-slate-200 text-slate-900 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                🩺
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest block text-blue-800">
                  Core Purpose
                </span>
                <h3 className="text-xl font-serif font-bold">Our Mission</h3>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              {businessSettings.missionPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Director's Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-200 pb-6">
              {/* Circular Director Photo with Purple Ring at Left Corner */}
              <div className="shrink-0 flex items-center gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white border-[5px] border-[#5a2196] shadow-md overflow-hidden shrink-0">
                  <img
                    src={businessSettings.directorPhotoUrl || drMushtaqImg}
                    alt={businessSettings.directorName || "Director"}
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-800">
                  <Quote className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest block">
                    Leadership Address
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  Director's Message
                </h2>
                <div className="pt-1">
                  <p className="font-bold text-base sm:text-lg text-slate-900">{businessSettings.directorName}</p>
                  <p className="text-xs sm:text-sm font-semibold text-[#5a2196]">{businessSettings.directorDesignation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line font-medium">
              {businessSettings.directorMessage}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-serif italic text-sm text-slate-600">Sincerely,</p>
                <p className="font-serif font-bold text-lg text-slate-900 mt-0.5">{businessSettings.directorName}</p>
                <p className="text-xs uppercase tracking-widest font-mono text-slate-500">{businessSettings.directorDesignation}</p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl">
                  Established for Public Welfare
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Specialized Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 inline-block mb-2 rounded-full">
            Our Departments
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Expert Specialty & Surgical Care
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Providing complete vision care and advanced surgical procedures in Basti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Department 1: Ophthalmology */}
          <div className="bg-white border border-slate-200 text-slate-900 p-6 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                👁 Department of Ophthalmology
              </h3>
              <p className="text-xs font-semibold bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-100">
                Providing complete vision care with advanced laser & surgical treatment facilities.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cataract (Phaco) & Refractive Surgery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Glaucoma Diagnosis & Treatment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Retina & Corneal Care</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Pediatric Ophthalmology & Squint Correction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Emergency Eye Trauma Care</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 italic text-xs font-serif text-slate-500">
              “Restoring sight, enhancing life — one patient at a time.”
            </div>
          </div>

          {/* Department 2: General Surgery */}
          <div className="bg-white border border-slate-200 text-slate-900 p-6 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                ⚕ Department of General Surgery
              </h3>
              <p className="text-xs font-semibold bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-100">
                Comprehensive surgical management for abdominal and trauma conditions.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hernia, Appendix & Gallbladder Surgery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Piles, Fistula & Fissure Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Thyroid & Breast Surgery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Trauma & Wound Treatment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Post-Operative Care & Pain Management</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              In-charge: <strong className="text-slate-900">Dr Mushtaq Ahmad Khan</strong> (35 Yrs Experience)
            </div>
          </div>

          {/* Department 3: Laparoscopic Surgery */}
          <div className="bg-white border border-slate-200 text-slate-900 p-6 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                🔪 Department of Laproscopic Surgery
              </h3>
              <p className="text-xs font-semibold bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-100">
                Keyhole surgeries for faster healing and minimal discomfort.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Laparoscopic Appendix Surgery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Laparoscopic Gallbladder Surgery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hernia Repair</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Diagnostic Laparoscopy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Laparoscopic Gynecological Procedures</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 italic text-xs font-serif text-slate-500">
              “Smaller incisions. Faster recovery. Better outcomes.”
            </div>
          </div>
        </div>
      </section>

      {/* 7. Facilities & Services & Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Facilities List */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Infrastructure & Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                💊 Facilities & Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Modern Operation Theatres',
                  'Advanced Pathology & Lab',
                  'Online Appointments',
                  'Health Check-Up Camps',
                  'Wheelchair Access & Patient Support',
                  'Clean & Comfort Waiting Zones'
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800 border border-slate-700 text-slate-200 p-3.5 rounded-2xl flex items-center gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Khair Hospital */}
            <div className="lg:col-span-5 bg-slate-800 border border-slate-700 text-white p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest block text-emerald-400">
                  Patient Assurance
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  Why Choose Khair Hospital?
                </h3>
                <p className="text-xs mt-2 italic font-serif text-slate-300">
                  "Because your health deserves expert care — every single day."
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Experienced Specialists</h4>
                      <p className="text-[11px] text-slate-300">Over 35 years of surgical and eye care leadership.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Advanced Technology</h4>
                      <p className="text-[11px] text-slate-300">Modern Phaco cataract lasers and laparoscopic suites.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Affordable Care</h4>
                      <p className="text-[11px] text-slate-300">Ayushman Bharat empanelled for transparent pricing.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer"
                >
                  Schedule Consultation Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Meet Our Expert Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 inline-block mb-2 rounded-full">
            Clinical Faculty
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Meet Our Expert Doctors
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Experienced professionals dedicated to your health and wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="aspect-3/4 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block mb-1">
                    {doc.department}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-mono font-semibold text-slate-600 mt-0.5">
                    {doc.qualification}
                  </p>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500">Experience:</span>
                    <span className="font-bold text-slate-900">{doc.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500">OPD Fee:</span>
                    <span className="font-bold text-slate-900">₹{doc.fee}</span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Mobile:</span>
                      <span className="font-bold text-slate-900">{doc.phone}</span>
                    </div>
                  )}
                  <div className="text-[11px] pt-1 border-t border-slate-200 text-slate-600">
                    {doc.opdSchedule}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctorForBooking(doc);
                  setIsAppointmentModalOpen(true);
                }}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Feedback Form & Contact Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Feedback Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xs space-y-5">
            <div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2">
                Patient Voice
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                📝 Feedback Form
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Share your experience, feedback, or inquiry directly with Khair Hospital administration.
              </p>
            </div>

            {feedbackSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been submitted successfully to administration.</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-emerald-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-emerald-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your mobile number"
                    value={feedbackForm.phone}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-emerald-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Subject of your feedback"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-emerald-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Your message here..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2 mt-4"
              >
                <Send className="w-3.5 h-3.5" /> Submit Feedback
              </button>
            </form>
          </div>

          {/* Contact Us Details & Location Map Info */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
                Hospital Reception
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Contact Us
              </h2>
              <p className="text-xs text-slate-300">
                Get in touch for appointments, emergency assistance, and medical inquiries.
              </p>

              <div className="space-y-3 text-xs pt-2">
                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Phone Helplines</h4>
                    <p className="font-mono font-semibold text-slate-300 mt-0.5">05542-359380</p>
                    <p className="font-mono font-bold text-sm text-emerald-400">+91 9628897004</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Email & Web</h4>
                    <p className="font-mono text-slate-300">kmh.bst@gmail.com</p>
                    <p className="font-mono text-slate-300">www.khairhospitalbst.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Hospital Address</h4>
                    <p className="mt-0.5 leading-relaxed text-slate-300">
                      Khair Hospital, Bansi Road, Katra, Basti, Uttar Pradesh 272001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl space-y-2 border border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Our Location
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Visit us at our state-of-the-art facility located in the heart of the city, easily accessible and equipped with modern healthcare amenities.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
