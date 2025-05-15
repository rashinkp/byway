import {
  PrismaClient,
  User as PrismaUser,
  UserVerification as PrismaVerification,
} from "@prisma/client";
import { User } from "../../domain/entities/user";
import { UserVerification } from "../../domain/entities/verification";
import { IAuthRepository } from "../../app/repositories/auth.repository";
import { Role } from "../../domain/enum/role.enum";

export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(
      user.id,
      user.name,
      user.email,
      user.password ?? undefined,
      user.googleId ?? undefined,
      user.facebookId ?? undefined,
      user.role as Role,
      user.isVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return new User(
      user.id,
      user.name,
      user.email,
      user.password ?? undefined,
      user.googleId ?? undefined,
      user.facebookId ?? undefined,
      user.role as Role,
      user.isVerified,
      user.createdAt,
      user.updatedAt
    );
  }

  async findUserByFacebookId(facebookId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { facebookId } });
    if (!user) return null;
    return new User(
      user.id,
      user.name,
      user.email,
      user.password ?? undefined,
      user.googleId ?? undefined,
      user.facebookId ?? undefined,
      user.role as Role,
      user.isVerified,
      user.createdAt,
      user.updatedAt
    );
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
        role: user.role as unknown as PrismaUser["role"],
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return new User(
      created.id,
      created.name,
      created.email,
      created.password ?? undefined,
      created.googleId ?? undefined,
      created.facebookId ?? undefined,
      created.role as Role,
      created.isVerified,
      created.createdAt,
      created.updatedAt
    );
  }

  async createVerification(
    verification: UserVerification
  ): Promise<UserVerification> {

    const created = await this.prisma.userVerification.upsert({
      where: { email: verification.email },
      update: {
        userId: verification.userId,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attemptCount,
        isUsed: verification.isUsed,
        createdAt: verification.createdAt,
      },
      create: {
        id: verification.id,
        userId: verification.userId,
        email: verification.email,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attemptCount,
        isUsed: verification.isUsed,
        createdAt: verification.createdAt,
      },
    });
    return new UserVerification(
      created.id,
      created.userId,
      created.email,
      created.otp,
      created.expiresAt,
      created.attemptCount,
      created.isUsed,
      created.createdAt
    );
  }

  async findVerificationByEmail(
    email: string
  ): Promise<UserVerification | null> {
    const verification = await this.prisma.userVerification.findUnique({
      where: { email },
    });
    if (!verification) return null;
    return new UserVerification(
      verification.id,
      verification.userId,
      verification.email,
      verification.otp,
      verification.expiresAt,
      verification.attemptCount,
      verification.isUsed,
      verification.createdAt
    );
  }

  async updateVerification(
    verification: UserVerification
  ): Promise<UserVerification> {
    const updated = await this.prisma.userVerification.update({
      where: { id: verification.id },
      data: {
        attemptCount: verification.attemptCount,
        isUsed: verification.isUsed,
      },
    });
    return new UserVerification(
      updated.id,
      updated.userId,
      updated.email,
      updated.otp,
      updated.expiresAt,
      updated.attemptCount,
      updated.isUsed,
      updated.createdAt
    );
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt,
      },
    });
    return new User(
      updated.id,
      updated.name,
      updated.email,
      updated.password ?? undefined,
      updated.googleId ?? undefined,
      updated.facebookId ?? undefined,
      updated.role as Role,
      updated.isVerified,
      updated.createdAt,
      updated.updatedAt
    );
  }
}
