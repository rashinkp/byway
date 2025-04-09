import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptAuthController } from "../../adapters/expressAuthAdapters";

export const createAuthRouter = (authController:AuthController ): Router => {
  const authRouter = Router();
  const adapt = adaptAuthController(authController);


  authRouter.post("/registerAdmin", adapt.registerAdmin);
  authRouter.post("/registerUser", adapt.registerUser);
  authRouter.post("/login", adapt.login);
  authRouter.post("/logout", protect, adapt.logout);
  authRouter.post('/forgot-password' , adapt.forgotPassword)
  authRouter.post('/reset-password' , adapt.resetPassword)
  
  return authRouter;
} 