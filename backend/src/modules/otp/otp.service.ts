import * as nodemailer from "nodemailer";
import { randomInt } from "crypto";
import {
  IGenerateAndSendOtpInput,
  IResendOtpInput,
  IVerifyOtpInput,
} from "./types";
import { IOtpRepository } from "./otp.repository";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export class OtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private emailUser: string,
    private emailPass: string
  ) {
    if (!emailUser || !emailPass) {
      throw new AppError(
        "Email credentials not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.emailUser,
        pass: this.emailPass,
      },
    });

    await transporter.sendMail({
      from: this.emailUser,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is ${otp}. It expires in 10 minutes`,
    });
  }

  async verifyOtp(
    input: IVerifyOtpInput
  ): Promise<{ id: string; email: string; role: string }> {
    try {
      return await this.otpRepository.verifyOtp(input.email, input.otp);
    } catch (error) {
      throw error instanceof AppError
        ? error
        : AppError.badRequest(
            error instanceof Error ? error.message : "Verification failed"
          );
    }
  }

  async resendOtp(input: IResendOtpInput): Promise<void> {
    try {
      await this.otpRepository.resendOtp(input.email);
    } catch (error) {
      throw error instanceof AppError
        ? error
        : AppError.badRequest(
            error instanceof Error ? error.message : "Resend OTP failed"
          );
    }
  }

  async generateAndSendOtp(input: IGenerateAndSendOtpInput): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.otpRepository.generateAndSendOtp(
      input.email,
      input.userId,
      otp,
      expiresAt
    );
    try {
      await this.sendOtpEmail(input.email, otp);
    } catch (error) {
      throw AppError.badRequest("Failed to send OTP email");
    }
  }
}
