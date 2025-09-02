import { PaginatedResult } from "../../../../domain/types/pagination-filter.interface";
import { GetAllUsersDto, UserResponseDTO } from "../../../dtos/user.dto";

import {
  IUserRepository,
} from "../../../repositories/user.repository";
import { IGetAllUsersUseCase } from "../interfaces/get-all-users.usecase.interface";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    dto: GetAllUsersDto
  ): Promise<PaginatedResult<UserResponseDTO>> {
    let input = {
      page: dto.page || 1,
      limit: dto.limit || 10,
      sortBy: dto.sortBy || "createdAt",
      sortOrder: dto.sortOrder || "asc",
      includeDeleted: dto.includeDeleted || false,
      search: dto.search || "",
      filterBy: dto.filterBy || "All",
      role: dto.role || "USER",
    };
    const result = await this._userRepository.findAll(input);

    const total = result.total ?? 0;
    const totalPage = result.totalPage ?? Math.ceil(total / input.limit);
    
    // Map domain entities to DTOs
    return {
      items: result.items.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
        avatar: user.avatar,
        deletedAt: user.deletedAt,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      })),
      total,
      totalPage,
    };
  }
}
