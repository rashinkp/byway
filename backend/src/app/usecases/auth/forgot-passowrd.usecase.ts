import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import { OtpProvider } from "../../../infra/providers/otp/otp.provider";
import { ForgotPasswordDto } from "../../../domain/dtos/auth/forgot-password.dto";

export class ForgotPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const verification = await this.otpProvider.generateOtp(
      user.email,
      user.id,
      "RESET"
    );
    // await this.emailProvider.sendResetTokenEmail(user.email, verification.otp);
  }
}
