-- =====================================================
-- Nagar Mitra — Storage Setup
-- Migration 003: Storage Bucket & Policies
-- Run in Supabase SQL Editor
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-photos', 'report-photos', true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Authenticated users upload to their own folder
CREATE POLICY "Users upload own photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'report-photos' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

-- Public read access
CREATE POLICY "Public view report photos" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'report-photos');

-- Users can update their own photos
CREATE POLICY "Users update own photos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'report-photos' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

-- Admins can delete photos
CREATE POLICY "Admins delete photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'report-photos' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
