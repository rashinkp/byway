import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
