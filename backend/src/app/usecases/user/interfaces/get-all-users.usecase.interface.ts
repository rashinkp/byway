import { PaginatedResult } from "../../../../domain/types/pagination-filter.interface";
import { GetAllUsersDto, UserResponseDTO } from "../../../dtos/user.dto";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersDto): Promise<PaginatedResult<UserResponseDTO>>;
}
