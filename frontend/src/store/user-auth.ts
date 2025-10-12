import type { StateCreator } from 'zustand';

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

export const createAuthSlice: StateCreator<UserAuthStore, [], [], UserAuthStore> = (set) => ({
  ...defaultInitState,
  signup: async (email: string, otp: string) => {
    // simulate signup logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, email: email });
  },
  login: async (email: string, otp: string) => {
    // simulate login logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, email: email, isAdmin: true });
  },
  logout: () => {
    set({ isAuthenticated: false, email: null, isAdmin: false });
  },
});
