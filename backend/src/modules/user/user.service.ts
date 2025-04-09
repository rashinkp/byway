import { IUserWithProfile, UpdateUserInput } from "./types";
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
}
