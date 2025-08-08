
import { User } from "../../../../domain/entities/user.entity";
import { LoginDto } from "../../../dtos/auth.dto";

export interface ILoginUseCase {
  execute(dto: LoginDto): Promise<{ user: User; cartCount: number }>;
}
