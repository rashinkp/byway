import { ResetPasswordRequestDto } from "../../../dtos/auth.dto";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordRequestDto): Promise<void>;
}
