import { ProfileDTO, UpdateUserDto, UserResponseDTO } from "../../../dtos/user.dto";

export interface IUpdateUserUseCase {
  execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }>;
}
