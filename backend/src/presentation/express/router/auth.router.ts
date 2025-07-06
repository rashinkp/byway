import { Router } from "express";
import { AuthController } from "../../http/controllers/auth.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function authRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/facebook", (req, res, next) =>
    expressAdapter(req, res, authController.facebookAuth.bind(authController), next)
  );
  router.post("/forgot-password", (req, res, next) =>
    expressAdapter(req, res, authController.forgotPassword.bind(authController), next)
  );
  router.post("/google", (req, res, next) =>
    expressAdapter(req, res, authController.googleAuth.bind(authController), next)
  );
  router.post("/login", (req, res, next) =>
    expressAdapter(req, res, authController.login.bind(authController), next)
  );
  router.post("/logout", (req, res, next) =>
    expressAdapter(req, res, authController.logout.bind(authController), next)
  );
  router.post("/register", (req, res, next) =>
    expressAdapter(req, res, authController.register.bind(authController), next)
  );
  router.post("/resend-otp", (req, res, next) =>
    expressAdapter(req, res, authController.resendOtp.bind(authController), next)
  );
  router.post("/reset-password", (req, res, next) =>
    expressAdapter(req, res, authController.resetPassword.bind(authController), next)
  );
  router.post("/verify-otp", (req, res, next) =>
    expressAdapter(req, res, authController.verifyOtp.bind(authController), next)
  );
  router.get("/verification-status", (req, res, next) =>
    expressAdapter(req, res, authController.getVerificationStatus.bind(authController), next)
  );

  return router;
}
