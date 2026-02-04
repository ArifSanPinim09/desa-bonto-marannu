/**
 * Village Profile types
 * Used for displaying and managing village identity and history
 */

export interface VillageProfile {
  id: string
  village_name: string
  sub_district: string
  district: string
  province: string
  postal_code: string
  area_size: number
  history: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface VillageProfileCreate {
  village_name: string
  sub_district: string
  district: string
  province: string
  postal_code: string
  area_size: number
  history: string
  logo_url?: string
}

export interface VillageProfileUpdate {
  village_name?: string
  sub_district?: string
  district?: string
  province?: string
  postal_code?: string
  area_size?: number
  history?: string
  logo_url?: string
}
