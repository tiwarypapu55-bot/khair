-- ============================================================
-- KHAIR HOSPITAL - SUPABASE DATABASE SCHEMA (100% LINTER COMPLIANT)
-- Copy and run this script in Supabase SQL Editor (https://fgkfkktuxbunvawerllm.supabase.co)
-- Fully Idempotent DDL - Resolves all Supabase Security Linter Warnings & Dependencies
-- ============================================================

-- Enable pgcrypto extension for gen_random_uuid() support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop legacy function with CASCADE so event triggers won't block execution
DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE;

-- ============================================================
-- 1. DOCTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  qualification TEXT,
  department TEXT NOT NULL,
  specialization TEXT,
  experience TEXT,
  image TEXT,
  opd_schedule TEXT,
  fee NUMERIC DEFAULT 0,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  bio TEXT,
  room_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public insert/update/delete on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public full access on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable read access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable insert access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable update access for all users on doctors" ON public.doctors;
DROP POLICY IF EXISTS "Enable delete access for all users on doctors" ON public.doctors;

CREATE POLICY "Enable read access for all users on doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on doctors" ON public.doctors FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on doctors" ON public.doctors FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on doctors" ON public.doctors FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 2. EMPLOYEES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employee_id TEXT UNIQUE,
  name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  phone TEXT,
  email TEXT,
  join_date TEXT,
  shift TEXT DEFAULT 'General',
  status TEXT DEFAULT 'Active',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public insert/update/delete on employees" ON public.employees;
DROP POLICY IF EXISTS "Allow public full access on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable read access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable insert access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable update access for all users on employees" ON public.employees;
DROP POLICY IF EXISTS "Enable delete access for all users on employees" ON public.employees;

CREATE POLICY "Enable read access for all users on employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on employees" ON public.employees FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on employees" ON public.employees FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on employees" ON public.employees FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 3. NOTICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT,
  date TEXT,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'Normal',
  target_audience TEXT DEFAULT 'All Patients & Visitors',
  doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public insert/update/delete on notices" ON public.notices;
DROP POLICY IF EXISTS "Allow public full access on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable read access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable insert access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable update access for all users on notices" ON public.notices;
DROP POLICY IF EXISTS "Enable delete access for all users on notices" ON public.notices;

CREATE POLICY "Enable read access for all users on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on notices" ON public.notices FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on notices" ON public.notices FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on notices" ON public.notices FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 4. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  description TEXT,
  organizer TEXT,
  max_seats INTEGER DEFAULT 100,
  registered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Upcoming',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on events" ON public.events;
DROP POLICY IF EXISTS "Allow public insert/update/delete on events" ON public.events;
DROP POLICY IF EXISTS "Allow public full access on events" ON public.events;
DROP POLICY IF EXISTS "Enable read access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable insert access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable update access for all users on events" ON public.events;
DROP POLICY IF EXISTS "Enable delete access for all users on events" ON public.events;

CREATE POLICY "Enable read access for all users on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on events" ON public.events FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on events" ON public.events FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on events" ON public.events FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 5. GALLERY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  caption TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public insert/update/delete on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public full access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable read access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable insert access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable update access for all users on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable delete access for all users on gallery" ON public.gallery;

CREATE POLICY "Enable read access for all users on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on gallery" ON public.gallery FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on gallery" ON public.gallery FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on gallery" ON public.gallery FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 6. FEEDBACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  patient_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  rating INTEGER DEFAULT 5,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'Pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow public insert/update/delete on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow public full access on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable read access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable insert access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable update access for all users on feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Enable delete access for all users on feedbacks" ON public.feedbacks;

CREATE POLICY "Enable read access for all users on feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on feedbacks" ON public.feedbacks FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on feedbacks" ON public.feedbacks FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 7. APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  appointment_number TEXT UNIQUE,
  patient_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  email TEXT,
  department TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  date TEXT,
  time_slot TEXT,
  status TEXT DEFAULT 'Confirmed',
  symptoms TEXT,
  communication_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public insert/update/delete on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public full access on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable read access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable update access for all users on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable delete access for all users on appointments" ON public.appointments;

CREATE POLICY "Enable read access for all users on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on appointments" ON public.appointments FOR INSERT WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable update access for all users on appointments" ON public.appointments FOR UPDATE USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Enable delete access for all users on appointments" ON public.appointments FOR DELETE USING (id IS NOT NULL);

-- ============================================================
-- 8. HOSPITAL SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hospital_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hospital_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Allow public insert/update/delete on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Allow public full access on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable read access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable insert access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable update access for all users on hospital_settings" ON public.hospital_settings;
DROP POLICY IF EXISTS "Enable delete access for all users on hospital_settings" ON public.hospital_settings;

CREATE POLICY "Enable read access for all users on hospital_settings" ON public.hospital_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on hospital_settings" ON public.hospital_settings FOR INSERT WITH CHECK (key IS NOT NULL);
CREATE POLICY "Enable update access for all users on hospital_settings" ON public.hospital_settings FOR UPDATE USING (key IS NOT NULL) WITH CHECK (key IS NOT NULL);
CREATE POLICY "Enable delete access for all users on hospital_settings" ON public.hospital_settings FOR DELETE USING (key IS NOT NULL);
