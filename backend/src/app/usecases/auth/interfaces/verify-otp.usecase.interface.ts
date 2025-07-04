export interface IVerifyOtpUseCase {
  execute(data: { email: string; otp: string }): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}
