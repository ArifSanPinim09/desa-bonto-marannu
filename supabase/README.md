# Supabase Database Setup

This directory contains the database migration scripts for the Village Website project.

## Migration Files

1. **20240203000000_initial_schema.sql** - Creates all database tables, indexes, RLS policies, and triggers
2. **20240203000001_storage_setup.sql** - Sets up storage buckets and their access policies

## Tables Created

- `hero_sections` - Hero section content for homepage
- `village_profile` - Village identity and history information
- `organization_structure` - Village government officials
- `residents` - Population data for statistics
- `tourist_destinations` - Tourist attraction information
- `destination_images` - Images for tourist destinations
- `news` - News articles and announcements

## Storage Buckets

- `hero-images` - Hero section images (max 5MB)
- `profile-images` - Village logo and photos (max 5MB)
- `official-photos` - Official photos (max 2MB)
- `destination-images` - Destination photos (max 5MB)
- `news-images` - News thumbnails and content images (max 2MB)

## Security Policies

### Public Access (Requirements 16.1, 16.2)
- **Read Access**: All public users can read data from all tables
- **News Exception**: Public users can only read published news articles
- **Storage**: All buckets allow public read access for images

### Admin Access (Requirements 16.3, 16.4, 16.5)
- **Full CRUD**: Authenticated users have complete access to all tables
- **Storage**: Authenticated users can upload, update, and delete files in all buckets
- **RLS Enforcement**: Row Level Security is enabled on all tables

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - First: `20240203000000_initial_schema.sql`
   - Second: `20240203000001_storage_setup.sql`
4. Execute each script

### Option 3: Manual Application

If you prefer to run migrations manually:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations in order
\i supabase/migrations/20240203000000_initial_schema.sql
\i supabase/migrations/20240203000001_storage_setup.sql
```

## Verification

After applying migrations, verify the setup:

1. **Check Tables**: Ensure all 7 tables are created
2. **Check RLS**: Verify RLS is enabled on all tables
3. **Check Policies**: Confirm public read and authenticated full access policies exist
4. **Check Storage**: Verify all 5 storage buckets are created
5. **Check Storage Policies**: Confirm storage access policies are in place

## Environment Variables

Make sure to set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Notes

- All tables include `created_at` and `updated_at` timestamps
- The `updated_at` field is automatically updated via triggers
- Foreign key constraints ensure referential integrity
- Indexes are created for frequently queried columns
- Storage buckets have file size limits and MIME type restrictions
