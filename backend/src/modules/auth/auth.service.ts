import { JwtUtil } from "../../utils/jwt.util";
import * as bcrypt from "bcrypt";
import { IAuthRepository, IAuthUser, IForgotPasswordInput, IResetPasswordInput } from "./auth.types";
import { OtpService } from "../otp/otp.service";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../user/user.service";



export class AuthService {
  constructor(
    private authRepository: IAuthRepository,
    private otpService: OtpService,
    private jwtSecret: string,
    private userService: UserService
  ) {
    if (!jwtSecret) {
      throw new AppError(
        "JWT_SECRET not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
  }

  async registerAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: IAuthUser; token: string }> {
    if (!name || !email || !password) {
      throw AppError.badRequest("Name, email, and password are required");
    }

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw AppError.badRequest("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createAdmin(
      name,
      email,
      hashedPassword
    );
    const token = this.generateToken(user.id, user.email, user.role);
    return { user, token };
  }

  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser> {
    if (!name || !email || !password) {
      throw AppError.badRequest("Name, email, and password are required");
    }

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser && existingUser.isVerified) {
      throw AppError.badRequest("User already exists");
    }

    if (existingUser) {
      return existingUser;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser(
      name,
      email,
      hashedPassword
    );
    try {
      await this.otpService.generateAndSendOtp({ email, userId: user.id });
    } catch (error) {
      console.error("Failed to send OTP during registration:", error);
    }
    return user;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IAuthUser; token: string }> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }

    if (user.authProvider !== "EMAIL_PASSWORD" || !user.password) {
      throw AppError.badRequest(
        "This account uses a different authentication method"
      );
    }

    if (!user.isVerified || user.deletedAt !== null) {
      throw AppError.forbidden("This account is not currently available");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid email or password");
    }
    return { user, token: this.generateToken(user.id, user.email, user.role) };
  }

  private generateToken(id: string, email: string, role: string): string {
    return JwtUtil.generateToken({ id, email, role }, this.jwtSecret);
  }

  async forgotPassword(input: IForgotPasswordInput): Promise<void> {
    const { email } = input;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw AppError.notFound("User not found");
    }
    await this.otpService.generateAndSendOtp({ email, userId: user.id });
  }

  async resetPassword(input: IResetPasswordInput): Promise<void> {
    const { email, newPassword, otp } = input;

    const isVerified = await this.otpService.verifyOtp({ email, otp });
    if (!isVerified) {
      throw AppError.badRequest("Invalid or expired OTP");
    }

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.authRepository.resetPassword(email, hashedPassword);
  }

  async me(userId: string): Promise<IAuthUser> {
    const user = await this.userService.findUserById(userId);
    if (!user || user.deletedAt !== null) {
      throw AppError.notFound("User not found or account is deactivated");
    }
    return user;
  }
}
