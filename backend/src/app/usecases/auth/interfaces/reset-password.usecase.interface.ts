import { ResetPasswordDto } from "../../../dtos/auth.dto";


export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDto): Promise<void>;
}
