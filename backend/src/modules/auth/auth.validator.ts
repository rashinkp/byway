import { z } from "zod";

export const RegisterAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterUserSchema = z.object({
   name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(6, "OTP must be 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});


export const GoogleAuthSchema = z.object({
  access_token: z.string().min(1, "Google ID token is required"),
});

export const FacebookAuthSchema = z.object({
  accessToken: z.string().min(1, "Facebook access token is required"),
  userId: z.string().min(1, "Facebook user ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  picture: z.string().url("Invalid picture URL").optional(),
});