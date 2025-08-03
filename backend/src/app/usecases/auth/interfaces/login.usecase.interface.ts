import { LoginDto } from "../../../dtos/auth/login.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface ILoginUseCase {
  execute(dto: LoginDto): Promise<{ user: User; cartCount: number }>;
}
