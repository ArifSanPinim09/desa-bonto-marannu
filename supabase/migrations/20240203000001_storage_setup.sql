-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for different image types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('hero-images', 'hero-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('official-photos', 'official-photos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('destination-images', 'destination-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('news-images', 'news-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES - PUBLIC READ ACCESS
-- =====================================================

-- Hero Images: Public can read all files
CREATE POLICY "Public read access for hero-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero-images');

-- Profile Images: Public can read all files
CREATE POLICY "Public read access for profile-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Official Photos: Public can read all files
CREATE POLICY "Public read access for official-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'official-photos');

-- Destination Images: Public can read all files
CREATE POLICY "Public read access for destination-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination-images');

-- News Images: Public can read all files
CREATE POLICY "Public read access for news-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- =====================================================
-- STORAGE POLICIES - AUTHENTICATED ADMIN ACCESS
-- =====================================================

-- Hero Images: Authenticated users can insert
CREATE POLICY "Authenticated insert for hero-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-images');

-- Hero Images: Authenticated users can update
CREATE POLICY "Authenticated update for hero-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

-- Hero Images: Authenticated users can delete
CREATE POLICY "Authenticated delete for hero-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-images');

-- Profile Images: Authenticated users can insert
CREATE POLICY "Authenticated insert for profile-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Profile Images: Authenticated users can update
CREATE POLICY "Authenticated update for profile-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images')
WITH CHECK (bucket_id = 'profile-images');

-- Profile Images: Authenticated users can delete
CREATE POLICY "Authenticated delete for profile-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');

-- Official Photos: Authenticated users can insert
CREATE POLICY "Authenticated insert for official-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'official-photos');

-- Official Photos: Authenticated users can update
CREATE POLICY "Authenticated update for official-photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'official-photos')
WITH CHECK (bucket_id = 'official-photos');

-- Official Photos: Authenticated users can delete
CREATE POLICY "Authenticated delete for official-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'official-photos');

-- Destination Images: Authenticated users can insert
CREATE POLICY "Authenticated insert for destination-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'destination-images');

-- Destination Images: Authenticated users can update
CREATE POLICY "Authenticated update for destination-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'destination-images')
WITH CHECK (bucket_id = 'destination-images');

-- Destination Images: Authenticated users can delete
CREATE POLICY "Authenticated delete for destination-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'destination-images');

-- News Images: Authenticated users can insert
CREATE POLICY "Authenticated insert for news-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

-- News Images: Authenticated users can update
CREATE POLICY "Authenticated update for news-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images')
WITH CHECK (bucket_id = 'news-images');

-- News Images: Authenticated users can delete
CREATE POLICY "Authenticated delete for news-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');
