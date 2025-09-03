import { IAuthRepository } from "../../../repositories/auth.repository";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { IResendOtpUseCase } from "../interfaces/resend-otp.usecase.interface";
import { ResendOtpDto } from "../../../dtos/auth.dto";
import { UserNotFoundError, UserValidationError } from "../../../../domain/errors/domain-errors";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _otpProvider: OtpProvider
  ) {}

  async execute(dto: ResendOtpDto): Promise<void> {
    const user = await this._authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError(dto.email);
    }

    try {
      await this._otpProvider.generateOtp(user.email, user.id);
      // await this.emailProvider.sendOtpEmail(user.email, verification.otp);
    } catch (error) {
      if (error instanceof Error) {
        throw new UserValidationError(error.message);
      }
      throw new UserValidationError("Failed to resend OTP");
    }
  }
}
