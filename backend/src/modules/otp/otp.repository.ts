import { PrismaClient } from "@prisma/client";
import { OtpService } from "./otp.service";


export interface IOtpRepository {
  verifyOtp(
    email: string,
    otp: string
  ): Promise<{ id: string; email: string; role: string }>;
  resendOtp(email: string): Promise<void>;
  generateAndSendOtp(email: string, userId: string , otp:string , expiresAt:Date): Promise<void>;
}


export class OtpRepository implements IOtpRepository {

  constructor(private prisma: PrismaClient) { }

  async verifyOtp(email: string, otp: string): Promise<{id:string , email:string , role:string}> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
      include: { user: true }
    });

    if (
      !verification ||
      verification.isUsed ||
      verification.expiresAt < new Date() ||
      verification.attemptCount >= 10
    ) {
      throw new Error("Invalid or expired OTP");
    }

    if (verification.otp !== otp) {
      await this.prisma.userVerification.update({
        where: { id: verification.id },
        data: { attemptCount: verification.attemptCount + 1 },
      });
      throw new Error("Incorrect OTP");
    }

    const user = await this.prisma.$transaction(async (tx) => {
      //if verified otp then update user status
      const updatedUser = await tx.user.update({
        where: { id: verification.userId },
        data: { isVerified: true },
      });

      //update userVerification table
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
      throw new Error("No pending verification found");
    }

    if (verification.expiresAt > new Date() && verification.attemptCount < 10) {
      throw new Error("OTP still valid try again later");
    }

    const newOtp = OtpService.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.userVerification.update({
      where: { id: verification.id },
      data: {
        otp: newOtp,
        expiresAt,
        attemptCount: 0,
      },
    });

    await OtpService.sendOtpEmail(email, newOtp);
  }



  async generateAndSendOtp(email: string, userId: string, otp: string, expiresAt:Date): Promise<void> {
  

    await this.prisma.userVerification.upsert({
      where: { email },
      update: {
        otp: otp,
        expiresAt,
        attemptCount: 0,
        isUsed: false,
      },
      create: {
        userId,
        email,
        otp: otp,
        expiresAt,
      }
    });

    await OtpService.sendOtpEmail(email, otp);
  }



  
}