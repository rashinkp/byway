import { IDatabaseProvider } from "../database";
import { OtpController } from "../../modules/otp/otp.controller";
import { OtpService } from "../../modules/otp/otp.service";
import { OtpRepository } from "../../modules/otp/otp.repository";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export interface OtpDependencies {
  otpController: OtpController;
  otpService: OtpService;
}

export const initializeOtpDependencies = (
  dbProvider: IDatabaseProvider
): OtpDependencies => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new AppError(
      "EMAIL_USER and EMAIL_PASS environment variables are not set",
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }
  const prisma = dbProvider.getClient();
  const otpRepository = new OtpRepository(prisma);
  const otpService = new OtpService(
    otpRepository,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );
  const otpController = new OtpController(otpService);
  return { otpController, otpService };
};
