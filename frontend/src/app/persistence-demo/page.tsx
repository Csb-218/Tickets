'use client'

import React from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Trash2,
  Plus,
  User,
  FolderOpen 
} from 'lucide-react'

export default function PersistenceDemo() {
  const {
    // Auth state
    isAdmin,
    isAuthenticated,
    email,
    loading,
    // Auth actions
    
    logout,
    verifyAdminPassword,
    toggleAdminMode,
    // Sidebar state
    navMain,
    // Sidebar actions
    addProject,
  } = useAppStore((state) => state)

  const handleLogin = async () => {
    // await login('demo@example.com', '123456')
  }

  const handleToggleAdmin = async () => {
    if (!isAdmin) {
      const result = await verifyAdminPassword('admin123')
      if (result.success) {
        toggleAdminMode(true)
      } else {
        alert('Invalid admin password! Use: admin123')
      }
    } else {
      toggleAdminMode(false)
    }
  }

  const handleAddProject = () => {
    const randomId = Math.random().toString(36).substring(7)
    const projectNames = ['Mobile App', 'Web Platform', 'API Service', 'Analytics Dashboard', 'User Portal']
    const randomName = projectNames[Math.floor(Math.random() * projectNames.length)]
    
    addProject({
      id: randomId,
      title: `${randomName} ${randomId}`,
      description: `Demo project ${randomId}`,
      url: `/dashboard/team/${randomName.toLowerCase().replace(/\s+/g, '-')}-${randomId}`,
    })
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('app-storage')
    window.location.reload()
  }

  const projectCount = navMain?.[0]?.items?.length || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Persistence Demo</h1>
        <p className="text-gray-600">
          Test the persistence functionality of UserAuthStore and SidebarStore
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth State Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication State
            </CardTitle>
            <CardDescription>
              Persisted: isAdmin, isAuthenticated, email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authenticated:</span>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admin Mode:</span>
                <Badge variant={isAdmin ? "destructive" : "secondary"} className="flex items-center gap-1">
                  {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                  {isAdmin ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email:</span>
                <span className="text-sm font-mono">{email || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Loading:</span>
                <Badge variant="outline">
                  {loading ? 'True' : 'False'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              {!isAuthenticated ? (
                <Button onClick={handleLogin} className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Simulate Login
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={handleToggleAdmin} 
                    variant={isAdmin ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isAdmin ? (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Disable Admin
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Enable Admin (admin123)
                      </>
                    )}
                  </Button>
                  <Button onClick={logout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar State Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Sidebar State
            </CardTitle>
            <CardDescription>
              Persisted: navMain (projects list)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Projects Count:</span>
                <Badge variant="outline">
                  {projectCount} projects
                </Badge>
              </div>
            </div>

            {projectCount > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Current Projects:</span>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {navMain?.[0]?.items?.map((item, index) => (
                    <div key={item.id || index} className="text-xs bg-gray-50 p-2 rounded">
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleAddProject} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Random Project
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Persistence Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Persistence Controls
          </CardTitle>
          <CardDescription>
            Test persistence by refreshing the page or clearing storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            <Button onClick={clearLocalStorage} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Storage
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>To test persistence:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Login and enable admin mode</li>
              <li>Add some projects</li>
              <li>Refresh the page - your state should be restored!</li>
              <li>Clear storage to reset everything</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}