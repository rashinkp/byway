import { Role } from "@prisma/client";
import { AdminUpdateUserInput, IGetAllUsersInput, IGetAllUsersResponse, IUserWithProfile, UpdateUserInput } from "./types";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";



export class UserService {
  constructor(private userRepository: UserRepository) {}

  async updateUser(input: UpdateUserInput): Promise<IUserWithProfile> {
    const { userId, user, profile } = input;

    const hashedPassword = user?.password
      ? await bcrypt.hash(user.password, 10)
      : undefined;

    return this.userRepository.updateUser({
      userId,
      user: user
        ? {
            name: user.name,
            password: hashedPassword,
            avatar: user.avatar,
          }
        : undefined,
      profile,
    });
  }

  async getAllUsers(input: IGetAllUsersInput): Promise<IGetAllUsersResponse> {
    const { page = 1, limit = 10 ,role } = input;
    const skip = (page - 1) * limit;

    const validRoles = [Role.USER, Role.INSTRUCTOR, Role.ADMIN];

    if (role && !validRoles.includes(role)) {
      throw new Error("Invalid role specified");
    }

    const { users, total } = await this.userRepository.getAllUsers({ page, limit , skip ,role });

    return {
      users,
      total,
      page,
      limit
    }
  }

  async updateUserByAdmin(input: AdminUpdateUserInput): Promise<void> {
    return this.userRepository.updateUserByAdmin(input);
  }
}
