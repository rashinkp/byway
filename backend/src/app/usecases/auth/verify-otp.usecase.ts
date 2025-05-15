import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export class VerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new HttpError(
        "Email is required and must be a non-empty string",
        400
      );
    }
    if (!dto.otp || typeof dto.otp !== "string" || !dto.otp.trim()) {
      throw new HttpError(
        "OTP is required and must be a non-empty string",
        400
      );
    }

    const verification = await this.authRepository.findVerificationByEmail(
      dto.email
    );
    if (!verification) {
      throw new HttpError("Verification not found", 404);
    }

    if (verification.isUsed) {
      throw new HttpError("OTP already used", 400);
    }

    if (verification.expiresAt < new Date()) {
      throw new HttpError("OTP expired", 400);
    }

    if (verification.attemptCount >= 3) {
      throw new HttpError("Too many attempts", 429);
    }

    if (verification.otp !== dto.otp) {
      verification.attemptCount += 1;
      await this.authRepository.updateVerification(verification);
      throw new HttpError("Invalid OTP", 400);
    }

    verification.isUsed = true;
    await this.authRepository.updateVerification(verification);

    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    user.isVerified = true;
    user.updatedAt = new Date();
    await this.authRepository.updateUser(user);
  }
}
