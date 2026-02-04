/**
 * News types
 * Used for managing news articles and blog posts
 */

export type NewsStatus = 'draft' | 'published'

export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  thumbnail_url: string
  category: string
  status: NewsStatus
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsCreate {
  title: string
  slug: string
  content: string
  excerpt: string
  thumbnail_url: string
  category: string
  status: NewsStatus
  author_id?: string
  published_at?: string
}

export interface NewsUpdate {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  thumbnail_url?: string
  category?: string
  status?: NewsStatus
  author_id?: string
  published_at?: string
}

export interface NewsWithAuthor extends News {
  author?: {
    id: string
    email: string
    full_name?: string
  }
}
