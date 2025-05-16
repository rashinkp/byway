// presentation/http/router/auth.router.ts
import { Router } from "express";
import { AuthController } from "../../http/controllers/auth.controller";
import { LoginUseCase } from "../../../app/usecases/auth/login.usecase";
import { RegisterUseCase } from "../../../app/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "../../../app/usecases/auth/verify-otp.usecase";
import { LogoutUseCase } from "../../../app/usecases/auth/logout.usecase";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { PrismaDatabaseProvider } from "../../../infra/database/postgres/prisma.database.provider";
import { AuthRepository } from "../../../app/repositories/auth.repository.impl";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { OtpProvider } from "../../../infra/providers/otp/otp.provider";
import { ResendOtpUseCase } from "../../../app/usecases/auth/resend-otp-usecase";
import { ForgotPasswordUseCase } from "../../../app/usecases/auth/forgot-passowrd.usecase";
import { ResetPasswordUseCase } from "../../../app/usecases/auth/reset-password.usecase";
import { optionalAuth, restrictTo } from "../middlewares/auth.middleware";
import { GoogleAuthProvider } from "../../../infra/providers/auth/google-auth.provider";
import { GoogleAuthUseCase } from "../../../app/usecases/auth/google-auth.usecase";

const router = Router();
const logger = new WinstonLogger();
const databaseProvider = new PrismaDatabaseProvider(logger);
const authRepository = new AuthRepository(databaseProvider.getClient());
const jwtProvider = new JwtProvider();
const otpProvider = new OtpProvider(authRepository);
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository, otpProvider);
const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
const logoutUseCase = new LogoutUseCase();
const resendOtpUseCase = new ResendOtpUseCase(authRepository, otpProvider);
const forgotPasswordUseCase = new ForgotPasswordUseCase(
  authRepository,
  otpProvider
);
const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
const googleAuthProvider = new GoogleAuthProvider(
  process.env.GOOGLE_CLIENT_ID || ""
);
const googleAuthUseCase = new GoogleAuthUseCase(
  authRepository,
  googleAuthProvider
); // Fix: Add authRepository

const authController = new AuthController(
  loginUseCase,
  registerUseCase,
  verifyOtpUseCase,
  logoutUseCase,
  resendOtpUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  googleAuthUseCase, // Add this
  jwtProvider
);

// Public routes
router.post("/login", (req, res, next) =>
  authController.login(req, res).catch(next)
);
router.post("/register", (req, res, next) =>
  authController.register(req, res).catch(next)
);
router.post("/verify-otp", (req, res, next) =>
  authController.verifyOtp(req, res).catch(next)
);
router.post("/resend-otp", (req, res, next) =>
  authController.resendOtp(req, res).catch(next)
);
router.post("/forgot-password", (req, res, next) =>
  authController.forgotPassword(req, res).catch(next)
);
router.post("/reset-password", (req, res, next) =>
  authController.resetPassword(req, res).catch(next)
);
router.post(
  "/google",
  (req, res, next) => authController.googleAuth(req, res).catch(next) 
);

// Protected routes
router.post(
  "/logout",
  restrictTo("ADMIN", "TUTOR", "LEARNER"),
  (req, res, next) => authController.logout(req, res).catch(next)
);

export default router;
