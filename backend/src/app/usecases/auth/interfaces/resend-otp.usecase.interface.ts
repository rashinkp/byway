import { ResendOtpDto } from "../../../dtos/auth.dto";

export interface IResendOtpUseCase {
  execute(dto: ResendOtpDto): Promise<void>;
}
