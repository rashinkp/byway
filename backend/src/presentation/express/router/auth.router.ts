import { Router } from "express";
import { AuthController } from "../../http/controllers/auth.controller";
import { WinstonLogger } from "../../../infra/providers/logging/winston.logger";
import { LoginUseCase } from "../../../app/usecases/auth/login.usecase";
import { RegisterUseCase } from "../../../app/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "../../../app/usecases/auth/verify-otp.usecase";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { PrismaDatabaseProvider } from "../../../infra/database/postgres/prisma.database.provider";
import { AuthRepository } from "../../../app/repositories/auth.repository.impl";

const router = Router();
const logger = new WinstonLogger();
const databaseProvider = new PrismaDatabaseProvider(logger);
const authRepository = new AuthRepository(databaseProvider.getClient());
const jwtProvider = new JwtProvider();
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
const authController = new AuthController(
  loginUseCase,
  registerUseCase,
  verifyOtpUseCase,
  jwtProvider,
);

router.post("/login", (req, res) =>
  authController.login(req, res)
);
router.post("/register", (req, res) => authController.register(req, res));
router.post("/verify-otp", (req, res) =>
  authController.verifyOtp(req, res)
);

export default router;
