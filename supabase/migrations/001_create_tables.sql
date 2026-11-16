-- =====================================================
-- Nagar Mitra Database Schema
-- Community Civic Issue Reporting & Analytics Platform
-- Migration 001: Create Tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT UNIQUE NOT NULL,
  citizen_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('water', 'waste', 'road', 'electricity', 'drainage')),
  issue_type TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 5),
  description TEXT NOT NULL CHECK (char_length(description) >= 20),
  photo_path TEXT,
  locality TEXT NOT NULL,
  latitude NUMERIC CHECK (latitude >= -90 AND latitude <= 90),
  longitude NUMERIC CHECK (longitude >= -180 AND longitude <= 180),
  severity TEXT NOT NULL DEFAULT 'normal' CHECK (severity IN ('normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'in_progress', 'resolved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Report Updates table (status history)
CREATE TABLE IF NOT EXISTS report_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN ('submitted', 'under_review', 'in_progress', 'resolved', 'rejected')),
  admin_note TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_reports_citizen_id ON reports(citizen_id);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity);
CREATE INDEX IF NOT EXISTS idx_report_updates_report_id ON report_updates(report_id);

-- =====================================================
-- Triggers & Functions
-- =====================================================

-- Auto-update updated_at on report changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Generate reference ID: NM-YYYY-NNNN
CREATE OR REPLACE FUNCTION generate_reference_id()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_num INTEGER;
  ref_id TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM now())::TEXT;
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(reference_id FROM 9) AS INTEGER)
  ), 0) + 1
  INTO next_num
  FROM reports
  WHERE reference_id LIKE 'NM-' || current_year || '-%';
  ref_id := 'NM-' || current_year || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN ref_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-set reference_id on insert
CREATE OR REPLACE FUNCTION set_reference_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_id IS NULL OR NEW.reference_id = '' THEN
    NEW.reference_id := generate_reference_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_set_reference_id
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_reference_id();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen'),
    'citizen'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
