import { User } from "../../../../domain/entities/user.entity";
import { VerifyOtpDto } from "../../../dtos/auth.dto";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDto): Promise<{ user?: User; resetToken?: string }>;
}
