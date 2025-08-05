import { GetUserByIdRequestDto, UserWithProfileResponseDto } from "../../../dtos/user.dto";

export interface IGetUserByIdUseCase {
  execute(
    dto: GetUserByIdRequestDto
  ): Promise<UserWithProfileResponseDto>;
}
