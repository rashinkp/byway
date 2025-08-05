import { GetAllUsersRequestDto, UserResponseDto } from "../../../dtos/user.dto";
import { IPaginatedResponse } from "../../../repositories/user.repository";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersRequestDto): Promise<IPaginatedResponse<UserResponseDto>>;
}
