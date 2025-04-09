import { Router } from "express";
import { OtpController } from "./otp.controller";
import { adaptOtpController } from "../../adapters/expressOtpAdapters";
import { resendOtpLimiter } from "../../middlewares/reateLimiters";



export const createOtpRouter = (otpController: OtpController): Router => {
  const otpRouter = Router();
  const otpAdapt = adaptOtpController(otpController);

  otpRouter.post("/verify", otpAdapt.verifyOtp);
  otpRouter.post("/resend", resendOtpLimiter, otpAdapt.resendOtp);

  return otpRouter;
} 