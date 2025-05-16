import { z } from "zod";
import { FacebookAuthDto } from "../../domain/dtos/auth/facebook-auth.dto";
import { ForgotPasswordDto } from "../../domain/dtos/auth/forgot-password.dto";
import { GoogleAuthDto } from "../../domain/dtos/auth/googel-auth.dto";
import { AuthProvider } from "../../domain/enum/auth-provider.enum";
import { LoginDto } from "../../domain/dtos/auth/login.dto";
import { Role } from "../../domain/enum/role.enum";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { ResendOtpDto } from "../../domain/dtos/auth/resend-otp.dto";
import { ResetPasswordDto } from "../../domain/dtos/auth/reset-password.dto";
import { VerifyOtpDto } from "../../domain/dtos/auth/verify-otp.dto";


// FacebookAuthDto schema
const facebookAuthSchema = z.object({
  accessToken: z.string().min(1, "Facebook access token is required"),
  userId: z.string().min(1, "Facebook user ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  picture: z.string().url().optional(),
});

export function validateFacebookAuth(data: unknown): FacebookAuthDto {
  return facebookAuthSchema.parse(data);
}

// ForgotPasswordDto schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function validateForgotPassword(data: unknown): ForgotPasswordDto {
  return forgotPasswordSchema.parse(data);
}

// GoogleAuthDto schema
const googleAuthSchema = z.object({
  accessToken: z.string().min(1, "Google access token is required"),
});

export function validateGoogleAuth(data: unknown): GoogleAuthDto {
  return googleAuthSchema.parse(data);
}

// LoginDto schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  authProvider: z
    .enum([
      AuthProvider.EMAIL_PASSWORD,
      AuthProvider.GOOGLE,
      AuthProvider.FACEBOOK,
    ])
    .default(AuthProvider.EMAIL_PASSWORD),
});

export function validateLogin(data: unknown): LoginDto {
  return loginSchema.parse(data);
}

// RegisterDto schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([Role.USER, Role.ADMIN]).default(Role.USER),
});

export function validateRegister(data: unknown): RegisterDto {
  return registerSchema.parse(data);
}

// ResendOtpDto schema
const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function validateResendOtp(data: unknown): ResendOtpDto {
  return resendOtpSchema.parse(data);
}

// ResetPasswordDto schema
const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export function validateResetPassword(data: unknown): ResetPasswordDto {
  return resetPasswordSchema.parse(data);
}

// VerifyOtpDto schema
const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
});

export function validateVerifyOtp(data: unknown): VerifyOtpDto {
  return verifyOtpSchema.parse(data);
}
