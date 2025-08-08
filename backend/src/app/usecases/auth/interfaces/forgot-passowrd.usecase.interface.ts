import { ForgotPasswordDto } from "../../../dtos/auth.dto";


export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordDto): Promise<void>;
}
