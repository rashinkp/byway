import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const clearAuth = new URLSearchParams(window.location.search).get(
      "clearAuth"
    );

    // Skip initialization if clearAuth=true or on login page
    if (clearAuth || window.location.pathname === "/login") {
      useAuthStore.getState().clearAuth();
      return;
    }

    // Initialize auth only if not initialized and not loading
    if (!isInitialized && !isLoading) {
      initializeAuth().catch(() => {
        // Redirect to login only if no user and not on login
        if (
          !useAuthStore.getState().user &&
          !useAuthStore.getState().isLoading &&
          window.location.pathname !== "/login"
        ) {
          router.push("/login?clearAuth=true");
        }
      });
    }
  }, [initializeAuth, router, isInitialized, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
