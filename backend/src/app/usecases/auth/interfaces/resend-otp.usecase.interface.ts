import { ResendOtpDto } from "../../../../domain/dtos/auth/resend-otp.dto";


export interface IResendOtpUseCase {
  execute(dto: ResendOtpDto): Promise<void>;
}
