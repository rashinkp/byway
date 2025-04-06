import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middlewares/authMiddleware";

const prisma = new PrismaClient();
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/registerAdmin", (req, res) => authController.registerAdmin(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.post("/logout", authMiddleware("ADMIN"), (req, res) => authController.logout(req, res));

export default authRouter;