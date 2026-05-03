import { create } from 'zustand';
import api from '../services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  status: 'active' | 'archived' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: { name: string; description: string }) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addMember: (projectId: string, userId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/project');
      set({ projects: response.data.data.projects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/project/${id}`);
      set({ currentProject: response.data.data.project, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createProject: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/project', data);
      set((state) => ({
        projects: [response.data.data.project, ...state.projects],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/project/${id}`, data);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? response.data.data.project : p)),
        currentProject: response.data.data.project,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/project/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addMember: async (projectId, email) => {
    const response = await api.post(`/project/${projectId}/members`, { email });
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === projectId ? response.data.data.project : p
      ),
      currentProject: response.data.data.project,
    }));
  },
}));