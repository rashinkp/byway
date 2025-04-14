import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";

export function useAuth() {
  const { user, verifyAuth } = useAuthStore();

  useEffect(() => {
    verifyAuth(); 
  }, [verifyAuth]);

  return { user, isAuthenticated: !!user };
}
