import { PrismaClient, Role as PrismaRole, AuthProvider as PrismaAuthProvider } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserVerification } from "../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../app/repositories/auth.repository";
import { Role as DomainRole } from "../../domain/enum/role.enum";
import { AuthProvider as DomainAuthProvider } from "../../domain/enum/auth-provider.enum";

export class AuthRepository implements IAuthRepository {
  constructor(private _prisma: PrismaClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return User.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      googleId: user.googleId ?? undefined,
      facebookId: user.facebookId ?? undefined,
      role: user.role as unknown as DomainRole,
      authProvider: user.authProvider as unknown as DomainAuthProvider,
      isVerified: user.isVerified,
      avatar: user.avatar ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return User.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      googleId: user.googleId ?? undefined,
      facebookId: user.facebookId ?? undefined,
      role: user.role as unknown as DomainRole,
      authProvider: user.authProvider as unknown as DomainAuthProvider,
      isVerified: user.isVerified,
      avatar: user.avatar ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findUserByFacebookId(facebookId: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { facebookId } });
    if (!user) return null;
    return User.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      googleId: user.googleId ?? undefined,
      facebookId: user.facebookId ?? undefined,
      role: user.role as unknown as DomainRole,
      authProvider: user.authProvider as unknown as DomainAuthProvider,
      isVerified: user.isVerified,
      avatar: user.avatar ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async createUser(user: User): Promise<User> {
    const created = await this._prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password ?? null,
        googleId: user.googleId ?? null,
        facebookId: user.facebookId ?? null,
        role: user.role as unknown as PrismaRole,
        authProvider: user.authProvider as unknown as PrismaAuthProvider,
        isVerified: user.isVerified,
        avatar: user.avatar ?? null,
        deletedAt: user.deletedAt ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return User.fromPersistence({
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password ?? undefined,
      googleId: created.googleId ?? undefined,
      facebookId: created.facebookId ?? undefined,
      role: created.role as unknown as DomainRole,
      authProvider: created.authProvider as unknown as DomainAuthProvider,
      isVerified: created.isVerified,
      avatar: created.avatar ?? undefined,
      deletedAt: created.deletedAt ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async createVerification(
    verification: UserVerification
  ): Promise<UserVerification> {
    const created = await this._prisma.userVerification.upsert({
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
    return UserVerification.fromPersistence(created);
  }

  async findVerificationByEmail(
    email: string
  ): Promise<UserVerification | null> {
    const verification = await this._prisma.userVerification.findUnique({
      where: { email },
    });

    if (!verification) return null;
    return UserVerification.fromPersistence(verification);
  }

  async updateVerification(
    verification: UserVerification
  ): Promise<UserVerification> {
    const updated = await this._prisma.userVerification.update({
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
    return UserVerification.fromPersistence(updated);
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this._prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password ?? null,
        googleId: user.googleId ?? null,
        facebookId: user.facebookId ?? null,
        role: user.role as unknown as PrismaRole,
        authProvider: user.authProvider as unknown as PrismaAuthProvider,
        isVerified: user.isVerified,
        avatar: user.avatar ?? null,
        deletedAt: user.deletedAt ?? null,
        updatedAt: user.updatedAt,
      },
    });
    return User.fromPersistence({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password ?? undefined,
      googleId: updated.googleId ?? undefined,
      facebookId: updated.facebookId ?? undefined,
      role: updated.role as unknown as DomainRole,
      authProvider: updated.authProvider as unknown as DomainAuthProvider,
      isVerified: updated.isVerified,
      avatar: updated.avatar ?? undefined,
      deletedAt: updated.deletedAt ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
