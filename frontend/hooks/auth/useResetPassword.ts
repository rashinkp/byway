// src/hooks/auth/useResetPassword.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useResetPassword() {
  const { setEmail } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => resetPassword(email, otp, newPassword),
    onSuccess: () => {
      setEmail(null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Password updated", {
        description: "Your password has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to reset password", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
