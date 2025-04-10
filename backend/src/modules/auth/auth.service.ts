import { JwtUtil } from "../../utils/jwt.util";
import { IAuthRepository } from "./auth.repository";
import * as bcrypt from "bcrypt";
import { IForgotPasswordInput, IResetPasswordInput } from "./types";
import { OtpService } from "../otp/otp.service";

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  password?: string;
  authProvider?: string;
}

export class AuthService {
  constructor(private authRepository: IAuthRepository , private otpService:OtpService) {}

  async registerAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: IAuthUser; token: string }> {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
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
      throw new Error("All fields are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser(
      name,
      email,
      hashedPassword
    );
    return user;
  }

 

  async login(
    email: string,
    password: string
  ): Promise<{ user: IAuthUser; token: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.authProvider !== "EMAIL_PASSWORD" || !user.password) {
      throw new Error("This account uses a different authentication method");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return { user, token: this.generateToken(user.id, user.email, user.role) };
  }

  private generateToken(id: string, email: string, role: string): string {
    return JwtUtil.generateToken({ id, email, role });
  }

  async forgotPassword(input: IForgotPasswordInput): Promise<void>  {
   const { email } = input;
   const user = await this.authRepository.findUserByEmail(email);
   if (!user) throw new Error("User not found");
    await this.otpService.generateAndSendOtp({ email, userId: user.id });
    
  }

  async resetPassword(input: IResetPasswordInput): Promise<void> {
    const { email, newPassword, otpCode } = input

    console.log(otpCode);

    const isVerified = await this.otpService.verifyOtp({ email, otpCode });

    if (!isVerified) {
      throw new Error('OTP verification failed')
    }
    
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.authRepository.resetPassword(email, hashedPassword);
  }
}
