import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import * as bcrypt from "bcrypt";
import { IResetPasswordUseCase } from "../interfaces/reset-password.usecase.interface";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { ResetPasswordDto } from "../../../dtos/auth.dto";

// Type for reset password JWT payload
interface ResetPasswordPayload {
  email: string;
  type: string;
  iat: number;
}

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const jwtProvider = new JwtProvider();
    const payload = jwtProvider.verifyAccessToken(dto.resetToken) as ResetPasswordPayload | null;
    if (!payload) {
      throw new HttpError("Invalid or expired reset token", 400);
    }
    if (payload.type !== "password-reset") {
      throw new HttpError("Invalid reset token type", 400);
    }
    const email = payload.email;
    if (!email) {
      throw new HttpError("Invalid reset token payload", 400);
    }

    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      // Update password using entity method
      user.changePassword(await bcrypt.hash(dto.newPassword, 10));
      await this.authRepository.updateUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to reset password", 500);
    }
  }
}
