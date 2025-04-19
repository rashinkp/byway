import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/api/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success("Reset OTP Sent", {
        description: "A verification code has been sent to your email.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message || "Failed to send reset OTP",
        duration: 5000,
      });
    },
  });
} 