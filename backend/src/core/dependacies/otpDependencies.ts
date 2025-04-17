import { IDatabaseProvider } from "../database";
import { OtpController } from "../../modules/otp/otp.controller";
import { OtpService } from "../../modules/otp/otp.service";
import { OtpRepository } from "../../modules/otp/otp.repository";

export interface OtpDependencies {
  otpController: OtpController;
  otpService: OtpService; // Exported for use in auth
}

export const initializeOtpDependencies = (
  dbProvider: IDatabaseProvider
): OtpDependencies => {
  const prisma = dbProvider.getClient();
  const otpRepository = new OtpRepository(prisma);
  const otpService = new OtpService(otpRepository);
  const otpController = new OtpController(otpService);

  return { otpController, otpService };
};
