import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login, signup, logout, verifyAuth } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        const data = await login(email, password);
        set({ user: data });
      },
      signup: async (name, email, password) => {
        const data = await signup(name, email, password);
        set({ user: data });
      },
      logout: async () => {
        await logout();
        set({ user: null });
      },
      verifyAuth: async () => {
        try {
          const data = await verifyAuth();
          set({ user: data });
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
