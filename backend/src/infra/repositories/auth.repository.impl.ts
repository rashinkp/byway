import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserVerification } from "../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../app/repositories/auth.repository";

export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return User.fromPrisma(user);
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return User.fromPrisma(user);
  }

  async findUserByFacebookId(facebookId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { facebookId } });
    if (!user) return null;
    return User.fromPrisma(user);
  }

  async createUser(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        googleId: user.googleId,
        facebookId: user.facebookId,
        role: user.role,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
        avatar: user.avatar,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return User.fromPrisma(created);
  }

  async createVerification(
    verification: UserVerification
  ): Promise<UserVerification> {
    const created = await this.prisma.userVerification.upsert({
      where: { email: verification.email },
      update: {
        id: verification.id,
        userId: verification.userId,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attempts,
        isUsed: verification.isUsed,
        createdAt: verification.createdAt,
      },
      create: {
        id: verification.id,
        userId: verification.userId,
        email: verification.email,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attempts,
        isUsed: verification.isUsed,
        createdAt: verification.createdAt,
      },
    });
    return UserVerification.fromPrisma(created);
  }

  async findVerificationByEmail(
    email: string
  ): Promise<UserVerification | null> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
    });

    if (!verification) return null;
    return UserVerification.fromPrisma(verification);
  }

  async updateVerification(
    verification: UserVerification
  ): Promise<UserVerification> {
    const updated = await this.prisma.userVerification.update({
      where: { id: verification.id },
      data: {
        userId: verification.userId,
        email: verification.email,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attempts,
        isUsed: verification.isUsed,
        createdAt: verification.createdAt,
      },
    });
    return UserVerification.fromPrisma(updated);
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        googleId: user.googleId,
        facebookId: user.facebookId,
        role: user.role,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
        avatar: user.avatar,
        deletedAt: user.deletedAt,
        updatedAt: user.updatedAt,
      },
    });
    return User.fromPrisma(updated);
  }
}
