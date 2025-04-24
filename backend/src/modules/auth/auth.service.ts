import { JwtUtil } from "../../utils/jwt.util";
import { OAuth2Client } from "google-auth-library";
import * as bcrypt from "bcrypt";
import { IAuthRepository, IAuthUser, IForgotPasswordInput, IResetPasswordInput } from "./auth.types";
import { OtpService } from "../otp/otp.service";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../user/user.service";
import axios from "axios";


export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private authRepository: IAuthRepository,
    private otpService: OtpService,
    private jwtSecret: string,
    private userService: UserService,
    googleClientId: string
  ) {
    if (!jwtSecret) {
      throw new AppError(
        "JWT_SECRET not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }

    if (!googleClientId) {
      throw new AppError(
        "GOOGLE_CLIENT_ID not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
    this.googleClient = new OAuth2Client(googleClientId);
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

  async googleAuth(
    accessToken: string
  ): Promise<{ user: IAuthUser; token: string }> {
    try {
      // Fetch user info using access_token
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const payload = userInfoResponse.data;
      console.log("Google userinfo payload:", payload); 

      if (!payload || !payload.email || !payload.sub) {
        throw AppError.badRequest("Invalid Google access token");
      }

      const { email, name, sub: googleId } = payload;
      let user = await this.userService.findUserByEmail(email);

      if (!user) {
        user = await this.authRepository.createGoogleUser(
          name || "Google User",
          email,
          googleId
        );
      } else if (user.authProvider !== "GOOGLE") {
        const updatedUser = await this.userService.updateUser({ userId: user.id, googleId });
        user = { ...user, ...updatedUser };
        if (!user) {
          throw AppError.badRequest(
            "This email is registered with a different authentication method"
          );
        }
      } else if (user.deletedAt !== null) {
        throw AppError.forbidden("This account is deactivated");
      }

      const token = this.generateToken(user.id, user.email, user.role);
      return { user, token };
    } catch (error: any) {
      console.error("Google auth error:", error.message, error.response?.data); // Debug log
      if (error.response?.status === 401) {
        throw AppError.badRequest("Invalid Google access token");
      }
      throw AppError.badRequest(
        error.message || "Google authentication failed"
      );
    }
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

    // const isVerified = await this.otpService.verifyOtp({ email, otp });
    // if (!isVerified) {
    //   throw AppError.badRequest("Invalid or expired OTP");
    // }

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
