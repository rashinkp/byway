
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtp } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useVerifyOtp() {
  const { setUser, setEmail } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
    onSuccess: (user) => {
      setUser(user);
      setEmail(null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Email verified", {
        description: "Your email has been successfully verified.",
      });
    },
    onError: (error: any) => {
      toast.error("Invalid OTP", {
        description: error.message || "The OTP you entered is incorrect.",
      });
    },
  });
}
