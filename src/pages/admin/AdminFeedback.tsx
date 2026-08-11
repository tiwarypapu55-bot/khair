import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { FeedbackStatus } from '../../types';
import { MessageSquare, CheckCircle2, Clock, Trash2, Phone, Mail, Edit3, X } from 'lucide-react';

export const AdminFeedback: React.FC = () => {
  const { feedbacks, updateFeedbackStatus, deleteFeedback } = useHospital();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const filteredFeedbacks = filterStatus === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.status === filterStatus);

  const handleSaveNotes = (id: string) => {
    updateFeedbackStatus(id, 'Resolved', notesInput);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            Patient Feedback & Inquiries Inbox
          </h2>
          <p className="text-xs text-slate-500">Review patient reviews, complaints, and OPD inquiries submitted through the portal</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                filterStatus === st
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No feedbacks found in this filter.</p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm">
                    {fb.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{fb.patientName}</h3>
                    <p className="text-xs text-slate-500">
                      Dept: <strong className="text-slate-800">{fb.department}</strong> • {fb.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-amber-500 font-bold text-sm">{"★".repeat(fb.rating)}</span>
                  <select
                    value={fb.status}
                    onChange={(e) => updateFeedbackStatus(fb.id, e.target.value as FeedbackStatus)}
                    className={`text-xs font-bold border rounded-lg px-2.5 py-1 ${
                      fb.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : fb.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => deleteFeedback(fb.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60 font-serif italic">
                "{fb.message}"
              </p>

              {/* Patient Contact Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> {fb.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600" /> {fb.email}</span>
              </div>

              {/* Admin Notes */}
              {fb.adminNotes && (
                <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <span className="font-bold text-blue-800 uppercase text-[10px] block">Admin Action Notes:</span>
                  <p>{fb.adminNotes}</p>
                </div>
              )}

              {/* Add / Edit Admin Notes Action */}
              {editingNotesId === fb.id ? (
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Type resolution / response notes..."
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                  <button
                    onClick={() => handleSaveNotes(fb.id)}
                    className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Save & Resolve
                  </button>
                  <button
                    onClick={() => setEditingNotesId(null)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingNotesId(fb.id);
                    setNotesInput(fb.adminNotes || '');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {fb.adminNotes ? 'Edit Admin Notes' : 'Add Admin Resolution Notes'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
