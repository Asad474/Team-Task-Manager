import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface UserState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      users: [],
      isLoading: false,

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/user/profile');
          set({ user: response.data.data.user, isLoading: false });
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },

      fetchUsers: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/user');
          set({ users: response.data.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setUser: (user) => set({ user }),

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.patch('/user/profile', data);
          set({ user: response.data.data.user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteUser: async (id) => {
        set({ isLoading: true });
        try {
          await api.delete(`/user/${id}`);
          set((state) => ({
            users: state.users.filter((u) => u._id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
