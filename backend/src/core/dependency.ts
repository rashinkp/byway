import { PrismaClient } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";


export const initializeDependencies = () => {
  const prisma = new PrismaClient();
  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);
  return { authController };
}

