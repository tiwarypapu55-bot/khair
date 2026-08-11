import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor, Employee, Department, Facility, GalleryItem, Notice,
  EventItem, FeedbackItem, Appointment, BusinessSettings, SliderSetting, LogoSettings, FlashAnnouncement
} from '../types';
import {
  INITIAL_DOCTORS, INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS,
  INITIAL_FACILITIES, INITIAL_GALLERY, INITIAL_NOTICES,
  INITIAL_EVENTS, INITIAL_FEEDBACK, INITIAL_APPOINTMENTS,
  INITIAL_BUSINESS_SETTINGS, INITIAL_SLIDER_SETTINGS, INITIAL_LOGO_SETTINGS, INITIAL_FLASH_ANNOUNCEMENT
} from '../data/initialData';
import {
  fetchDoctorsFromSupabase, saveDoctorToSupabase, deleteDoctorFromSupabase,
  fetchEmployeesFromSupabase, saveEmployeeToSupabase, deleteEmployeeFromSupabase,
  fetchNoticesFromSupabase, saveNoticeToSupabase, deleteNoticeFromSupabase,
  fetchEventsFromSupabase, saveEventToSupabase, deleteEventFromSupabase,
  fetchGalleryFromSupabase, saveGalleryItemToSupabase, deleteGalleryItemFromSupabase,
  fetchFeedbacksFromSupabase, saveFeedbackToSupabase, deleteFeedbackFromSupabase,
  fetchAppointmentsFromSupabase, saveAppointmentToSupabase,
  fetchSettingFromSupabase, saveSettingToSupabase
} from '../lib/supabaseSync';

export type AdminTabType = 'home' | 'doctor-list' | 'employee' | 'gallery' | 'notice' | 'events' | 'feedback' | 'settings';

interface HospitalContextType {
  doctors: Doctor[];
  employees: Employee[];
  departments: Department[];
  facilities: Facility[];
  gallery: GalleryItem[];
  notices: Notice[];
  events: EventItem[];
  feedbacks: FeedbackItem[];
  appointments: Appointment[];
  isSupabaseConnected: boolean;

  // Settings
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  sliderSettings: SliderSetting[];
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

  // Doctor CRUD
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

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
  registerForEvent: (eventId: string) => void;

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

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('khair_doctors_v4');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('khair_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);

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
        return {
          ...INITIAL_BUSINESS_SETTINGS,
          ...parsed,
          googleMapsUrl: parsed.googleMapsUrl || INITIAL_BUSINESS_SETTINGS.googleMapsUrl
        };
      } catch (e) {
        console.warn('Failed to parse business settings:', e);
      }
    }
    return INITIAL_BUSINESS_SETTINGS;
  });

  const [sliderSettings, setSliderSettings] = useState<SliderSetting[]>(() => {
    const saved = localStorage.getItem('khair_slider_settings_v4') || localStorage.getItem('khair_slider_settings');
    return saved ? JSON.parse(saved) : INITIAL_SLIDER_SETTINGS;
  });

  const [logoSettings, setLogoSettings] = useState<LogoSettings>(() => {
    const saved = localStorage.getItem('khair_logo_settings_v2') || localStorage.getItem('khair_logo_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_LOGO_SETTINGS,
          ...parsed,
          headerLogoUrl: parsed.headerLogoUrl || INITIAL_LOGO_SETTINGS.headerLogoUrl,
          footerLogoUrl: parsed.footerLogoUrl || INITIAL_LOGO_SETTINGS.footerLogoUrl
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
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
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

  // Initial Sync from Supabase
  useEffect(() => {
    async function initSupabaseData() {
      // 1. Doctors
      const supabaseDocs = await fetchDoctorsFromSupabase();
      if (supabaseDocs && supabaseDocs.length > 0) {
        setDoctors(supabaseDocs);
        setIsSupabaseConnected(true);
      } else if (supabaseDocs && supabaseDocs.length === 0) {
        // Seed initial doctors
        setIsSupabaseConnected(true);
        for (const d of INITIAL_DOCTORS) {
          await saveDoctorToSupabase(d);
        }
      }

      // 2. Employees
      const supabaseEmps = await fetchEmployeesFromSupabase();
      if (supabaseEmps && supabaseEmps.length > 0) {
        setEmployees(supabaseEmps);
      } else if (supabaseEmps && supabaseEmps.length === 0) {
        for (const e of INITIAL_EMPLOYEES) {
          await saveEmployeeToSupabase(e);
        }
      }

      // 3. Notices
      const supabaseNotices = await fetchNoticesFromSupabase();
      if (supabaseNotices && supabaseNotices.length > 0) {
        setNotices(supabaseNotices);
      } else if (supabaseNotices && supabaseNotices.length === 0) {
        for (const n of INITIAL_NOTICES) {
          await saveNoticeToSupabase(n);
        }
      }

      // 4. Events
      const supabaseEvents = await fetchEventsFromSupabase();
      if (supabaseEvents && supabaseEvents.length > 0) {
        setEvents(supabaseEvents);
      } else if (supabaseEvents && supabaseEvents.length === 0) {
        for (const evt of INITIAL_EVENTS) {
          await saveEventToSupabase(evt);
        }
      }

      // 5. Gallery
      const supabaseGallery = await fetchGalleryFromSupabase();
      if (supabaseGallery && supabaseGallery.length > 0) {
        setGallery(supabaseGallery);
      } else if (supabaseGallery && supabaseGallery.length === 0) {
        for (const g of INITIAL_GALLERY) {
          await saveGalleryItemToSupabase(g);
        }
      }

      // 6. Feedbacks
      const supabaseFeedbacks = await fetchFeedbacksFromSupabase();
      if (supabaseFeedbacks && supabaseFeedbacks.length > 0) {
        setFeedbacks(supabaseFeedbacks);
      } else if (supabaseFeedbacks && supabaseFeedbacks.length === 0) {
        for (const fb of INITIAL_FEEDBACK) {
          await saveFeedbackToSupabase(fb);
        }
      }

      // 7. Appointments
      const supabaseApps = await fetchAppointmentsFromSupabase();
      if (supabaseApps && supabaseApps.length > 0) {
        setAppointments(supabaseApps);
      } else if (supabaseApps && supabaseApps.length === 0) {
        for (const app of INITIAL_APPOINTMENTS) {
          await saveAppointmentToSupabase(app);
        }
      }

      // 8. Settings
      const sbBiz = await fetchSettingFromSupabase<BusinessSettings>('business_settings');
      if (sbBiz) setBusinessSettings(sbBiz);
      else await saveSettingToSupabase('business_settings', INITIAL_BUSINESS_SETTINGS);

      const sbLogo = await fetchSettingFromSupabase<LogoSettings>('logo_settings');
      if (sbLogo) setLogoSettings(sbLogo);
      else await saveSettingToSupabase('logo_settings', INITIAL_LOGO_SETTINGS);

      const sbSliders = await fetchSettingFromSupabase<SliderSetting[]>('slider_settings');
      if (sbSliders) setSliderSettings(sbSliders);
      else await saveSettingToSupabase('slider_settings', INITIAL_SLIDER_SETTINGS);

      const sbFlash = await fetchSettingFromSupabase<FlashAnnouncement>('flash_announcement');
      if (sbFlash) setFlashAnnouncement(sbFlash);
      else await saveSettingToSupabase('flash_announcement', INITIAL_FLASH_ANNOUNCEMENT);
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
      localStorage.setItem('khair_doctors_v4', JSON.stringify(doctors));
    } catch (e) {
      console.warn('Failed to save doctors to localStorage:', e);
    }
  }, [doctors]);

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
      localStorage.setItem('khair_slider_settings_v4', JSON.stringify(sliderSettings));
    } catch (e) {
      console.warn('Failed to save slider settings to localStorage:', e);
    }
  }, [sliderSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('khair_logo_settings_v2', JSON.stringify(logoSettings));
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
      return updated;
    });
  };

  // Slider Handlers
  const addSlider = (slide: Omit<SliderSetting, 'id'>) => {
    const newSlide: SliderSetting = { ...slide, id: `slide-${Date.now()}` };
    setSliderSettings(prev => {
      const updated = [...prev, newSlide];
      saveSettingToSupabase('slider_settings', updated);
      return updated;
    });
  };

  const updateSlider = (id: string, slideData: Partial<SliderSetting>) => {
    setSliderSettings(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...slideData } : s);
      saveSettingToSupabase('slider_settings', updated);
      return updated;
    });
  };

  const deleteSlider = (id: string) => {
    setSliderSettings(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSettingToSupabase('slider_settings', updated);
      return updated;
    });
  };

  const toggleSliderStatus = (id: string) => {
    setSliderSettings(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
      saveSettingToSupabase('slider_settings', updated);
      return updated;
    });
  };

  const reorderSliders = (newOrder: SliderSetting[]) => {
    setSliderSettings(newOrder);
    saveSettingToSupabase('slider_settings', newOrder);
  };

  // Logo Handlers
  const updateLogoSettings = (settings: Partial<LogoSettings>) => {
    setLogoSettings(prev => {
      const updated = { ...prev, ...settings };
      saveSettingToSupabase('logo_settings', updated);
      return updated;
    });
  };

  // Flash Announcement Handler
  const updateFlashAnnouncement = (announcement: Partial<FlashAnnouncement>) => {
    setFlashAnnouncement(prev => {
      const updated = { ...prev, ...announcement, updatedAt: new Date().toISOString() };
      saveSettingToSupabase('flash_announcement', updated);
      return updated;
    });
  };

  // Doctor CRUD
  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = { ...doc, id: `doc-${Date.now()}` };
    setDoctors(prev => [newDoc, ...prev]);
    saveDoctorToSupabase(newDoc);
  };

  const updateDoctor = (id: string, docData: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, ...docData };
        saveDoctorToSupabase(updated);
        return updated;
      }
      return d;
    }));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    deleteDoctorFromSupabase(id);
  };

  // Employee CRUD
  const addEmployee = (emp: Omit<Employee, 'id' | 'employeeId'>) => {
    const empCount = employees.length + 1;
    const empIdStr = `KH-EMP-${String(empCount).padStart(3, '0')}`;
    const newEmp: Employee = { ...emp, id: `emp-${Date.now()}`, employeeId: empIdStr };
    setEmployees(prev => [newEmp, ...prev]);
    saveEmployeeToSupabase(newEmp);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...empData };
        saveEmployeeToSupabase(updated);
        return updated;
      }
      return e;
    }));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    deleteEmployeeFromSupabase(id);
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGallery(prev => [newItem, ...prev]);
    saveGalleryItemToSupabase(newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteGalleryItemFromSupabase(id);
  };

  // Notice CRUD
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = { ...notice, id: `not-${Date.now()}` };
    setNotices(prev => [newNotice, ...prev]);
    saveNoticeToSupabase(newNotice);
  };

  const updateNotice = (id: string, noticeData: Partial<Notice>) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const updated = { ...n, ...noticeData };
        saveNoticeToSupabase(updated);
        return updated;
      }
      return n;
    }));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    deleteNoticeFromSupabase(id);
  };

  // Event CRUD
  const addEvent = (evt: Omit<EventItem, 'id' | 'registeredCount'>) => {
    const newEvt: EventItem = { ...evt, id: `evt-${Date.now()}`, registeredCount: 0 };
    setEvents(prev => [newEvt, ...prev]);
    saveEventToSupabase(newEvt);
  };

  const updateEvent = (id: string, evtData: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...evtData };
        saveEventToSupabase(updated);
        return updated;
      }
      return e;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    deleteEventFromSupabase(id);
  };

  const registerForEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const updated = { ...e, registeredCount: e.registeredCount + 1 };
        saveEventToSupabase(updated);
        return updated;
      }
      return e;
    }));
  };

  // Feedback CRUD
  const addFeedback = (fb: Omit<FeedbackItem, 'id' | 'date' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newFb: FeedbackItem = { ...fb, id: `fb-${Date.now()}`, date: today, status: 'Pending' };
    setFeedbacks(prev => [newFb, ...prev]);
    saveFeedbackToSupabase(newFb);
  };

  const updateFeedbackStatus = (id: string, status: FeedbackItem['status'], adminNotes?: string) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, status, ...(adminNotes !== undefined ? { adminNotes } : {}) };
        saveFeedbackToSupabase(updated);
        return updated;
      }
      return f;
    }));
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    deleteFeedbackFromSupabase(id);
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
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, status };
        saveAppointmentToSupabase(updated);
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
        doctors, employees, departments, facilities, gallery, notices, events, feedbacks, appointments,
        isSupabaseConnected,
        businessSettings, updateBusinessSettings,
        sliderSettings, addSlider, updateSlider, deleteSlider, toggleSliderStatus, reorderSliders,
        logoSettings, updateLogoSettings,
        flashAnnouncement, updateFlashAnnouncement,
        isFlashModalOpen, setIsFlashModalOpen,
        addDoctor, updateDoctor, deleteDoctor,
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
        isAdminMode, setIsAdminMode,
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
