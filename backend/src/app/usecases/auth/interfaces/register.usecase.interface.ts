import { RegisterRequestDto } from "../../../dtos/auth.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IRegisterUseCase {
  execute(dto: RegisterRequestDto): Promise<User>;
}
