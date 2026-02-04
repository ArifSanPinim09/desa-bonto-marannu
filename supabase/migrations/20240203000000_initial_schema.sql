-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Hero Sections Table
CREATE TABLE hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Village Profile Table
CREATE TABLE village_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_name TEXT NOT NULL,
  sub_district TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  area_size DECIMAL NOT NULL,
  history TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Structure Table
CREATE TABLE organization_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  nip TEXT,
  photo_url TEXT,
  start_period DATE,
  end_period DATE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Residents Table
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  nik TEXT UNIQUE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
  birth_date DATE NOT NULL,
  address TEXT NOT NULL,
  occupation TEXT NOT NULL,
  education TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tourist Destinations Table
CREATE TABLE tourist_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  facilities TEXT[] DEFAULT '{}',
  ticket_price DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Destination Images Table
CREATE TABLE destination_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES tourist_destinations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_hero_sections_active ON hero_sections(is_active);
CREATE INDEX idx_hero_sections_order ON hero_sections(display_order);
CREATE INDEX idx_organization_order ON organization_structure(display_order);
CREATE INDEX idx_residents_nik ON residents(nik);
CREATE INDEX idx_residents_gender ON residents(gender);
CREATE INDEX idx_destination_images_destination ON destination_images(destination_id);
CREATE INDEX idx_destination_images_order ON destination_images(display_order);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published_at ON news(published_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - PUBLIC READ ACCESS
-- =====================================================

-- Hero Sections: Public can read all
CREATE POLICY "Public read access for hero_sections"
ON hero_sections FOR SELECT
TO public
USING (true);

-- Village Profile: Public can read all
CREATE POLICY "Public read access for village_profile"
ON village_profile FOR SELECT
TO public
USING (true);

-- Organization Structure: Public can read all
CREATE POLICY "Public read access for organization_structure"
ON organization_structure FOR SELECT
TO public
USING (true);

-- Residents: Public can read all (for statistics)
CREATE POLICY "Public read access for residents"
ON residents FOR SELECT
TO public
USING (true);

-- Tourist Destinations: Public can read all
CREATE POLICY "Public read access for tourist_destinations"
ON tourist_destinations FOR SELECT
TO public
USING (true);

-- Destination Images: Public can read all
CREATE POLICY "Public read access for destination_images"
ON destination_images FOR SELECT
TO public
USING (true);

-- News: Public can read only published articles
CREATE POLICY "Public read published news"
ON news FOR SELECT
TO public
USING (status = 'published');

-- =====================================================
-- RLS POLICIES - AUTHENTICATED ADMIN ACCESS
-- =====================================================

-- Hero Sections: Authenticated users have full access
CREATE POLICY "Authenticated full access for hero_sections"
ON hero_sections FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Village Profile: Authenticated users have full access
CREATE POLICY "Authenticated full access for village_profile"
ON village_profile FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Organization Structure: Authenticated users have full access
CREATE POLICY "Authenticated full access for organization_structure"
ON organization_structure FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Residents: Authenticated users have full access
CREATE POLICY "Authenticated full access for residents"
ON residents FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Tourist Destinations: Authenticated users have full access
CREATE POLICY "Authenticated full access for tourist_destinations"
ON tourist_destinations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Destination Images: Authenticated users have full access
CREATE POLICY "Authenticated full access for destination_images"
ON destination_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- News: Authenticated users have full access
CREATE POLICY "Authenticated full access for news"
ON news FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers to automatically update updated_at
CREATE TRIGGER update_hero_sections_updated_at
  BEFORE UPDATE ON hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_village_profile_updated_at
  BEFORE UPDATE ON village_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_structure_updated_at
  BEFORE UPDATE ON organization_structure
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residents_updated_at
  BEFORE UPDATE ON residents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tourist_destinations_updated_at
  BEFORE UPDATE ON tourist_destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
