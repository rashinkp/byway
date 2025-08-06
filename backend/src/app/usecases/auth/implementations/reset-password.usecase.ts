import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import * as bcrypt from "bcrypt";
import { IResetPasswordUseCase } from "../interfaces/reset-password.usecase.interface";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { ResetPasswordRequestDto } from "../../../dtos/auth.dto";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: ResetPasswordRequestDto): Promise<void> {
    try {
      const jwtProvider = new JwtProvider();
      const payload = jwtProvider.verifyAccessToken(dto.token) as {
        type?: string;
        email?: string;
        iat?: number;
      };
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

      // Get user record from repository
      const userRecord = await this.authRepository.findUserByEmail(email);
      if (!userRecord) {
        throw new HttpError("User not found", 404);
      }

      // Convert record to domain entity
      const user = UserMapper.toDomain(userRecord);

      // Update password using domain entity method
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      user.changePassword(hashedPassword);
      
      // Save updated user
      await this.authRepository.updateUser(user);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to reset password", 500);
    }
  }
}
