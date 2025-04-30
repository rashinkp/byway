import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptAuthController } from "../../adapters/expressAuthAdapters";
import { loginLimiter } from "../../middlewares/rateLimiters";

export const createAuthRouter = (authController: AuthController): Router => {
  const authRouter = Router();
  const adapt = adaptAuthController(authController);

  authRouter.post("/registerAdmin", adapt.registerAdmin);
  authRouter.post("/signup", adapt.registerUser);
  authRouter.post("/login", loginLimiter, adapt.login);
  authRouter.post("/google", adapt.googleAuth);
  authRouter.post("/logout", protect, adapt.logout);
  authRouter.post("/forgot-password", adapt.forgotPassword);
  authRouter.post("/reset-password", adapt.resetPassword);
  authRouter.get("/me", protect, adapt.me);
  authRouter.post('/facebook' , adapt.facebookAuth)

  return authRouter;
};
