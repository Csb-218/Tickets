import type { StateCreator } from 'zustand';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

export type AuthState = {
    isAdmin: boolean
    isAuthenticated: boolean
    email: string | null
    user: User | null
    loading: boolean
}

export type AuthActions = {
  sendOtp: (email: string) => Promise<{ error?: string; success?: boolean }>
  verifyOtp: (email: string, otp: string) => Promise<{ error?: string; success?: boolean }>
  checkSession: () => Promise<void>
  logout: () => Promise<void>
}

export type UserAuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  isAuthenticated: false,
  email: null,
  user: null,
  isAdmin: false,
  loading: true
}

export const createAuthSlice: StateCreator<UserAuthStore, [], [], UserAuthStore> = (set) => ({
  ...defaultInitState,
  
  sendOtp: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) {
        console.error('OTP send error:', error.message);
        return { error: error.message };
      }
      
      // Log the response to debug OTP vs Magic Link behavior
      console.log('Auth response:', { data, error });
      
      // According to Supabase docs, for OTP: data.user and data.session should be null
      if (data && data.user === null && data.session === null) {
        console.log('✅ OTP sent successfully - check email for 6-digit code');
        return { success: true };
      } else if (data && (data.user || data.session)) {
        console.warn('⚠️  Unexpected response - Supabase might be sending magic link instead of OTP');
        console.warn('Expected: { user: null, session: null }');
        console.warn('Received:', data);
        return { error: 'Supabase is configured for magic links, not OTP codes. Please check dashboard settings.' };
      } else {
        console.log('✅ OTP request completed - check email for 6-digit code');
        return { success: true };
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  verifyOtp: async (email: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });

      console.log('OTP verification response:', { data, error })
      
      if (error) {
        console.error('OTP verification error:', error.message);
        return { error: error.message };
      }
      
      if (data?.user) {
        const isAdmin = data.user.email?.includes('admin') || false;
        set({ 
          isAuthenticated: true, 
          email: data.user.email || null, 
          user: data.user,
          isAdmin: isAdmin,
          loading: false
        });
        return { success: true };
      }
      
      return { error: 'Verification failed' };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  checkSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error.message);
        set({ ...defaultInitState, loading: false });
        return;
      }
      
      if (session?.user) {
        const isAdmin = session.user.email?.includes('admin') || false;
        set({ 
          isAuthenticated: true, 
          email: session.user.email || null, 
          user: session.user,
          isAdmin: isAdmin,
          loading: false
        });
      } else {
        set({ ...defaultInitState, loading: false });
      }
    } catch (error) {
      console.error('Unexpected session error:', error);
      set({ ...defaultInitState, loading: false });
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
    } finally {
      set({ ...defaultInitState, loading: false });
    }
  },
});
