import { ResetPasswordDto } from "../../../dtos/auth/reset-password.dto";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDto): Promise<void>;
}
