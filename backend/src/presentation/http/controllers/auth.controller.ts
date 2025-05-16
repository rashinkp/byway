import { Request, Response } from "express";
import { LoginUseCase } from "../../../app/usecases/auth/login.usecase";
import { RegisterUseCase } from "../../../app/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "../../../app/usecases/auth/verify-otp.usecase";
import { LogoutUseCase } from "../../../app/usecases/auth/logout.usecase";
import { ResetPasswordUseCase } from "../../../app/usecases/auth/reset-password.usecase";
import { LoginDto } from "../../../domain/dtos/auth/login.dto";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { ResendOtpDto } from "../../../domain/dtos/auth/resend-otp.dto";
import { ForgotPasswordDto } from "../../../domain/dtos/auth/forgot-password.dto";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpSuccess } from "../utils/HttpSuccess";
import { HttpError } from "../utils/HttpErrors";
import { ResendOtpUseCase } from "../../../app/usecases/auth/resend-otp-usecase";
import { ForgotPasswordUseCase } from "../../../app/usecases/auth/forgot-passowrd.usecase";
import { cookieConfig } from "../../express/configs/cookie.config";
import { ResetPasswordDto } from "../../../domain/dtos/auth/reset-password.dto";
import { GoogleAuthDto } from "../../../domain/dtos/auth/googel-auth.dto";
import { GoogleAuthUseCase } from "../../../app/usecases/auth/google-auth.usecase";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private logoutUseCase: LogoutUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private googleAuthUseCase: GoogleAuthUseCase,
    private jwtProvider: JwtProvider
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const dto: LoginDto = req.body;
    if (!dto.email || typeof dto.email !== "string") {
      throw new HttpError("Email is required and must be a string", 400);
    }
    if (dto.authProvider === "EMAIL_PASSWORD" && !dto.password) {
      throw new HttpError("Password is required for email/password login", 400);
    }
    const user = await this.loginUseCase.execute(dto);
    const token = this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.cookie("jwt", token, cookieConfig.options);
    res.status(200).json(new HttpSuccess({ user }));
  }

  async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterDto = req.body;
    if (!dto.name || typeof dto.name !== "string") {
      throw new HttpError("Name is required and must be a string", 400);
    }
    if (!dto.email || typeof dto.email !== "string") {
      throw new HttpError("Email is required and must be a string", 400);
    }
    const user = await this.registerUseCase.execute(dto);
    res.status(201).json(new HttpSuccess({ user }));
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new HttpError(
        "Email is required and must be a non-empty string",
        400
      );
    }
    if (!dto.otp || typeof dto.otp !== "string" || !dto.otp.trim()) {
      throw new HttpError(
        "OTP is required and must be a non-empty string",
        400
      );
    }
    await this.verifyOtpUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ message: "Email verified successfully" }));
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.logoutUseCase.execute();
    res.cookie("jwt", "", { ...cookieConfig.options, maxAge: 0 });
    res
      .status(200)
      .json(new HttpSuccess({ message: "Logged out successfully" }));
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const dto: ResendOtpDto = req.body;
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new HttpError(
        "Email is required and must be a non-empty string",
        400
      );
    }
    await this.resendOtpUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ message: "OTP resent successfully" }));
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const dto: ForgotPasswordDto = req.body;
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new HttpError(
        "Email is required and must be a non-empty string",
        400
      );
    }
    await this.forgotPasswordUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ message: "Password reset email sent" }));
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const dto: ResetPasswordDto = req.body;
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new HttpError(
        "Email is required and must be a non-empty string",
        400
      );
    }
    if (
      !dto.newPassword ||
      typeof dto.newPassword !== "string" ||
      !dto.newPassword.trim()
    ) {
      throw new HttpError(
        "New password is required and must be a non-empty string",
        400
      );
    }
    await this.resetPasswordUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ message: "Password reset successfully" }));
  }

  // presentation/http/controllers/auth.controller.ts
  async googleAuth(req: Request, res: Response): Promise<void> {
    const dto: GoogleAuthDto = req.body;
    if (!dto.accessToken || typeof dto.accessToken !== "string") {
      throw new HttpError("Access token is required and must be a string", 400);
    }
    const user = await this.googleAuthUseCase.execute(dto.accessToken);
    const token = this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.cookie("jwt", token, cookieConfig.options);
    res.status(200).json(new HttpSuccess({ user }));
  }
}
