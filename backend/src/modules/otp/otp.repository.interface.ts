import { IUserVerification } from "./otp.types";

export interface IOtpRepository {
  findVerificationByEmail(email: string): Promise<IUserVerification | null>;
  incrementAttemptCount(verificationId: string): Promise<void>;
  updateVerificationStatus(
    verificationId: string,
    userId: string,
    isUsed: boolean,
    isVerified: boolean
  ): Promise<void>;
  updateOtp(
    verificationId: string,
    otp: string,
    expiresAt: Date,
    attemptCount: number
  ): Promise<void>;
  upsertVerification(
    userId: string,
    email: string,
    otp: string,
    expiresAt: Date
  ): Promise<void>;
}
