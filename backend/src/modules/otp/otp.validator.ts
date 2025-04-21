import { z } from "zod";

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(6, "OTP must be 6 characters"),
  type: z.enum(["signup", "password-reset"]).optional(),
});

export const ResendOtpSchema = z.object({
  email: z.string().email("Invalid email"),
});