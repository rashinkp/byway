import axios from "axios";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

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
  async (error) => {
    if (isLoggingOut || error.config._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/login")
    ) {
      isLoggingOut = true;
      try {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          error.config._retry = true; // Prevent retry loops
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
    return Promise.reject(error);
  }
);
