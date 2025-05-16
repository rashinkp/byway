import { VerifyOtpDto } from "../../../../domain/dtos/auth/verify-otp.dto";


export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDto): Promise<void>;
}
