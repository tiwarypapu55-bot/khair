import { hospitalDb, HospitalServerData } from "./serverDb";

export type { HospitalServerData };

export interface SyncMutation {
  id?: string;
  type: string;
  payload: any;
  clientId?: string;
  timestamp?: string;
}

class ServerStore {
  private data: HospitalServerData;
  private version: number = 1;
  private lastUpdated: string = new Date().toISOString();

  constructor() {
    this.data = hospitalDb.loadAllData();
    const meta = hospitalDb.getSetting<{ version?: number; lastUpdated?: string }>("__sync_meta");
    if (meta) {
      this.version = Number(meta.version) || 1;
      this.lastUpdated = meta.lastUpdated || new Date().toISOString();
    }
    console.log(
      `[ServerStore] SQLite database initialized (v${this.version}, tables: ${Object.keys(hospitalDb.getTableStats()).length})`
    );
  }

  private persistMeta() {
    hospitalDb.upsertSetting("__sync_meta", {
      version: this.version,
      lastUpdated: this.lastUpdated,
    });
  }

  public getData(): HospitalServerData {
    return this.data;
  }

  public getVersion(): number {
    return this.version;
  }

  public getLastUpdated(): string {
    return this.lastUpdated;
  }

  public getTableStats(): Record<string, number> {
    return hospitalDb.getTableStats();
  }

  public isPopulated(): boolean {
    return (
      (this.data.doctors && this.data.doctors.length > 0) ||
      (this.data.departments && this.data.departments.length > 0) ||
      (this.data.facilities && this.data.facilities.length > 0) ||
      (this.data.appointments && this.data.appointments.length > 0) ||
      Boolean(this.data.businessSettings)
    );
  }

  public bootstrap(initialData: Partial<HospitalServerData>): boolean {
    let modified = false;
    const seedPatch: Partial<HospitalServerData> = {};

    for (const key of Object.keys(initialData) as Array<keyof HospitalServerData>) {
      const currentVal = this.data[key];
      const newVal = initialData[key];

      if (Array.isArray(newVal)) {
        if (!Array.isArray(currentVal) || currentVal.length === 0) {
          (this.data as any)[key] = [...newVal];
          (seedPatch as any)[key] = [...newVal];
          modified = true;
        }
      } else if (newVal && typeof newVal === "object") {
        if (!currentVal) {
          (this.data as any)[key] = { ...newVal };
          (seedPatch as any)[key] = { ...newVal };
          modified = true;
        }
      }
    }

    if (modified) {
      hospitalDb.replaceAllData(seedPatch);
      this.data = hospitalDb.loadAllData();
      this.version++;
      this.lastUpdated = new Date().toISOString();
      this.persistMeta();
      console.log(`[ServerStore] Bootstrapped SQLite tables with initial data (v${this.version})`);
    }

    return modified;
  }

  public applyMutation(mutation: SyncMutation): { success: boolean; version: number } {
    const { type, payload } = mutation;
    let modified = false;

    switch (type) {
      // Doctors
      case "doctor:add":
        if (payload && payload.id) {
          const exists = this.data.doctors.some((d) => d.id === payload.id);
          if (!exists) {
            hospitalDb.upsertDoctor(payload);
            this.data.doctors = [payload, ...this.data.doctors];
            modified = true;
          }
        }
        break;

      case "doctor:update":
        if (payload && payload.id) {
          const existing = this.data.doctors.find((d) => d.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertDoctor(merged);
          this.data.doctors = existing
            ? this.data.doctors.map((d) => (d.id === payload.id ? merged : d))
            : [merged, ...this.data.doctors];
          modified = true;
        }
        break;

      case "doctor:delete":
        if (payload && payload.id) {
          hospitalDb.deleteDoctor(payload.id);
          this.data.doctors = this.data.doctors.filter((d) => d.id !== payload.id);
          modified = true;
        }
        break;

      // Departments
      case "department:add":
        if (payload && payload.id) {
          const exists = this.data.departments.some((dept) => dept.id === payload.id);
          if (!exists) {
            hospitalDb.upsertDepartment(payload);
            this.data.departments = [...this.data.departments, payload];
            modified = true;
          }
        }
        break;

      case "department:update":
        if (payload && payload.id) {
          const existing = this.data.departments.find((dept) => dept.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertDepartment(merged);
          this.data.departments = existing
            ? this.data.departments.map((dept) => (dept.id === payload.id ? merged : dept))
            : [...this.data.departments, merged];
          modified = true;
        }
        break;

      case "department:delete":
        if (payload && payload.id) {
          hospitalDb.deleteDepartment(payload.id);
          this.data.departments = this.data.departments.filter((dept) => dept.id !== payload.id);
          modified = true;
        }
        break;

      // Facilities
      case "facility:add":
      case "facility:update":
        if (payload && payload.id) {
          const existing = this.data.facilities.find((f) => f.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertFacility(merged);
          this.data.facilities = existing
            ? this.data.facilities.map((f) => (f.id === payload.id ? merged : f))
            : [...this.data.facilities, merged];
          modified = true;
        }
        break;

      // Employees
      case "employee:add":
        if (payload && payload.id) {
          const exists = this.data.employees.some((e) => e.id === payload.id);
          if (!exists) {
            hospitalDb.upsertEmployee(payload);
            this.data.employees = [payload, ...this.data.employees];
            modified = true;
          }
        }
        break;

      case "employee:update":
        if (payload && payload.id) {
          const existing = this.data.employees.find((e) => e.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertEmployee(merged);
          this.data.employees = existing
            ? this.data.employees.map((e) => (e.id === payload.id ? merged : e))
            : [merged, ...this.data.employees];
          modified = true;
        }
        break;

      case "employee:delete":
        if (payload && payload.id) {
          hospitalDb.deleteEmployee(payload.id);
          this.data.employees = this.data.employees.filter((e) => e.id !== payload.id);
          modified = true;
        }
        break;

      // Appointments
      case "appointment:add":
        if (payload && payload.id) {
          const exists = this.data.appointments.some((a) => a.id === payload.id);
          if (!exists) {
            hospitalDb.upsertAppointment(payload);
            this.data.appointments = [payload, ...this.data.appointments];
            modified = true;
          }
        }
        break;

      case "appointment:update":
        if (payload && payload.id) {
          const existing = this.data.appointments.find((a) => a.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertAppointment(merged);
          this.data.appointments = existing
            ? this.data.appointments.map((a) => (a.id === payload.id ? merged : a))
            : [merged, ...this.data.appointments];
          modified = true;
        }
        break;

      case "appointment:delete":
        if (payload && payload.id) {
          hospitalDb.deleteAppointment(payload.id);
          this.data.appointments = this.data.appointments.filter((a) => a.id !== payload.id);
          modified = true;
        }
        break;

      // Notices
      case "notice:add":
        if (payload && payload.id) {
          const exists = this.data.notices.some((n) => n.id === payload.id);
          if (!exists) {
            hospitalDb.upsertNotice(payload);
            this.data.notices = [payload, ...this.data.notices];
            modified = true;
          }
        }
        break;

      case "notice:update":
        if (payload && payload.id) {
          const existing = this.data.notices.find((n) => n.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertNotice(merged);
          this.data.notices = existing
            ? this.data.notices.map((n) => (n.id === payload.id ? merged : n))
            : [merged, ...this.data.notices];
          modified = true;
        }
        break;

      case "notice:delete":
        if (payload && payload.id) {
          hospitalDb.deleteNotice(payload.id);
          this.data.notices = this.data.notices.filter((n) => n.id !== payload.id);
          modified = true;
        }
        break;

      // Events & Event Registrations
      case "event:add":
        if (payload && payload.id) {
          const exists = this.data.events.some((e) => e.id === payload.id);
          if (!exists) {
            hospitalDb.upsertEvent(payload);
            this.data.events = [payload, ...this.data.events];
            modified = true;
          }
        }
        break;

      case "event:update":
        if (payload && payload.id) {
          const existing = this.data.events.find((e) => e.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertEvent(merged);
          this.data.events = existing
            ? this.data.events.map((e) => (e.id === payload.id ? merged : e))
            : [merged, ...this.data.events];
          modified = true;
        }
        break;

      case "event:delete":
        if (payload && payload.id) {
          hospitalDb.deleteEvent(payload.id);
          this.data.events = this.data.events.filter((e) => e.id !== payload.id);
          modified = true;
        }
        break;

      case "event:register":
        if (payload && payload.eventId) {
          hospitalDb.insertEventRegistration(payload);
          this.data.eventRegistrations = [payload, ...this.data.eventRegistrations];
          this.data.events = this.data.events.map((e) =>
            e.id === payload.eventId
              ? {
                  ...e,
                  registeredCount:
                    typeof payload.registeredCount === "number"
                      ? payload.registeredCount
                      : (Number(e.registeredCount) || 0) + 1,
                }
              : e
          );
          modified = true;
        }
        break;

      // Gallery
      case "gallery:add":
        if (payload && payload.id) {
          const exists = this.data.gallery.some((g) => g.id === payload.id);
          if (!exists) {
            hospitalDb.upsertGalleryItem(payload);
            this.data.gallery = [payload, ...this.data.gallery];
            modified = true;
          }
        }
        break;

      case "gallery:delete":
        if (payload && payload.id) {
          hospitalDb.deleteGalleryItem(payload.id);
          this.data.gallery = this.data.gallery.filter((g) => g.id !== payload.id);
          modified = true;
        }
        break;

      // Feedbacks
      case "feedback:add":
        if (payload && payload.id) {
          const exists = this.data.feedbacks.some((f) => f.id === payload.id);
          if (!exists) {
            hospitalDb.upsertFeedback(payload);
            this.data.feedbacks = [payload, ...this.data.feedbacks];
            modified = true;
          }
        }
        break;

      case "feedback:update":
        if (payload && payload.id) {
          const existing = this.data.feedbacks.find((f) => f.id === payload.id);
          const merged = existing ? { ...existing, ...payload } : payload;
          hospitalDb.upsertFeedback(merged);
          this.data.feedbacks = existing
            ? this.data.feedbacks.map((f) => (f.id === payload.id ? merged : f))
            : [merged, ...this.data.feedbacks];
          modified = true;
        }
        break;

      case "feedback:delete":
        if (payload && payload.id) {
          hospitalDb.deleteFeedback(payload.id);
          this.data.feedbacks = this.data.feedbacks.filter((f) => f.id !== payload.id);
          modified = true;
        }
        break;

      // Settings
      case "business_settings:update":
        this.data.businessSettings = {
          ...(this.data.businessSettings || {}),
          ...payload,
        };
        hospitalDb.upsertSetting("business_settings", this.data.businessSettings);
        modified = true;
        break;

      case "logo_settings:update":
        this.data.logoSettings = {
          ...(this.data.logoSettings || {}),
          ...payload,
        };
        hospitalDb.upsertSetting("logo_settings", this.data.logoSettings);
        modified = true;
        break;

      case "flash_announcement:update":
        this.data.flashAnnouncement = {
          ...(this.data.flashAnnouncement || {}),
          ...payload,
        };
        hospitalDb.upsertSetting("flash_announcement", this.data.flashAnnouncement);
        modified = true;
        break;

      case "full:replace":
        if (payload && typeof payload === "object") {
          hospitalDb.replaceAllData(payload);
          this.data = hospitalDb.loadAllData();
          modified = true;
        }
        break;

      default:
        console.warn(`[ServerStore] Unknown mutation type: ${type}`);
    }

    if (modified) {
      this.version++;
      this.lastUpdated = new Date().toISOString();
      this.persistMeta();
    }

    return { success: modified, version: this.version };
  }
}

export const serverStore = new ServerStore();

