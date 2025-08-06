import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { IResendOtpUseCase } from "../interfaces/resend-otp.usecase.interface";
import { ResendOtpRequestDto } from "@/app/dtos/auth.dto";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: ResendOtpRequestDto): Promise<void> {
    try {
      // Get user record from repository
      const userRecord = await this.authRepository.findUserByEmail(dto.email);
      if (!userRecord) {
        throw new HttpError("User not found", 404);
      }

      // Convert record to domain entity
      const user = UserMapper.toDomain(userRecord);

      // Generate new OTP
      await this.otpProvider.generateOtp(user.email.address, user.id);
      // TODO: Implement email sending
      // await this.emailProvider.sendOtpEmail(user.email.address, verification.otp);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to resend OTP", 500);
    }
  }
}
