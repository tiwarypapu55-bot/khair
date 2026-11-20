import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor, Employee, Department, Facility, GalleryItem, Notice,
  EventItem, EventRegistration, FeedbackItem, Appointment, BusinessSettings, SliderSetting, LogoSettings, FlashAnnouncement
} from '../types';
import {
  INITIAL_DOCTORS, INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS,
  INITIAL_FACILITIES, INITIAL_GALLERY, INITIAL_NOTICES,
  INITIAL_EVENTS, INITIAL_FEEDBACK, INITIAL_APPOINTMENTS,
  INITIAL_BUSINESS_SETTINGS, INITIAL_SLIDER_SETTINGS, INITIAL_LOGO_SETTINGS, INITIAL_FLASH_ANNOUNCEMENT,
  STATIC_HERO_BANNERS, getFixedDoctorImage
} from '../data/initialData';
import {
  fetchDoctorsFromSupabase, saveDoctorToSupabase, deleteDoctorFromSupabase,
  fetchDepartmentsFromSupabase, saveDepartmentToSupabase, deleteDepartmentFromSupabase,
  fetchFacilitiesFromSupabase, saveFacilityToSupabase,
  fetchEmployeesFromSupabase, saveEmployeeToSupabase, deleteEmployeeFromSupabase,
  fetchNoticesFromSupabase, saveNoticeToSupabase, deleteNoticeFromSupabase,
  fetchEventsFromSupabase, saveEventToSupabase, deleteEventFromSupabase, saveEventRegistrationToSupabase,
  fetchGalleryFromSupabase, saveGalleryItemToSupabase, deleteGalleryItemFromSupabase,
  fetchFeedbacksFromSupabase, saveFeedbackToSupabase, deleteFeedbackFromSupabase,
  fetchAppointmentsFromSupabase, saveAppointmentToSupabase,
  fetchSettingFromSupabase, saveSettingToSupabase
} from '../lib/supabaseSync';
import { isSupabaseConfigured } from '../lib/supabase';
import { serverSync, SyncState } from '../lib/serverSync';
import { formatLocalDateISO } from '../utils/scheduleSlots';

export type AdminTabType = 'home' | 'departments' | 'doctor-list' | 'employee' | 'gallery' | 'notice' | 'events' | 'feedback' | 'settings';

interface HospitalContextType {
  doctors: Doctor[];
  employees: Employee[];
  departments: Department[];
  facilities: Facility[];
  gallery: GalleryItem[];
  notices: Notice[];
  events: EventItem[];
  eventRegistrations: EventRegistration[];
  feedbacks: FeedbackItem[];
  appointments: Appointment[];
  isSupabaseConnected: boolean;

  // Real-Time Cross-Device & Server Synchronization
  syncState: SyncState;
  forceSyncWithServer: () => Promise<void>;
  syncNotice: string | null;
  clearSyncNotice: () => void;

  // Settings
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  sliderSettings: SliderSetting[];
  isBannerEditingInactive: boolean;
  addSlider: (slide: Omit<SliderSetting, 'id'>) => void;
  updateSlider: (id: string, slide: Partial<SliderSetting>) => void;
  deleteSlider: (id: string) => void;
  toggleSliderStatus: (id: string) => void;
  reorderSliders: (newOrder: SliderSetting[]) => void;
  logoSettings: LogoSettings;
  updateLogoSettings: (settings: Partial<LogoSettings>) => void;
  flashAnnouncement: FlashAnnouncement;
  updateFlashAnnouncement: (announcement: Partial<FlashAnnouncement>) => void;
  isFlashModalOpen: boolean;
  setIsFlashModalOpen: (open: boolean) => void;

  // Department CRUD
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Doctor CRUD
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  isDoctorPhotoEditingInactive: boolean;

  // Employee CRUD
  addEmployee: (emp: Omit<Employee, 'id' | 'employeeId'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Gallery CRUD
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Notice CRUD
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  // Event CRUD
  addEvent: (evt: Omit<EventItem, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, evt: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (
    eventId: string,
    details?: { attendeeName?: string; attendeePhone?: string; attendeeEmail?: string }
  ) => void;

  // Feedback CRUD
  addFeedback: (fb: Omit<FeedbackItem, 'id' | 'date' | 'status'>) => void;
  updateFeedbackStatus: (id: string, status: FeedbackItem['status'], adminNotes?: string) => void;
  deleteFeedback: (id: string) => void;

  // Appointment CRUD
  addAppointment: (app: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointment: (id: string, appData: Partial<Appointment>) => void;
  addCommunicationLog: (appointmentId: string, channel: 'WhatsApp' | 'SMS' | 'Call' | 'Note', message: string) => void;

  // Employee Auth & Portal State
  loggedInEmployee: Employee | null;
  loginEmployee: (empIdOrEmail: string, pass: string) => { success: boolean; message: string };
  logoutEmployee: () => void;
  isEmployeeModalOpen: boolean;
  setIsEmployeeModalOpen: (open: boolean) => void;
  isEmployeePortalOpen: boolean;
  setIsEmployeePortalOpen: (open: boolean) => void;

  // Navigation state
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminLogin: (id: string, pass: string) => boolean;
  adminLogout: () => void;
  adminTab: AdminTabType;
  setAdminTab: (tab: AdminTabType) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doc: Doctor | null) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncState>(serverSync.getState());
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const clearSyncNotice = () => setSyncNotice(null);

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('khair_doctors_v5') || localStorage.getItem('khair_doctors_v4');
    if (saved) {
      try {
        const parsed: Doctor[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(d => ({
            ...d,
            image: getFixedDoctorImage(d.id || d.name, d.image)
          }));
        }
      } catch (e) {
        console.warn('Failed to parse doctors:', e);
      }
    }
    return INITIAL_DOCTORS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('khair_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('khair_departments_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse departments:', e);
      }
    }
    return INITIAL_DEPARTMENTS;
  });
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('khair_facilities_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse facilities:', e);
      }
    }
    return INITIAL_FACILITIES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('khair_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('khair_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('khair_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('khair_event_registrations_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed to parse event registrations:', e);
      }
    }
    return [];
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('khair_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('khair_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  // Business & Branding Settings State
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('khair_business_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const rawDirPhoto = parsed.directorPhotoUrl;
        const cleanDirPhoto =
          !rawDirPhoto || String(rawDirPhoto).includes('dr_mushtaq_khan_1786250783424')
            ? INITIAL_BUSINESS_SETTINGS.directorPhotoUrl
            : rawDirPhoto;
        return {
          ...INITIAL_BUSINESS_SETTINGS,
          ...parsed,
          directorPhotoUrl: cleanDirPhoto,
          googleMapsUrl: parsed.googleMapsUrl || INITIAL_BUSINESS_SETTINGS.googleMapsUrl
        };
      } catch (e) {
        console.warn('Failed to parse business settings:', e);
      }
    }
    return INITIAL_BUSINESS_SETTINGS;
  });

  // Hero Banners (Dynamic - configurable by Admin & synced across devices)
  const [sliderSettings, setSliderSettings] = useState<SliderSetting[]>(() => {
    const saved = localStorage.getItem('khair_slider_settings_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse slider settings:', e);
      }
    }
    return INITIAL_SLIDER_SETTINGS;
  });

  const [logoSettings, setLogoSettings] = useState<LogoSettings>(() => {
    const saved = localStorage.getItem('khair_logo_settings_v3') || localStorage.getItem('khair_logo_settings_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isOldLogo = (url?: string) => !url || url.includes('khair_hospital_logo_1786262717216') || url.includes('khair_hospital_logo');
        return {
          ...INITIAL_LOGO_SETTINGS,
          ...parsed,
          headerLogoUrl: isOldLogo(parsed.headerLogoUrl) ? INITIAL_LOGO_SETTINGS.headerLogoUrl : parsed.headerLogoUrl,
          footerLogoUrl: isOldLogo(parsed.footerLogoUrl) ? INITIAL_LOGO_SETTINGS.footerLogoUrl : parsed.footerLogoUrl
        };
      } catch (e) {
        console.warn('Failed to parse logo settings:', e);
      }
    }
    return INITIAL_LOGO_SETTINGS;
  });

  const [flashAnnouncement, setFlashAnnouncement] = useState<FlashAnnouncement>(() => {
    const saved = localStorage.getItem('khair_flash_announcement');
    return saved ? JSON.parse(saved) : INITIAL_FLASH_ANNOUNCEMENT;
  });

  const [isFlashModalOpen, setIsFlashModalOpen] = useState<boolean>(() => {
    const savedFlash = localStorage.getItem('khair_flash_announcement');
    const flashObj = savedFlash ? JSON.parse(savedFlash) : INITIAL_FLASH_ANNOUNCEMENT;
    return flashObj.enabled && flashObj.autoShowOnLoad;
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('khair_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminModeState, setIsAdminModeState] = useState<boolean>(() => {
    return sessionStorage.getItem('khair_admin_auth') === 'true';
  });

  const setIsAdminMode = (admin: boolean) => {
    if (admin) {
      if (sessionStorage.getItem('khair_admin_auth') === 'true' || isAdminAuthenticated) {
        setIsAdminModeState(true);
      } else {
        setIsAdminLoginModalOpen(true);
      }
    } else {
      setIsAdminModeState(false);
    }
  };

  const adminLogin = (id: string, pass: string): boolean => {
    if (id.trim() === 'admin' && pass === 'Khair123@') {
      setIsAdminAuthenticated(true);
      setIsAdminModeState(true);
      setIsAdminLoginModalOpen(false);
      sessionStorage.setItem('khair_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminModeState(false);
    sessionStorage.removeItem('khair_admin_auth');
  };

  const [adminTab, setAdminTab] = useState<AdminTabType>('home');

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);

  // Employee Auth & Portal State
  const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('khair_logged_in_employee');
    return saved ? JSON.parse(saved) : null;
  });
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState<boolean>(false);
  const [isEmployeePortalOpen, setIsEmployeePortalOpen] = useState<boolean>(false);

  // Auto-dismiss sync notice after 5 seconds
  useEffect(() => {
    if (!syncNotice) return;
    const t = setTimeout(() => {
      setSyncNotice(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [syncNotice]);

  // Real-time synchronization across devices, browsers, and the server
  useEffect(() => {
    serverSync.connect();
    const unsubState = serverSync.onStateChange((state) => {
      setSyncState(state);
    });

    const unsubEvents = serverSync.onSyncEvent(({ mutation, isRemote }) => {
      if (!isRemote) return;
      const { type, payload } = mutation;
      switch (type) {
        case 'doctor:add':
          if (payload?.id) {
            setDoctors(prev => prev.some(d => d.id === payload.id) ? prev : [
              { ...payload, image: getFixedDoctorImage(payload.id || payload.name, payload.image) },
              ...prev
            ]);
            setSyncNotice(`Dr. ${payload.name || 'Doctor'} added via live sync`);
          }
          break;
        case 'doctor:update':
          if (payload?.id) {
            setDoctors(prev => prev.map(d => d.id === payload.id ? {
              ...d,
              ...payload,
              image: getFixedDoctorImage(d.id || d.name, payload.image ?? d.image)
            } : d));
            setSyncNotice(`Doctor profile "${payload.name || ''}" updated across devices`);
          }
          break;
        case 'doctor:delete':
          if (payload?.id) {
            setDoctors(prev => prev.filter(d => d.id !== payload.id));
          }
          break;
        case 'department:add':
          if (payload?.id) {
            setDepartments(prev => prev.some(dept => dept.id === payload.id) ? prev : [...prev, payload]);
            setSyncNotice(`Department "${payload.name || ''}" added via live sync`);
          }
          break;
        case 'department:update':
          if (payload?.id) {
            setDepartments(prev => prev.map(dept => dept.id === payload.id ? { ...dept, ...payload } : dept));
            setSyncNotice(`Department "${payload.name || ''}" updated across devices`);
          }
          break;
        case 'department:delete':
          if (payload?.id) {
            setDepartments(prev => prev.filter(dept => dept.id !== payload.id));
          }
          break;
        case 'facility:add':
        case 'facility:update':
          if (payload?.id) {
            setFacilities(prev => {
              const exists = prev.some(f => f.id === payload.id);
              return exists ? prev.map(f => f.id === payload.id ? { ...f, ...payload } : f) : [...prev, payload];
            });
          }
          break;
        case 'employee:add':
          if (payload?.id) {
            setEmployees(prev => prev.some(e => e.id === payload.id) ? prev : [payload, ...prev]);
          }
          break;
        case 'employee:update':
          if (payload?.id) {
            setEmployees(prev => prev.map(e => e.id === payload.id ? { ...e, ...payload } : e));
          }
          break;
        case 'employee:delete':
          if (payload?.id) {
            setEmployees(prev => prev.filter(e => e.id !== payload.id));
          }
          break;
        case 'appointment:add':
          if (payload?.id) {
            setAppointments(prev => prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]);
            setSyncNotice(`New appointment #${payload.appointmentNumber || ''} synced from patient device`);
          }
          break;
        case 'appointment:update':
          if (payload?.id) {
            setAppointments(prev => prev.map(a => a.id === payload.id ? { ...a, ...payload } : a));
            setSyncNotice('Appointment update synchronized across devices');
          }
          break;
        case 'appointment:delete':
          if (payload?.id) {
            setAppointments(prev => prev.filter(a => a.id !== payload.id));
          }
          break;
        case 'notice:add':
          if (payload?.id) {
            setNotices(prev => prev.some(n => n.id === payload.id) ? prev : [payload, ...prev]);
            setSyncNotice(`Notice "${payload.title || ''}" synced`);
          }
          break;
        case 'notice:update':
          if (payload?.id) {
            setNotices(prev => prev.map(n => n.id === payload.id ? { ...n, ...payload } : n));
          }
          break;
        case 'notice:delete':
          if (payload?.id) {
            setNotices(prev => prev.filter(n => n.id !== payload.id));
          }
          break;
        case 'event:add':
          if (payload?.id) {
            setEvents(prev => prev.some(e => e.id === payload.id) ? prev : [payload, ...prev]);
          }
          break;
        case 'event:update':
          if (payload?.id) {
            setEvents(prev => prev.map(e => e.id === payload.id ? { ...e, ...payload } : e));
          }
          break;
        case 'event:delete':
          if (payload?.id) {
            setEvents(prev => prev.filter(e => e.id !== payload.id));
          }
          break;
        case 'event:register':
          if (payload?.eventId) {
            setEventRegistrations(prev =>
              payload.id && prev.some(r => r.id === payload.id) ? prev : [payload, ...prev]
            );
            setEvents(prev =>
              prev.map(e =>
                e.id === payload.eventId
                  ? {
                      ...e,
                      registeredCount:
                        typeof payload.registeredCount === 'number'
                          ? payload.registeredCount
                          : e.registeredCount + 1,
                    }
                  : e
              )
            );
          }
          break;
        case 'gallery:add':
          if (payload?.id) {
            setGallery(prev => prev.some(g => g.id === payload.id) ? prev : [payload, ...prev]);
          }
          break;
        case 'gallery:delete':
          if (payload?.id) {
            setGallery(prev => prev.filter(g => g.id !== payload.id));
          }
          break;
        case 'feedback:add':
          if (payload?.id) {
            setFeedbacks(prev => prev.some(f => f.id === payload.id) ? prev : [payload, ...prev]);
            setSyncNotice(`New feedback received from ${payload.patientName || 'patient'}`);
          }
          break;
        case 'feedback:update':
          if (payload?.id) {
            setFeedbacks(prev => prev.map(f => f.id === payload.id ? { ...f, ...payload } : f));
          }
          break;
        case 'feedback:delete':
          if (payload?.id) {
            setFeedbacks(prev => prev.filter(f => f.id !== payload.id));
          }
          break;
        case 'business_settings:update':
          if (payload) {
            setBusinessSettings(prev => ({ ...prev, ...payload }));
            setSyncNotice('Hospital business info updated across devices');
          }
          break;
        case 'logo_settings:update':
          if (payload) setLogoSettings(prev => ({ ...prev, ...payload }));
          break;
        case 'flash_announcement:update':
          if (payload) setFlashAnnouncement(prev => ({ ...prev, ...payload }));
          break;
        case 'slider_settings:update':
          if (Array.isArray(payload)) {
            setSliderSettings(payload);
            setSyncNotice('Hero banners updated across devices');
          }
          break;
        case 'sync:init':
          if (payload) {
            if (Array.isArray(payload.doctors) && payload.doctors.length > 0) {
              setDoctors(payload.doctors.map((d: any) => ({ ...d, image: getFixedDoctorImage(d.id || d.name, d.image) })));
            }
            if (Array.isArray(payload.departments) && payload.departments.length > 0) setDepartments(payload.departments);
            if (Array.isArray(payload.facilities) && payload.facilities.length > 0) setFacilities(payload.facilities);
            if (Array.isArray(payload.employees) && payload.employees.length > 0) setEmployees(payload.employees);
            if (Array.isArray(payload.appointments) && payload.appointments.length > 0) setAppointments(payload.appointments);
            if (Array.isArray(payload.notices) && payload.notices.length > 0) setNotices(payload.notices);
            if (Array.isArray(payload.events) && payload.events.length > 0) setEvents(payload.events);
            if (Array.isArray(payload.eventRegistrations)) setEventRegistrations(payload.eventRegistrations);
            if (Array.isArray(payload.gallery) && payload.gallery.length > 0) setGallery(payload.gallery);
            if (Array.isArray(payload.feedbacks) && payload.feedbacks.length > 0) setFeedbacks(payload.feedbacks);
            if (payload.businessSettings) setBusinessSettings(payload.businessSettings);
            if (payload.logoSettings) setLogoSettings(payload.logoSettings);
            if (payload.flashAnnouncement) setFlashAnnouncement(payload.flashAnnouncement);
            if (Array.isArray(payload.sliderSettings) && payload.sliderSettings.length > 0) {
              setSliderSettings(payload.sliderSettings);
            }
          }
          break;
      }
    });

    async function initialServerHydration() {
      const res = await serverSync.fetchServerData();
      if (res && res.data) {
        const { data } = res;
        const hasData = (data.doctors && data.doctors.length > 0) ||
                        (data.departments && data.departments.length > 0) ||
                        (data.facilities && data.facilities.length > 0) ||
                        (data.appointments && data.appointments.length > 0) ||
                        Boolean(data.businessSettings);

        if (hasData) {
          if (data.doctors && data.doctors.length > 0) {
            setDoctors(data.doctors.map((d: any) => ({ ...d, image: getFixedDoctorImage(d.id || d.name, d.image) })));
          }
          if (data.departments && data.departments.length > 0) setDepartments(data.departments);
          if (data.facilities && data.facilities.length > 0) setFacilities(data.facilities);
          if (data.employees && data.employees.length > 0) setEmployees(data.employees);
          if (data.appointments && data.appointments.length > 0) setAppointments(data.appointments);
          if (data.notices && data.notices.length > 0) setNotices(data.notices);
          if (data.events && data.events.length > 0) setEvents(data.events);
          if (Array.isArray(data.eventRegistrations)) setEventRegistrations(data.eventRegistrations);
          if (data.gallery && data.gallery.length > 0) setGallery(data.gallery);
          if (data.feedbacks && data.feedbacks.length > 0) setFeedbacks(data.feedbacks);
          if (data.businessSettings) setBusinessSettings(data.businessSettings);
          if (data.logoSettings) setLogoSettings(data.logoSettings);
          if (data.flashAnnouncement) setFlashAnnouncement(data.flashAnnouncement);
          if (Array.isArray(data.sliderSettings) && data.sliderSettings.length > 0) {
            setSliderSettings(data.sliderSettings);
          } else {
            // Ensure hero_banners table is seeded if missing on existing server DB
            serverSync.bootstrapServer({ sliderSettings: INITIAL_SLIDER_SETTINGS });
          }
        } else {
          // Bootstrap server SQLite database with initial data
          serverSync.bootstrapServer({
            doctors: INITIAL_DOCTORS,
            employees: INITIAL_EMPLOYEES,
            departments: INITIAL_DEPARTMENTS,
            facilities: INITIAL_FACILITIES,
            gallery: INITIAL_GALLERY,
            notices: INITIAL_NOTICES,
            events: INITIAL_EVENTS,
            eventRegistrations: [],
            feedbacks: INITIAL_FEEDBACK,
            appointments: INITIAL_APPOINTMENTS,
            businessSettings: INITIAL_BUSINESS_SETTINGS,
            logoSettings: INITIAL_LOGO_SETTINGS,
            flashAnnouncement: INITIAL_FLASH_ANNOUNCEMENT,
            sliderSettings: INITIAL_SLIDER_SETTINGS,
          });
        }
      }
    }

    initialServerHydration();

    return () => {
      unsubState();
      unsubEvents();
    };
  }, []);

  const forceSyncWithServer = async () => {
    const res = await serverSync.fetchServerData();
    if (res && res.data) {
      const { data } = res;
      if (data.doctors && data.doctors.length > 0) {
        setDoctors(data.doctors.map((d: any) => ({ ...d, image: getFixedDoctorImage(d.id || d.name, d.image) })));
      }
      if (data.departments && data.departments.length > 0) setDepartments(data.departments);
      if (data.facilities && data.facilities.length > 0) setFacilities(data.facilities);
      if (data.employees && data.employees.length > 0) setEmployees(data.employees);
      if (data.appointments && data.appointments.length > 0) setAppointments(data.appointments);
      if (data.notices && data.notices.length > 0) setNotices(data.notices);
      if (data.events && data.events.length > 0) setEvents(data.events);
      if (Array.isArray(data.eventRegistrations)) setEventRegistrations(data.eventRegistrations);
      if (data.gallery && data.gallery.length > 0) setGallery(data.gallery);
      if (data.feedbacks && data.feedbacks.length > 0) setFeedbacks(data.feedbacks);
      if (data.businessSettings) setBusinessSettings(data.businessSettings);
      if (data.logoSettings) setLogoSettings(data.logoSettings);
      if (data.flashAnnouncement) setFlashAnnouncement(data.flashAnnouncement);
      if (Array.isArray(data.sliderSettings) && data.sliderSettings.length > 0) {
        setSliderSettings(data.sliderSettings);
      }
      setSyncNotice('Full synchronization with server complete');
    }
  };

  // Initial Sync from Supabase
  useEffect(() => {
    async function initSupabaseData() {
      if (!isSupabaseConfigured) {
        setIsSupabaseConnected(false);
        return;
      }

      let isConnected = false;

      try {
        // 1. Doctors
        const supabaseDocs = await fetchDoctorsFromSupabase();
        if (supabaseDocs !== null) {
          isConnected = true;
          if (supabaseDocs.length > 0) {
            setDoctors(supabaseDocs.map(d => ({
              ...d,
              image: getFixedDoctorImage(d.id, d.image)
            })));
          } else {
            for (const d of INITIAL_DOCTORS) {
              await saveDoctorToSupabase(d);
            }
          }
        }

        // 2. Employees
        const supabaseEmps = await fetchEmployeesFromSupabase();
        if (supabaseEmps !== null) {
          isConnected = true;
          if (supabaseEmps.length > 0) {
            setEmployees(supabaseEmps);
          } else {
            for (const e of INITIAL_EMPLOYEES) {
              await saveEmployeeToSupabase(e);
            }
          }
        }

        // 3. Notices
        const supabaseNotices = await fetchNoticesFromSupabase();
        if (supabaseNotices !== null) {
          isConnected = true;
          if (supabaseNotices.length > 0) {
            setNotices(supabaseNotices);
          } else {
            for (const n of INITIAL_NOTICES) {
              await saveNoticeToSupabase(n);
            }
          }
        }

        // 4. Events
        const supabaseEvents = await fetchEventsFromSupabase();
        if (supabaseEvents !== null) {
          isConnected = true;
          if (supabaseEvents.length > 0) {
            setEvents(supabaseEvents);
          } else {
            for (const evt of INITIAL_EVENTS) {
              await saveEventToSupabase(evt);
            }
          }
        }

        // 5. Gallery
        const supabaseGallery = await fetchGalleryFromSupabase();
        if (supabaseGallery !== null) {
          isConnected = true;
          if (supabaseGallery.length > 0) {
            setGallery(supabaseGallery);
          } else {
            for (const g of INITIAL_GALLERY) {
              await saveGalleryItemToSupabase(g);
            }
          }
        }

        // 6. Feedbacks
        const supabaseFeedbacks = await fetchFeedbacksFromSupabase();
        if (supabaseFeedbacks !== null) {
          isConnected = true;
          if (supabaseFeedbacks.length > 0) {
            setFeedbacks(supabaseFeedbacks);
          } else {
            for (const fb of INITIAL_FEEDBACK) {
              await saveFeedbackToSupabase(fb);
            }
          }
        }

        // 7. Appointments
        const supabaseApps = await fetchAppointmentsFromSupabase();
        if (supabaseApps !== null) {
          isConnected = true;
          if (supabaseApps.length > 0) {
            setAppointments(supabaseApps);
          } else {
            for (const app of INITIAL_APPOINTMENTS) {
              await saveAppointmentToSupabase(app);
            }
          }
        }

        // 8. Settings - only if Supabase is connected and responding
        if (isConnected) {
          const sbBiz = await fetchSettingFromSupabase<BusinessSettings>('business_settings');
          if (sbBiz) {
            setBusinessSettings(sbBiz);
          } else {
            await saveSettingToSupabase('business_settings', INITIAL_BUSINESS_SETTINGS);
          }

          const sbLogo = await fetchSettingFromSupabase<LogoSettings>('logo_settings');
          if (sbLogo) {
            setLogoSettings(sbLogo);
          } else {
            await saveSettingToSupabase('logo_settings', INITIAL_LOGO_SETTINGS);
          }

          // Hero Banners (Dynamic)
          const sbSliders = await fetchSettingFromSupabase<SliderSetting[]>('slider_settings');
          if (Array.isArray(sbSliders) && sbSliders.length > 0) {
            setSliderSettings(sbSliders);
          } else {
            await saveSettingToSupabase('slider_settings', INITIAL_SLIDER_SETTINGS);
          }

          const sbFlash = await fetchSettingFromSupabase<FlashAnnouncement>('flash_announcement');
          if (sbFlash) {
            setFlashAnnouncement(sbFlash);
          } else {
            await saveSettingToSupabase('flash_announcement', INITIAL_FLASH_ANNOUNCEMENT);
          }

          // 8. Departments Table
          const supabaseDepts = await fetchDepartmentsFromSupabase();
          if (supabaseDepts !== null && supabaseDepts.length > 0) {
            setDepartments(supabaseDepts);
          } else {
            const sbDepartments = await fetchSettingFromSupabase<Department[]>('departments_list');
            if (Array.isArray(sbDepartments) && sbDepartments.length > 0) {
              setDepartments(sbDepartments);
              for (const dept of sbDepartments) {
                await saveDepartmentToSupabase(dept);
              }
            } else {
              for (const dept of INITIAL_DEPARTMENTS) {
                await saveDepartmentToSupabase(dept);
              }
              await saveSettingToSupabase('departments_list', INITIAL_DEPARTMENTS);
            }
          }

          // 9. Facilities Table
          const supabaseFacs = await fetchFacilitiesFromSupabase();
          if (supabaseFacs !== null && supabaseFacs.length > 0) {
            setFacilities(supabaseFacs);
          } else {
            for (const fac of INITIAL_FACILITIES) {
              await saveFacilityToSupabase(fac);
            }
          }
        }

        setIsSupabaseConnected(isConnected);
      } catch (err) {
        console.warn('Supabase initialization note:', err);
        setIsSupabaseConnected(false);
      }
    }

    initSupabaseData();
  }, []);

  useEffect(() => {
    if (loggedInEmployee) {
      localStorage.setItem('khair_logged_in_employee', JSON.stringify(loggedInEmployee));
    } else {
      localStorage.removeItem('khair_logged_in_employee');
    }
  }, [loggedInEmployee]);

  // Backup sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('khair_doctors_v5', JSON.stringify(doctors));
    } catch (e) {
      console.warn('Failed to save doctors to localStorage:', e);
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_departments_v1', JSON.stringify(departments));
    } catch (e) {
      console.warn('Failed to save departments to localStorage:', e);
    }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_facilities_v1', JSON.stringify(facilities));
    } catch (e) {
      console.warn('Failed to save facilities to localStorage:', e);
    }
  }, [facilities]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_employees', JSON.stringify(employees));
    } catch (e) {
      console.warn('Failed to save employees to localStorage:', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_gallery', JSON.stringify(gallery));
    } catch (e) {
      console.warn('Failed to save gallery to localStorage:', e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_notices', JSON.stringify(notices));
    } catch (e) {
      console.warn('Failed to save notices to localStorage:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_events', JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to localStorage:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_event_registrations_v1', JSON.stringify(eventRegistrations));
    } catch (e) {
      console.warn('Failed to save event registrations to localStorage:', e);
    }
  }, [eventRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_feedbacks', JSON.stringify(feedbacks));
    } catch (e) {
      console.warn('Failed to save feedbacks to localStorage:', e);
    }
  }, [feedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to save appointments to localStorage:', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_business_settings', JSON.stringify(businessSettings));
    } catch (e) {
      console.warn('Failed to save business settings to localStorage:', e);
    }
  }, [businessSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_slider_settings_v6', JSON.stringify(sliderSettings));
    } catch (e) {
      console.warn('Failed to save slider settings to localStorage:', e);
    }
  }, [sliderSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_logo_settings_v3', JSON.stringify(logoSettings));
    } catch (e) {
      console.warn('Failed to save logo settings to localStorage:', e);
    }
  }, [logoSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_flash_announcement', JSON.stringify(flashAnnouncement));
    } catch (e) {
      console.warn('Failed to save flash announcement to localStorage:', e);
    }
  }, [flashAnnouncement]);

  // Business Settings Handler
  const updateBusinessSettings = (settings: Partial<BusinessSettings>) => {
    setBusinessSettings(prev => {
      const updated = { ...prev, ...settings };
      saveSettingToSupabase('business_settings', updated);
      serverSync.sendMutation('business_settings:update', updated);
      return updated;
    });
  };

  // Dynamic Slider Handlers (Configurable by Admin & Synced across devices)
  const syncSliders = (updated: SliderSetting[]) => {
    saveSettingToSupabase('slider_settings', updated);
    serverSync.sendMutation('slider_settings:update', updated);
  };

  const addSlider = (slide: Omit<SliderSetting, 'id'>) => {
    const newSlide: SliderSetting = {
      ...slide,
      id: `slide-${Date.now()}`,
      isActive: slide.isActive ?? true,
    };
    setSliderSettings(prev => {
      const updated = [...prev, newSlide];
      syncSliders(updated);
      return updated;
    });
  };

  const updateSlider = (id: string, slideData: Partial<SliderSetting>) => {
    setSliderSettings(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...slideData } : s));
      syncSliders(updated);
      return updated;
    });
  };

  const deleteSlider = (id: string) => {
    setSliderSettings(prev => {
      const updated = prev.filter(s => s.id !== id);
      syncSliders(updated);
      return updated;
    });
  };

  const toggleSliderStatus = (id: string) => {
    setSliderSettings(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s));
      syncSliders(updated);
      return updated;
    });
  };

  const reorderSliders = (newOrder: SliderSetting[]) => {
    setSliderSettings(newOrder);
    syncSliders(newOrder);
  };

  // Logo Handlers
  const updateLogoSettings = (settings: Partial<LogoSettings>) => {
    setLogoSettings(prev => {
      const updated = { ...prev, ...settings };
      saveSettingToSupabase('logo_settings', updated);
      serverSync.sendMutation('logo_settings:update', updated);
      return updated;
    });
  };

  // Flash Announcement Handler
  const updateFlashAnnouncement = (announcement: Partial<FlashAnnouncement>) => {
    setFlashAnnouncement(prev => {
      const updated = { ...prev, ...announcement, updatedAt: new Date().toISOString() };
      saveSettingToSupabase('flash_announcement', updated);
      serverSync.sendMutation('flash_announcement:update', updated);
      return updated;
    });
  };

  // Doctor CRUD (Dynamic Photo Support)
  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newId = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      ...doc,
      id: newId,
      image: getFixedDoctorImage(newId, doc.image)
    };
    setDoctors(prev => [newDoc, ...prev]);
    saveDoctorToSupabase(newDoc);
    serverSync.sendMutation('doctor:add', newDoc);
  };

  const updateDoctor = (id: string, docData: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === id) {
        const nextImage = docData.image !== undefined ? docData.image : d.image;
        const updated = {
          ...d,
          ...docData,
          image: getFixedDoctorImage(d.id || d.name, nextImage)
        };
        saveDoctorToSupabase(updated);
        serverSync.sendMutation('doctor:update', updated);
        return updated;
      }
      return d;
    }));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    deleteDoctorFromSupabase(id);
    serverSync.sendMutation('doctor:delete', { id });
  };

  // Department CRUD
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = { ...dept, id: `dept-${Date.now()}` };
    setDepartments(prev => {
      const updatedList = [...prev, newDept];
      saveSettingToSupabase('departments_list', updatedList);
      return updatedList;
    });
    saveDepartmentToSupabase(newDept);
    serverSync.sendMutation('department:add', newDept);
  };

  const updateDepartment = (id: string, deptData: Partial<Department>) => {
    setDepartments(prev => {
      let updatedItem: Department | null = null;
      const updatedList = prev.map(d => {
        if (d.id === id) {
          updatedItem = { ...d, ...deptData };
          return updatedItem;
        }
        return d;
      });
      if (updatedItem) {
        saveSettingToSupabase('departments_list', updatedList);
        saveDepartmentToSupabase(updatedItem);
        serverSync.sendMutation('department:update', updatedItem);
      }
      return updatedList;
    });
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => {
      const updatedList = prev.filter(d => d.id !== id);
      saveSettingToSupabase('departments_list', updatedList);
      return updatedList;
    });
    deleteDepartmentFromSupabase(id);
    serverSync.sendMutation('department:delete', { id });
  };

  // Employee CRUD
  const addEmployee = (emp: Omit<Employee, 'id' | 'employeeId'>) => {
    const empCount = employees.length + 1;
    const empIdStr = `KH-EMP-${String(empCount).padStart(3, '0')}`;
    const newEmp: Employee = { ...emp, id: `emp-${Date.now()}`, employeeId: empIdStr };
    setEmployees(prev => [newEmp, ...prev]);
    saveEmployeeToSupabase(newEmp);
    serverSync.sendMutation('employee:add', newEmp);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...empData };
        saveEmployeeToSupabase(updated);
        serverSync.sendMutation('employee:update', updated);
        return updated;
      }
      return e;
    }));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    deleteEmployeeFromSupabase(id);
    serverSync.sendMutation('employee:delete', { id });
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGallery(prev => [newItem, ...prev]);
    saveGalleryItemToSupabase(newItem);
    serverSync.sendMutation('gallery:add', newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteGalleryItemFromSupabase(id);
    serverSync.sendMutation('gallery:delete', { id });
  };

  // Notice CRUD
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const normalizedDocUrl = notice.docUrl || notice.attachmentUrl || '';
    const newNotice: Notice = { ...notice, docUrl: normalizedDocUrl, id: `not-${Date.now()}` };
    setNotices(prev => [newNotice, ...prev]);
    saveNoticeToSupabase(newNotice);
    serverSync.sendMutation('notice:add', newNotice);
  };

  const updateNotice = (id: string, noticeData: Partial<Notice>) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const normalizedDocUrl = noticeData.docUrl ?? noticeData.attachmentUrl ?? n.docUrl ?? n.attachmentUrl ?? '';
        const updated = { ...n, ...noticeData, docUrl: normalizedDocUrl };
        saveNoticeToSupabase(updated);
        serverSync.sendMutation('notice:update', updated);
        return updated;
      }
      return n;
    }));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    deleteNoticeFromSupabase(id);
    serverSync.sendMutation('notice:delete', { id });
  };

  // Event CRUD
  const addEvent = (evt: Omit<EventItem, 'id' | 'registeredCount'>) => {
    const newEvt: EventItem = { ...evt, id: `evt-${Date.now()}`, registeredCount: 0 };
    setEvents(prev => [newEvt, ...prev]);
    saveEventToSupabase(newEvt);
    serverSync.sendMutation('event:add', newEvt);
  };

  const updateEvent = (id: string, evtData: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...evtData };
        saveEventToSupabase(updated);
        serverSync.sendMutation('event:update', updated);
        return updated;
      }
      return e;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    deleteEventFromSupabase(id);
    serverSync.sendMutation('event:delete', { id });
  };

  const registerForEvent = (
    eventId: string,
    details?: { attendeeName?: string; attendeePhone?: string; attendeeEmail?: string }
  ) => {
    const reg: EventRegistration = {
      id: `ereg-${Date.now()}`,
      eventId,
      attendeeName: details?.attendeeName?.trim() || 'Patient / Visitor',
      attendeePhone: details?.attendeePhone?.trim() || '',
      attendeeEmail: details?.attendeeEmail?.trim() || '',
      registeredAt: new Date().toISOString(),
    };

    setEventRegistrations(prev => [reg, ...prev]);

    let nextCount: number | undefined;
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        nextCount = e.registeredCount + 1;
        const updated = { ...e, registeredCount: nextCount };
        saveEventToSupabase(updated);
        return updated;
      }
      return e;
    }));

    saveEventRegistrationToSupabase(reg);
    serverSync.sendMutation('event:register', {
      ...reg,
      ...(typeof nextCount === 'number' ? { registeredCount: nextCount } : {}),
    });
  };

  // Feedback CRUD
  const addFeedback = (fb: Omit<FeedbackItem, 'id' | 'date' | 'status'>) => {
    const today = formatLocalDateISO(new Date());
    const newFb: FeedbackItem = { ...fb, id: `fb-${Date.now()}`, date: today, status: 'Pending' };
    setFeedbacks(prev => [newFb, ...prev]);
    saveFeedbackToSupabase(newFb);
    serverSync.sendMutation('feedback:add', newFb);
  };

  const updateFeedbackStatus = (id: string, status: FeedbackItem['status'], adminNotes?: string) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, status, ...(adminNotes !== undefined ? { adminNotes } : {}) };
        saveFeedbackToSupabase(updated);
        serverSync.sendMutation('feedback:update', updated);
        return updated;
      }
      return f;
    }));
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    deleteFeedbackFromSupabase(id);
    serverSync.sendMutation('feedback:delete', { id });
  };

  // Appointment CRUD
  const addAppointment = (appData: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'status'>): Appointment => {
    const dateStr = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 8);
    const count = appointments.length + 1;
    const appNum = `KH-${dateStr}-${String(count).padStart(2, '0')}`;
    const newApp: Appointment = {
      ...appData,
      id: `app-${Date.now()}`,
      appointmentNumber: appNum,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApp, ...prev]);
    saveAppointmentToSupabase(newApp);
    serverSync.sendMutation('appointment:add', newApp);
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, status };
        saveAppointmentToSupabase(updated);
        serverSync.sendMutation('appointment:update', updated);
        return updated;
      }
      return a;
    }));
  };

  const updateAppointment = (id: string, appData: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...appData };
        saveAppointmentToSupabase(updated);
        serverSync.sendMutation('appointment:update', updated);
        return updated;
      }
      return a;
    }));
  };

  const addCommunicationLog = (appointmentId: string, channel: 'WhatsApp' | 'SMS' | 'Call' | 'Note', message: string) => {
    const logId = `log-${Date.now()}`;
    const sentAt = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const empName = loggedInEmployee ? loggedInEmployee.name : 'OPD Receptionist';

    setAppointments(prev => prev.map(app => {
      if (app.id === appointmentId) {
        const existingLogs = app.communicationLogs || [];
        const updated = {
          ...app,
          communicationLogs: [{ id: logId, sentByEmployeeName: empName, sentAt, channel, message }, ...existingLogs]
        };
        saveAppointmentToSupabase(updated);
        serverSync.sendMutation('appointment:update', updated);
        return updated;
      }
      return app;
    }));
  };

  // Employee Auth
  const loginEmployee = (empIdOrEmail: string, pass: string): { success: boolean; message: string } => {
    const trimmedInput = empIdOrEmail.trim().toLowerCase();
    const trimmedPass = pass.trim();

    const emp = employees.find(e =>
      e.employeeId.toLowerCase() === trimmedInput ||
      e.email.toLowerCase() === trimmedInput ||
      e.phone.replace(/\s+/g, '') === trimmedInput
    );

    if (!emp) {
      return { success: false, message: 'Employee ID or Email not found in hospital directory.' };
    }

    if (emp.status !== 'Active') {
      return { success: false, message: 'This employee account is currently inactive or on leave.' };
    }

    const expectedPass = emp.password || 'khair123';
    if (trimmedPass !== expectedPass) {
      return { success: false, message: 'Incorrect password. Default demo password is "khair123".' };
    }

    setLoggedInEmployee(emp);
    setIsEmployeeModalOpen(false);
    setIsEmployeePortalOpen(true);
    return { success: true, message: `Welcome back, ${emp.name}!` };
  };

  const logoutEmployee = () => {
    setLoggedInEmployee(null);
    setIsEmployeePortalOpen(false);
  };

  return (
    <HospitalContext.Provider
      value={{
        doctors, employees, departments, facilities, gallery, notices, events, eventRegistrations, feedbacks, appointments,
        isSupabaseConnected,
        syncState, forceSyncWithServer, syncNotice, clearSyncNotice,
        businessSettings, updateBusinessSettings,
        sliderSettings, isBannerEditingInactive: false, addSlider, updateSlider, deleteSlider, toggleSliderStatus, reorderSliders,
        logoSettings, updateLogoSettings,
        flashAnnouncement, updateFlashAnnouncement,
        isFlashModalOpen, setIsFlashModalOpen,
        addDoctor, updateDoctor, deleteDoctor, isDoctorPhotoEditingInactive: false,
        addDepartment, updateDepartment, deleteDepartment,
        addEmployee, updateEmployee, deleteEmployee,
        addGalleryItem, deleteGalleryItem,
        addNotice, updateNotice, deleteNotice,
        addEvent, updateEvent, deleteEvent, registerForEvent,
        addFeedback, updateFeedbackStatus, deleteFeedback,
        addAppointment, updateAppointmentStatus, updateAppointment, addCommunicationLog,
        loggedInEmployee, loginEmployee, logoutEmployee,
        isEmployeeModalOpen, setIsEmployeeModalOpen,
        isEmployeePortalOpen, setIsEmployeePortalOpen,
        currentTab, setCurrentTab,
        isAdminMode: isAdminModeState, setIsAdminMode,
        isAdminAuthenticated, isAdminLoginModalOpen, setIsAdminLoginModalOpen, adminLogin, adminLogout,
        adminTab, setAdminTab,
        selectedDoctorForBooking, setSelectedDoctorForBooking,
        isAppointmentModalOpen, setIsAppointmentModalOpen
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
