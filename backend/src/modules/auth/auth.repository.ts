import { PrismaClient } from "@prisma/client";
import { IAuthRepository, IAuthUser } from "./auth.types";


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
    return this.prisma.user.create({
      data: { name, email, password, isVerified: false },
    }) as Promise<IAuthUser>;
  }

  async findUserByEmail(email: string): Promise<IAuthUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<IAuthUser | null>;
  }

  async findUserById(id: string): Promise<IAuthUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<IAuthUser | null>;
  }

  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
}
