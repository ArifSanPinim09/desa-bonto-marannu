/**
 * Tourist Destination types
 * Used for managing tourist destinations and their images
 */

export interface DestinationImage {
  id: string
  destination_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface DestinationUMKM {
  id: string
  destination_id: string
  name: string
  maps_url?: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface TouristDestination {
  id: string
  name: string
  description: string
  location: string
  category: string
  facilities: string[]
  maps_url?: string | null
  images?: DestinationImage[]
  umkm?: DestinationUMKM[]
  created_at: string
  updated_at: string
}

export interface TouristDestinationCreate {
  name: string
  description: string
  location: string
  category: string
  facilities?: string[]
  maps_url?: string | null
}

export interface TouristDestinationUpdate {
  name?: string
  description?: string
  location?: string
  category?: string
  facilities?: string[]
  maps_url?: string | null
}

export interface DestinationImageCreate {
  destination_id: string
  image_url: string
  display_order?: number
}

export interface DestinationImageUpdate {
  image_url?: string
  display_order?: number
}

export interface DestinationUMKMCreate {
  destination_id: string
  name: string
  maps_url?: string | null
  display_order?: number
}

export interface DestinationUMKMUpdate {
  name?: string
  maps_url?: string | null
  display_order?: number
}
