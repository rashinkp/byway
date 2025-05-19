import { create } from "zustand";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";

interface AuthState {
  user: User | null;
  email: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setEmail: (email: string | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

let isInitializing = false; // Guard against concurrent initializeAuth calls

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  email: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setEmail: (email) => set({ email }),
  clearAuth: () => set({ user: null, email: null, isLoading: false }),
  initializeAuth: async () => {
    if (isInitializing || get().isLoading) return; // Prevent concurrent calls
    isInitializing = true;
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({
        user,
        email: user?.email || get().email,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        email: get().email,
        isLoading: false,
      });
    } finally {
      isInitializing = false;
    }
  },
}));
