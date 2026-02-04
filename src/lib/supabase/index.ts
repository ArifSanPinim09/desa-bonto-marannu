/**
 * Supabase client utilities
 * Export all Supabase-related functions for easy importing
 */

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export {
  signIn,
  signOut,
  getSession,
  getUser,
  isAuthenticated,
  getClientSession,
  getClientUser,
} from './auth'
