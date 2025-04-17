import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export interface IOtpRepository {
  verifyOtp(
    email: string,
    otp: string
  ): Promise<{ id: string; email: string; role: string }>;
  resendOtp(email: string): Promise<void>;
  generateAndSendOtp(
    email: string,
    userId: string,
    otp: string,
    expiresAt: Date
  ): Promise<void>;
}

export class OtpRepository implements IOtpRepository {
  constructor(private prisma: PrismaClient) {}

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ id: string; email: string; role: string }> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
      include: { user: true },
    });

    if (
      !verification ||
      verification.isUsed ||
      verification.expiresAt < new Date() ||
      verification.attemptCount >= 10
    ) {
      throw AppError.badRequest("Invalid or expired OTP");
    }

    if (verification.otp !== otp) {
      await this.prisma.userVerification.update({
        where: { id: verification.id },
        data: { attemptCount: verification.attemptCount + 1 },
      });
      throw AppError.badRequest("Incorrect OTP");
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: verification.userId },
        data: { isVerified: true },
      });

      await tx.userVerification.update({
        where: { id: verification.id },
        data: { isUsed: true },
      });

      return updatedUser;
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async resendOtp(email: string): Promise<void> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
    });

    if (!verification || verification.isUsed) {
      throw AppError.badRequest("No pending verification found");
    }

    if (verification.expiresAt > new Date() && verification.attemptCount < 10) {
      throw AppError.badRequest("OTP still valid, try again later");
    }

    const newOtp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.userVerification.update({
      where: { id: verification.id },
      data: {
        otp: newOtp,
        expiresAt,
        attemptCount: 0,
      },
    });

    await this.sendOtpEmail(email, newOtp);
  }

  async generateAndSendOtp(
    email: string,
    userId: string,
    otp: string,
    expiresAt: Date
  ): Promise<void> {
    await this.prisma.userVerification.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        attemptCount: 0,
        isUsed: false,
      },
      create: {
        userId,
        email,
        otp,
        expiresAt,
      },
    });
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    // Delegate to OtpService for actual email sending
    // This method is a placeholder to satisfy the interface
  }
}
