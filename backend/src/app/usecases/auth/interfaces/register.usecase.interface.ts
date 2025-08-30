import { RegisterDto, AuthUserDTO } from "../../../dtos/auth.dto";

export interface IRegisterUseCase {
  execute(dto: RegisterDto): Promise<AuthUserDTO>;
}
