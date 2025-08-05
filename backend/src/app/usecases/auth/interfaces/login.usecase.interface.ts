import { LoginRequestDto } from "../../../dtos/auth.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface ILoginUseCase {
  execute(dto: LoginRequestDto): Promise<{ user: User; cartCount: number }>;
}
