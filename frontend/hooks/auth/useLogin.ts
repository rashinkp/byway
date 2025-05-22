import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      console.log("Login success, user:", user);
      setUser(user);
      const redirectPath =
        user.role === "ADMIN"
          ? "/admin/dashboard"
          : user.role === "INSTRUCTOR"
          ? "/instructor/dashboard"
          : "/";
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message);
      setUser(null);
    },
  });
}
 