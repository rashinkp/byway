import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { user, isLoading, isInitialized, initializeAuth, setUser } =
    useAuthStore();
  const router = useRouter();

  const handleAuthInitialization = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const clearAuth = searchParams.get("clearAuth");
    const isLoginPage = window.location.pathname === "/login";

    // Skip if already initialized or on login page with clearAuth=true
    if (isInitialized || (isLoginPage && clearAuth)) {
      if (isLoginPage && clearAuth) {
        useAuthStore.getState().clearAuth();
      }
      return;
    }

    // Check for user data in x-user header
    try {
      const response = await fetch("/api/auth/user-header");
      if (response.ok) {
        const { user: userHeader } = await response.json();
        if (userHeader) {
          setUser(userHeader);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch user-header:", error);
    }

    // Initialize auth only if not loading and no user
    if (!isLoading && !user) {
      try {
        await initializeAuth();
      } catch (error) {
        if (!isLoginPage && !useAuthStore.getState().user) {
          router.push("/login");
        }
      }
    }
  }, [initializeAuth, router, isInitialized, isLoading, user, setUser]);

  // Use a ref to prevent double initialization in Strict Mode
  const hasInitialized = useCallback(() => {
    const state = useAuthStore.getState();
    return state.isInitialized || state.isLoading;
  }, []);

  useEffect(() => {
    if (!hasInitialized()) {
      handleAuthInitialization();
    }
  }, [handleAuthInitialization, hasInitialized]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
