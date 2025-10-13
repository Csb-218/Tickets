'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/providers/auth-provider'
import { Spinner } from '@/components/ui/spinner'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: RouteGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useAuthStore((state) => state)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login')
        return
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/') // Redirect non-admin users to home
        return
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, requireAuth, requireAdmin])

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

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect to login
  }

  if (requireAdmin && !isAdmin) {
    return null // Will redirect to home
  }

  return <>{children}</>
}