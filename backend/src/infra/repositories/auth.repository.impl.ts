import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserVerification } from "../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../app/repositories/auth.repository";
import { GenericRepository } from "./generic.repository";

export class AuthRepository extends GenericRepository<User> implements IAuthRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'user');
  }

  protected getPrismaModel() {
    return this._prisma.user;
  }

  protected mapToEntity(user: any): User {
    return User.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      googleId: user.googleId ?? undefined,
      facebookId: user.facebookId ?? undefined,
      role: user.role as any,
      authProvider: user.authProvider as any,
      isVerified: user.isVerified,
      avatar: user.avatar ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof User) {
      return {
        name: entity.name,
        email: entity.email,
        password: entity.password ?? null,
        googleId: entity.googleId ?? null,
        facebookId: entity.facebookId ?? null,
        role: entity.role as any,
        authProvider: entity.authProvider as any,
        isVerified: entity.isVerified,
        avatar: entity.avatar ?? null,
        deletedAt: entity.deletedAt ?? null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    }
    return entity;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findUserByFacebookId(facebookId: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({ where: { facebookId } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async createUser(user: User): Promise<User> {
    return this.create(user);
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
      },
      create: {
        id: verification.id,
        email: verification.email,
        userId: verification.userId,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attempts,
        isUsed: verification.isUsed,
      },
    });

    return UserVerification.fromPersistence(created);
  }

  async findVerificationByEmail(email: string): Promise<UserVerification | null> {
    const ver = await this._prisma.userVerification.findUnique({ where: { email } });
    return ver ? UserVerification.fromPersistence(ver) : null;
  }

  async updateVerification(verification: UserVerification): Promise<UserVerification> {
    const updated = await this._prisma.userVerification.update({
      where: { email: verification.email },
      data: {
        id: verification.id,
        userId: verification.userId,
        otp: verification.otp,
        expiresAt: verification.expiresAt,
        attemptCount: verification.attempts,
        isUsed: verification.isUsed,
      },
    });
    return UserVerification.fromPersistence(updated);
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this._prisma.user.update({
      where: { id: user.id },
      data: this.mapToPrismaData(user),
    });
    return this.mapToEntity(updated);
  }
}
