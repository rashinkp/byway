import { Router } from "express";
import { AuthController } from "../../http/controllers/auth.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function authRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/facebook", (req, res) =>
    expressAdapter(req, res, authController.facebookAuth.bind(authController))
  );
  router.post("/forgot-password", (req, res) =>
    expressAdapter(req, res, authController.forgotPassword.bind(authController))
  );
  router.post("/google", (req, res) =>
    expressAdapter(req, res, authController.googleAuth.bind(authController))
  );
  router.post("/login", (req, res) =>
    expressAdapter(req, res, authController.login.bind(authController))
  );
  router.post("/logout", (req, res) =>
    expressAdapter(req, res, authController.logout.bind(authController))
  );
  router.post("/register", (req, res) =>
    expressAdapter(req, res, authController.register.bind(authController))
  );
  router.post("/resend-otp", (req, res) =>
    expressAdapter(req, res, authController.resendOtp.bind(authController))
  );
  router.post("/reset-password", (req, res) =>
    expressAdapter(req, res, authController.resetPassword.bind(authController))
  );
  router.post("/verify-otp", (req, res) =>
    expressAdapter(req, res, authController.verifyOtp.bind(authController))
  );
  router.get("/verification-status", (req, res) =>
    expressAdapter(req, res, authController.getVerificationStatus.bind(authController))
  );

  return router;
}
