import { z } from 'zod'

// Hero Section Schema
export const heroSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  subtitle: z.string().optional(),
  cta_text: z.string()
    .min(1, 'CTA text is required')
    .max(50, 'CTA text must be 50 characters or less'),
  cta_link: z.string()
    .min(1, 'CTA link is required'),
  image_url: z.string()
    .min(1, 'Hero image is required'),
  is_active: z.boolean(),
  display_order: z.number()
    .min(0, 'Display order must be 0 or greater'),
})

export type HeroFormData = z.infer<typeof heroSchema>

// Village Profile Schema
export const profileSchema = z.object({
  village_name: z.string()
    .min(1, 'Village name is required'),
  sub_district: z.string()
    .min(1, 'Sub-district is required'),
  district: z.string()
    .min(1, 'District is required'),
  province: z.string()
    .min(1, 'Province is required'),
  postal_code: z.string()
    .regex(/^\d{5}$/, 'Postal code must be exactly 5 digits'),
  area_size: z.string()
    .refine((val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    }, 'Area size must be a positive number'),
  history: z.string()
    .min(1, 'Village history is required')
    .refine((val) => {
      // Remove HTML tags and count actual text content
      const textContent = val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
      return textContent.length >= 100
    }, 'History must be at least 100 characters (excluding HTML formatting)'),
  logo_url: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Official Schema
export const officialSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position must be 100 characters or less'),
  nip: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      const digits = val.replace(/\D/g, '')
      return digits.length === 18
    }, 'NIP must be exactly 18 digits'),
  photo_url: z.string().optional(),
  start_period: z.string().optional(),
  end_period: z.string().optional(),
  display_order: z.number()
    .min(0, 'Display order must be 0 or greater'),
})

export type OfficialFormData = z.infer<typeof officialSchema>

// Resident Schema
export const residentSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be 100 characters or less'),
  nik: z.string()
    .min(1, 'NIK is required')
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 16
    }, 'NIK must be exactly 16 digits'),
  gender: z.enum(['Laki-laki', 'Perempuan']).refine((val) => val !== undefined, {
    message: 'Gender is required',
  }),
  birth_date: z.string()
    .min(1, 'Birth date is required')
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      return date <= today
    }, 'Birth date cannot be in the future'),
  address: z.string()
    .min(1, 'Address is required'),
  occupation: z.string()
    .min(1, 'Occupation is required'),
  education: z.string()
    .min(1, 'Education is required'),
  marital_status: z.string()
    .min(1, 'Marital status is required'),
})

export type ResidentFormData = z.infer<typeof residentSchema>

// Destination Schema
export const destinationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters'),
  location: z.string()
    .min(1, 'Location is required'),
  category: z.string()
    .min(1, 'Category is required'),
  facilities: z.array(z.string()),
  maps_url: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
    .nullable(),
  umkm: z.array(z.object({
    id: z.string(),
    destination_id: z.string().optional(),
    name: z.string().min(1, 'UMKM name is required'),
    maps_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable(),
    display_order: z.number(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })).optional(),
  images: z.array(z.object({
    id: z.string(),
    destination_id: z.string(),
    image_url: z.string(),
    display_order: z.number(),
    created_at: z.string(),
  }))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
})

export type DestinationFormData = z.infer<typeof destinationSchema>

// News Schema
export const newsSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .min(100, 'Content must be at least 100 characters'),
  category: z.string()
    .min(1, 'Category is required'),
  status: z.enum(['draft', 'published'] as const),
  thumbnail_url: z.string()
    .min(1, 'Thumbnail image is required'),
})

export type NewsFormData = z.infer<typeof newsSchema>
