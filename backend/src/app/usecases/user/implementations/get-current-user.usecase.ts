import { UserResponseDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetCurrentUserUseCase } from "../interfaces/get-current-user.usecase.interface";
import { ICartRepository } from "../../../repositories/cart.repository";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(userId: string): Promise<{ user: UserResponseDto, cartCount: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (user.deletedAt) {
      throw new HttpError("User account is disabled", 401);
    }
    const cartCount = await this.cartRepository.countByUserId(userId);
    
    // Transform to response DTO
    return { 
      user: {
        id: user.id,
        name: user.name,
        email: user.email.address,
        avatar: user.avatar,
        role: user.role,
        isActive: !user.isDeleted(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }, 
      cartCount 
    };
  }
}
