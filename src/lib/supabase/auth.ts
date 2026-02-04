import { createClient as createBrowserClient } from './client'
import { createClient as createServerClient } from './server'

/**
 * Authentication helper functions for both client and server
 */

/**
 * Sign in with email and password (client-side)
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Sign out (client-side)
 */
export async function signOut() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

/**
 * Get current user session (server-side)
 */
export async function getSession() {
  const supabase = await createServerClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return session
}

/**
 * Get current user (server-side)
 */
export async function getUser() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession()
    return !!session
  } catch {
    return false
  }
}

/**
 * Get current user session (client-side)
 */
export async function getClientSession() {
  const supabase = createBrowserClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return session
}

/**
 * Get current user (client-side)
 */
export async function getClientUser() {
  const supabase = createBrowserClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}
