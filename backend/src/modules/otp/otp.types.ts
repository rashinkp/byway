export interface IVerifyOtpInput {
  email: string;
  otp: string;
  type?: "signup" | "password-reset";
}

export interface IResendOtpInput {
  email: string;
}

export interface IGenerateAndSendOtpInput {
  email: string;
  userId: string;
}

export interface IUserVerification {
  id: string;
  userId: string;
  email: string;
  otp: string;
  expiresAt: Date;
  attemptCount: number;
  isUsed: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
}

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