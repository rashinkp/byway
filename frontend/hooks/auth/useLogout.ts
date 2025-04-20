"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}
