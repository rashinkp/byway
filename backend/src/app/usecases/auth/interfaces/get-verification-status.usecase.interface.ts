export interface IGetVerificationStatusUseCase {
  execute(email: string): Promise<{
    cooldownTime: number;
    isExpired: boolean;
  }>;
} 