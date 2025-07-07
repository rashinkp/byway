export interface EmailProvider {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendResetTokenEmail(email: string, token: string): Promise<void>;
  }