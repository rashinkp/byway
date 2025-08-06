import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { IForgotPasswordUseCase } from "../interfaces/forgot-passowrd.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ForgotPasswordRequestDto } from "@/app/dtos/auth.dto";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: ForgotPasswordRequestDto): Promise<void> {
    try {
      // Get user record from repository
      const userRecord = await this.authRepository.findUserByEmail(dto.email);
      if (!userRecord) {
        throw new HttpError("User not found", 404);
      }

      // Convert record to domain entity
      const user = UserMapper.toDomain(userRecord);

      // Generate OTP for password reset
      await this.otpProvider.generateOtp(user.email.address, user.id);
      // TODO: Implement email sending
      // await this.emailProvider.sendResetTokenEmail(user.email.address, verification.otp);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to generate OTP", 500);
    }
  }
}
