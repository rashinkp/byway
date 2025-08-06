import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserVerificationMapper } from "../../../mappers/user-verification.mapper";
import { IGetVerificationStatusUseCase } from "../interfaces/get-verification-status.usecase.interface";

export class GetVerificationStatusUseCase implements IGetVerificationStatusUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string): Promise<{
    cooldownTime: number;
    isExpired: boolean;
  }> {
    const verificationRecord = await this.authRepository.findVerificationByEmail(email);
    
    if (!verificationRecord) {
      return {
        cooldownTime: 0,
        isExpired: true
      };
    }

    const verification = UserVerificationMapper.toDomain(verificationRecord);

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