import { Request, Response } from "express";
import { LoginUseCase } from "../../../app/usecases/auth/login.usecase";
import { RegisterUseCase } from "../../../app/usecases/auth/register.usecase";
import { VerifyOtpUseCase } from "../../../app/usecases/auth/verify-otp.usecase";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { VerifyOtpDto } from "../../../domain/dtos/auth/verify-otp.dto";
import { HttpSuccess } from "../utils/HttpSuccess";
import { LoginDto } from "../../../domain/dtos/auth/login.dto";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const dto: LoginDto = req.body;
    const result = await this.loginUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ user: result.user, token: result.token }));
  }

  async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterDto = req.body;
    const user = await this.registerUseCase.execute(dto);
    res.status(201).json(new HttpSuccess({ user }));
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const dto: VerifyOtpDto = req.body;
    await this.verifyOtpUseCase.execute(dto);
    res
      .status(200)
      .json(new HttpSuccess({ message: "Email verified successfully" }));
  }
}
