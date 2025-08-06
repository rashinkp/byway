import { IUserRepository } from "@/app/repositories/user.repository";
import { PrismaClient } from "@prisma/client";
import { DbUser } from "../types/database.types";
import { Role } from "@/domain/enum/role.enum";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<DbUser[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<DbUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByRole(role: Role): Promise<DbUser[]> {
    return this.prisma.user.findMany({
      where: { role: role as any },
    });
  }

  async save(user: DbUser): Promise<DbUser> {
    const existing = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existing) {
      return this.prisma.user.update({
        where: { id: user.id },
        data: user,
      });
    }

    return this.prisma.user.create({
      data: user,
    });
  }
}
