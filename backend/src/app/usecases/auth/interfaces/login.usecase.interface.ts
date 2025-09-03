
import { LoginDto, AuthUserDTO } from "../../../dtos/auth.dto";

export interface ILoginUseCase {
  execute(dto: LoginDto): Promise<{ user: AuthUserDTO; cartCount: number }>;
}
