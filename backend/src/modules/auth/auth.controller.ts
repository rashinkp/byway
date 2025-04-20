import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { ForgotPasswordSchema, LoginSchema, RegisterAdminSchema, RegisterUserSchema, ResetPasswordSchema } from "./auth.validator";



export class AuthController {
  constructor(private authService: AuthService) {}

  async registerAdmin(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = RegisterAdminSchema.parse(input);
      const { name, email, password } = validatedInput;
      const { user, token } = await this.authService.registerAdmin(
        name,
        email,
        password
      );
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        token,
        statusCode: StatusCodes.CREATED,
        message: "Admin registered successfully",
      };
    } catch (error) {
      logger.error("Register admin error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async registerUser(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = RegisterUserSchema.parse(input);
      console.log(validatedInput);
      const { name, email, password } = validatedInput;

      const user = await this.authService.registerUser(name, email, password);
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        statusCode: StatusCodes.CREATED,
        message:
          "User registered successfully. Please verify your email with the OTP sent.",
      };
    } catch (error) {
      logger.error("Register user error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async login(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = LoginSchema.parse(input);
      const { email, password } = validatedInput;
      const { user, token } = await this.authService.login(email, password);
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        token,
        statusCode: StatusCodes.OK,
        message: "Logged in successfully",
      };
    } catch (error) {
      logger.error("Login error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    return {
      status: "success",
      message: "Logged out successfully",
      statusCode: StatusCodes.OK,
    };
  }

  async forgotPassword(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = ForgotPasswordSchema.parse(input);
      await this.authService.forgotPassword(validatedInput);
      return {
        status: "success",
        data: null,
        message: "OTP sent to your email for password reset",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Forgot password error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async resetPassword(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = ResetPasswordSchema.parse(input);
      await this.authService.resetPassword(validatedInput);
      return {
        status: "success",
        data: null,
        message: "Password reset successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Reset password error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async me(userId: string): Promise<ApiResponse> {
    try {
      const user = await this.authService.me(userId);
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        statusCode: StatusCodes.OK,
        message: "User details retrieved",
      };
    } catch (error) {
      logger.error("Get user details error:", { error, userId });
      throw error;
    }
  }
}
