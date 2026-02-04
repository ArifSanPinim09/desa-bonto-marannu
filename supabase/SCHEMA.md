# Database Schema Reference

## Tables Overview

### hero_sections
Stores hero section content for the homepage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | TEXT | NOT NULL | Main heading text |
| subtitle | TEXT | - | Optional subheading |
| cta_text | TEXT | NOT NULL | Call-to-action button text |
| cta_link | TEXT | NOT NULL | CTA button link/URL |
| image_url | TEXT | NOT NULL | Hero background image URL |
| is_active | BOOLEAN | DEFAULT false | Whether this hero is currently active |
| display_order | INTEGER | DEFAULT 0 | Order for displaying multiple heroes |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**: `is_active`, `display_order`

---

### village_profile
Stores village identity and historical information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| village_name | TEXT | NOT NULL | Official village name |
| sub_district | TEXT | NOT NULL | Sub-district (kecamatan) |
| district | TEXT | NOT NULL | District (kabupaten) |
| province | TEXT | NOT NULL | Province name |
| postal_code | TEXT | NOT NULL | Postal code |
| area_size | DECIMAL | NOT NULL | Village area in hectares |
| history | TEXT | NOT NULL | Village history (rich text) |
| logo_url | TEXT | - | Village logo/emblem URL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

---

### organization_structure
Stores village government officials information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Official's full name |
| position | TEXT | NOT NULL | Official position/title |
| nip | TEXT | - | Employee ID number |
| photo_url | TEXT | - | Official's photo URL |
| start_period | DATE | - | Start of service period |
| end_period | DATE | - | End of service period |
| display_order | INTEGER | DEFAULT 0 | Display order in hierarchy |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**: `display_order`

---

### village_demographics
Stores village demographic and geographic information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| total_population | INTEGER | NOT NULL | Total population count |
| male_population | INTEGER | NOT NULL | Male population count |
| female_population | INTEGER | NOT NULL | Female population count |
| total_families | INTEGER | NOT NULL | Total number of families (KK) |
| altitude_mdpl | INTEGER | NOT NULL | Altitude in meters above sea level |
| area_size_km | DECIMAL | NOT NULL | Village area in square kilometers |
| topography | TEXT | NOT NULL | Topography type (e.g., Pegunungan) |
| description | TEXT | - | Additional description |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**: `updated_at`

---

### tourist_destinations
Stores tourist attraction information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Destination name |
| description | TEXT | NOT NULL | Full description |
| location | TEXT | NOT NULL | Location details |
| category | TEXT | NOT NULL | Category (e.g., beach, mountain) |
| facilities | TEXT[] | DEFAULT '{}' | Available facilities array |
| ticket_price | DECIMAL | DEFAULT 0 | Entry ticket price |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

---

### destination_images
Stores images for tourist destinations (one-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| destination_id | UUID | FOREIGN KEY | References tourist_destinations(id) |
| image_url | TEXT | NOT NULL | Image URL |
| display_order | INTEGER | DEFAULT 0 | Display order in gallery |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Foreign Keys**: `destination_id` → `tourist_destinations(id)` ON DELETE CASCADE  
**Indexes**: `destination_id`, `display_order`

---

### news
Stores news articles and announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | TEXT | NOT NULL | Article title |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly slug |
| content | TEXT | NOT NULL | Full article content (rich text) |
| excerpt | TEXT | NOT NULL | Short excerpt/summary |
| thumbnail_url | TEXT | NOT NULL | Thumbnail image URL |
| category | TEXT | NOT NULL | Article category |
| status | TEXT | NOT NULL, CHECK | Status: 'draft' or 'published' |
| author_id | UUID | FOREIGN KEY | References auth.users(id) |
| published_at | TIMESTAMPTZ | - | Publication timestamp |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Foreign Keys**: `author_id` → `auth.users(id)`  
**Indexes**: `status`, `slug`, `published_at`

---

## Storage Buckets

| Bucket ID | Purpose | Max Size | Allowed Types | Public |
|-----------|---------|----------|---------------|--------|
| hero-images | Hero section images | 5MB | jpg, png, webp | Yes |
| profile-images | Village logos/photos | 5MB | jpg, png, webp | Yes |
| official-photos | Official portraits | 2MB | jpg, png, webp | Yes |
| destination-images | Destination photos | 5MB | jpg, png, webp | Yes |
| news-images | News thumbnails | 2MB | jpg, png, webp | Yes |

---

## Row Level Security (RLS) Policies

### Public Access (Unauthenticated Users)
- **SELECT** access on all tables
- **Exception**: News table only shows `status = 'published'`
- **Storage**: Read access to all buckets

### Authenticated Access (Admin Users)
- **ALL** operations (SELECT, INSERT, UPDATE, DELETE) on all tables
- **Storage**: Full CRUD access to all buckets

---

## Relationships

```
tourist_destinations (1) ──< destination_images (N)
    └─ ON DELETE CASCADE

auth.users (1) ──< news (N)
    └─ author_id reference
```

---

## Automatic Triggers

All tables have automatic `updated_at` timestamp updates via triggers:
- Trigger function: `update_updated_at_column()`
- Fires: BEFORE UPDATE on each row
- Action: Sets `updated_at = NOW()`
