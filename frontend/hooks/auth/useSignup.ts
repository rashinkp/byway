// src/hooks/auth/useSignup.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signup } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useSignup() {
  const { setEmail } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => signup(name, email, password),
    onSuccess: (data) => {
      setEmail(data?.data?.email);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Signed up successfully", {
        description: "Please verify your email with the OTP sent.",
      });
    },
    onError: (error: any) => {
      toast.error("Signup failed", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
