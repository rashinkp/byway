"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useForgotPassword() {
  const { setEmail } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (_, email) => {
      setEmail(email); 
      toast.success("Reset OTP Sent", {
        description: "A verification code has been sent to your email.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message || "Failed to send reset OTP. Please check if the email exists.",
        duration: 5000,
      });
    },
  });
}
