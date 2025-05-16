import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import { OtpProvider } from "../../../infra/providers/otp/otp.provider";
import { ResendOtpDto } from "../../../domain/dtos/auth/resend-otp.dto";

export class ResendOtpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider,
  ) {}

  async execute(dto: ResendOtpDto): Promise<void> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const verification = await this.otpProvider.generateOtp(
      user.email,
      user.id,
      "VERIFICATION"
    );
    // await this.emailProvider.sendOtpEmail(user.email, verification.otp);
  }
}
