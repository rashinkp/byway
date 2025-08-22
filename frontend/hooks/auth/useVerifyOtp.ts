"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtp } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

interface UseVerifyOtpOptions {
	setRedirecting?: (val: boolean) => void;
	setLocalError?: (val: string | null) => void;
}

// Interface for the reset token response
interface ResetTokenResponse {
	resetToken?: string;
}

export function useVerifyOtp(options: UseVerifyOtpOptions = {}) {
	const { setRedirecting, setLocalError } = options;
	const { clearAuth } = useAuthStore();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: ({
			email,
			otp,
			type = "signup",
		}: {
			email: string;
			otp: string;
			type?: "signup" | "password-reset";
		}) => verifyOtp(otp, email, type),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["auth"] });
			if (setLocalError) setLocalError(null);
			if (setRedirecting) setRedirecting(true);
			if (variables.type === "password-reset") {
				const resetToken = (data?.data as ResetTokenResponse)?.resetToken;
				if (resetToken) {
					sessionStorage.setItem("resetToken", resetToken);
				}
				toast.success("OTP verified", {
					description: "Please set your new password.",
				});
				router.push("/reset-password");
			} else {
				toast.success("Email verified", {
					description:
						"Your email has been successfully verified. Please log in.",
				});
				router.push("/login");
			}
			clearAuth();
		},
		onError: (error: Error) => {
			if (setRedirecting) setRedirecting(false);
			if (setLocalError) setLocalError(error.message || "The OTP you entered is incorrect.");
			toast.error("Invalid OTP", {
				description: error.message || "The OTP you entered is incorrect.",
			});
		},
	});
}
