"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyOtp } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useVerifyOtp() {
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

			if (variables.type === "password-reset") {
				const resetToken = data?.data?.resetToken;
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
		onError: (error: any) => {
			toast.error("Invalid OTP", {
				description: error.message || "The OTP you entered is incorrect.",
			});
		},
	});
}
