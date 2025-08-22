import { IAuthRepository } from "../../../repositories/auth.repository";
import { IGetVerificationStatusUseCase } from "../interfaces/get-verification-status.usecase.interface";


export class GetVerificationStatusUseCase implements IGetVerificationStatusUseCase {
  constructor(private _authRepository: IAuthRepository) {}

  async execute(email: string): Promise<{
    cooldownTime: number;
    isExpired: boolean;
  }> {
    const verification = await this._authRepository.findVerificationByEmail(email);
    
    if (!verification) {
      return {
        cooldownTime: 0,
        isExpired: true
      };
    }

    const now = new Date();
    const lastUpdateTime = verification.updatedAt || verification.createdAt;
    const timeDiff = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000);
    const cooldownTime = Math.max(0, 60 - timeDiff);

    return {
      cooldownTime,
      isExpired: verification.isExpired()
    };
  }
} 