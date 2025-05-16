import { VerifyOtpDto } from "../../../../domain/dtos/auth/verify-otp.dto";


export interface IVerifyOtpUseCase {
  execute(data: { email: string; otp: string }): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}
