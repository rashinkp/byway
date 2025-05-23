import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
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
  const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="));
  return jwtCookie ? jwtCookie.split("=")[1] : null;
};

export const getTokenServer = (cookieHeader: string) => {
  const cookies = cookieHeader.split(";");
  const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="));
  return jwtCookie ? jwtCookie.split("=")[1] : null;
};

api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = getTokenClient();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {

    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      isLoggingOut = true;
      try {
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          if (error.config) {
            (error.config as ExtendedAxiosRequestConfig)._retry = true;
          }
          useAuthStore.getState().clearAuth();
          await logout();
          window.location.href = "/login";
        }
      } catch (logoutError) {
        console.error("Logout failed during 401 handling:", logoutError);
      } finally {
        isLoggingOut = false;
      }
    }

    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "An unexpected error occurred";

    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage) as AxiosError<ApiErrorResponse>;
    enhancedError.response = error.response;
    enhancedError.config = error.config;

    return Promise.reject(enhancedError);
  }
);
