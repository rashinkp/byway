import { PrismaClient } from "@prisma/client";
import { IOtpRepository, IUserVerification } from "./otp.types";

export class OtpRepository implements IOtpRepository {
  constructor(private prisma: PrismaClient) {}

  async findVerificationByEmail(
    email: string
  ): Promise<IUserVerification | null> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
      include: { user: true },
    });

    if (!verification) return null;

    return {
      id: verification.id,
      userId: verification.userId,
      email: verification.email,
      otp: verification.otp,
      expiresAt: verification.expiresAt,
      attemptCount: verification.attemptCount,
      isUsed: verification.isUsed,
      user: {
        id: verification.user.id,
        email: verification.user.email,
        role: verification.user.role,
        isVerified: verification.user.isVerified,
      },
    };
  }

  async incrementAttemptCount(verificationId: string): Promise<void> {
    await this.prisma.userVerification.update({
      where: { id: verificationId },
      data: { attemptCount: { increment: 1 } },
    });
  }

  async updateVerificationStatus(
    verificationId: string,
    userId: string,
    isUsed: boolean,
    isVerified: boolean
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { isVerified },
      });

      await tx.userVerification.update({
        where: { id: verificationId },
        data: { isUsed },
      });
    });
  }

  async updateOtp(
    verificationId: string,
    otp: string,
    expiresAt: Date,
    attemptCount: number
  ): Promise<void> {
    await this.prisma.userVerification.update({
      where: { id: verificationId },
      data: {
        otp,
        expiresAt,
        attemptCount,
      },
    });
  }

  async upsertVerification(
    userId: string,
    email: string,
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
}
