// src/hooks/auth/useResendOtp.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendOtp } from "@/api/auth";

export function useResendOtp() {
	return useMutation({
		mutationFn: (email: string) => resendOtp(email),
		onSuccess: () => {
			toast.success("OTP resent", {
				description: "A new verification code has been sent to your email.",
			});
		},
		onError: (error: any) => {
			toast.error("Failed to resend OTP", {
				description: error.message || "Something went wrong",
			});
		},
	});
}
