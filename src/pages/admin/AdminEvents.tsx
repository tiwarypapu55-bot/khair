import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { EventStatus } from '../../types';
import { Calendar, Plus, Trash2, X, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { FileUploadInput } from '../../components/FileUploadInput';

export const AdminEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useHospital();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Khair Hospital Auditorium, Basti');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Khair Hospital Medical Desk');
  const [maxSeats, setMaxSeats] = useState<number>(200);
  const [status, setStatus] = useState<EventStatus>('Upcoming');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addEvent({
      title,
      date,
      location,
      description,
      organizer,
      maxSeats,
      status,
      imageUrl
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Health Camps & Medical Events Management
          </h2>
          <p className="text-xs text-slate-500">Organize free mega health checkup drives, blood donation camps, and medical workshops</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Health Event
        </button>
      </div>

      {/* Events Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-md">
                  {evt.date}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  evt.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {evt.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{evt.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

              <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <p>Venue: <strong className="text-slate-800">{evt.location}</strong></p>
                <p>Organizer: <strong className="text-slate-800">{evt.organizer}</strong></p>
                <p>Registrations: <strong className="text-emerald-700">{evt.registeredCount} / {evt.maxSeats} Spots</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <select
                value={evt.status}
                onChange={(e) => updateEvent(evt.id, { status: e.target.value as EventStatus })}
                className="text-xs font-semibold border border-slate-300 rounded-lg px-2 py-1 bg-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => deleteEvent(evt.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <h3 className="font-bold text-lg text-slate-900">Create New Health Camp / Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free Eye & Diabetes Screening Camp"
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Registration Seats</label>
                  <input
                    type="number"
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organizer Desk</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <FileUploadInput
                label="Event Poster / Document (JPG, PNG, PDF)"
                value={imageUrl}
                onChange={setImageUrl}
                helpText="Upload event promotional banner or PDF brochure."
              />

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
