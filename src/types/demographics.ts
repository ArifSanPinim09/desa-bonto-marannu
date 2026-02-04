/**
 * Village Demographics & Geography types
 * Used for managing village demographic and geographic data
 */

export interface VillageDemographics {
  id: string
  total_population: number
  male_population: number
  female_population: number
  total_families: number
  altitude_mdpl: number
  area_size_km: number
  topography: string
  description?: string
  created_at: string
  updated_at: string
}

export interface VillageDemographicsUpdate {
  total_population?: number
  male_population?: number
  female_population?: number
  total_families?: number
  altitude_mdpl?: number
  area_size_km?: number
  topography?: string
  description?: string
}

export interface DemographicStats {
  totalPopulation: number
  malePopulation: number
  femalePopulation: number
  totalFamilies: number
  malePercentage: number
  femalePercentage: number
}

export interface GeographicInfo {
  altitudeMdpl: number
  areaSizeKm: number
  topography: string
  description?: string
}
