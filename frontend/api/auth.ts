import { api, getTokenServer } from "@/api/api";
import { User } from "@/types/user";

interface ApiResponse<T> {
	statusCode: number;
	success: boolean;
	message: string;
	data: T;
	error?: string;
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

export async function signup(data: SignupData): Promise<ApiResponse<User>> {
	try {
		const response = await api.post<ApiResponse<User>>("/auth/register", data);
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Signup failed",
		);
	}
}

export async function login(email: string, password: string) {
	try {
		const response = await api.post<ApiResponse<User>>("/auth/login", {
			email,
			password,
		});
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Login failed",
		);
	}
}

export async function googleAuth(
	access_token: string,
): Promise<ApiResponse<User>> {
	try {
		const response = await api.post<ApiResponse<User>>("/auth/google", {
			accessToken: access_token,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Google authentication failed",
		);
	}
}

export async function verifyOtp(
	otp: string,
	email: string,
	type: "signup" | "password-reset" = "signup",
): Promise<ApiResponse<User>> {
	try {
		const response = await api.post<ApiResponse<User>>("/auth/verify-otp", {
			otp,
			email,
			type,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"OTP verification failed",
		);
	}
}

export async function resendOtp(email: string): Promise<void> {
	try {
		await api.post<ApiResponse<unknown>>("/auth/resend-otp", { email });
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Resend OTP failed",
		);
	}
}

export async function forgotPassword(email: string): Promise<void> {
	try {
		await api.post<ApiResponse<unknown>>("/auth/forgot-password", { email });
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Forgot password request failed",
		);
	}
}

export async function resetPassword(
	email: string,
	otp: string,
	newPassword: string,
): Promise<void> {
	try {
		await api.post<ApiResponse<unknown>>("/auth/reset-password", {
			email,
			otp,
			newPassword,
		});
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Password reset failed",
		);
	}
}

export async function getCurrentUser(): Promise<User | null> {
	try {
		const response = await api.get<ApiResponse<User>>("/user/me");
		return response.data.data;
	} catch (error: any) {
		if (error.response?.status === 401) {
			return null;
		}
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to fetch current user",
		);
	}
}

export async function logout(): Promise<void> {
	try {
		await api.post<ApiResponse<unknown>>("/auth/logout");
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Logout failed",
		);
	}
}

export async function getCurrentUserServer(
	cookies: string,
): Promise<User | null> {
		const token = getTokenServer(cookies);
		const response = await api.get<ApiResponse<User>>("/user/me", {
			headers: {
				Cookie: cookies,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		});
		return response.data.data;
}

export async function facebookAuth(
	data: FacebookAuthRequest,
): Promise<ApiResponse<User>> {
	try {
		const response = await api.post<ApiResponse<User>>("/auth/facebook", data);
		return response.data;
	} catch (error: any) {
		console.error("Facebook auth error:", {
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to authenticate with Facebook",
		);
	}
}

export async function getVerificationStatus(email: string): Promise<{
	cooldownTime: number;
	isExpired: boolean;
}> {
	try {
		const response = await api.get(
			`/auth/verification-status?email=${encodeURIComponent(email)}`,
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Get verification status error:", error);
		throw new Error(
			error.response?.data?.message || "Failed to get verification status",
		);
	}
}
