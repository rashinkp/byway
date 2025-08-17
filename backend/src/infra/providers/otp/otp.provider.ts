import { v4 as uuidv4 } from "uuid";
import { UserVerification } from "../../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../../app/repositories/auth.repository";
import { IOtpProvider } from "../../../app/providers/otp-provider.interface";
import { EmailProvider } from "../../../app/providers/email.provider.interface";

export class OtpProvider implements IOtpProvider {
  constructor(
    private _authRepository: IAuthRepository,
    private _emailProvider: EmailProvider
  ) {}

  async generateOtp(email: string, userId: string): Promise<UserVerification> {
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create UserVerification
    const verification = UserVerification.create({
      id: uuidv4(),
      userId,
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      isUsed: false,
      createdAt: new Date(),
    });

    // Store verification
    await this._authRepository.createVerification(verification);

    // Send OTP via email using EmailProviderImpl
    await this._emailProvider.sendOtpEmail(email, otp);

    return verification;
  }
}
