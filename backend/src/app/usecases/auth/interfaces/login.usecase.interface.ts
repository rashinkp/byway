import { LoginDto } from "../../../../domain/dtos/auth/login.dto";
import { User } from "../../../../domain/entities/user";


export interface ILoginUseCase {
  execute(dto: LoginDto): Promise<User>;
}
