import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Department } from '../../types';
import { INITIAL_DEPARTMENTS } from '../../data/initialData';
import { FileUploadInput } from '../../components/FileUploadInput';
import {
  Building2, Camera, Edit2, Plus, Trash2, X, CheckCircle2,
  Bed, Phone, UserCheck, RotateCcw, Stethoscope
} from 'lucide-react';

export const AdminDepartments: React.FC = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useHospital();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'photo' | 'full'>('full');
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [bedCapacity, setBedCapacity] = useState<number>(20);
  const [phoneExt, setPhoneExt] = useState('101');
  const [description, setDescription] = useState('');
  const [treatmentsText, setTreatmentsText] = useState('');
  const [image, setImage] = useState('');

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const openChangePhotoModal = (dept: Department) => {
    setEditingDept(dept);
    setModalMode('photo');
    setName(dept.name);
    setHeadOfDepartment(dept.headOfDepartment);
    setBedCapacity(dept.bedCapacity);
    setPhoneExt(dept.phoneExt);
    setDescription(dept.description);
    setTreatmentsText(dept.commonTreatments.join('\n'));
    setImage(dept.image);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setModalMode('full');
    setName(dept.name);
    setHeadOfDepartment(dept.headOfDepartment);
    setBedCapacity(dept.bedCapacity);
    setPhoneExt(dept.phoneExt);
    setDescription(dept.description);
    setTreatmentsText(dept.commonTreatments.join('\n'));
    setImage(dept.image);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingDept(null);
    setModalMode('full');
    setName('');
    setHeadOfDepartment('');
    setBedCapacity(20);
    setPhoneExt('104');
    setDescription('Specialized clinical department delivering compassionate evidence-based patient care.');
    setTreatmentsText('OPD Consultation\nDiagnostic Evaluation\nDaycare & Inpatient Care');
    setImage('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000');
    setIsModalOpen(true);
  };

  const handleRestoreDefaultImage = () => {
    if (!editingDept) return;
    const defaultDept = INITIAL_DEPARTMENTS.find(d => d.id === editingDept.id);
    if (defaultDept) {
      setImage(defaultDept.image);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) return;

    const treatments = treatmentsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingDept) {
      if (modalMode === 'photo') {
        updateDepartment(editingDept.id, { image: image.trim() });
        showToast(`Photo updated for ${editingDept.name} and synced across devices.`);
      } else {
        if (!name.trim()) return;
        updateDepartment(editingDept.id, {
          name: name.trim(),
          headOfDepartment: headOfDepartment.trim(),
          bedCapacity: Number(bedCapacity) || 10,
          phoneExt: phoneExt.trim(),
          description: description.trim(),
          commonTreatments: treatments,
          image: image.trim(),
        });
        showToast(`${name.trim()} department updated and synced across devices.`);
      }
    } else {
      if (!name.trim()) return;
      addDepartment({
        name: name.trim(),
        iconName: 'Stethoscope',
        headOfDepartment: headOfDepartment.trim() || 'Senior Consultant',
        bedCapacity: Number(bedCapacity) || 15,
        phoneExt: phoneExt.trim() || '105',
        description: description.trim(),
        commonTreatments: treatments,
        image: image.trim(),
      });
      showToast(`New department "${name.trim()}" added and synced.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-xs p-6 border border-emerald-950 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-1">
            Clinical Specialties & Visuals
          </span>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-300" />
            Departments & Photo Management
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Change department photos/images, upload new cover banners, or edit clinical department details. Changes sync immediately to the Departments page across devices.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Departments Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const isInitial = INITIAL_DEPARTMENTS.some(d => d.id === dept.id);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Department Photo Showcase */}
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                  {/* Quick Change Photo Floating Button */}
                  <button
                    onClick={() => openChangePhotoModal(dept)}
                    className="absolute top-3 right-3 bg-white/95 hover:bg-emerald-600 hover:text-white text-slate-900 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer border border-white/60"
                    title="Change Department Photo / Image"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      Clinical Department
                    </span>
                    <h3 className="text-lg font-extrabold leading-tight">{dept.name}</h3>
                    <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3 h-3 text-emerald-300 shrink-0" />
                      <span>HOD: <strong>{dept.headOfDepartment}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      {dept.bedCapacity} Beds
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      Ext: {dept.phoneExt}
                    </span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {dept.commonTreatments.length} Procedures
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => openChangePhotoModal(dept)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Change Image
                </button>

                <button
                  onClick={() => openEditModal(dept)}
                  className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-300 font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  title="Edit Department Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>

                {!isInitial && (
                  confirmDeleteId === dept.id ? (
                    <button
                      onClick={() => {
                        deleteDepartment(dept.id);
                        setConfirmDeleteId(null);
                        showToast(`Department "${dept.name}" removed.`);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-2.5 rounded-xl transition cursor-pointer"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(dept.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition cursor-pointer"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Change Department Photo or Edit Department */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-700" />
                  {modalMode === 'photo' && editingDept
                    ? `Change Photo — ${editingDept.name}`
                    : editingDept
                    ? `Edit Department — ${editingDept.name}`
                    : 'Add New Clinical Department'}
                </h3>
                <p className="text-xs text-slate-500">
                  Upload a photo from your device or paste an image URL.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm overflow-y-auto pr-1">
              {/* Live Banner Preview matching public DepartmentsPage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Public Page Banner Preview
                  </span>
                  {editingDept && INITIAL_DEPARTMENTS.some(d => d.id === editingDept.id) && (
                    <button
                      type="button"
                      onClick={handleRestoreDefaultImage}
                      className="text-[11px] font-bold text-slate-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Default Image
                    </button>
                  )}
                </div>
                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-900 border border-slate-200">
                  {image ? (
                    <img
                      src={image}
                      alt={name || 'Department Preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No image selected
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      Clinical Department
                    </span>
                    <h4 className="text-xl font-extrabold">{name || 'Department Name'}</h4>
                    <p className="text-xs text-slate-200">
                      Head of Dept: <strong>{headOfDepartment || 'Senior Consultant'}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo / Image Upload or URL Input */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4">
                <FileUploadInput
                  label="Department Photo / Image (Upload JPG, PNG, WEBP or URL)"
                  value={image}
                  onChange={(val) => setImage(val)}
                  acceptTypes="image/*,.jpg,.jpeg,.png,.webp,.svg"
                  placeholder="https://images.unsplash.com/..."
                  helpText="Recommended landscape image (16:9 or 800x500px+). Supports file upload or direct image URL."
                  allowPdf={false}
                  required
                />
              </div>

              {/* Full Department Fields when in 'full' mode */}
              {modalMode === 'full' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ophthalmology"
                        className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Head of Department</label>
                      <input
                        type="text"
                        value={headOfDepartment}
                        onChange={(e) => setHeadOfDepartment(e.target.value)}
                        placeholder="e.g. Dr. Farha Deeba"
                        className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bed Capacity</label>
                      <input
                        type="number"
                        min={1}
                        value={bedCapacity}
                        onChange={(e) => setBedCapacity(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Intercom Extension</label>
                      <input
                        type="text"
                        value={phoneExt}
                        onChange={(e) => setPhoneExt(e.target.value)}
                        placeholder="e.g. 103"
                        className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department Overview</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Common Procedures & Treatments (One per line)
                    </label>
                    <textarea
                      value={treatmentsText}
                      onChange={(e) => setTreatmentsText(e.target.value)}
                      rows={4}
                      className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!image.trim()}
                  className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer transition"
                >
                  {modalMode === 'photo'
                    ? 'Save Department Photo'
                    : editingDept
                    ? 'Save Department Changes'
                    : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
