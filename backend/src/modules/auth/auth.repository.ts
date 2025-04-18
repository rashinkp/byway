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


  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
}
