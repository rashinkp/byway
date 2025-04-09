// src/middlewares/rateLimiters.ts
import rateLimit from "express-rate-limit";
import { Request } from "express";

export const resendOtpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 1, // 1 request per minute
  message: {
    status: "error",
    message: "Too many OTP resend requests, please wait 1 minute",
    statusCode: 429,
  },
  keyGenerator: (req: Request) => {
    return (req.body.email as string) || req.ip || 'unknown'; // Use email if present, else IP
  },
  standardHeaders: true, // Add Rate-Limit headers
  legacyHeaders: false, // Disable old headers
});

// // Optional: Add more rate limiters here if needed
// export const registerLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 registration attempts per 15 minutes
//   message: {
//     status: "error",
//     message: "Too many registration attempts, please wait 15 minutes",
//     statusCode: 429,
//   },
//   keyGenerator: (req: Request) => (req.body.email as string) || req.ip,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
