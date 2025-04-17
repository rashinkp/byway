import rateLimit from "express-rate-limit";
import { Request } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

const emailSchema = z.string().email().optional();

export const resendOtpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request per minute
  message: {
    status: "error",
    message: "Too many OTP resend requests, please wait 1 minute",
    code: "TOO_MANY_REQUESTS",
  },
  keyGenerator: (req: Request) => {
    const emailResult = emailSchema.safeParse(req.body.email);
    if (!emailResult.success) {
      throw AppError.badRequest("Invalid email provided");
    }
    return emailResult.data || req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: {
    status: "error",
    message: "Too many login attempts, please wait 15 minutes",
    code: "TOO_MANY_REQUESTS",
  },
  keyGenerator: (req: Request) => {
    const emailResult = emailSchema.safeParse(req.body.email);
    if (!emailResult.success) {
      throw AppError.badRequest("Invalid email provided");
    }
    return emailResult.data || req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
});
