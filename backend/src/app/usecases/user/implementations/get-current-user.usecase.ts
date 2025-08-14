
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetCurrentUserUseCase } from "../interfaces/get-current-user.usecase.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { UserResponseDTO } from "../../../dtos/user.dto";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(
    userId: string
  ): Promise<{ user: UserResponseDTO; cartCount: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (user.deletedAt) {
      throw new HttpError("User account is disabled", 401);
    }
    const cartCount = await this.cartRepository.countByUserId(userId);
    return { user, cartCount };
  }
}
