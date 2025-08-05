export interface UserVerificationRecord {
  id: string;
  userId: string;
  email: string;
  otp: string;
  expiresAt: Date;
  attemptCount: number;
  isUsed: boolean;
  createdAt: Date;
} 