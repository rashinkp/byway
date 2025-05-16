import { PrismaClient } from "@prisma/client";
import { AuthController } from "../presentation/http/controllers/auth.controller";
import { AuthRepository } from "../app/repositories/auth.repository.impl";
import { OtpProvider } from "../infra/providers/otp/otp.provider";
import { GoogleAuthProvider } from "../infra/providers/auth/google-auth.provider";
import { envConfig } from "../presentation/express/configs/env.config";
import { FacebookAuthUseCase } from "../app/usecases/auth/facebook-auth.usecase";
import { ForgotPasswordUseCase } from "../app/usecases/auth/forgot-passowrd.usecase";
import { GoogleAuthUseCase } from "../app/usecases/auth/google-auth.usecase";
import { LoginUseCase } from "../app/usecases/auth/login.usecase";
import { LogoutUseCase } from "../app/usecases/auth/logout.usecase";
import { RegisterUseCase } from "../app/usecases/auth/register.usecase";
import { ResendOtpUseCase } from "../app/usecases/auth/resend-otp-usecase";
import { ResetPasswordUseCase } from "../app/usecases/auth/reset-password.usecase";
import { VerifyOtpUseCase } from "../app/usecases/auth/verify-otp.usecase";

export interface AuthDependencies {
  authController: AuthController;
}

export function createAuthDependencies(): AuthDependencies {
  // Initialize infrastructure
  const prisma = new PrismaClient();
  const authRepository = new AuthRepository(prisma);
  const otpProvider = new OtpProvider(authRepository);
  const googleAuthGateway = new GoogleAuthProvider(envConfig.GOOGLE_CLIENT_ID);

  // Initialize use cases
  const facebookAuthUseCase = new FacebookAuthUseCase(authRepository);
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    authRepository,
    otpProvider
  );
  const googleAuthUseCase = new GoogleAuthUseCase(
    authRepository,
    googleAuthGateway
  );
  const loginUseCase = new LoginUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase();
  const registerUseCase = new RegisterUseCase(authRepository, otpProvider);
  const resendOtpUseCase = new ResendOtpUseCase(authRepository, otpProvider);
  const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
  const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);

  // Initialize controller
  const authController = new AuthController(
    facebookAuthUseCase,
    forgotPasswordUseCase,
    googleAuthUseCase,
    loginUseCase,
    logoutUseCase,
    registerUseCase,
    resendOtpUseCase,
    resetPasswordUseCase,
    verifyOtpUseCase
  );

  return {
    authController,
  };
}
