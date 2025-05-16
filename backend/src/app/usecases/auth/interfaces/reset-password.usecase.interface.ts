import { ResetPasswordDto } from "../../../../domain/dtos/auth/reset-password.dto";


export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDto): Promise<void>;
}
