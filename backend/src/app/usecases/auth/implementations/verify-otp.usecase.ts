import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { VerifyOtpDto } from "../../../../domain/dtos/auth/verify-otp.dto";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { IVerifyOtpUseCase } from "../interfaces/verify-otp.usecase.interface";


export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: VerifyOtpDto): Promise<{ user?: User; resetToken?: string }> {
    const verification = await this.authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new HttpError("Verification not found", 404);
    }

    if (verification.attempts >= 3) {
      throw new HttpError("Maximum attempts exceeded", 400);
    }

    try {
      verification.verify(dto.otp);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid OTP") {
        verification.incrementAttempts();
        await this.authRepository.updateVerification(verification);
      }
      throw error;
    }

    // Update verification record
    await this.authRepository.updateVerification(verification);

    // Fetch and verify user
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (dto.type === "signup") {
      user.verifyEmail();
      await this.authRepository.updateUser(user);
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
