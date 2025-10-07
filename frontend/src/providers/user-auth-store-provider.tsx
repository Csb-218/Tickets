// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type UserAuthStore, createAuthStore } from '@/store/user-auth'

export type AuthStoreApi = ReturnType<typeof createAuthStore>

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
)

export interface AuthStoreProviderProps {
  children: ReactNode
}

export const AuthStoreProvider = ({
  children,
}: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createAuthStore()
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  )
}

export const useAuth = <T,>(
  selector: (store: UserAuthStore) => T,
): T => {
  const authStoreContext = useContext(AuthStoreContext)

  if (!authStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(authStoreContext, selector)
}
