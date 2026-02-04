/**
 * Database types generated from Supabase schema
 * This file contains the core database table types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hero_sections: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          cta_text: string
          cta_link: string
          image_url: string
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          cta_text: string
          cta_link: string
          image_url: string
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          cta_text?: string
          cta_link?: string
          image_url?: string
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      village_profile: {
        Row: {
          id: string
          village_name: string
          sub_district: string
          district: string
          province: string
          postal_code: string
          area_size: number
          history: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          village_name: string
          sub_district: string
          district: string
          province: string
          postal_code: string
          area_size: number
          history: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          village_name?: string
          sub_district?: string
          district?: string
          province?: string
          postal_code?: string
          area_size?: number
          history?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_structure: {
        Row: {
          id: string
          name: string
          position: string
          nip: string | null
          photo_url: string | null
          start_period: string | null
          end_period: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          nip?: string | null
          photo_url?: string | null
          start_period?: string | null
          end_period?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          nip?: string | null
          photo_url?: string | null
          start_period?: string | null
          end_period?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      residents: {
        Row: {
          id: string
          full_name: string
          nik: string
          gender: 'Laki-laki' | 'Perempuan'
          birth_date: string
          address: string
          occupation: string
          education: string
          marital_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          nik: string
          gender: 'Laki-laki' | 'Perempuan'
          birth_date: string
          address: string
          occupation: string
          education: string
          marital_status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          nik?: string
          gender?: 'Laki-laki' | 'Perempuan'
          birth_date?: string
          address?: string
          occupation?: string
          education?: string
          marital_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      village_demographics: {
        Row: {
          id: string
          total_population: number
          male_population: number
          female_population: number
          total_families: number
          altitude_mdpl: number
          area_size_km: number
          topography: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_population?: number
          male_population?: number
          female_population?: number
          total_families?: number
          altitude_mdpl?: number
          area_size_km?: number
          topography?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_population?: number
          male_population?: number
          female_population?: number
          total_families?: number
          altitude_mdpl?: number
          area_size_km?: number
          topography?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tourist_destinations: {
        Row: {
          id: string
          name: string
          description: string
          location: string
          category: string
          facilities: string[]
          ticket_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          location: string
          category: string
          facilities?: string[]
          ticket_price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          category?: string
          facilities?: string[]
          ticket_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      destination_images: {
        Row: {
          id: string
          destination_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          destination_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          destination_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          thumbnail_url: string
          category: string
          status: 'draft' | 'published'
          author_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          thumbnail_url: string
          category: string
          status: 'draft' | 'published'
          author_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          thumbnail_url?: string
          category?: string
          status?: 'draft' | 'published'
          author_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
