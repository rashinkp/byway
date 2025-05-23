import { create } from "zustand";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: false,
  setUser: (user) => set({ user, isInitialized: true }),
  clearAuth: () => set({ 
    user: null, 
    isInitialized: false, 
    isLoading: false 
  }),
  initializeAuth: async () => {
    // Skip if already initialized
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      // First try to get user from x-user header
      const response = await fetch("/api/auth/user-header", {
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        const { user: userHeader } = await response.json();
        if (userHeader) {
          set({
            user: userHeader,
            isInitialized: true,
            isLoading: false,
          });
          return;
        }
      }

      // If no user in header, try to fetch from API
      try {
        const userData = await getCurrentUser();
        set({
          user: userData,
          isInitialized: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch user from API:", error);
        set({
          user: null,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        user: null,
        isInitialized: true,
        isLoading: false,
      });
    }
  },
}));
