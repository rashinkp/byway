"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtp } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useVerifyOtp() {
  const { setUser, setEmail } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, otp, type = "signup" }: { email: string; otp: string; type?: "signup" | "password-reset" }) =>
      verifyOtp(otp, email, type),
    onSuccess: (user, variables) => {
      // Only set user for signup verification
      if (variables.type !== "password-reset") {
        setUser(user);
      }
      
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Email verified", {
        description: "Your email has been successfully verified.",
      });
      setEmail(null);
    },
    onError: (error: any) => {
      toast.error("Invalid OTP", {
        description: error.message || "The OTP you entered is incorrect.",
      });
    },
  });
}
