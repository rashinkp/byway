// src/stores/auth/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";

interface AuthState {
  user: User | null;
  email: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setEmail: (email: string | null) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      email: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }),
      clearAuth: () => set({ user: null, email: null }),
      fetchUser: async () => {
        if (get().user || get().isLoading) return;
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, email: state.email }),
    }
  )
);
