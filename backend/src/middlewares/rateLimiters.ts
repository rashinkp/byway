import rateLimit from "express-rate-limit";
import { Request } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger";

const emailSchema = z.string().email().optional();

// Validate environment variables for configurable limiters
const getRateLimitConfig = (prefix: string) => {
  const windowMs = parseInt(process.env[`${prefix}_WINDOW_MS`] || "900000"); // Default: 15 minutes
  const max = parseInt(process.env[`${prefix}_MAX`] || "5"); // Default: 5 requests

  if (isNaN(windowMs) || windowMs <= 0) {
    throw new AppError(
      `Invalid ${prefix}_WINDOW_MS: must be a positive number`,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }
  if (isNaN(max) || max <= 0) {
    throw new AppError(
      `Invalid ${prefix}_MAX: must be a positive number`,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }

  return { windowMs, max };
};

export const resendOtpLimiter = rateLimit({
  ...getRateLimitConfig("RATE_LIMIT_OTP_RESEND"),
  message: async () => ({
    status: "error",
    message: `Too many OTP resend requests, please wait ${Math.round(
      getRateLimitConfig("RATE_LIMIT_OTP_RESEND").windowMs / 60000
    )} minutes`,
    code: "TOO_MANY_REQUESTS",
  }),
  keyGenerator: (req: Request) => {
    const emailResult = emailSchema.safeParse(req.body.email);
    if (!emailResult.success) {
      logger.warn("Invalid email in resend OTP request", { ip: req.ip });
      throw AppError.badRequest("Invalid email provided");
    }
    return emailResult.data || req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for ${req.path}`, {
      ip: req.ip,
      email: req.body.email || "unknown",
    });
    next(
      new AppError(
        options.message.message,
        StatusCodes.TOO_MANY_REQUESTS,
        options.message.code
      )
    );
  },
});

export const loginLimiter = rateLimit({
  ...getRateLimitConfig("RATE_LIMIT_LOGIN"),
  message: async () => ({
    status: "error",
    message: `Too many login attempts, please wait ${Math.round(
      getRateLimitConfig("RATE_LIMIT_LOGIN").windowMs / 60000
    )} minutes`,
    code: "TOO_MANY_REQUESTS",
  }),
  keyGenerator: (req: Request) => {
    const emailResult = emailSchema.safeParse(req.body.email);
    if (!emailResult.success) {
      logger.warn("Invalid email in login request", { ip: req.ip });
      throw AppError.badRequest("Invalid email provided");
    }
    return emailResult.data || req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for ${req.path}`, {
      ip: req.ip,
      email: req.body.email || "unknown",
    });
    next(
      new AppError(
        options.message.message,
        StatusCodes.TOO_MANY_REQUESTS,
        options.message.code
      )
    );
  },
});

export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests
  message: {
    status: "error",
    message: "Too many OTP verification requests, please wait 15 minutes",
    code: "TOO_MANY_REQUESTS",
  },
  keyGenerator: (req: Request) => {
    const emailResult = emailSchema.safeParse(req.body.email);
    if (!emailResult.success) {
      logger.warn("Invalid email in verify OTP request", { ip: req.ip });
      throw AppError.badRequest("Invalid email provided");
    }
    return emailResult.data || req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for ${req.path}`, {
      ip: req.ip,
      email: req.body.email || "unknown",
    });
    next(
      new AppError(
        options.message.message,
        StatusCodes.TOO_MANY_REQUESTS,
        options.message.code
      )
    );
  },
});
