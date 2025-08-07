// src/infra/repositories/user.repository.ts
import { IUserRepository } from "@/app/repositories/user.repository";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { Role } from "@/domain/enum/role.enum";
import { UserMapper } from "../mappers/user.mapper";
import { User } from "@/domain/entities/user.entity";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByRole(role: Role): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role: role as any }, // cast carefully
    });
    return users.map(UserMapper.toDomain);
  }

  async save(user: User): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    const prismaData = {
      ...user,
      role: user.role ,
      authProvider: user.authProvider ,
    };

    let saved: PrismaUser;
    if (existing) {
      saved = await this.prisma.user.update({
        where: { id: user.id },
        data: prismaData,
      });
    } else {
      saved = await this.prisma.user.create({
        data: prismaData,
      });
    }

    return UserMapper.toDomain(saved);
  }
}
