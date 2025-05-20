import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../../infra/repositories/interfaces/auth.repository";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { VerifyOtpDto } from "../../../../domain/dtos/auth/verify-otp.dto";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDto): Promise<User>;
}

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: VerifyOtpDto): Promise<User> {
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
      return await this.authRepository.updateUser(user);
    }

    return user;
  }
}
