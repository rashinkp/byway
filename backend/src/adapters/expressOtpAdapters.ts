import { Request, Response, NextFunction } from "express";
import { OtpController } from "../modules/otp/otp.controller";
import { JwtUtil } from "../utils/jwt.util";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const adaptOtpController = (controller: OtpController) => ({
  verifyOtp: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.verifyOtp(req.body);
    if (result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }
    res.status(result.statusCode).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  }),

  resendOtp: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.resendOtp(req.body);
    res.status(result.statusCode).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  }),
});
