'use client'

import { useAuthStore } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { RouteGuard } from '@/components/auth/route-guard'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

export default function Home() {
  const { isAuthenticated, email, isAdmin, logout, loading } = useAuthStore((state) => state)

  const handleLogout = async () => {
    await logout()
  }

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Tickets App</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard requireAuth>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tickets App</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{email}</span>
                  {isAdmin && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Admin
                    </span>
                  )}
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Authentication Status</h3>
                <p className="text-sm text-blue-700">
                  ✅ Successfully authenticated with OTP
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">User Role</h3>
                <p className="text-sm text-green-700">
                  {isAdmin ? '👑 Administrator' : '👤 Regular User'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">Session</h3>
                <p className="text-sm text-purple-700">
                  🔐 Secured with Supabase
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>✨ OTP-based authentication using Supabase</li>
                <li>🔄 Automatic session management and token refresh</li>
                <li>🛡️ Protected routes with role-based access</li>
                <li>👑 Admin mode toggle with password verification</li>
                <li>📱 Responsive design with Tailwind CSS</li>
                <li>⚡ Built with Next.js 15 and React 19</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
