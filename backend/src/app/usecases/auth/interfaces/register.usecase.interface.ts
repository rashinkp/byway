import { User } from "../../../../domain/entities/user.entity";
import { RegisterDto } from "../../../dtos/auth.dto";

export interface IRegisterUseCase {
  execute(dto: RegisterDto): Promise<User>;
}
