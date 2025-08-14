import { RegisterDto } from "../../../dtos/auth.dto";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IRegisterUseCase {
  execute(dto: RegisterDto): Promise<UserResponseDTO>;
}
