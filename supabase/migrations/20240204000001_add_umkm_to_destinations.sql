-- Migration: Add UMKM support to destinations
-- Date: 2025-02-04

-- Create UMKM table for destinations
CREATE TABLE IF NOT EXISTS destination_umkm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID NOT NULL REFERENCES tourist_destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  maps_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_destination_umkm_destination_id 
ON destination_umkm(destination_id);

CREATE INDEX IF NOT EXISTS idx_destination_umkm_display_order 
ON destination_umkm(destination_id, display_order);

-- Add comments
COMMENT ON TABLE destination_umkm IS 'UMKM (Micro, Small and Medium Enterprises) associated with tourist destinations';
COMMENT ON COLUMN destination_umkm.destination_id IS 'Reference to the tourist destination';
COMMENT ON COLUMN destination_umkm.name IS 'Name of the UMKM business';
COMMENT ON COLUMN destination_umkm.maps_url IS 'Google Maps URL for the UMKM location';
COMMENT ON COLUMN destination_umkm.display_order IS 'Order in which UMKM should be displayed';

-- Enable RLS
ALTER TABLE destination_umkm ENABLE ROW LEVEL SECURITY;

-- RLS Policies for destination_umkm
-- Allow public to read
CREATE POLICY "Allow public read access to destination_umkm"
ON destination_umkm FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert destination_umkm"
ON destination_umkm FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update destination_umkm"
ON destination_umkm FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete destination_umkm"
ON destination_umkm FOR DELETE
TO authenticated
USING (true);

-- Verify the changes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'destination_umkm'
  ) THEN
    RAISE NOTICE 'Table destination_umkm successfully created';
  END IF;
END $$;
