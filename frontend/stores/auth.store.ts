import { create } from "zustand";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";

interface AuthState {
  user: User | null;
  email: string | null;
  isLoading: boolean;
  isInitialized: boolean; // Track initialization status
  setUser: (user: User | null) => void;
  setEmail: (email: string | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

let isInitializing = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  email: null,
  isLoading: false,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setEmail: (email) => set({ email }),
  clearAuth: () =>
    set({ user: null, email: null, isLoading: false, isInitialized: true }),
  initializeAuth: async () => {
    if (isInitializing || get().isLoading || get().isInitialized) return;
    isInitializing = true;
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({
        user,
        email: user?.email || get().email,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({
        user: null,
        email: get().email,
        isLoading: false,
        isInitialized: true,
      });
    } finally {
      isInitializing = false;
    }
  },
}));
