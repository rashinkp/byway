import { VerifyOtpRequestDto } from "@/app/dtos/auth.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpRequestDto): Promise<{ user?: User; resetToken?: string }>;
}
