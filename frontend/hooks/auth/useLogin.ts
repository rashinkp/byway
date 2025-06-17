import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { clearAllCache } from "@/lib/utils";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      console.log("Login success, user:", user);
      
      // Clear all cache to ensure fresh data for the logged-in user
      queryClient.clear();
      clearAllCache();
      
      setUser(user);
      const redirectPath =
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "INSTRUCTOR"
          ? "/instructor"
          : "/";
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message);
      setUser(null);
    },
  });
}
