// src/hooks/auth/useLogout.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
    },
  });
}
