
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetCurrentUserUseCase } from "../interfaces/get-current-user.usecase.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { UserResponseDTO } from "../../../dtos/user.dto";
import { UserNotFoundError, UserAuthenticationError } from "../../../../domain/errors/domain-errors";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _cartRepository: ICartRepository
  ) {}

  async execute(
    userId: string
  ): Promise<{ user: UserResponseDTO; cartCount: number }> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (user.deletedAt) {
      throw new UserAuthenticationError("User account is disabled");
    }
    const cartCount = await this._cartRepository.countByUserId(userId);
    return { user, cartCount };
  }
}
