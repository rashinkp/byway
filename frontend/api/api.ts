import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";

interface ApiErrorResponse {
	message?: string;
	error?: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
	console.log("Request sent:", { url: config.url, method: config.method });
	return config;
});

api.interceptors.response.use(
	(response) => {
		console.log("Response received:", {
			url: response.config.url,
			status: response.status,
		});
		return response;
	},
	async (error: AxiosError<ApiErrorResponse>) => {
		console.log("Interceptor error:", {
			status: error.response?.status,
			url: error.config?.url,
		});

		// List of endpoints that should not trigger auth clearing or redirect on 401
		const guestAccessibleEndpoints = [
			"/reviews/course/",
			"/courses/",
			"/instructors/",
			"/categories/",
			"/login",
			"/signup",
			"/verify-otp",
			"/forgot-password",
			"/reset-password",
			"/", // Home page
		];

		const isGuestAccessibleEndpoint = guestAccessibleEndpoints.some(
			(endpoint) => error.config?.url?.includes(endpoint)
		);

		const isGuestPage = typeof window !== "undefined" && guestAccessibleEndpoints.some(
			(endpoint) => window.location.pathname.startsWith(endpoint)
		);

		// Handle 401 errors (unauthorized/disabled user)
		if (
			error.response?.status === 401 &&
			!error.config?.url?.includes("/auth/logout") &&
			!isGuestAccessibleEndpoint &&
			!isGuestPage
		) {
			console.log("Handling 401 for:", error.config?.url);
			console.log("[API] Calling clearAuth for 401");
			useAuthStore.getState().clearAuth();
			if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
				console.log("[API] Redirecting to /login due to 401 error");
				window.location.href = "/login";
			}
		} else {
			// For non-401 errors, use handleAuthError to preserve user data
			console.log("[API] Calling handleAuthError for non-401");
			useAuthStore.getState().handleAuthError(error);
		}

		const errorMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			"An unexpected error occurred";

		console.log("Error details:", errorMessage);
		const enhancedError = new Error(
			errorMessage,
		) as AxiosError<ApiErrorResponse>;
		enhancedError.response = error.response;
		enhancedError.config = error.config;

		return Promise.reject(enhancedError);
	},
);
