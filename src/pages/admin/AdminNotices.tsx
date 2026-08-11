import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { NoticeCategory, NoticePriority } from '../../types';
import { FileText, Plus, Pin, Trash2, X, AlertTriangle, ExternalLink, Megaphone, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { FileUploadInput } from '../../components/FileUploadInput';

export const AdminNotices: React.FC = () => {
  const {
    notices, addNotice, updateNotice, deleteNotice,
    flashAnnouncement, updateFlashAnnouncement, setIsFlashModalOpen
  } = useHospital();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Flash announcement local state for form editing
  const [flashTitle, setFlashTitle] = useState(flashAnnouncement?.title || 'Latest Announcement');
  const [flashMessage, setFlashMessage] = useState(flashAnnouncement?.message || 'Every Thursday - Consultation fee - Free.');
  const [flashSubText, setFlashSubText] = useState(flashAnnouncement?.subText || '');
  const [flashEnabled, setFlashEnabled] = useState(flashAnnouncement?.enabled ?? true);
  const [autoShow, setAutoShow] = useState(flashAnnouncement?.autoShowOnLoad ?? true);
  const [showTicker, setShowTicker] = useState(flashAnnouncement?.showTickerBanner ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [priority, setPriority] = useState<NoticePriority>('Normal');
  const [targetAudience, setTargetAudience] = useState('All Patients & Visitors');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const categories: NoticeCategory[] = ['General', 'OPD Schedule', 'Health Advisory', 'Recruitment', 'Emergency'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addNotice({
      title,
      category,
      date,
      content,
      isPinned,
      priority,
      targetAudience,
      attachmentUrl
    });

    setTitle('');
    setContent('');
    setAttachmentUrl('');
    setIsModalOpen(false);
  };

  const handleSaveFlashAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateFlashAnnouncement({
      title: flashTitle,
      message: flashMessage,
      subText: flashSubText,
      enabled: flashEnabled,
      autoShowOnLoad: autoShow,
      showTickerBanner: showTicker
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Flash Announcement Control Panel */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-purple-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center text-yellow-300">
              <Megaphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Flash Announcement / Website Alert Provision
              </h2>
              <p className="text-xs text-purple-200">
                Flash urgent announcements, free OPD drives, or critical notices in an automatic website modal & ticker.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFlashModalOpen(true)}
              className="px-3.5 py-2 bg-purple-700/60 hover:bg-purple-600 text-white rounded-xl text-xs font-bold border border-purple-400/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-yellow-300" />
              <span>Preview Popup</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveFlashAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Announcement Modal Header Title
              </label>
              <input
                type="text"
                value={flashTitle}
                onChange={(e) => setFlashTitle(e.target.value)}
                placeholder="e.g. Latest Announcement"
                className="w-full bg-slate-950/80 border border-purple-700/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                Sub-caption / Additional Note (Optional)
              </label>
              <input
                type="text"
                value={flashSubText}
                onChange={(e) => setFlashSubText(e.target.value)}
                placeholder="e.g. Free OPD doctor consultation for all patients at Khair Hospital"
                className="w-full bg-slate-950/80 border border-purple-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Flashed Message Text (Main Quote)
            </label>
            <input
              type="text"
              value={flashMessage}
              onChange={(e) => setFlashMessage(e.target.value)}
              placeholder='e.g. Every Thursday - Consultation fee - Free.'
              className="w-full bg-slate-950/80 border border-purple-700/80 rounded-xl px-3.5 py-2.5 text-sm font-bold text-yellow-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-purple-800/80">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flashEnabled}
                  onChange={(e) => setFlashEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Enable Flash Announcement</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoShow}
                  onChange={(e) => setAutoShow(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Auto-Popup Modal on Page Load</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTicker}
                  onChange={(e) => setShowTicker(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Show Flash Ticker Bar on Top Header</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Announcement Updated & Saved!
                </span>
              )}
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-slate-900" /> Save & Publish Flash Announcement
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Official Notices & Bulletins
          </h2>
          <p className="text-xs text-slate-500">Publish OPD schedule changes, recruitment drives, health advisories, and emergency alerts</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
              notice.isPinned ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-bold px-2.5 py-0.5 rounded-md ${
                  notice.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {notice.category}
                </span>
                <span className="text-slate-400">• {notice.date}</span>
                {notice.isPinned && (
                  <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900">{notice.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
              <p className="text-[11px] text-slate-400">Target Audience: <strong className="text-slate-700">{notice.targetAudience}</strong></p>
            </div>

            <div className="flex sm:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => updateNotice(notice.id, { isPinned: !notice.isPinned })}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                  notice.isPinned ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
                title="Toggle Pin"
              >
                <Pin className="w-3.5 h-3.5" />
                {notice.isPinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                onClick={() => deleteNotice(notice.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Delete Notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Post New Hospital Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Revised OPD Schedule for Festival Holiday"
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="All Patients / Staff / Public"
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Write notice details..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              <FileUploadInput
                label="Attach PDF Document or Photo (Optional)"
                value={attachmentUrl}
                onChange={setAttachmentUrl}
                helpText="Attach official notice PDF circular, recruitment form, or image banner."
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-amber-600"
                />
                <label htmlFor="pinNotice" className="font-semibold text-slate-700 cursor-pointer">
                  Pin to Homepage Banner Ticker
                </label>
              </div>

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
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
