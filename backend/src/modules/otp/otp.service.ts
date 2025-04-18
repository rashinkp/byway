import * as nodemailer from "nodemailer";
import { randomInt } from "crypto";
import {
  IGenerateAndSendOtpInput,
  IOtpRepository,
  IResendOtpInput,
  IVerifyOtpInput,
} from "./otp.types";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";

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
    try {
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
    } catch (error) {
      logger.error("Failed to send OTP email", { error, email });
      throw new AppError(
        "Failed to send OTP email",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "EMAIL_ERROR"
      );
    }
  }

  async verifyOtp(
    input: IVerifyOtpInput
  ): Promise<{ id: string; email: string; role: string }> {
    const verification = await this.otpRepository.findVerificationByEmail(
      input.email
    );

    if (
      !verification ||
      verification.isUsed ||
      verification.expiresAt < new Date() ||
      verification.attemptCount >= 10
    ) {
      logger.warn("Invalid or expired OTP", { email: input.email });
      throw new AppError(
        "Invalid or expired OTP",
        StatusCodes.BAD_REQUEST,
        "INVALID_OTP"
      );
    }

    if (verification.otp !== input.otp) {
      await this.otpRepository.incrementAttemptCount(verification.id);
      logger.warn("Incorrect OTP attempt", {
        email: input.email,
        attemptCount: verification.attemptCount + 1,
      });
      throw new AppError(
        "Incorrect OTP",
        StatusCodes.BAD_REQUEST,
        "INCORRECT_OTP"
      );
    }

    await this.otpRepository.updateVerificationStatus(
      verification.id,
      verification.userId,
      true,
      true
    );

    return {
      id: verification.user.id,
      email: verification.user.email,
      role: verification.user.role,
    };
  }

  async resendOtp(input: IResendOtpInput): Promise<void> {
    const verification = await this.otpRepository.findVerificationByEmail(
      input.email
    );

    if (!verification || verification.isUsed) {
      logger.warn("No pending verification found", { email: input.email });
      throw new AppError(
        "No pending verification found",
        StatusCodes.BAD_REQUEST,
        "NO_VERIFICATION"
      );
    }

    if (verification.expiresAt > new Date() && verification.attemptCount < 10) {
      logger.warn("OTP still valid", { email: input.email });
      throw new AppError(
        "OTP still valid, try again later",
        StatusCodes.BAD_REQUEST,
        "OTP_VALID"
      );
    }

    const newOtp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpRepository.updateOtp(verification.id, newOtp, expiresAt, 0);

    await this.sendOtpEmail(input.email, newOtp);
  }

  async generateAndSendOtp(input: IGenerateAndSendOtpInput): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpRepository.upsertVerification(
      input.userId,
      input.email,
      otp,
      expiresAt
    );

    await this.sendOtpEmail(input.email, otp);
  }
}
