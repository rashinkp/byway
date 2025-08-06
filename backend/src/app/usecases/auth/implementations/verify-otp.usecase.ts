import { User } from "../../../../domain/entities/user.entity";
import { UserVerification } from "../../../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { UserVerificationMapper } from "../../../mappers/user-verification.mapper";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { JwtProvider } from "../../../../infra/providers/auth/jwt.provider";
import { IVerifyOtpUseCase } from "../interfaces/verify-otp.usecase.interface";
import { VerifyOtpRequestDto } from "@/app/dtos/auth.dto";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    dto: VerifyOtpRequestDto
  ): Promise<{ user?: User; resetToken?: string }> {
    try {
      // Get verification record and convert to domain entity
      const verificationRecord = await this.authRepository.findVerificationByEmail(dto.email);
      if (!verificationRecord) {
        throw new HttpError("Verification not found", 404);
      }

      const verification = UserVerificationMapper.toDomain(verificationRecord);

      // Validate OTP attempt
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

      // Fetch user record and convert to domain entity
      const userRecord = await this.authRepository.findUserByEmail(dto.email);
      if (!userRecord) {
        throw new HttpError("User not found", 404);
      }

      const user = UserMapper.toDomain(userRecord);

      if (dto.type === "signup") {
        user.verifyEmail();
        await this.authRepository.updateUser(user);
        return { user };
      }

      // For password-reset, generate a JWT reset token
      if (dto.type === "password-reset") {
        const jwtProvider = new JwtProvider();
        const resetToken = jwtProvider.signAccessToken({
          email: user.email.address,
          type: "password-reset",
          iat: Math.floor(Date.now() / 1000),
        });
        return { resetToken };
      }

      return { user };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError("OTP verification failed", 500);
    }
  }
}
