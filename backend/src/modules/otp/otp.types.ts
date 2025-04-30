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

