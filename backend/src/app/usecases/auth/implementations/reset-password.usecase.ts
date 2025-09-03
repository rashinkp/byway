import { IAuthRepository } from "../../../repositories/auth.repository";
import * as bcrypt from "bcrypt";
import { IResetPasswordUseCase } from "../interfaces/reset-password.usecase.interface";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { ResetPasswordDto } from "../../../dtos/auth.dto";
import { UserNotFoundError, UserValidationError } from "../../../../domain/errors/domain-errors";

// Type for reset password JWT payload
interface ResetPasswordPayload {
  email: string;
  type: string;
  iat: number;
}

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private _authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const jwtProvider = new JwtProvider();
    const payload = jwtProvider.verifyAccessToken(
      dto.resetToken
    ) as ResetPasswordPayload | null;
    if (!payload) {
      throw new UserValidationError("Invalid or expired reset token");
    }
    if (payload.type !== "password-reset") {
      throw new UserValidationError("Invalid reset token type");
    }
    const email = payload.email;
    if (!email) {
      throw new UserValidationError("Invalid reset token payload");
    }

    const user = await this._authRepository.findUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError(email);
    }

    try {
      // Update password using entity method
      user.changePassword(await bcrypt.hash(dto.newPassword, 10));
      await this._authRepository.updateUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new UserValidationError(error.message);
      }
      throw new UserValidationError("Failed to reset password");
    }
  }
}
