import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { ResetPasswordDto } from "../../../domain/dtos/auth/reset-password.dto";

export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const verification = await this.authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new HttpError("Invalid or expired reset token", 404);
    }

    if (!verification.isUsed) {
      throw new HttpError("Reset token already used", 400);
    }

    if (verification.expiresAt < new Date()) {
      throw new HttpError("Reset token expired", 400);
    }

    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    // Update password
    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.updatedAt = new Date();
    await this.authRepository.updateUser(user);

    // Mark token as used
    verification.isUsed = true;
    await this.authRepository.updateVerification(verification);
  }
}
