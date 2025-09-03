import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { IVerifyOtpUseCase } from "../interfaces/verify-otp.usecase.interface";
import { VerifyOtpDto } from "../../../dtos/auth.dto";
import { UserResponseDTO } from "../../../dtos/user.dto";
import { 
  UserNotFoundError, 
  UserValidationError 
} from "../../../../domain/errors/domain-errors";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private _authRepository: IAuthRepository) {}

  async execute(
    dto: VerifyOtpDto
  ): Promise<{ user?: UserResponseDTO; resetToken?: string }> {
    const verification = await this._authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new UserNotFoundError("Verification not found");
    }

    if (verification.attempts >= 3) {
      throw new UserValidationError("Maximum attempts exceeded");
    }

    try {
      verification.verify(dto.otp);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid OTP") {
        verification.incrementAttempts();
        await this._authRepository.updateVerification(verification);
      }
      throw error;
    }

    // Update verification record
    await this._authRepository.updateVerification(verification);

    // Fetch and verify user
    const user = await this._authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError("User not found");
    }

    if (dto.type === "signup") {
      user.verifyEmail();
      await this._authRepository.updateUser(user);
      return { user };
    }

    // For password-reset, generate a JWT reset token
    if (dto.type === "password-reset") {
      const jwtProvider = new JwtProvider();
      const resetToken = jwtProvider.signAccessToken({
        email: user.email,
        type: "password-reset",
        iat: Math.floor(Date.now() / 1000),
      });
      return { resetToken };
    }

    return { user };
  }
}
