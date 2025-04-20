import { api } from "@/api/api";
import { User } from "@/types/user";

interface IVerifyOtpResponse {
  data: User;
}

interface IResendOtpResponse {
  message?: string;
}

interface IResetPasswordResponse {
  message?: string;
}

interface ILoginResponse {
  data: User;
}

interface ISignupResponse {
  data: User;
}

interface IVerifyAuthResponse {
  data: User;
}

interface IGetCurrentUserResponse {
  data: User;
}

interface ILogoutResponse {
  message?: string;
}

interface IForgotPasswordResponse {
  message?: string;
}

export async function signup(name: string, email: string, password: string) {
  try {
    const response = await api.post<ISignupResponse>("/auth/signup", {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post<ILoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function verifyOtp(email: string, otp: string): Promise<User> {
  try {
    const response = await api.post<IVerifyOtpResponse>("/otp/verify", {
      otp,
      email,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
}

export async function resendOtp(email: string): Promise<void> {
  try {
    await api.post<IResendOtpResponse>("/otp/resend", { email });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Resend OTP failed");
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await api.post<IForgotPasswordResponse>("/auth/forgot-password", { email });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Forgot password request failed"
    );
  }
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<void> {
  try {
    await api.post<IResetPasswordResponse>("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<IGetCurrentUserResponse>("/auth/me");
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch current user"
    );
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post<ILogoutResponse>("/auth/logout");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
}
