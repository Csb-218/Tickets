import { createStore } from 'zustand'

export type AuthState = {
    isAdmin:boolean
    isAuthenticated: boolean
    email:string | null
}

export type AuthActions = {
  signup: (email: string, otp: string) => Promise<void>
  login: (email: string, otp: string) => Promise<void>
  logout: () => void
}

export type UserAuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  isAuthenticated: false,
  email: null,
  isAdmin:false
}

export const createAuthStore = (
  initState: AuthState = defaultInitState,
) => {
  return createStore<UserAuthStore>()((set) => ({
    ...initState,
    signup: async (email: string, otp: string) => set((state) => ({ isAuthenticated: true, email: email })),
    login: async (email: string, otp: string) => set((state) => ({ isAuthenticated: true, email: email })),
    logout: () => set((state) => ({ isAuthenticated: false, email: null })),
  }))
}
