import { PrismaClient } from "@prisma/client";
import { IAuthUser } from "./auth.service";

export interface IAuthRepository {
  createAdmin(name: string, email: string, password: string): Promise<IAuthUser>;
  createUser(name: string, email: string, password: string): Promise<IAuthUser>;
  findUserByEmail(email: string): Promise<IAuthUser | null>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async createAdmin(name: string, email: string, password: string): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: { name, email, password, role: 'ADMIN' },
    }) as Promise<IAuthUser>;
  }

  async createUser(name: string, email: string, password: string): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: { name, email, password },
    }) as Promise<IAuthUser>;
  }

  async findUserByEmail(email: string): Promise<IAuthUser | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<IAuthUser | null>;
  }


}