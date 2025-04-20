import { Router } from "express";
import { OtpController } from "./otp.controller";
import { adaptOtpController } from "../../adapters/expressOtpAdapters";
import { resendOtpLimiter, verifyOtpLimiter } from "../../middlewares/rateLimiters";



export const createOtpRouter = (otpController: OtpController): Router => {
  const otpRouter = Router();
  const otpAdapt = adaptOtpController(otpController);

  //todo : add otp limitters
  otpRouter.post("/verify", otpAdapt.verifyOtp);
  otpRouter.post("/resend", otpAdapt.resendOtp);

  return otpRouter;
} 