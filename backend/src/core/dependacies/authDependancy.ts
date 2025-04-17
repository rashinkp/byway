import { IDatabaseProvider } from "../database";
import { AuthController } from "../../modules/auth/auth.controller";
import { AuthService } from "../../modules/auth/auth.service";
import { AuthRepository } from "../../modules/auth/auth.repository";
import { OtpService } from "../../modules/otp/otp.service";
import { OtpRepository } from "../../modules/otp/otp.repository";

export interface AuthDependencies {
  authController: AuthController;
}

export const initializeAuthDependencies = (
  dbProvider: IDatabaseProvider
): AuthDependencies => {
  const prisma = dbProvider.getClient();

  const otpRepository = new OtpRepository(prisma);
  const otpService = new OtpService(otpRepository);


  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository, otpService);
  const authController = new AuthController(authService);

  return { authController };
};
