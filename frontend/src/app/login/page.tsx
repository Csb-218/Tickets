'use client'

import { AuthForm } from '@/components/auth/auth-form'
import { useAuthStore } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuthStore((state) => state)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm />
    </div>
  )
}