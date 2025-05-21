import { IAuthRepository } from "../../../repositories/auth.repository";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { ForgotPasswordDto } from "../../../../domain/dtos/auth/forgot-password.dto";
import { IForgotPasswordUseCase } from "../interfaces/forgot-passowrd.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      await this.otpProvider.generateOtp(user.email, user.id, "RESET");
      // TODO: Implement email sending
      // await this.emailProvider.sendResetTokenEmail(user.email, verification.otp);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to generate OTP", 500);
    }
  }
}
