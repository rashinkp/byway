import { PrismaClient } from "@prisma/client";
import { IAuthUser } from "./auth.service";
import { OtpService } from "../otp/otp.service";
import { IResetPasswordInput } from "./types";

export interface IAuthRepository {
  createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser>;
  createUser(name: string, email: string, password: string): Promise<IAuthUser>;
  findUserByEmail(email: string): Promise<IAuthUser | null>;
  resetPassword(email: string, hashedPassword: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: { name, email, password, role: "ADMIN" },
    }) as Promise<IAuthUser>;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser> {
    const otp = OtpService.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const result = this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password, isVerified: false },
      });

      //stores otp and infos
      await tx.userVerification.create({
        data: {
          userId: user.id,
          email,
          otpCode: otp,
          expiresAt,
        },
      });

      return user;
    });

    await OtpService.sendOtpEmail(email, otp);

    return result as Promise<IAuthUser>;
  }

  async findUserByEmail(email: string): Promise<IAuthUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<IAuthUser | null>;
  }


  async resetPassword(
    email:string,
    hashedPassword: string
  ): Promise<void> {

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });


  }
}