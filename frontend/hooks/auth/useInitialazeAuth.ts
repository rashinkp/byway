"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useInitializeAuth() {
  const { user, isInitialized, initializeAuth, setUser } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;

    // Check for x-user header (set by middleware)
    const fetchUserFromHeader = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          headers: {
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user from header:", error);
        setUser(null);
      }
    };

    // If no user data in store, try to fetch from header or initialize auth
    if (!user) {
      fetchUserFromHeader();
    } else {
      initializeAuth();
    }
  }, [user, isInitialized, setUser, initializeAuth]);
}
