
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IGetCurrentUserUseCase {
  execute(
    userId: string
  ): Promise<{ user: UserResponseDTO; cartCount: number }>;
}
