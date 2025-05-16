import { Request, Response, NextFunction } from "express";
import { IFacebookAuthUseCase } from "../../../app/usecases/auth/interfaces/facebook-auth.usecase.interface";
import { IForgotPasswordUseCase } from "../../../app/usecases/auth/interfaces/forgot-passowrd.usecase.interface";
import { IGoogleAuthUseCase } from "../../../app/usecases/auth/interfaces/google-auth.usecase.interface";
import { ILoginUseCase } from "../../../app/usecases/auth/interfaces/login.usecase.interface";
import { ILogoutUseCase } from "../../../app/usecases/auth/interfaces/logout.usecase.interface";
import { IRegisterUseCase } from "../../../app/usecases/auth/interfaces/register.usecase.interface";
import { IResendOtpUseCase } from "../../../app/usecases/auth/interfaces/resend-otp.usecase.interface";
import { IResetPasswordUseCase } from "../../../app/usecases/auth/interfaces/reset-password.usecase.interface";
import { IVerifyOtpUseCase } from "../../../app/usecases/auth/interfaces/verify-otp.usecase.interface";
import { validateFacebookAuth, validateForgotPassword, validateGoogleAuth, validateLogin, validateRegister, validateResendOtp, validateResetPassword, validateVerifyOtp } from "../../validators/auth.validators";

export class AuthController {
  constructor(
    private facebookAuthUseCase: IFacebookAuthUseCase,
    private forgotPasswordUseCase: IForgotPasswordUseCase,
    private googleAuthUseCase: IGoogleAuthUseCase,
    private loginUseCase: ILoginUseCase,
    private logoutUseCase: ILogoutUseCase,
    private registerUseCase: IRegisterUseCase,
    private resendOtpUseCase: IResendOtpUseCase,
    private resetPasswordUseCase: IResetPasswordUseCase,
    private verifyOtpUseCase: IVerifyOtpUseCase
  ) {}

  async facebookAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateFacebookAuth(req.body);
      const user = await this.facebookAuthUseCase.execute(validated);
      res
        .status(200)
        .json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateForgotPassword(req.body);
      await this.forgotPasswordUseCase.execute(validated);
      res.status(200).json({ message: "Password reset OTP sent" });
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateGoogleAuth(req.body);
      const user = await this.googleAuthUseCase.execute(validated.accessToken);
      res
        .status(200)
        .json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateLogin(req.body);
      const user = await this.loginUseCase.execute(validated);
      res
        .status(200)
        .json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.logoutUseCase.execute();
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateRegister(req.body);
      const user = await this.registerUseCase.execute(validated);
      res
        .status(201)
        .json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateResendOtp(req.body);
      await this.resendOtpUseCase.execute(validated);
      res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateResetPassword(req.body);
      await this.resetPasswordUseCase.execute(validated);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateVerifyOtp(req.body);
      await this.verifyOtpUseCase.execute(validated);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      next(error);
    }
  }
}
