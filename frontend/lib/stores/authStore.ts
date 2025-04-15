import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  login,
  signup,
  verifyOtp,
  resendOtp,
  logout,
  verifyAuth,
  forgotPassword,
  resetPassword,
} from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
}

interface AuthState {
  user: User | null;
  email: string | null;
  setEmail: (email: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      email: null,
      setEmail: (email) => set({ email }),
      login: async (email, password) => {
        const data = await login(email, password);
        set({ user: data, email: null });
      },
      signup: async (name, email, password) => {
        const data = await signup(name, email, password);
        set({ email: data.email }); // Store email for OTP
      },
      verifyOtp: async (email, otp) => {
        const data = await verifyOtp(email, otp);
        setTimeout(() => {}, 60000);
        set({ user: data, email: null });
      },
      resendOtp: async (email) => {
        await resendOtp(email);
      },
      logout: async () => {
        await logout();
        set({ user: null, email: null });
      },

      forgotPassword: async (email: string) => {
        try {
          await forgotPassword(email);
          set({ email });
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Failed to send reset OTP"
          );
        }
      },

      resetPassword: async (
        email: string,
        otp: string,
        newPassword: string
      ) => {
        try {
          await resetPassword(email , otp , newPassword);
          set({ email: null });
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Failed to reset password"
          );
        }
      },

      verifyAuth: async () => {
        try {
          const data = await verifyAuth();
          set({ user: data, email: null });
        } catch {
          set({ user: null, email: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, email: state.email }),
    }
  )
);
