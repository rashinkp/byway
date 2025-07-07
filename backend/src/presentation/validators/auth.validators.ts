import { z } from "zod";
import {
  FacebookAuthDto,
} from "../../domain/dtos/auth/facebook-auth.dto";
import { AuthProvider } from "../../domain/enum/auth-provider.enum";
import { Role } from "../../domain/enum/role.enum";
import { ForgotPasswordDto } from "../../domain/dtos/auth/forgot-password.dto";
import { GoogleAuthDto } from "../../domain/dtos/auth/googel-auth.dto";
import { LoginDto } from "../../domain/dtos/auth/login.dto";
import { RegisterDto } from "../../domain/dtos/auth/register.dto";
import { ResendOtpDto } from "../../domain/dtos/auth/resend-otp.dto";
import { ResetPasswordDto } from "../../domain/dtos/auth/reset-password.dto";
import { VerifyOtpDto } from "../../domain/dtos/auth/verify-otp.dto";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// FacebookAuthDto schema
const facebookAuthSchema = z.object({
  accessToken: z.string().min(1, "Facebook access token is required"),
  userId: z.string().min(1, "Facebook user ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  picture: z.string().url().optional(),
});

// ForgotPasswordDto schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// GoogleAuthDto schema
const googleAuthSchema = z.object({
  accessToken: z.string().min(1, "Google access token is required"),
});

// LoginDto schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  authProvider: z
    .enum([AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.FACEBOOK])
    .default(AuthProvider.EMAIL_PASSWORD),
});

// RegisterDto schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([Role.USER, Role.ADMIN]).default(Role.USER),
});

// ResendOtpDto schema
const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ResetPasswordDto schema
const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// VerifyOtpDto schema
const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
  type: z.string(),
});

// Validation schemas for endpoints
export const facebookAuthSchemaDef: ValidationSchema = {
  body: facebookAuthSchema,
};

export const forgotPasswordSchemaDef: ValidationSchema = {
  body: forgotPasswordSchema,
};

export const googleAuthSchemaDef: ValidationSchema = {
  body: googleAuthSchema,
};

export const loginSchemaDef: ValidationSchema = {
  body: loginSchema,
};

export const registerSchemaDef: ValidationSchema = {
  body: registerSchema,
};

export const resendOtpSchemaDef: ValidationSchema = {
  body: resendOtpSchema,
};

export const resetPasswordSchemaDef: ValidationSchema = {
  body: resetPasswordSchema,
};

export const verifyOtpSchemaDef: ValidationSchema = {
  body: verifyOtpSchema,
};

// Validation functions
export function validateFacebookAuth(data: unknown): FacebookAuthDto {
  return facebookAuthSchema.parse(data);
}

export function validateForgotPassword(data: unknown): ForgotPasswordDto {
  return forgotPasswordSchema.parse(data);
}

export function validateGoogleAuth(data: unknown): GoogleAuthDto {
  return googleAuthSchema.parse(data);
}

export function validateLogin(data: unknown): LoginDto {
  return loginSchema.parse(data);
}

export function validateRegister(data: unknown): RegisterDto {
  return registerSchema.parse(data);
}

export function validateResendOtp(data: unknown): ResendOtpDto {
  return resendOtpSchema.parse(data);
}

export function validateResetPassword(data: unknown): ResetPasswordDto {
  return resetPasswordSchema.parse(data);
}

export function validateVerifyOtp(data: unknown): VerifyOtpDto {
  return verifyOtpSchema.parse(data);
}
