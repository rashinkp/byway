import { GetAllUsersDto, UserResponseDTO } from "../../../dtos/user.dto";
import { IPaginatedResponse } from "../../../repositories/user.repository";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersDto): Promise<IPaginatedResponse<UserResponseDTO>>;
}
