import { User } from "../../../../domain/entities/user.entity";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IUserRepository } from "../../../../infra/repositories/interfaces/user.repository";
import { IGetCurrentUserUseCase } from "../interfaces/get-current-user.usecase.interface";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    return user;
  }
}
