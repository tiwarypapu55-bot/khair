import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "server-data");
const DB_FILE = path.join(DATA_DIR, "khair_hospital.db");
const LEGACY_JSON_FILE = path.join(DATA_DIR, "hospital-db.json");

export interface HospitalServerData {
  doctors: any[];
  employees: any[];
  departments: any[];
  facilities: any[];
  gallery: any[];
  notices: any[];
  events: any[];
  eventRegistrations: any[];
  feedbacks: any[];
  appointments: any[];
  businessSettings: any;
  logoSettings: any;
  flashAnnouncement: any;
}

class HospitalSQLiteDatabase {
  private db: DatabaseSync;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    this.db = new DatabaseSync(DB_FILE);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.createTables();
    this.migrateLegacyJsonIfNeeded();
  }

  private createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        qualification TEXT DEFAULT '',
        department TEXT NOT NULL,
        specialization TEXT DEFAULT '',
        experience TEXT DEFAULT '',
        image TEXT DEFAULT '',
        opd_schedule TEXT DEFAULT '',
        fee REAL DEFAULT 0,
        phone TEXT DEFAULT '',
        status TEXT DEFAULT 'Active',
        bio TEXT DEFAULT '',
        room_no TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon_name TEXT DEFAULT 'Stethoscope',
        description TEXT DEFAULT '',
        head_of_department TEXT DEFAULT '',
        bed_capacity INTEGER DEFAULT 15,
        phone_ext TEXT DEFAULT '',
        common_treatments TEXT DEFAULT '[]',
        image TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS facilities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT DEFAULT '',
        description TEXT DEFAULT '',
        availability TEXT DEFAULT '',
        image TEXT DEFAULT '',
        features TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        employee_id TEXT UNIQUE,
        name TEXT NOT NULL,
        designation TEXT DEFAULT '',
        department TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        join_date TEXT DEFAULT '',
        shift TEXT DEFAULT 'General',
        status TEXT DEFAULT 'Active',
        password TEXT DEFAULT 'khair123',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        appointment_number TEXT UNIQUE,
        patient_name TEXT NOT NULL,
        age INTEGER DEFAULT 30,
        gender TEXT DEFAULT 'Male',
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        department TEXT DEFAULT '',
        doctor_id TEXT DEFAULT '',
        doctor_name TEXT DEFAULT '',
        date TEXT DEFAULT '',
        time_slot TEXT DEFAULT '',
        status TEXT DEFAULT 'Confirmed',
        symptoms TEXT DEFAULT '',
        communication_logs TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS appointment_communication_logs (
        id TEXT PRIMARY KEY,
        appointment_id TEXT NOT NULL,
        sent_by_employee_name TEXT DEFAULT '',
        sent_at TEXT DEFAULT '',
        channel TEXT DEFAULT 'Note',
        message TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        date TEXT DEFAULT '',
        content TEXT DEFAULT '',
        is_pinned INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'Normal',
        target_audience TEXT DEFAULT 'All Patients & Visitors',
        doc_url TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT DEFAULT '',
        location TEXT DEFAULT '',
        description TEXT DEFAULT '',
        organizer TEXT DEFAULT '',
        max_seats INTEGER DEFAULT 100,
        registered_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Upcoming',
        image_url TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS event_registrations (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        attendee_name TEXT DEFAULT 'Patient / Visitor',
        attendee_phone TEXT DEFAULT '',
        attendee_email TEXT DEFAULT '',
        registered_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'Facilities',
        image_url TEXT DEFAULT '',
        caption TEXT DEFAULT '',
        date TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS feedbacks (
        id TEXT PRIMARY KEY,
        patient_name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        department TEXT DEFAULT '',
        rating INTEGER DEFAULT 5,
        message TEXT DEFAULT '',
        date TEXT DEFAULT '',
        status TEXT DEFAULT 'Pending',
        admin_notes TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS hospital_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_comm_logs_app_id ON appointment_communication_logs(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_event_reg_event_id ON event_registrations(event_id);
    `);
  }

  private safeJsonParse<T>(raw: any, fallback: T): T {
    if (typeof raw !== "string") return (raw as T) ?? fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private migrateLegacyJsonIfNeeded() {
    if (!fs.existsSync(LEGACY_JSON_FILE)) return;
    const stats = this.getTableStats();
    const hasAnyRows = Object.values(stats).some((c) => c > 0);
    if (hasAnyRows) return;

    try {
      const raw = fs.readFileSync(LEGACY_JSON_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const data = parsed?.data || parsed;
      if (data && typeof data === "object") {
        this.replaceAllData(data);
        console.log(`[SQLiteDB] Migrated legacy JSON data from ${LEGACY_JSON_FILE} into SQLite tables.`);
      }
    } catch (err) {
      console.warn("[SQLiteDB] Legacy JSON migration warning:", err);
    }
  }

  private runInTransaction(fn: () => void) {
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      fn();
      this.db.exec("COMMIT;");
    } catch (err) {
      this.db.exec("ROLLBACK;");
      throw err;
    }
  }

  public getSetting<T = any>(key: string): T | null {
    const row = this.db.prepare("SELECT value FROM hospital_settings WHERE key = ?").get(key) as
      | { value: string }
      | undefined;
    if (!row) return null;
    return this.safeJsonParse<T | null>(row.value, null);
  }

  public upsertSetting(key: string, value: any) {
    const serialized = JSON.stringify(value ?? null);
    this.db
      .prepare(
        `INSERT INTO hospital_settings (key, value, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
      )
      .run(key, serialized);
  }

  public upsertDoctor(doc: any) {
    if (!doc || !doc.id) return;
    this.db
      .prepare(
        `INSERT INTO doctors (
          id, name, qualification, department, specialization, experience,
          image, opd_schedule, fee, phone, status, bio, room_no
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          qualification = excluded.qualification,
          department = excluded.department,
          specialization = excluded.specialization,
          experience = excluded.experience,
          image = excluded.image,
          opd_schedule = excluded.opd_schedule,
          fee = excluded.fee,
          phone = excluded.phone,
          status = excluded.status,
          bio = excluded.bio,
          room_no = excluded.room_no`
      )
      .run(
        String(doc.id),
        String(doc.name || ""),
        String(doc.qualification || ""),
        String(doc.department || ""),
        String(doc.specialization || ""),
        String(doc.experience || ""),
        String(doc.image || ""),
        String(doc.opdSchedule || doc.opd_schedule || ""),
        Number(doc.fee) || 0,
        String(doc.phone || ""),
        String(doc.status || "Active"),
        String(doc.bio || ""),
        String(doc.roomNo || doc.room_no || "")
      );
  }

  public deleteDoctor(id: string) {
    this.db.prepare("DELETE FROM doctors WHERE id = ?").run(String(id));
  }

  public upsertDepartment(dept: any) {
    if (!dept || !dept.id) return;
    this.db
      .prepare(
        `INSERT INTO departments (
          id, name, icon_name, description, head_of_department,
          bed_capacity, phone_ext, common_treatments, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          icon_name = excluded.icon_name,
          description = excluded.description,
          head_of_department = excluded.head_of_department,
          bed_capacity = excluded.bed_capacity,
          phone_ext = excluded.phone_ext,
          common_treatments = excluded.common_treatments,
          image = excluded.image`
      )
      .run(
        String(dept.id),
        String(dept.name || ""),
        String(dept.iconName || dept.icon_name || "Stethoscope"),
        String(dept.description || ""),
        String(dept.headOfDepartment || dept.head_of_department || ""),
        Number(dept.bedCapacity ?? dept.bed_capacity) || 15,
        String(dept.phoneExt || dept.phone_ext || ""),
        JSON.stringify(Array.isArray(dept.commonTreatments) ? dept.commonTreatments : []),
        String(dept.image || "")
      );
  }

  public deleteDepartment(id: string) {
    this.db.prepare("DELETE FROM departments WHERE id = ?").run(String(id));
  }

  public upsertFacility(fac: any) {
    if (!fac || !fac.id) return;
    this.db
      .prepare(
        `INSERT INTO facilities (
          id, name, category, description, availability, image, features
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          category = excluded.category,
          description = excluded.description,
          availability = excluded.availability,
          image = excluded.image,
          features = excluded.features`
      )
      .run(
        String(fac.id),
        String(fac.name || ""),
        String(fac.category || ""),
        String(fac.description || ""),
        String(fac.availability || ""),
        String(fac.image || ""),
        JSON.stringify(Array.isArray(fac.features) ? fac.features : [])
      );
  }

  public upsertEmployee(emp: any) {
    if (!emp || !emp.id) return;
    this.db
      .prepare(
        `INSERT INTO employees (
          id, employee_id, name, designation, department, phone,
          email, join_date, shift, status, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          employee_id = excluded.employee_id,
          name = excluded.name,
          designation = excluded.designation,
          department = excluded.department,
          phone = excluded.phone,
          email = excluded.email,
          join_date = excluded.join_date,
          shift = excluded.shift,
          status = excluded.status,
          password = excluded.password`
      )
      .run(
        String(emp.id),
        String(emp.employeeId || emp.employee_id || emp.id),
        String(emp.name || ""),
        String(emp.designation || ""),
        String(emp.department || ""),
        String(emp.phone || ""),
        String(emp.email || ""),
        String(emp.joinDate || emp.join_date || ""),
        String(emp.shift || "General"),
        String(emp.status || "Active"),
        String(emp.password || "khair123")
      );
  }

  public deleteEmployee(id: string) {
    this.db.prepare("DELETE FROM employees WHERE id = ?").run(String(id));
  }

  public upsertAppointment(app: any) {
    if (!app || !app.id) return;
    const logs = Array.isArray(app.communicationLogs)
      ? app.communicationLogs
      : Array.isArray(app.communication_logs)
      ? app.communication_logs
      : [];

    this.db
      .prepare(
        `INSERT INTO appointments (
          id, appointment_number, patient_name, age, gender, phone, email,
          department, doctor_id, doctor_name, date, time_slot, status,
          symptoms, communication_logs, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          appointment_number = excluded.appointment_number,
          patient_name = excluded.patient_name,
          age = excluded.age,
          gender = excluded.gender,
          phone = excluded.phone,
          email = excluded.email,
          department = excluded.department,
          doctor_id = excluded.doctor_id,
          doctor_name = excluded.doctor_name,
          date = excluded.date,
          time_slot = excluded.time_slot,
          status = excluded.status,
          symptoms = excluded.symptoms,
          communication_logs = excluded.communication_logs`
      )
      .run(
        String(app.id),
        String(app.appointmentNumber || app.appointment_number || app.id),
        String(app.patientName || app.patient_name || ""),
        Number(app.age) || 30,
        String(app.gender || "Male"),
        String(app.phone || ""),
        String(app.email || ""),
        String(app.department || ""),
        String(app.doctorId || app.doctor_id || ""),
        String(app.doctorName || app.doctor_name || ""),
        String(app.date || ""),
        String(app.timeSlot || app.time_slot || ""),
        String(app.status || "Confirmed"),
        String(app.symptoms || ""),
        JSON.stringify(logs),
        String(app.createdAt || app.created_at || new Date().toISOString())
      );

    // Sync normalized communication log rows
    const insertLog = this.db.prepare(
      `INSERT INTO appointment_communication_logs (
        id, appointment_id, sent_by_employee_name, sent_at, channel, message
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        sent_by_employee_name = excluded.sent_by_employee_name,
        sent_at = excluded.sent_at,
        channel = excluded.channel,
        message = excluded.message`
    );

    for (const log of logs) {
      if (log && log.id) {
        insertLog.run(
          String(log.id),
          String(app.id),
          String(log.sentByEmployeeName || "Staff"),
          String(log.sentAt || ""),
          String(log.channel || "Note"),
          String(log.message || "")
        );
      }
    }
  }

  public deleteAppointment(id: string) {
    this.db.prepare("DELETE FROM appointments WHERE id = ?").run(String(id));
  }

  public upsertNotice(notice: any) {
    if (!notice || !notice.id) return;
    this.db
      .prepare(
        `INSERT INTO notices (
          id, title, category, date, content, is_pinned, priority, target_audience, doc_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          category = excluded.category,
          date = excluded.date,
          content = excluded.content,
          is_pinned = excluded.is_pinned,
          priority = excluded.priority,
          target_audience = excluded.target_audience,
          doc_url = excluded.doc_url`
      )
      .run(
        String(notice.id),
        String(notice.title || ""),
        String(notice.category || "General"),
        String(notice.date || ""),
        String(notice.content || ""),
        notice.isPinned ? 1 : 0,
        String(notice.priority || "Normal"),
        String(notice.targetAudience || notice.target_audience || "All Patients & Visitors"),
        String(notice.docUrl || notice.attachmentUrl || notice.doc_url || "")
      );
  }

  public deleteNotice(id: string) {
    this.db.prepare("DELETE FROM notices WHERE id = ?").run(String(id));
  }

  public upsertEvent(evt: any) {
    if (!evt || !evt.id) return;
    this.db
      .prepare(
        `INSERT INTO events (
          id, title, date, location, description, organizer,
          max_seats, registered_count, status, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          date = excluded.date,
          location = excluded.location,
          description = excluded.description,
          organizer = excluded.organizer,
          max_seats = excluded.max_seats,
          registered_count = excluded.registered_count,
          status = excluded.status,
          image_url = excluded.image_url`
      )
      .run(
        String(evt.id),
        String(evt.title || ""),
        String(evt.date || ""),
        String(evt.location || ""),
        String(evt.description || ""),
        String(evt.organizer || ""),
        Number(evt.maxSeats ?? evt.max_seats) || 100,
        Number(evt.registeredCount ?? evt.registered_count) || 0,
        String(evt.status || "Upcoming"),
        String(evt.imageUrl || evt.image_url || "")
      );
  }

  public deleteEvent(id: string) {
    this.db.prepare("DELETE FROM events WHERE id = ?").run(String(id));
  }

  public insertEventRegistration(reg: any) {
    if (!reg || !reg.eventId) return;
    const regId = String(reg.id || `ereg-${Date.now()}`);
    this.db
      .prepare(
        `INSERT INTO event_registrations (
          id, event_id, attendee_name, attendee_phone, attendee_email, registered_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING`
      )
      .run(
        regId,
        String(reg.eventId),
        String(reg.attendeeName || "Patient / Visitor"),
        String(reg.attendeePhone || ""),
        String(reg.attendeeEmail || ""),
        String(reg.registeredAt || new Date().toISOString())
      );

    if (typeof reg.registeredCount === "number") {
      this.db
        .prepare("UPDATE events SET registered_count = ? WHERE id = ?")
        .run(reg.registeredCount, String(reg.eventId));
    } else {
      this.db
        .prepare("UPDATE events SET registered_count = registered_count + 1 WHERE id = ?")
        .run(String(reg.eventId));
    }
  }

  public upsertGalleryItem(item: any) {
    if (!item || !item.id) return;
    this.db
      .prepare(
        `INSERT INTO gallery (id, title, category, image_url, caption, date)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           category = excluded.category,
           image_url = excluded.image_url,
           caption = excluded.caption,
           date = excluded.date`
      )
      .run(
        String(item.id),
        String(item.title || ""),
        String(item.category || "Facilities"),
        String(item.imageUrl || item.image_url || ""),
        String(item.caption || ""),
        String(item.date || "")
      );
  }

  public deleteGalleryItem(id: string) {
    this.db.prepare("DELETE FROM gallery WHERE id = ?").run(String(id));
  }

  public upsertFeedback(fb: any) {
    if (!fb || !fb.id) return;
    this.db
      .prepare(
        `INSERT INTO feedbacks (
          id, patient_name, email, phone, department, rating, message, date, status, admin_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          patient_name = excluded.patient_name,
          email = excluded.email,
          phone = excluded.phone,
          department = excluded.department,
          rating = excluded.rating,
          message = excluded.message,
          date = excluded.date,
          status = excluded.status,
          admin_notes = excluded.admin_notes`
      )
      .run(
        String(fb.id),
        String(fb.patientName || fb.patient_name || ""),
        String(fb.email || ""),
        String(fb.phone || ""),
        String(fb.department || ""),
        Number(fb.rating) || 5,
        String(fb.message || ""),
        String(fb.date || ""),
        String(fb.status || "Pending"),
        String(fb.adminNotes || fb.admin_notes || "")
      );
  }

  public deleteFeedback(id: string) {
    this.db.prepare("DELETE FROM feedbacks WHERE id = ?").run(String(id));
  }

  public replaceAllData(data: Partial<HospitalServerData>) {
    this.runInTransaction(() => {
      if (Array.isArray(data.doctors)) {
        for (const doc of data.doctors) this.upsertDoctor(doc);
      }
      if (Array.isArray(data.departments)) {
        for (const dept of data.departments) this.upsertDepartment(dept);
      }
      if (Array.isArray(data.facilities)) {
        for (const fac of data.facilities) this.upsertFacility(fac);
      }
      if (Array.isArray(data.employees)) {
        for (const emp of data.employees) this.upsertEmployee(emp);
      }
      if (Array.isArray(data.appointments)) {
        for (const app of data.appointments) this.upsertAppointment(app);
      }
      if (Array.isArray(data.notices)) {
        for (const notice of data.notices) this.upsertNotice(notice);
      }
      if (Array.isArray(data.events)) {
        for (const evt of data.events) this.upsertEvent(evt);
      }
      if (Array.isArray(data.eventRegistrations)) {
        for (const reg of data.eventRegistrations) this.insertEventRegistration(reg);
      }
      if (Array.isArray(data.gallery)) {
        for (const item of data.gallery) this.upsertGalleryItem(item);
      }
      if (Array.isArray(data.feedbacks)) {
        for (const fb of data.feedbacks) this.upsertFeedback(fb);
      }
      if (data.businessSettings) {
        this.upsertSetting("business_settings", data.businessSettings);
      }
      if (data.logoSettings) {
        this.upsertSetting("logo_settings", data.logoSettings);
      }
      if (data.flashAnnouncement) {
        this.upsertSetting("flash_announcement", data.flashAnnouncement);
      }
    });
  }

  public loadAllData(): HospitalServerData {
    const doctors = (this.db.prepare("SELECT * FROM doctors ORDER BY rowid ASC").all() as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      qualification: d.qualification || "",
      department: d.department || "",
      specialization: d.specialization || "",
      experience: d.experience || "",
      image: d.image || "",
      opdSchedule: d.opd_schedule || "",
      fee: Number(d.fee) || 0,
      phone: d.phone || "",
      status: d.status || "Active",
      bio: d.bio || "",
      roomNo: d.room_no || "",
    }));

    const departments = (this.db.prepare("SELECT * FROM departments ORDER BY rowid ASC").all() as any[]).map((dept) => ({
      id: dept.id,
      name: dept.name,
      iconName: dept.icon_name || "Stethoscope",
      description: dept.description || "",
      headOfDepartment: dept.head_of_department || "",
      bedCapacity: Number(dept.bed_capacity) || 15,
      phoneExt: dept.phone_ext || "",
      commonTreatments: this.safeJsonParse<string[]>(dept.common_treatments, []),
      image: dept.image || "",
    }));

    const facilities = (this.db.prepare("SELECT * FROM facilities ORDER BY rowid ASC").all() as any[]).map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category || "",
      description: f.description || "",
      availability: f.availability || "",
      image: f.image || "",
      features: this.safeJsonParse<string[]>(f.features, []),
    }));

    const employees = (this.db.prepare("SELECT * FROM employees ORDER BY rowid ASC").all() as any[]).map((e) => ({
      id: e.id,
      employeeId: e.employee_id || "",
      name: e.name,
      designation: e.designation || "",
      department: e.department || "",
      phone: e.phone || "",
      email: e.email || "",
      joinDate: e.join_date || "",
      shift: e.shift || "General",
      status: e.status || "Active",
      password: e.password || "khair123",
    }));

    const appointments = (this.db.prepare("SELECT * FROM appointments ORDER BY created_at DESC, rowid DESC").all() as any[]).map(
      (a) => ({
        id: a.id,
        appointmentNumber: a.appointment_number || "",
        patientName: a.patient_name,
        age: Number(a.age) || 30,
        gender: a.gender || "Male",
        phone: a.phone || "",
        email: a.email || "",
        department: a.department || "",
        doctorId: a.doctor_id || "",
        doctorName: a.doctor_name || "",
        date: a.date || "",
        timeSlot: a.time_slot || "",
        status: a.status || "Confirmed",
        symptoms: a.symptoms || "",
        createdAt: a.created_at || new Date().toISOString(),
        communicationLogs: this.safeJsonParse<any[]>(a.communication_logs, []),
      })
    );

    const notices = (this.db.prepare("SELECT * FROM notices ORDER BY rowid DESC").all() as any[]).map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category || "General",
      date: n.date || "",
      content: n.content || "",
      isPinned: Boolean(n.is_pinned),
      priority: n.priority || "Normal",
      targetAudience: n.target_audience || "All Patients & Visitors",
      docUrl: n.doc_url || "",
    }));

    const events = (this.db.prepare("SELECT * FROM events ORDER BY rowid DESC").all() as any[]).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date || "",
      location: e.location || "",
      description: e.description || "",
      organizer: e.organizer || "",
      maxSeats: Number(e.max_seats) || 100,
      registeredCount: Number(e.registered_count) || 0,
      status: e.status || "Upcoming",
      imageUrl: e.image_url || "",
    }));

    const eventRegistrations = (
      this.db.prepare("SELECT * FROM event_registrations ORDER BY rowid DESC").all() as any[]
    ).map((r) => ({
      id: r.id,
      eventId: r.event_id,
      attendeeName: r.attendee_name,
      attendeePhone: r.attendee_phone,
      attendeeEmail: r.attendee_email,
      registeredAt: r.registered_at,
    }));

    const gallery = (this.db.prepare("SELECT * FROM gallery ORDER BY rowid DESC").all() as any[]).map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category || "Facilities",
      imageUrl: g.image_url || "",
      caption: g.caption || "",
      date: g.date || "",
    }));

    const feedbacks = (this.db.prepare("SELECT * FROM feedbacks ORDER BY rowid DESC").all() as any[]).map((f) => ({
      id: f.id,
      patientName: f.patient_name,
      email: f.email || "",
      phone: f.phone || "",
      department: f.department || "",
      rating: Number(f.rating) || 5,
      message: f.message || "",
      date: f.date || "",
      status: f.status || "Pending",
      adminNotes: f.admin_notes || "",
    }));

    return {
      doctors,
      employees,
      departments,
      facilities,
      gallery,
      notices,
      events,
      eventRegistrations,
      feedbacks,
      appointments,
      businessSettings: this.getSetting("business_settings"),
      logoSettings: this.getSetting("logo_settings"),
      flashAnnouncement: this.getSetting("flash_announcement"),
    };
  }

  public getTableStats(): Record<string, number> {
    const tables = [
      "doctors",
      "departments",
      "facilities",
      "employees",
      "appointments",
      "appointment_communication_logs",
      "notices",
      "events",
      "event_registrations",
      "gallery",
      "feedbacks",
      "hospital_settings",
    ];
    const counts: Record<string, number> = {};
    for (const t of tables) {
      const row = this.db.prepare(`SELECT COUNT(*) AS count FROM ${t}`).get() as { count: number };
      counts[t] = Number(row?.count) || 0;
    }
    return counts;
  }
}

export const hospitalDb = new HospitalSQLiteDatabase();
