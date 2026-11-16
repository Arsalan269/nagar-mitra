-- =====================================================
-- Nagar Mitra — Row Level Security Policies
-- Migration 002: RLS Policies
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_updates ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========== PROFILES ==========
CREATE POLICY "Users read own profile" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT TO authenticated
  USING (is_admin());
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- ========== REPORTS ==========
CREATE POLICY "Citizens read own reports" ON reports FOR SELECT TO authenticated
  USING (citizen_id = auth.uid());
CREATE POLICY "Admins read all reports" ON reports FOR SELECT TO authenticated
  USING (is_admin());
CREATE POLICY "Citizens create reports" ON reports FOR INSERT TO authenticated
  WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "Admins update reports" ON reports FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins delete reports" ON reports FOR DELETE TO authenticated
  USING (is_admin());

-- ========== REPORT_UPDATES ==========
CREATE POLICY "Citizens read own report updates" ON report_updates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = report_updates.report_id AND reports.citizen_id = auth.uid()));
CREATE POLICY "Admins read all updates" ON report_updates FOR SELECT TO authenticated
  USING (is_admin());
CREATE POLICY "Admins create updates" ON report_updates FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- ========== PUBLIC FUNCTIONS ==========

-- Public map data (limited fields, no PII)
CREATE OR REPLACE FUNCTION get_public_map_reports(
  filter_category TEXT DEFAULT NULL,
  filter_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID, reference_id TEXT, category TEXT, title TEXT,
  locality TEXT, latitude NUMERIC, longitude NUMERIC,
  status TEXT, severity TEXT, created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.reference_id, r.category, r.title,
    r.locality, r.latitude, r.longitude, r.status, r.severity, r.created_at
  FROM reports r
  WHERE (filter_category IS NULL OR r.category = filter_category)
    AND (filter_status IS NULL OR r.status = filter_status)
    AND r.latitude IS NOT NULL AND r.longitude IS NOT NULL
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION get_public_map_reports TO anon;
GRANT EXECUTE ON FUNCTION get_public_map_reports TO authenticated;

-- Public stats
CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'total_reports', (SELECT COUNT(*) FROM reports),
    'resolved_reports', (SELECT COUNT(*) FROM reports WHERE status = 'resolved'),
    'categories_used', (SELECT COUNT(DISTINCT category) FROM reports),
    'areas_covered', (SELECT COUNT(DISTINCT locality) FROM reports)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION get_public_stats TO anon;
GRANT EXECUTE ON FUNCTION get_public_stats TO authenticated;
