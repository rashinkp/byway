// src/hooks/auth/useCurrentUser.ts
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useCurrentUser() {
  const { user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser();
    }
  }, [user, isLoading, fetchUser]);

  return {
    data: user,
    isLoading,
    refetch: fetchUser,
  };
}
