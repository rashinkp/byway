import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";

export interface IGetUserByIdUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }>;
}
