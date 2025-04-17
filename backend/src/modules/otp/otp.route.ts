import { Router } from "express";
import { OtpController } from "./otp.controller";
import { adaptOtpController } from "../../adapters/expressOtpAdapters";
import { resendOtpLimiter, verifyOtpLimiter } from "../../middlewares/rateLimiters";



export const createOtpRouter = (otpController: OtpController): Router => {
  const otpRouter = Router();
  const otpAdapt = adaptOtpController(otpController);

  otpRouter.post("/verify",verifyOtpLimiter, otpAdapt.verifyOtp);
  otpRouter.post("/resend",resendOtpLimiter, resendOtpLimiter, otpAdapt.resendOtp);

  return otpRouter;
} 