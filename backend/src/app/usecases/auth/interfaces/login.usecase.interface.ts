
import { User } from "../../../../domain/entities/user.entity";
import { LoginDto } from "../../../dtos/auth.dto";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface ILoginUseCase {
  execute(dto: LoginDto): Promise<{ user: UserResponseDTO; cartCount: number }>;
}
