import { ForgotPasswordRequestDto } from "@/app/dtos/auth.dto";


export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordRequestDto): Promise<void>;
}
