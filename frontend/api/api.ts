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

api.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("Response error:", error.response?.status, error.message);
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      try {
        useAuthStore.getState().clearAuth();
        if (!window.location.pathname.includes("/login")) {
          await logout();
          window.location.href = "/login?clearAuth=true";
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
