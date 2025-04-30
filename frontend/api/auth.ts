import {api} from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
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

interface SignupData {
  email: string;
  password: string;
  name: string;
}



interface FacebookAuthRequest {
  accessToken: string;
  userId: string;
  name: string;
  email?: string;
  picture?: string;
}



export async function signup(data: SignupData) {
  try {
    const response = await api.post<ISignupResponse>("/auth/signup", data);
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

export async function googleAuth(
  access_token: string
): Promise<IVerifyAuthResponse> {
  try {
    const response = await api.post<IVerifyAuthResponse>("/auth/google", {
      access_token,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Google authentication failed"
    );
  }
}

export async function verifyOtp(otp: string, email: string, type: "signup" | "password-reset" = "signup"): Promise<User> {
  try {
    const response = await api.post<IVerifyOtpResponse>(
      "/otp/verify",
      { otp, email, type }
    );
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
    // Check if the error is from our backend AppError
    if (error.response?.data?.status === "error") {
      throw new Error(error.response.data.message || "Forgot password request failed");
    }
    // For other errors
    throw new Error(error.response?.data?.message || "Forgot password request failed");
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



export async function getCurrentUserServer(
  cookies: string
): Promise<User | null> {
  try {
    const response = await api.get<IGetCurrentUserResponse>("/auth/me", {
      headers: {
        Cookie: cookies, // Forward the securecookie
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    console.error("Error fetching current user server-side:", error);
    return null;
  }
}


export async function facebookAuth(
  data: FacebookAuthRequest
): Promise<ApiResponse> {
  try {
    const response = await api.post<ApiResponse>(
      "/auth/facebook",
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error during Facebook authentication:", error);
    throw error.response?.data?.error || "Failed to authenticate with Facebook";
  }
}