import { PrismaClient } from "@prisma/client";
import prisma from "../../core/database";

export class AuthRepository {
  constructor(private prisma: PrismaClient) { };

  
  async createAdmin(name: string, email: string, password: string) {
    return prisma.user.create({ data: { name, email, password , role:'ADMIN' } });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({where : {email}})
  }
}