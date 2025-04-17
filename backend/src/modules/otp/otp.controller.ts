import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { OtpService } from "./otp.service";
import { JwtUtil } from "../../utils/jwt.util";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";

const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(6, "OTP must be 6 characters"),
});

const ResendOtpSchema = z.object({
  email: z.string().email("Invalid email"),
});

export class OtpController {
  constructor(private otpService: OtpService) {}

  async verifyOtp(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = VerifyOtpSchema.parse(input);
      const user = await this.otpService.verifyOtp(validatedInput);
      const token = JwtUtil.generateToken(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!
      );
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        token,
        message: "Email verified successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Verify OTP error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async resendOtp(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = ResendOtpSchema.parse(input);
      await this.otpService.resendOtp(validatedInput);
      return {
        status: "success",
        data: null,
        message: "OTP resent successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Resend OTP error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }
}
