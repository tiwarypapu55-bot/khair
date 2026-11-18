import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { FileText, Calendar, MapPin, Users, CheckCircle2, Pin, Megaphone, Sparkles, X } from 'lucide-react';

export const NewsEventsPage: React.FC = () => {
  const { notices, events, registerForEvent, flashAnnouncement, setIsFlashModalOpen } = useHospital();
  const [activeTab, setActiveTab] = useState<'notices' | 'events'>('notices');
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('khair_registered_events_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [regModalEventId, setRegModalEventId] = useState<string | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('khair_registered_events_v1', JSON.stringify(registeredEventIds));
    } catch {
      // ignore storage quota errors
    }
  }, [registeredEventIds]);

  const selectedEventForModal = events.find(e => e.id === regModalEventId) || null;

  const handleOpenRegistration = (eventId: string) => {
    setRegModalEventId(eventId);
    setAttendeeName('');
    setAttendeePhone('');
    setAttendeeEmail('');
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regModalEventId || !attendeeName.trim() || !attendeePhone.trim()) return;

    registerForEvent(regModalEventId, {
      attendeeName: attendeeName.trim(),
      attendeePhone: attendeePhone.trim(),
      attendeeEmail: attendeeEmail.trim(),
    });
    setRegisteredEventIds(prev => (prev.includes(regModalEventId) ? prev : [...prev, regModalEventId]));
    setRegModalEventId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Hospital News Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Notices, Health Advisory & Events
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Stay informed with official OPD schedule updates, medical advisories, free health checkup camps, and community blood drives.
        </p>
      </div>

      {/* Main Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 border border-slate-200">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Official Notices ({notices.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'events'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Health Camps & Events ({events.length})
          </button>
        </div>
      </div>

      {/* Flashed Announcement Spotlight Card */}
      {flashAnnouncement?.enabled && (
        <div className="bg-amber-500/10 border border-amber-200 text-amber-950 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Latest Flash Announcement</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-amber-950 pt-1">
              "{flashAnnouncement.message}"
            </h3>
            {flashAnnouncement.subText && (
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                {flashAnnouncement.subText}
              </p>
            )}
          </div>

          <button
            onClick={() => setIsFlashModalOpen(true)}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Flash Popup Window</span>
          </button>
        </div>
      )}

      {/* Tab 1: Notices List */}
      {activeTab === 'notices' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {notices.map((notice) => {
            const noticeAttachment = notice.docUrl || notice.attachmentUrl;
            return (
              <div
                key={notice.id}
                className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 shadow-xs transition-all relative space-y-3"
              >
                {notice.isPinned && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-amber-200">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-md">
                      {notice.category}
                    </span>
                    <span className="text-slate-500">• {notice.date}</span>
                    <span className="text-slate-600">Target: <strong>{notice.targetAudience}</strong></span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  {noticeAttachment && (
                    <div className="pt-2">
                      {noticeAttachment.startsWith('data:application/pdf') || noticeAttachment.toLowerCase().includes('.pdf') ? (
                        <a
                          href={noticeAttachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Attached Notice PDF Document</span>
                        </a>
                      ) : (
                        <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 mt-2">
                          <img src={noticeAttachment} alt="Notice Attachment" className="w-full max-h-64 object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Health Camps & Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((evt) => {
            const isRegistered = registeredEventIds.includes(evt.id);
            const isFull = evt.registeredCount >= evt.maxSeats;
            return (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 text-slate-900 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-slate-100">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md">
                      {evt.date}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-slate-900">{evt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                    <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 text-slate-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Venue: <strong>{evt.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Organizer: <strong>{evt.organizer}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2 text-xs">
                  <span className="font-medium text-slate-600">
                    Registered: <strong>{evt.registeredCount} / {evt.maxSeats}</strong>
                  </span>

                  {isRegistered ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenRegistration(evt.id)}
                      disabled={evt.status === 'Completed' || isFull}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-50 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      {evt.status === 'Completed' ? 'Camp Completed' : isFull ? 'Seats Full' : 'Register Free Spot'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Registration Modal */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Free Health Camp Registration</span>
                <h3 className="font-bold text-base text-slate-900">{selectedEventForModal.title}</h3>
              </div>
              <button
                onClick={() => setRegModalEventId(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Participant Full Name *</label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Suresh Verma"
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="e.g. +91 98390 12345"
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="e.g. suresh@gmail.com"
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRegModalEventId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
