/**
 * Central export file for all types
 * Import types from here for consistency across the application
 */

// Database types
export type { Database, Json } from './database'

// Hero Section types
export type {
  HeroSection,
  HeroSectionCreate,
  HeroSectionUpdate,
} from './hero'

// Village Profile types
export type {
  VillageProfile,
  VillageProfileCreate,
  VillageProfileUpdate,
} from './profile'

// Official types
export type {
  Official,
  OfficialCreate,
  OfficialUpdate,
} from './official'

// Demographics types
export type {
  VillageDemographics,
  VillageDemographicsUpdate,
  DemographicStats,
  GeographicInfo,
} from './demographics'

// Destination types
export type {
  DestinationImage,
  TouristDestination,
  TouristDestinationCreate,
  TouristDestinationUpdate,
  DestinationImageCreate,
  DestinationImageUpdate,
} from './destination'

// News types
export type {
  NewsStatus,
  News,
  NewsCreate,
  NewsUpdate,
  NewsWithAuthor,
} from './news'
