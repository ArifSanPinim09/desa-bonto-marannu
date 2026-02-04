-- =====================================================
-- SEED DATA (Optional - for testing purposes)
-- =====================================================

-- Insert sample village profile
INSERT INTO village_profile (
  village_name,
  sub_district,
  district,
  province,
  postal_code,
  area_size,
  history,
  logo_url
) VALUES (
  'Bonto Marannu',
  'Galesong Selatan',
  'Takalar',
  'Sulawesi Selatan',
  '92271',
  12.5,
  '<p>Desa Bonto Marannu adalah sebuah desa yang terletak di Kecamatan Galesong Selatan, Kabupaten Takalar, Provinsi Sulawesi Selatan. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal.</p><p>Nama Bonto Marannu berasal dari bahasa Makassar yang memiliki makna historis bagi masyarakat setempat.</p>',
  NULL
) ON CONFLICT DO NOTHING;

-- Insert sample hero section
INSERT INTO hero_sections (
  title,
  subtitle,
  cta_text,
  cta_link,
  image_url,
  is_active,
  display_order
) VALUES (
  'Selamat Datang di Desa Bonto Marannu',
  'Desa yang Maju, Sejahtera, dan Berbudaya',
  'Jelajahi Desa Kami',
  '#profil',
  '/images/hero-placeholder.jpg',
  true,
  1
) ON CONFLICT DO NOTHING;

-- Insert sample organization structure
INSERT INTO organization_structure (
  name,
  position,
  nip,
  photo_url,
  display_order
) VALUES 
  ('Kepala Desa', 'Kepala Desa', NULL, NULL, 1),
  ('Sekretaris Desa', 'Sekretaris Desa', NULL, NULL, 2),
  ('Kaur Pemerintahan', 'Kepala Urusan Pemerintahan', NULL, NULL, 3),
  ('Kaur Pembangunan', 'Kepala Urusan Pembangunan', NULL, NULL, 4),
  ('Kaur Kesejahteraan', 'Kepala Urusan Kesejahteraan', NULL, NULL, 5)
ON CONFLICT DO NOTHING;

-- Insert sample residents (for statistics testing)
INSERT INTO residents (
  full_name,
  nik,
  gender,
  birth_date,
  address,
  occupation,
  education,
  marital_status
) VALUES 
  ('Ahmad Wijaya', '7301011990010001', 'Laki-laki', '1990-01-01', 'Jl. Contoh No. 1', 'Petani', 'SMA', 'Menikah'),
  ('Siti Aminah', '7301012000020002', 'Perempuan', '2000-02-02', 'Jl. Contoh No. 2', 'Ibu Rumah Tangga', 'SMP', 'Menikah'),
  ('Budi Santoso', '7301011985030003', 'Laki-laki', '1985-03-03', 'Jl. Contoh No. 3', 'Wiraswasta', 'S1', 'Menikah'),
  ('Dewi Lestari', '7301011995040004', 'Perempuan', '1995-04-04', 'Jl. Contoh No. 4', 'Guru', 'S1', 'Belum Menikah'),
  ('Eko Prasetyo', '7301012005050005', 'Laki-laki', '2005-05-05', 'Jl. Contoh No. 5', 'Pelajar', 'SMA', 'Belum Menikah')
ON CONFLICT (nik) DO NOTHING;

-- Insert sample tourist destination
INSERT INTO tourist_destinations (
  name,
  description,
  location,
  category,
  facilities,
  ticket_price
) VALUES (
  'Pantai Galesong',
  'Pantai Galesong adalah destinasi wisata pantai yang indah dengan pasir putih dan air laut yang jernih. Tempat yang sempurna untuk bersantai bersama keluarga.',
  'Galesong Selatan, Takalar',
  'Pantai',
  ARRAY['Parkir', 'Toilet', 'Warung Makan', 'Gazebo'],
  5000
) ON CONFLICT DO NOTHING;

-- Get the destination ID for inserting images
DO $$
DECLARE
  dest_id UUID;
BEGIN
  SELECT id INTO dest_id FROM tourist_destinations WHERE name = 'Pantai Galesong' LIMIT 1;
  
  IF dest_id IS NOT NULL THEN
    INSERT INTO destination_images (destination_id, image_url, display_order)
    VALUES 
      (dest_id, '/images/destination-placeholder-1.jpg', 1),
      (dest_id, '/images/destination-placeholder-2.jpg', 2)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Note: News articles require an author_id from auth.users
-- These should be added after creating admin users through Supabase Auth
-- Example (uncomment and replace with actual user ID):
-- INSERT INTO news (
--   title,
--   slug,
--   content,
--   excerpt,
--   thumbnail_url,
--   category,
--   status,
--   author_id,
--   published_at
-- ) VALUES (
--   'Pembangunan Jalan Desa Dimulai',
--   'pembangunan-jalan-desa-dimulai',
--   '<p>Pemerintah desa telah memulai proyek pembangunan jalan desa...</p>',
--   'Pemerintah desa telah memulai proyek pembangunan jalan desa',
--   '/images/news-placeholder.jpg',
--   'Pembangunan',
--   'published',
--   'your-user-id-here',
--   NOW()
-- );
