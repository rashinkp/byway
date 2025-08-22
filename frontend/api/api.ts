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
	return config;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error: AxiosError<ApiErrorResponse>) => {

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
			useAuthStore.getState().clearAuth();
			if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
		} else {
			useAuthStore.getState().handleAuthError(error);
		}

		const errorMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			"An unexpected error occurred";

		const enhancedError = new Error(
			errorMessage,
		) as AxiosError<ApiErrorResponse>;
		enhancedError.response = error.response;
		enhancedError.config = error.config;

		return Promise.reject(enhancedError);
	},
);
