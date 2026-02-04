/**
 * Hero Section types
 * Used for the main hero section on the homepage
 */

export interface HeroSection {
  id: string
  title: string
  subtitle?: string
  cta_text: string
  cta_link: string
  image_url: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface HeroSectionCreate {
  title: string
  subtitle?: string
  cta_text: string
  cta_link: string
  image_url: string
  is_active?: boolean
  display_order?: number
}

export interface HeroSectionUpdate {
  title?: string
  subtitle?: string
  cta_text?: string
  cta_link?: string
  image_url?: string
  is_active?: boolean
  display_order?: number
}
