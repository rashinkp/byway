import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { IResendOtpUseCase } from "../interfaces/resend-otp.usecase.interface";
import { ResendOtpDto } from "../../../dtos/auth.dto";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: ResendOtpDto): Promise<void> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      await this.otpProvider.generateOtp(user.email, user.id);

      // await this.emailProvider.sendOtpEmail(user.email, verification.otp);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to resend OTP", 500);
    }
  }
}
