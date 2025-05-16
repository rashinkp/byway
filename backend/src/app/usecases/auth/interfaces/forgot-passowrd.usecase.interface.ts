import { ForgotPasswordDto } from "../../../../domain/dtos/auth/forgot-password.dto";


export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordDto): Promise<void>;
}
