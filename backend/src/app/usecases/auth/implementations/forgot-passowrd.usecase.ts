import { IAuthRepository } from "../../../repositories/auth.repository";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { IForgotPasswordUseCase } from "../interfaces/forgot-passowrd.usecase.interface";
import { ForgotPasswordDto } from "../../../dtos/auth.dto";
import { UserNotFoundError, UserValidationError } from "../../../../domain/errors/domain-errors";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _otpProvider: OtpProvider
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this._authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError(dto.email);
    }

    try {
      await this._otpProvider.generateOtp(user.email, user.id);
      // TODO: Implement email sending
      // await this.emailProvider.sendResetTokenEmail(user.email, verification.otp);
    } catch (error) {
      if (error instanceof Error) {
        throw new UserValidationError(error.message);
      }
      throw new UserValidationError("Failed to generate OTP");
    }
  }
}
