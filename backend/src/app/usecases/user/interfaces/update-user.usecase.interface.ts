import { UpdateUserRequestDto, UserWithProfileResponseDto } from "../../../dtos/user.dto";

export interface IUpdateUserUseCase {
  execute(
    dto: UpdateUserRequestDto,
    userId: string
  ): Promise<UserWithProfileResponseDto>;
}
