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
import {
  validateFacebookAuth,
  validateForgotPassword,
  validateGoogleAuth,
  validateLogin,
  validateRegister,
  validateResendOtp,
  validateResetPassword,
  validateVerifyOtp,
} from "../../validators/auth.validators";
import jwt from "jsonwebtoken";
import { ApiResponse, UserResponse } from "../interfaces/ApiResponse";

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

  private generateToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
  }

  private setAuthCookie(
    res: Response,
    user: { id: string; email: string; role: string }
  ): void {
    const token = this.generateToken(user);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  async facebookAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateFacebookAuth(req.body);
      const user = await this.facebookAuthUseCase.execute(validated);
      this.setAuthCookie(res, user);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Facebook authentication successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      res.status(200).json(response);
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
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Password reset OTP sent",
        data: null,
      };
      res.status(200).json(response);
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
      this.setAuthCookie(res, user);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Google authentication successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateLogin(req.body);
      const user = await this.loginUseCase.execute(validated);
      this.setAuthCookie(res, user);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.logoutUseCase.execute();
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Logged out successfully",
        data: null,
      };
      res.status(200).json(response);
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
      this.setAuthCookie(res, user);
      const response: ApiResponse<UserResponse> = {
        statusCode: 201,
        success: true,
        message: "Registration successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      res.status(201).json(response);
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
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "OTP resent successfully",
        data: null,
      };
      res.status(200).json(response);
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
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Password reset successfully",
        data: null,
      };
      res.status(200).json(response);
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
      const user = await this.verifyOtpUseCase.execute(validated);
      this.setAuthCookie(res, user);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
