-- Migration: Update tourist_destinations table
-- Replace ticket_price with maps_url
-- Date: 2025-02-04

-- Add maps_url column
ALTER TABLE tourist_destinations
ADD COLUMN maps_url TEXT;

-- Add comment to the new column
COMMENT ON COLUMN tourist_destinations.maps_url IS 'Google Maps URL for the destination location';

-- Drop ticket_price column
ALTER TABLE tourist_destinations
DROP COLUMN IF EXISTS ticket_price;

-- Update existing records to have NULL maps_url (admin will need to fill these in)
-- No data migration needed as we're removing ticket_price

-- Add index on maps_url for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_tourist_destinations_maps_url 
ON tourist_destinations(maps_url) 
WHERE maps_url IS NOT NULL;

-- Verify the changes
DO $$
BEGIN
  -- Check if maps_url column exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tourist_destinations' 
    AND column_name = 'maps_url'
  ) THEN
    RAISE NOTICE 'Column maps_url successfully added to tourist_destinations';
  END IF;

  -- Check if ticket_price column is removed
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tourist_destinations' 
    AND column_name = 'ticket_price'
  ) THEN
    RAISE NOTICE 'Column ticket_price successfully removed from tourist_destinations';
  END IF;
END $$;
