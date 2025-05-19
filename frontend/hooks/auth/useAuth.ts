import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { user, isLoading, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const clearAuth = new URLSearchParams(window.location.search).get(
      "clearAuth"
    );
    const isProtectedRoute =
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/instructor") ||
      window.location.pathname.startsWith("/user");
    if (!clearAuth && !user && !isProtectedRoute) {
      initializeAuth().then(() => {
        if (!useAuthStore.getState().user && !isLoading) {
          router.push("/login?clearAuth=true");
        }
      });
    }
  }, [initializeAuth, router, user, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
