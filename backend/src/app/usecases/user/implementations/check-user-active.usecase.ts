import { IUserRepository } from "../../../repositories/user.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class CheckUserActiveUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new HttpError("User is deleted or does not exist", 401);
    }
  }
} 