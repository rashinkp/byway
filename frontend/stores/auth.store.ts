import { create } from "zustand";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";

interface AuthState {
  user: User | null;
  email: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setEmail: (email: string | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  email: null,
  isLoading: false,
  isInitialized: false,
  setUser: (user) => set({ user, isInitialized: true, isLoading: false }),
  setEmail: (email) => set({ email }),
  clearAuth: () =>
    set({ user: null, email: null, isLoading: false, isInitialized: true }),
  initializeAuth: async () => {
    if (get().isInitialized || get().isLoading) return;

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
      console.error("Auth initialization error:", error);
      set({
        user: null,
        email: get().email,
        isLoading: false,
        isInitialized: true,
      });
    }
  },
}));
