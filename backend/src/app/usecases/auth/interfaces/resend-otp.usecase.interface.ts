import { ResendOtpRequestDto } from "@/app/dtos/auth.dto";


export interface IResendOtpUseCase {
  execute(dto: ResendOtpRequestDto): Promise<void>;
}
