import { create } from 'zustand';
import api from '../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  projectId: string;
  assignedTo: { _id: string; name: string; email: string };
  assignedBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (projectId) => {
    set({ isLoading: true });
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
      const response = await api.get(url);
      set({ tasks: response.data.data.tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/tasks', data);
      set((state) => ({
        tasks: [response.data.data.task, ...state.tasks],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? response.data.data.task : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTaskStatus: async (id, status) => {
    await get().updateTask(id, { status });
  },
}));