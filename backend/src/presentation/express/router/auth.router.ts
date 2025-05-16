import { Router } from "express";
import { AuthController } from "../../http/controllers/auth.controller";

export default function authRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/facebook", (req, res, next) =>
    authController.facebookAuth(req, res, next)
  );
  router.post("/forgot-password", (req, res, next) =>
    authController.forgotPassword(req, res, next)
  );
  router.post("/google", (req, res, next) =>
    authController.googleAuth(req, res, next)
  );
  router.post("/login", (req, res, next) =>
    authController.login(req, res, next)
  );
  router.post("/logout", (req, res, next) =>
    authController.logout(req, res, next)
  );
  router.post("/register", (req, res, next) =>
    authController.register(req, res, next)
  );
  router.post("/resend-otp", (req, res, next) =>
    authController.resendOtp(req, res, next)
  );
  router.post("/reset-password", (req, res, next) =>
    authController.resetPassword(req, res, next)
  );
  router.post("/verify-otp", (req, res, next) =>
    authController.verifyOtp(req, res, next)
  );

  return router;
}
