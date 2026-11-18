import { supabase, isSupabaseConfigured } from './supabase';
import {
  Doctor, Department, Facility, Employee, Notice, EventItem, EventRegistration, GalleryItem, FeedbackItem,
  Appointment, BusinessSettings, LogoSettings, SliderSetting, FlashAnnouncement
} from '../types';

// ============================================================
// DOCTORS SYNC
// ============================================================
export async function fetchDoctorsFromSupabase(): Promise<Doctor[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch doctors warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      qualification: d.qualification || '',
      department: d.department || '',
      specialization: d.specialization || '',
      experience: d.experience || '',
      image: d.image || '',
      opdSchedule: d.opd_schedule || '',
      fee: Number(d.fee) || 0,
      phone: d.phone || '',
      status: d.status || 'Active',
      bio: d.bio || '',
      roomNo: d.room_no || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch doctors exception:', err);
    return null;
  }
}

export async function saveDoctorToSupabase(doc: Doctor): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('doctors').upsert({
      id: doc.id,
      name: doc.name,
      qualification: doc.qualification,
      department: doc.department,
      specialization: doc.specialization,
      experience: doc.experience,
      image: doc.image,
      opd_schedule: doc.opdSchedule,
      fee: doc.fee,
      phone: doc.phone,
      status: doc.status,
      bio: doc.bio,
      room_no: doc.roomNo
    });
    if (error) {
      console.warn('Supabase save doctor warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save doctor exception:', err);
    return false;
  }
}

export async function deleteDoctorFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete doctor warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete doctor exception:', err);
    return false;
  }
}

// ============================================================
// EMPLOYEES SYNC
// ============================================================
export async function fetchEmployeesFromSupabase(): Promise<Employee[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch employees warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((e: any) => ({
      id: e.id,
      employeeId: e.employee_id || '',
      name: e.name,
      designation: e.designation || '',
      department: e.department || '',
      phone: e.phone || '',
      email: e.email || '',
      joinDate: e.join_date || '',
      shift: e.shift || 'General',
      status: e.status || 'Active',
      password: e.password || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch employees exception:', err);
    return null;
  }
}

export async function saveEmployeeToSupabase(emp: Employee): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('employees').upsert({
      id: emp.id,
      employee_id: emp.employeeId,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      phone: emp.phone,
      email: emp.email,
      join_date: emp.joinDate,
      shift: emp.shift,
      status: emp.status,
      password: emp.password
    });
    if (error) {
      console.warn('Supabase save employee warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save employee exception:', err);
    return false;
  }
}

export async function deleteEmployeeFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete employee warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete employee exception:', err);
    return false;
  }
}

// ============================================================
// NOTICES SYNC
// ============================================================
export async function fetchNoticesFromSupabase(): Promise<Notice[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch notices warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((n: any) => ({
      id: n.id,
      title: n.title,
      category: n.category || 'General',
      date: n.date || '',
      content: n.content || '',
      isPinned: Boolean(n.is_pinned),
      priority: n.priority || 'Normal',
      targetAudience: n.target_audience || 'All Patients & Visitors',
      docUrl: n.doc_url || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch notices exception:', err);
    return null;
  }
}

export async function saveNoticeToSupabase(notice: Notice): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('notices').upsert({
      id: notice.id,
      title: notice.title,
      category: notice.category,
      date: notice.date,
      content: notice.content,
      is_pinned: notice.isPinned,
      priority: notice.priority,
      target_audience: notice.targetAudience,
      doc_url: notice.docUrl || ''
    });
    if (error) {
      console.warn('Supabase save notice warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save notice exception:', err);
    return false;
  }
}

export async function deleteNoticeFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete notice warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete notice exception:', err);
    return false;
  }
}

// ============================================================
// EVENTS SYNC
// ============================================================
export async function fetchEventsFromSupabase(): Promise<EventItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch events warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      date: e.date || '',
      location: e.location || '',
      description: e.description || '',
      organizer: e.organizer || '',
      maxSeats: Number(e.max_seats) || 100,
      registeredCount: Number(e.registered_count) || 0,
      status: e.status || 'Upcoming',
      imageUrl: e.image_url || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch events exception:', err);
    return null;
  }
}

export async function saveEventToSupabase(event: EventItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      organizer: event.organizer,
      max_seats: event.maxSeats,
      registered_count: event.registeredCount,
      status: event.status,
      image_url: event.imageUrl
    });
    if (error) {
      console.warn('Supabase save event warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save event exception:', err);
    return false;
  }
}

export async function deleteEventFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete event warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete event exception:', err);
    return false;
  }
}

// ============================================================
// GALLERY SYNC
// ============================================================
export async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch gallery warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((g: any) => ({
      id: g.id,
      title: g.title,
      category: g.category || 'Facilities',
      imageUrl: g.image_url || '',
      caption: g.caption || '',
      date: g.date || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch gallery exception:', err);
    return null;
  }
}

export async function saveGalleryItemToSupabase(item: GalleryItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('gallery').upsert({
      id: item.id,
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      caption: item.caption,
      date: item.date
    });
    if (error) {
      console.warn('Supabase save gallery item warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save gallery item exception:', err);
    return false;
  }
}

export async function deleteGalleryItemFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete gallery item warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete gallery item exception:', err);
    return false;
  }
}

// ============================================================
// FEEDBACKS SYNC
// ============================================================
export async function fetchFeedbacksFromSupabase(): Promise<FeedbackItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch feedbacks warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((f: any) => ({
      id: f.id,
      patientName: f.patient_name,
      email: f.email || '',
      phone: f.phone || '',
      department: f.department || '',
      rating: Number(f.rating) || 5,
      message: f.message || '',
      date: f.date || '',
      status: f.status || 'Pending',
      adminNotes: f.admin_notes || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch feedbacks exception:', err);
    return null;
  }
}

export async function saveFeedbackToSupabase(fb: FeedbackItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('feedbacks').upsert({
      id: fb.id,
      patient_name: fb.patientName,
      email: fb.email,
      phone: fb.phone,
      department: fb.department,
      rating: fb.rating,
      message: fb.message,
      date: fb.date,
      status: fb.status,
      admin_notes: fb.adminNotes
    });
    if (error) {
      console.warn('Supabase save feedback warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save feedback exception:', err);
    return false;
  }
}

export async function deleteFeedbackFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete feedback warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete feedback exception:', err);
    return false;
  }
}

// ============================================================
// APPOINTMENTS SYNC
// ============================================================
export async function fetchAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch appointments warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((a: any) => ({
      id: a.id,
      appointmentNumber: a.appointment_number,
      patientName: a.patient_name,
      age: Number(a.age) || 30,
      gender: a.gender || 'Male',
      phone: a.phone || '',
      email: a.email || '',
      department: a.department || '',
      doctorId: a.doctor_id || '',
      doctorName: a.doctor_name || '',
      date: a.date || '',
      timeSlot: a.time_slot || '',
      status: a.status || 'Confirmed',
      symptoms: a.symptoms || '',
      createdAt: a.created_at || new Date().toISOString(),
      communicationLogs: a.communication_logs || []
    }));
  } catch (err) {
    console.warn('Supabase fetch appointments exception:', err);
    return null;
  }
}

export async function saveAppointmentToSupabase(app: Appointment): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('appointments').upsert({
      id: app.id,
      appointment_number: app.appointmentNumber,
      patient_name: app.patientName,
      age: app.age,
      gender: app.gender,
      phone: app.phone,
      email: app.email,
      department: app.department,
      doctor_id: app.doctorId,
      doctor_name: app.doctorName,
      date: app.date,
      time_slot: app.timeSlot,
      status: app.status,
      symptoms: app.symptoms,
      communication_logs: app.communicationLogs || []
    });
    if (error) {
      console.warn('Supabase save appointment warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save appointment exception:', err);
    return false;
  }
}

// ============================================================
// SETTINGS SYNC (BusinessSettings, LogoSettings, SliderSetting[], FlashAnnouncement)
// ============================================================
export async function fetchSettingFromSupabase<T>(key: string): Promise<T | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('hospital_settings').select('value').eq('key', key).maybeSingle();
    if (error) {
      console.warn(`Supabase fetch setting [${key}] warning:`, error.message || error);
      return null;
    }
    if (!data) return null;
    return data.value as T;
  } catch (err) {
    console.warn(`Supabase fetch setting [${key}] exception:`, err);
    return null;
  }
}

export async function saveSettingToSupabase<T>(key: string, value: T): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('hospital_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.warn(`Supabase save setting [${key}] warning:`, error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase save setting [${key}] exception:`, err);
    return false;
  }
}

// ============================================================
// DEPARTMENTS SYNC
// ============================================================
export async function fetchDepartmentsFromSupabase(): Promise<Department[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('departments').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch departments warning:', error.message || error);
      return null;
    }
    if (!data) return null;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      iconName: d.icon_name || 'Stethoscope',
      description: d.description || '',
      headOfDepartment: d.head_of_department || '',
      bedCapacity: Number(d.bed_capacity) || 15,
      phoneExt: d.phone_ext || '',
      commonTreatments: Array.isArray(d.common_treatments) ? d.common_treatments : [],
      image: d.image || ''
    }));
  } catch (err) {
    console.warn('Supabase fetch departments exception:', err);
    return null;
  }
}

export async function saveDepartmentToSupabase(dept: Department): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('departments').upsert({
      id: dept.id,
      name: dept.name,
      icon_name: dept.iconName,
      description: dept.description,
      head_of_department: dept.headOfDepartment,
      bed_capacity: dept.bedCapacity,
      phone_ext: dept.phoneExt,
      common_treatments: dept.commonTreatments,
      image: dept.image
    });
    if (error) {
      console.warn('Supabase save department warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save department exception:', err);
    return false;
  }
}

export async function deleteDepartmentFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete department warning:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete department exception:', err);
    return false;
  }
}

// ============================================================
// FACILITIES & EVENT REGISTRATIONS SYNC
// ============================================================
export async function fetchFacilitiesFromSupabase(): Promise<Facility[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('facilities').select('*').order('created_at', { ascending: true });
    if (error) return null;
    if (!data) return null;
    return data.map((f: any) => ({
      id: f.id,
      name: f.name,
      category: f.category || '',
      description: f.description || '',
      availability: f.availability || '',
      image: f.image || '',
      features: Array.isArray(f.features) ? f.features : []
    }));
  } catch {
    return null;
  }
}

export async function saveFacilityToSupabase(fac: Facility): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('facilities').upsert({
      id: fac.id,
      name: fac.name,
      category: fac.category,
      description: fac.description,
      availability: fac.availability,
      image: fac.image,
      features: fac.features
    });
    return !error;
  } catch {
    return false;
  }
}

export async function saveEventRegistrationToSupabase(reg: EventRegistration): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('event_registrations').upsert({
      id: reg.id,
      event_id: reg.eventId,
      attendee_name: reg.attendeeName,
      attendee_phone: reg.attendeePhone,
      attendee_email: reg.attendeeEmail,
      registered_at: reg.registeredAt
    });
    return !error;
  } catch {
    return false;
  }
}


