// src/stores/auth/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      email: null,
      isLoading: false,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }),
      clearAuth: () => set({ user: null, email: null, isInitialized: true }),
      initializeAuth: async () => {
        // Only initialize if not already initialized
        if (get().isInitialized) return;
        
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isLoading: false, isInitialized: true });
        } catch (error) {
          set({ user: null, isLoading: false, isInitialized: true });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        email: state.email,
        isInitialized: state.isInitialized 
      }),
    }
  )
);
