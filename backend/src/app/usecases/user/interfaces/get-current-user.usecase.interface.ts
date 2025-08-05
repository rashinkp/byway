import { UserResponseDto } from "../../../dtos/user.dto";

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<{ user: UserResponseDto, cartCount: number }>;
}
