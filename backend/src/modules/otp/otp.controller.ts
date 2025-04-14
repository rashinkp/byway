import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { IResendOtpInput, IVerifyOtpInput } from "./types";
import { OtpService } from "./otp.service";
import { JwtUtil } from "../../utils/jwt.util";



export class OtpController {
  constructor(private otpService: OtpService) { }

  
    async verifyOtp(input: IVerifyOtpInput): Promise<ApiResponse> {
      try {
        const user = await this.otpService.verifyOtp(input);
        const token = JwtUtil.generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });
        
        return {
          status: "success",
          data: {id:user.id , email:user.email , role:user.role},
          token,
          message: "Email verified successfully",
          statusCode: StatusCodes.OK,
        };
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          message: error instanceof Error ? error.message : "Verification failed",
          statusCode: StatusCodes.BAD_REQUEST,
        };
      }
    }
  
    async resendOtp(input: IResendOtpInput): Promise<ApiResponse> {
      try {
        await this.otpService.resendOtp(input);
        return {
          status: 'success',
          data: null,
          message: 'OTP resent successfully',
          statusCode: StatusCodes.OK,
        }
      } catch (error) {
        console.error(error);
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Resend',
          statusCode:StatusCodes.BAD_REQUEST,
        }
      }
  }
  
    
}