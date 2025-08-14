import { ToggleDeleteUserDto, UserResponseDTO } from "../../../dtos/user.dto";

export interface IToggleDeleteUserUseCase {
  execute(
    dto: ToggleDeleteUserDto,
    currentUser: { id: string; role: string }
  ): Promise<UserResponseDTO>;
}
