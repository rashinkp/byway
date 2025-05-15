import { Request, Response } from "express";
import { LoginUseCase } from "../../../app/usecases/auth/login.usecase";
import { RegisterUseCase } from "../../../app/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "../../../app/usecases/auth/verify-otp.usecase";
import { LoginDto } from "../../../domain/dtos/auth/login.dto";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpSuccess } from "../utils/HttpSuccess";
import { HttpError } from "../utils/HttpErrors";
import { cookieConfig } from "../../express/configs/cookie.config";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private jwtProvider: JwtProvider
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const dto: LoginDto = req.body;
    // Basic validation
    if (!dto.email || typeof dto.email !== "string") {
      throw new HttpError("Email is required and must be a string", 400);
    }
    if (dto.authProvider === "EMAIL_PASSWORD" && !dto.password) {
      throw new HttpError("Password is required for email/password login", 400);
    }
    const user = await this.loginUseCase.execute(dto);
    // Generate token
    const token = this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    res.cookie("jwt", token, cookieConfig.options);
    // Return user data without token
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
    // Validate VerifyOtpDto
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
}
