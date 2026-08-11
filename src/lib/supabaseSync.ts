import { supabase } from './supabase';
import {
  Doctor, Employee, Notice, EventItem, GalleryItem, FeedbackItem,
  Appointment, BusinessSettings, LogoSettings, SliderSetting, FlashAnnouncement
} from '../types';

// ============================================================
// DOCTORS SYNC
// ============================================================
export async function fetchDoctorsFromSupabase(): Promise<Doctor[] | null> {
  try {
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch doctors error:', error.message || error);
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
      console.error('Supabase save doctor error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save doctor exception:', err);
    return false;
  }
}

export async function deleteDoctorFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete doctor error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete doctor exception:', err);
    return false;
  }
}

// ============================================================
// EMPLOYEES SYNC
// ============================================================
export async function fetchEmployeesFromSupabase(): Promise<Employee[] | null> {
  try {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch employees error:', error.message || error);
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
      console.error('Supabase save employee error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save employee exception:', err);
    return false;
  }
}

export async function deleteEmployeeFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete employee error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete employee exception:', err);
    return false;
  }
}

// ============================================================
// NOTICES SYNC
// ============================================================
export async function fetchNoticesFromSupabase(): Promise<Notice[] | null> {
  try {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch notices error:', error.message || error);
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
      console.error('Supabase save notice error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save notice exception:', err);
    return false;
  }
}

export async function deleteNoticeFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete notice error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete notice exception:', err);
    return false;
  }
}

// ============================================================
// EVENTS SYNC
// ============================================================
export async function fetchEventsFromSupabase(): Promise<EventItem[] | null> {
  try {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch events error:', error.message || error);
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
      console.error('Supabase save event error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save event exception:', err);
    return false;
  }
}

export async function deleteEventFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete event error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete event exception:', err);
    return false;
  }
}

// ============================================================
// GALLERY SYNC
// ============================================================
export async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  try {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch gallery error:', error.message || error);
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
      console.error('Supabase save gallery item error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save gallery item exception:', err);
    return false;
  }
}

export async function deleteGalleryItemFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete gallery item error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete gallery item exception:', err);
    return false;
  }
}

// ============================================================
// FEEDBACKS SYNC
// ============================================================
export async function fetchFeedbacksFromSupabase(): Promise<FeedbackItem[] | null> {
  try {
    const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch feedbacks error:', error.message || error);
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
      console.error('Supabase save feedback error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save feedback exception:', err);
    return false;
  }
}

export async function deleteFeedbackFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete feedback error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete feedback exception:', err);
    return false;
  }
}

// ============================================================
// APPOINTMENTS SYNC
// ============================================================
export async function fetchAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  try {
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch appointments error:', error.message || error);
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
      console.error('Supabase save appointment error:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save appointment exception:', err);
    return false;
  }
}

// ============================================================
// SETTINGS SYNC (BusinessSettings, LogoSettings, SliderSetting[], FlashAnnouncement)
// ============================================================
export async function fetchSettingFromSupabase<T>(key: string): Promise<T | null> {
  try {
    const { data, error } = await supabase.from('hospital_settings').select('value').eq('key', key).maybeSingle();
    if (error) {
      console.warn(`Supabase fetch setting [${key}] error:`, error.message || error);
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
  try {
    const { error } = await supabase.from('hospital_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error(`Supabase save setting [${key}] error:`, error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Supabase save setting [${key}] exception:`, err);
    return false;
  }
}
