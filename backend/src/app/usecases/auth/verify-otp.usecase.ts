import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import { VerifyOtpDto } from "../../../domain/dtos/auth/verify-otp.dto";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDto): Promise<void>;
}

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    const verification = await this.authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new HttpError("Verification not found", 404);
    }

    // Use 'attempts' instead of 'attemptCount'
    if (verification.attempts >= 3) {
      throw new HttpError("Maximum attempts exceeded", 400);
    }

    try {
      verification.verify(dto.otp);
    } catch (error) {
      // Use 'incrementAttempts' instead of 'incrementAttemptCount'
      if (error instanceof Error && error.message === "Invalid OTP") {
        verification.incrementAttempts();
        await this.authRepository.updateVerification(verification);
      }
      throw error;
    }

    await this.authRepository.updateVerification(verification);
  }
}
