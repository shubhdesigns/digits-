import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; avatar_url?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      initialized: false,
      error: null,

      initialize: async () => {
        try {
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: { user } } = await supabase.auth.getUser();
            set({ user, session, initialized: true, loading: false });
          } else {
            set({ initialized: true, loading: false });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              const { data: { user } } = await supabase.auth.getUser();
              set({ user, session });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, session: null });
            }
          });
        } catch (error: any) {
          set({ error: error.message, loading: false, initialized: true });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, session: data.session, loading: false });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign in',
            loading: false 
          });
        }
      },

      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          });
          if (error) throw error;
          set({ user: data.user, loading: false });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign up',
            loading: false 
          });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null, loading: false });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign out',
            loading: false 
          });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reset password',
            loading: false 
          });
        }
      },

      updateProfile: async (data: { first_name?: string; last_name?: string; avatar_url?: string }) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.updateUser({
            data: data,
          });
          if (error) throw error;

          // Update local user state
          const { data: { user } } = await supabase.auth.getUser();
          set({ user, loading: false });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            loading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);