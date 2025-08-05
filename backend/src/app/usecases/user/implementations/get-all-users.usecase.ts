import { GetAllUsersRequestDto, UserResponseDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import {
  IPaginatedResponse,
  IUserRepository,
} from "../../../repositories/user.repository";
import { IGetAllUsersUseCase } from "../interfaces/get-all-users.usecase.interface";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: GetAllUsersRequestDto): Promise<IPaginatedResponse<UserResponseDto>> {
    const result = await this.userRepository.findAll(dto);
    
    // Transform domain entities to response DTOs
    const users: UserResponseDto[] = result.items.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email.address, // Accessing value object property
      avatar: user.avatar,
      role: user.role,
      isActive: !user.isDeleted(), // User is active if not deleted
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return {
      items: users,
      total: result.total,
      totalPages: result.totalPages,
    };
  }
}
