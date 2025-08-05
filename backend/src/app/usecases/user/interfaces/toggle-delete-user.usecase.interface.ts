import { ToggleDeleteUserRequestDto, UserResponseDto } from "../../../dtos/user.dto";

export interface IToggleDeleteUserUseCase {
  execute(
    dto: ToggleDeleteUserRequestDto,
    currentUser: { id: string; role: string }
  ): Promise<UserResponseDto>;
}
