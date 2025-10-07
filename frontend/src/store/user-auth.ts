import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'

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
  isAdmin:true 
}

export const createAuthStore = (
  initState: AuthState = defaultInitState,
) => {
  return createStore<UserAuthStore>()(devtools((set) => ({
    ...initState,
    signup: async (email: string, otp: string) => set((state) => {
      // simulate signup logic
      Promise.resolve(setTimeout(()=>{},3000))
      return ({ isAuthenticated: true, email: email })
    
    }),
    login: async (email: string, otp: string) => set((state) => {
      // simulate login logic
      Promise.resolve(setTimeout(()=>{},3000))
      return  ({ isAuthenticated: true, email: email , isAdmin:true })
    }
    ),
    logout: () => set((state) => ({ isAuthenticated: false, email: null })),
  })))
}
