'use client'

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { type UserAuthStore, createAuthSlice } from '@/store/user-auth'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { supabase } from '@/config/supabase'

// Create auth store factory
const createAuthStore = () =>
  create<UserAuthStore>()(
    devtools(
      (...a) => ({
        ...createAuthSlice(...a),
      }),
      { name: 'auth-store' }
    )
  )

type UserAuthStoreApi = ReturnType<typeof createAuthStore>

// Create context for the auth store
const UserAuthStoreContext = createContext<UserAuthStoreApi | undefined>(
  undefined,
)

export interface AuthProviderProps {
  children: ReactNode
}

// Combined Auth Provider - handles both store and session management
export function AuthProvider({ children }: AuthProviderProps) {
  // Create store reference
  const storeRef = useRef<UserAuthStoreApi | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createAuthStore()
  }

  return (
    <UserAuthStoreContext.Provider value={storeRef.current}>
      <SessionManager>{children}</SessionManager>
    </UserAuthStoreContext.Provider>
  )
}

// Session manager component that handles auth state changes
function SessionManager({ children }: { children: ReactNode }) {
  const { checkSession } = useAuthStore((state) => state)

  useEffect(() => {
    // Check initial session
    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        // Re-check session on any auth state change
        await checkSession()
      }
    )

    return () => subscription.unsubscribe()
  }, [checkSession])

  return <>{children}</>
}

// Custom hook to use the auth store
export const useAuthStore = <T,>(
  selector: (store: UserAuthStore) => T,
): T => {
  const userAuthStoreContext = useContext(UserAuthStoreContext)

  if (!userAuthStoreContext) {
    throw new Error(`useAuthStore must be used within AuthProvider`)
  }

  return useStore(userAuthStoreContext, selector)
}
