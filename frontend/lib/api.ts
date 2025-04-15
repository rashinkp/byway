import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
});

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data; // { id, email, role }
  } catch (error) {
    throw new Error(
      (error as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Login failed"
    );
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data.data; // { id, email }
  } catch (error) {
    throw new Error(
      (error as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Signup failed"
    );
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const response = await api.post("/otp/verify", { email, otp });
    return response.data.data; 
  } catch (error) {
    throw new Error(
      (error as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Invalid OTP"
    );
  }
}

export async function resendOtp(email: string) {
  try {
    const response = await api.post("/otp/resend", { email });
    return response.data; 
  } catch (error) {
    throw new Error(
      (error as AxiosError<ApiErrorResponse>).response?.data?.message ||
        "Failed to resend OTP"
    );
  }
}

export async function verifyAuth() {
  try {
    const response = await api.get("/auth/me");
    return response.data.data; // { id, email, role }
  } catch {
    throw new Error("Invalid session");
  }
}

export async function forgotPassword(email:string) {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.data;
  } catch (error) {
    throw new Error('couldn\'t submit your email');
  }
}
export async function resetPassword(email:string , otp:string , newPassword:string) {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data.data;
  } catch (error) {
    throw new Error('couldn\'t submit your email');
  }
}


export async function logout() {
  await api.post("/auth/logout");
}

