import { IUser, UpdateUserInput } from "./types";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt'


export class UserService {
  constructor(private userRepository: UserRepository) { }

  async updateUser(input: UpdateUserInput): Promise<IUser> {
    const { userId, name, password, avatar } = input
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    return this.userRepository.updateUser({
      userId,
      name,
      password:hashedPassword,
      avatar,
    })
    
  }
}