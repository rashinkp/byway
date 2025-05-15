import { v4 as uuidv4 } from "uuid";
import { UserVerification } from "../../../domain/entities/verification";
import { IAuthRepository } from "../../../app/repositories/auth.repository";

export interface OtpProvider {
  generateOtp(
    email: string,
    userId: string,
    type: "VERIFICATION" | "RESET"
  ): Promise<UserVerification>;
}

export class OtpProvider implements OtpProvider {
  constructor(private authRepository: IAuthRepository) {}

  async generateOtp(
    email: string,
    userId: string,
    type: "VERIFICATION" | "RESET"
  ): Promise<UserVerification> {
    // Generate 6-digit OTP or reset token
    const otp =
      type === "VERIFICATION"
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidv4().slice(0, 8); 

    const verification = new UserVerification(
      uuidv4(),
      userId,
      email,
      otp,
      new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      0,
      false,
      new Date()
    );

    // Delete existing verifications for the user to avoid duplicates
    // await this.authRepository.deleteVerificationsByEmail(email);
    await this.authRepository.createVerification(verification);

    return verification;
  }
}
