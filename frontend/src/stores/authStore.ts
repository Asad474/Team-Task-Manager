import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useUserStore } from './userStore';

interface AuthState {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/login', { email, password });
          
          // Sync user state in userStore
          await useUserStore.getState().fetchUser();
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/register', { name, email, password });
          
          // Sync user state in userStore
          await useUserStore.getState().fetchUser();
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          useUserStore.getState().setUser(null);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);