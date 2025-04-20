"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();

  // Initialize auth only once when the component mounts
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
