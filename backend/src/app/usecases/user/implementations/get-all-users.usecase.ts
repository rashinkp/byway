import { PaginatedResult } from "../../../../domain/types/pagination-filter.interface";
import { GetAllUsersDto, UserResponseDTO } from "../../../dtos/user.dto";

import {
  IUserRepository,
} from "../../../repositories/user.repository";
import { IGetAllUsersUseCase } from "../interfaces/get-all-users.usecase.interface";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

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
    return await this.userRepository.findAll(input);
  }
}
