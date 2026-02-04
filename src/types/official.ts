/**
 * Organization Structure types
 * Used for managing village government officials
 */

export interface Official {
  id: string
  name: string
  position: string
  nip?: string
  photo_url?: string
  start_period?: string
  end_period?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface OfficialCreate {
  name: string
  position: string
  nip?: string
  photo_url?: string
  start_period?: string
  end_period?: string
  display_order?: number
}

export interface OfficialUpdate {
  name?: string
  position?: string
  nip?: string
  photo_url?: string
  start_period?: string
  end_period?: string
  display_order?: number
}
