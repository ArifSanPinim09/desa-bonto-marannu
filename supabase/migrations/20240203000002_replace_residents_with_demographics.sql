-- Migration: Replace residents table with village demographics and geography
-- Date: 2024-02-03
-- Description: Remove residents table and create village_demographics table

-- Drop existing residents table and related objects
DROP TABLE IF EXISTS residents CASCADE;

-- Create village_demographics table
CREATE TABLE village_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Population Statistics
  total_population INTEGER NOT NULL DEFAULT 0,
  male_population INTEGER NOT NULL DEFAULT 0,
  female_population INTEGER NOT NULL DEFAULT 0,
  total_families INTEGER NOT NULL DEFAULT 0,
  
  -- Geographic Information
  altitude_mdpl INTEGER NOT NULL DEFAULT 0,
  area_size_km DECIMAL(10, 2) NOT NULL DEFAULT 0,
  topography TEXT NOT NULL DEFAULT 'Dataran',
  
  -- Additional Information
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_village_demographics_updated_at ON village_demographics(updated_at DESC);

-- Enable RLS
ALTER TABLE village_demographics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for village_demographics
-- Public can read
CREATE POLICY "Public can view village demographics"
  ON village_demographics
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users can manage village demographics"
  ON village_demographics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_village_demographics_updated_at
  BEFORE UPDATE ON village_demographics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data based on requirements
INSERT INTO village_demographics (
  total_population,
  male_population,
  female_population,
  total_families,
  altitude_mdpl,
  area_size_km,
  topography,
  description
) VALUES (
  1818,
  827,
  814,
  950,
  1100,
  1248.00,
  'Pegunungan',
  'Data demografi dan geografis Desa'
);

-- Add comment to table
COMMENT ON TABLE village_demographics IS 'Stores village demographic and geographic information';
