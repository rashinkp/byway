import { UserResponseDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserMapper } from "../../../mappers/user.mapper";
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
    try {
      // Get user record from repository
      const userRecord = await this.userRepository.findById(userId);
      if (!userRecord) {
        throw new HttpError("User not found", 404);
      }

      // Convert record to domain entity
      const user = UserMapper.toDomain(userRecord);

      // Validate user is active
      if (user.isDeleted()) {
        throw new HttpError("User account is disabled", 401);
      }

      // Get cart count
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
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError("Failed to get current user", 500);
    }
  }
}
