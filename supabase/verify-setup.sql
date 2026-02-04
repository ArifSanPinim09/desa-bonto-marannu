-- =====================================================
-- VERIFICATION SCRIPT
-- Run this script to verify the database setup
-- =====================================================

-- Check if all tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 7 THEN '✓ All tables created'
    ELSE '✗ Missing tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'hero_sections',
    'village_profile', 
    'organization_structure',
    'residents',
    'tourist_destinations',
    'destination_images',
    'news'
  );

-- Check if RLS is enabled on all tables
SELECT 
  'RLS Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 7 THEN '✓ RLS enabled on all tables'
    ELSE '✗ RLS not enabled on some tables'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
  AND tablename IN (
    'hero_sections',
    'village_profile',
    'organization_structure',
    'residents',
    'tourist_destinations',
    'destination_images',
    'news'
  );

-- Check public read policies
SELECT 
  'Public Read Policies' as check_type,
  COUNT(DISTINCT tablename) as count,
  CASE 
    WHEN COUNT(DISTINCT tablename) >= 7 THEN '✓ Public read policies exist'
    ELSE '✗ Missing public read policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND cmd = 'SELECT'
  AND roles @> ARRAY['public'];

-- Check authenticated full access policies
SELECT 
  'Authenticated Policies' as check_type,
  COUNT(DISTINCT tablename) as count,
  CASE 
    WHEN COUNT(DISTINCT tablename) >= 7 THEN '✓ Authenticated policies exist'
    ELSE '✗ Missing authenticated policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND roles @> ARRAY['authenticated'];

-- Check storage buckets
SELECT 
  'Storage Buckets' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 5 THEN '✓ All storage buckets created'
    ELSE '✗ Missing storage buckets'
  END as status
FROM storage.buckets 
WHERE id IN (
  'hero-images',
  'profile-images',
  'official-photos',
  'destination-images',
  'news-images'
);

-- List all tables with their RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- List all storage buckets with their settings
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY name;
