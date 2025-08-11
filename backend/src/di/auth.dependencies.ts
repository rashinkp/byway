import { FacebookAuthUseCase } from "../app/usecases/auth/implementations/facebook-auth.usecase";
import { ForgotPasswordUseCase } from "../app/usecases/auth/implementations/forgot-passowrd.usecase";
import { GetVerificationStatusUseCase } from "../app/usecases/auth/implementations/get-verification-status.usecase";
import { GoogleAuthUseCase } from "../app/usecases/auth/implementations/google-auth.usecase";
import { LoginUseCase } from "../app/usecases/auth/implementations/login.usecase";
import { LogoutUseCase } from "../app/usecases/auth/implementations/logout.usecase";
import { RegisterUseCase } from "../app/usecases/auth/implementations/register.usecase";
import { ResendOtpUseCase } from "../app/usecases/auth/implementations/resend-otp-usecase";
import { ResetPasswordUseCase } from "../app/usecases/auth/implementations/reset-password.usecase";
import { VerifyOtpUseCase } from "../app/usecases/auth/implementations/verify-otp.usecase";
import { AuthController } from "../presentation/http/controllers/auth.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface AuthDependencies {
  authController: AuthController;
}

export function createAuthDependencies(
  deps: SharedDependencies
): AuthDependencies {
  const { authRepository, otpProvider, googleAuthProvider } = deps;

  // Initialize use cases
  const facebookAuthUseCase = new FacebookAuthUseCase(authRepository);
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    authRepository,
    otpProvider
  );
  const googleAuthUseCase = new GoogleAuthUseCase(
    authRepository,
    googleAuthProvider
  );
  const loginUseCase = new LoginUseCase(authRepository, deps.cartRepository);
  const logoutUseCase = new LogoutUseCase();
  const registerUseCase = new RegisterUseCase(authRepository, otpProvider , deps.passwordHasher);
  const resendOtpUseCase = new ResendOtpUseCase(authRepository, otpProvider);
  const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
  const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
  const getVerificationStatusUseCase = new GetVerificationStatusUseCase(
    authRepository
  );

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
    verifyOtpUseCase,
    getVerificationStatusUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    authController,
  };
}
