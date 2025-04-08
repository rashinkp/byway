import { PrismaClient } from "@prisma/client";
import { IUser, UpdateUserInput } from "./types";

export interface IUserRepository {
  updateUser(input: UpdateUserInput): Promise<IUser>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async updateUser(input: UpdateUserInput): Promise<IUser> {
    const { userId, name, password, avatar } = input;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        password: password || undefined,
        avatar: avatar || undefined,
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name || undefined,
      password: updatedUser.password || undefined,
      avatar: updatedUser.avatar || undefined,
    };
  }
}
