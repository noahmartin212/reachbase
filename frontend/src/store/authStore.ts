import { create } from 'zustand';
import authService from '../services/auth.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  workspaceId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  initialize: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    set({
      user,
      isAuthenticated,
      isLoading: false,
    });
  },
}));
