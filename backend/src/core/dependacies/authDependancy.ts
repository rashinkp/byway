import { IDatabaseProvider } from "../database";
import { AuthController } from "../../modules/auth/auth.controller";
import { AuthService } from "../../modules/auth/auth.service";
import { AuthRepository } from "../../modules/auth/auth.repository";
import { OtpService } from "../../modules/otp/otp.service";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export interface AuthDependencies {
  authController: AuthController;
}

export const initializeAuthDependencies = (
  dbProvider: IDatabaseProvider,
  otpService: OtpService
): AuthDependencies => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "JWT_SECRET environment variable is not set",
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }
  const prisma = dbProvider.getClient();
  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(
    authRepository,
    otpService,
    process.env.JWT_SECRET
  );
  const authController = new AuthController(authService);
  return { authController };
};
