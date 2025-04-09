import { Request, Response } from "express";
import { OtpController } from "../modules/otp/otp.controller";
import { JwtUtil } from "../utils/jwt.util";


export const adaptOtpController = (controller: OtpController) => ({

  verifyOtp: async (req: Request, res: Response) => {
    const result = await controller.verifyOtp(req.body);
    if (result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }
    res.status(result.statusCode).json({
      status: result.status,
      data: result.data,
      message:result.message,
    });
  },

  resendOtp: async (req: Request, res: Response) => {
    const result = await controller.resendOtp(req.body);
    res.status(result.statusCode).json(result);
  },
    
})