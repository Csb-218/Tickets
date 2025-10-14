'use client'

import React, { useState } from 'react'
import { Shield, ShieldCheck, Settings } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/providers/auth-provider'
import { AdminPasswordDialog } from './admin-password-dialog'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AdminToggle() {
  const { isAdmin, verifyAdminPassword, toggleAdminMode, isAuthenticated } = useAuthStore((state) => state)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // Don't show the toggle if user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleToggleChange = (checked: boolean) => {
    if (checked) {
      // User wants to enable admin mode - show password dialog
      setShowPasswordDialog(true)
    } else {
      // User wants to disable admin mode - do it immediately
      toggleAdminMode(false)
    }
  }

  const handlePasswordVerify = async (password: string) => {
    const result = await verifyAdminPassword(password)
    
    if (result.success) {
      toggleAdminMode(true)
      return { success: true }
    } else {
      return { success: false, error: result.error }
    }
  }

  const handleCancel = () => {
    // User cancelled - don't change admin state
    // The switch will remain in its current state
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70">
          Admin Controls
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between w-full px-2 py-1.5">
                <div className="flex items-center gap-2 flex-1">
                  {isAdmin ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Shield className="h-4 w-4 text-gray-500" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Admin Mode
                    </span>
                    <span className="text-xs text-sidebar-foreground/70">
                      {isAdmin ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <Switch
                  checked={isAdmin}
                  onCheckedChange={handleToggleChange}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AdminPasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onVerify={handlePasswordVerify}
        onCancel={handleCancel}
      />
    </>
  )
}