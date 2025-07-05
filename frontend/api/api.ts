import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

interface ApiErrorResponse {
	message?: string;
	error?: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

export const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5001/api/v1",
	withCredentials: true,
	headers: {
		"Cache-Control": "no-cache",
	},
});

let isLoggingOut = false;

const getTokenClient = () => {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split(";");
	const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="));
	return jwtCookie ? jwtCookie.split("=")[1] : null;
};

export const getTokenServer = (cookieHeader: string) => {
	const cookies = cookieHeader.split(";");
	const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="));
	return jwtCookie ? jwtCookie.split("=")[1] : null;
};

api.interceptors.request.use((config) => {
	const token = getTokenClient();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
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
		const originalRequest = error.config as ExtendedAxiosRequestConfig;

		console.log("Interceptor error:", {
			status: error.response?.status,
			url: error.config?.url,
			retry: originalRequest._retry,
			isLoggingOut,
		});

		// List of endpoints that should not trigger logout on 401
		const guestAccessibleEndpoints = [
			"/reviews/course/",
			"/courses/",
			"/instructors/",
			"/categories/",
		];

		const isGuestAccessibleEndpoint = guestAccessibleEndpoints.some(
			(endpoint) => error.config?.url?.includes(endpoint),
		);

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!error.config?.url?.includes("/auth/logout") &&
			!isGuestAccessibleEndpoint
		) {
			console.log("Handling 401 for:", error.config?.url);
			if (isLoggingOut) {
				console.log("Already logging out, rejecting error");
				return Promise.reject(error);
			}

			isLoggingOut = true;
			originalRequest._retry = true;

			try {
				if (typeof window !== "undefined") {
					useAuthStore.getState().clearAuth();
					await logout();
					console.log("Logout successful, redirecting to /login");
					if (!window.location.pathname.includes("/login")) {
						window.location.href = "/login";
					} else {
						console.log("Already on /login, no redirect needed");
					}
				} else {
					console.log("Skipping logout/redirect: SSR context");
				}
			} catch (logoutError) {
				console.error("Logout failed during 401 handling:", logoutError);
			} finally {
				isLoggingOut = false;
				console.log("Reset isLoggingOut flag");
			}

			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Session invalidated. Please log in again.";
			const enhancedError = new Error(
				errorMessage,
			) as AxiosError<ApiErrorResponse>;
			enhancedError.response = error.response;
			enhancedError.config = error.config;
			return Promise.reject(enhancedError);
		}

		const errorMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			"An unexpected error occurred";

		console.log("Non-401 error:", errorMessage);
		const enhancedError = new Error(
			errorMessage,
		) as AxiosError<ApiErrorResponse>;
		enhancedError.response = error.response;
		enhancedError.config = error.config;

		return Promise.reject(enhancedError);
	},
);
