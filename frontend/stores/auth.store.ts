import { create } from "zustand";
import { User } from "@/types/user";
import { getCurrentUser } from "@/api/auth";
import { clearAllCache } from "@/lib/utils";

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  email: string | null;
  setUser: (user: User | null) => void;
  setEmail: (email: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: false,
  email: null,
  setUser: (user) => {
    // Clear cache when user state changes
    clearAllCache();
    set({ user, isInitialized: true });
  },
  setEmail: (email) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_email", email);
    }
    set({ email });
  },
  clearAuth: () => {
    // Clear cache when auth is cleared
    clearAllCache();
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_email");
    }
    set({
      user: null,
      isInitialized: true, // Keep initialized to avoid re-fetching
      isLoading: false,
      email: null,
    });
  },
  initializeAuth: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      // Initialize email from localStorage
      if (typeof window !== "undefined") {
        const storedEmail = localStorage.getItem("auth_email");
        if (storedEmail) {
          set({ email: storedEmail });
        }
      }

      // First try to get user from x-user header
      const response = await fetch("/api/auth/user-header", {
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
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

      // Fetch user from API
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
