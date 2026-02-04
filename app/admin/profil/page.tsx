'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { VillageProfile } from '@/src/types/profile'
import ProfileForm from '@/src/components/admin/forms/ProfileForm'
import LoadingSpinner from '@/src/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function ProfilPage() {
  const [profile, setProfile] = useState<VillageProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  async function fetchProfile() {
    try {
      setIsLoading(true)
      // @ts-ignore - Supabase type inference issue
      const { data, error } = await supabase
        .from('village_profile')
        .select('*')
        .limit(1)
        .single()

      if (error) {
        // If no profile exists yet, that's okay
        if (error.code === 'PGRST116') {
          setProfile(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load village profile')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  function handleSuccess() {
    fetchProfile()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Village Profile Management</h1>
        <p className="mt-2 text-gray-600">
          {profile ? 'Edit' : 'Create'} village profile information
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <ProfileForm profile={profile} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
