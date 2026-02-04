'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import Button from '@/src/components/shared/Button'
import Input from '@/src/components/shared/Input'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast.success('Login successful!')
      router.push(redirectTo)
      router.refresh()
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle specific Supabase error messages
      const errorMessage = error?.message || 'An error occurred during login'
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email or password')
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Please confirm your email address')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white px-8 py-10 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="admin@example.com"
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Website Desa
          </h1>
          <h2 className="mt-2 text-xl font-semibold text-green-700">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your village website
          </p>
        </div>

        <Suspense fallback={
          <div className="rounded-lg bg-white px-8 py-10 shadow-lg">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-gray-500">
          Protected by Supabase Authentication
        </p>
      </div>
    </div>
  )
}
