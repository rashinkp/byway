import { useState, useEffect } from "react";
import { getVerificationStatus } from "@/api/auth";

interface UseVerificationStatusProps {
	email: string | null;
	onError?: (error: Error) => void;
}

export function useVerificationStatus({
	email,
	onError,
}: UseVerificationStatusProps) {
	const [resendCooldown, setResendCooldown] = useState(60);
	const [isLoading, setIsLoading] = useState(false);

	// Initialize cooldown from backend
	useEffect(() => {
		if (email) {
			setIsLoading(true);
			getVerificationStatus(email)
				.then((response) => {
					setResendCooldown(response.cooldownTime);
				})
				.catch((error) => {
					onError?.(error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [email, onError]);

	// Cooldown timer
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(
				() => setResendCooldown(resendCooldown - 1),
				1000,
			);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	// Format cooldown time
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Refresh verification status
	const refreshStatus = async () => {
		if (!email) return;

		setIsLoading(true);
		try {
			const response = await getVerificationStatus(email);
			setResendCooldown(response.cooldownTime);
		} catch (error) {
			onError?.(error as Error);
		} finally {
			setIsLoading(false);
		}
	};	

	return {
		resendCooldown,
		isLoading,
		formatTime,
		refreshStatus,
		setResendCooldown,
	};
}
