import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { IResetPasswordUseCase } from "../interfaces/reset-password.usecase.interface";
import { ResetPasswordDto } from "../../../../domain/dtos/auth/reset-password.dto";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const verification = await this.authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new HttpError("Invalid or expired reset token", 404);
    }

    if (verification.expiresAt < new Date()) {
      throw new HttpError("Reset token expired", 400);
    }

    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      // Update password using entity method
      user.changePassword(await bcrypt.hash(dto.newPassword, 10));
      await this.authRepository.updateUser(user);

      // Mark verification as used
      verification.markAsUsed();
      await this.authRepository.updateVerification(verification);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to reset password", 500);
    }
  }
}
