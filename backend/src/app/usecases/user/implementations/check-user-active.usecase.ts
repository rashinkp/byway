import { IUserRepository } from "../../../repositories/user.repository";
import { UserAuthenticationError } from "../../../../domain/errors/domain-errors";

export class CheckUserActiveUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new UserAuthenticationError("User is deleted or does not exist");
    }
  }
} 