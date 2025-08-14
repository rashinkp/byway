import { User } from "../../../../domain/entities/user.entity";
import { VerifyOtpDto } from "../../../dtos/auth.dto";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IVerifyOtpUseCase {
  execute(
    dto: VerifyOtpDto
  ): Promise<{ user?: UserResponseDTO; resetToken?: string }>;
}
