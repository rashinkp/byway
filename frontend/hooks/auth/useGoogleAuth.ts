import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleAuth } from "@/api/auth";
import { useRoleRedirect } from "../useRoleRedirects";
import { useAuthStore } from "@/stores/auth.store";
import { clearAllCache } from "@/lib/utils";

interface UseGoogleAuthResult {
	handleGoogleAuth: () => void;
	isSubmitting: boolean;
	error: string | null;
}

export function useGoogleAuth(): UseGoogleAuthResult {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { redirectByRole } = useRoleRedirect();
	const { setUser } = useAuthStore();

	const handleGoogleAuth = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			setIsSubmitting(true);
			setError(null);
			try {
				if (!tokenResponse.access_token) {
					throw new Error("No ID token received from Google");
				}
				const response = await googleAuth(tokenResponse.access_token);
				toast.success("Google authentication successful", {
					description: "You are now logged in.",
				});

				// Clear all cache to ensure fresh data for the logged-in user
				clearAllCache();

				setUser(response.data); // Set user in the store
				redirectByRole(response.data.role || "/");
			} catch (err: unknown) {
				const error = err as Error;
				const errorMessages: Record<string, string> = {
					"This email is registered with a different authentication method":
						"This email is already registered with email/password. Please sign in with that method.",
					"This account is deactivated":
						"Your account is deactivated. Please contact support.",
					"Invalid Google ID token":
						"Failed to authenticate with Google. Please try again.",
				};
				const message =
					errorMessages[error.message] ||
					error.message ||
					"Google authentication failed";
				setError(message);
				toast.error(message);
			} finally {
				setIsSubmitting(false);
			}
		},
		onError: (error: { error?: string; message?: string }) => {
			const message =
				error.error === "popup_blocked"
					? "Please allow popups and try again"
					: "Google authentication failed";
			setError(message);
			toast.error(message);
		},
		flow: "implicit",
		scope: "openid email profile", // Ensures id_token is returned
	});

	return { handleGoogleAuth, isSubmitting, error };
}
