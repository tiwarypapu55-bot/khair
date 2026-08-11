import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, ExternalLink, Navigation } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addFeedback, departments, businessSettings } = useHospital();
  const mapsUrl = businessSettings.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=Khair+Hospital+Bansi+Road+Katra+Basti+Uttar+Pradesh";
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Inquiry');
  const [rating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !message) return;

    addFeedback({
      patientName,
      email: email || 'patient@khairhospital.in',
      phone,
      department,
      rating,
      message
    });

    setIsSubmitted(true);
    setPatientName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Hospital Contact & Feedback
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect with {businessSettings.hospitalName}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We are available 24x7 for emergency casualty, ambulance dispatch, OPD consultation bookings, and patient feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Hospital Address & Location
              </h3>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full transition flex items-center gap-1 shadow-sm shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition group"
                title="Click to open location in Google Maps"
              >
                <strong className="block text-base font-semibold transition flex items-center justify-between text-white">
                  {businessSettings.hospitalName}
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                </strong>
                <span className="block mt-1 text-slate-300">
                  {businessSettings.address}, {businessSettings.city}, {businessSettings.statePin}.
                </span>
                <span className="text-[11px] font-semibold mt-2 inline-flex items-center gap-1 text-emerald-400 underline">
                  <MapPin className="w-3 h-3" /> Open in Google Maps
                </span>
              </a>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <span className="text-xs font-bold uppercase block text-emerald-400">24x7 Emergency Hotline</span>
                <a href={`tel:${businessSettings.primaryPhone}`} className="font-extrabold text-lg block text-white hover:underline">
                  {businessSettings.primaryPhone}
                </a>
                <p className="text-[11px] text-slate-400">Landline: {businessSettings.landlinePhone}</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>OPD Timings: {businessSettings.opdTimings}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{businessSettings.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map & Location Guidance Card */}
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-5 text-center space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">Location Guidance</h4>
                  <p className="text-[11px] text-slate-500">Khair Hospital, Bansi Road, Katra, Basti</p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Live Google Map Preview */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <iframe
                title="Khair Hospital Basti Google Map Location"
                src="https://maps.google.com/maps?q=Khair+Hospital+Bansi+Road+Katra+Basti+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            <p className="text-xs text-left bg-slate-50 p-3 rounded-2xl border border-slate-200 leading-relaxed text-slate-600">
              <strong>Directions:</strong> Located centrally on Bansi Road / Malviya Road (Katra, Basti). Easily accessible via auto-rickshaws, bus stand, and Basti Railway Station (2.5 km).
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Navigation className="w-4 h-4" /> Get Live Driving Directions on Google Maps
            </a>
          </div>
        </div>

        {/* Right Patient Feedback / Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              Patient Feedback & Inquiry Form
            </h3>
            <p className="text-xs text-slate-600">
              Your feedback helps us continuously elevate patient safety and hospital service quality.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-lg text-emerald-950">Thank You for Your Feedback!</h4>
              <p className="text-xs text-emerald-800">
                Your message has been logged directly into the Khair Hospital Admin Desk. We appreciate your valuable input.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9628897004"
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@gmail.com"
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Concern Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden font-medium text-slate-700"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Message / Feedback Details *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your experience or query..."
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" /> Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
