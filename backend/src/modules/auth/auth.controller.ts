import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { IForgotPasswordInput, IResetPasswordInput } from "./types";


interface RegisterAdminInput {
  name: string;
  email: string;
  password: string;
}
interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}



export class AuthController {
  constructor(private authService: AuthService) {}

  async registerAdmin(input: RegisterAdminInput): Promise<ApiResponse> {
    const { name, email, password } = input;
    try {
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
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Registration failed",
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }
  }

  async registerUser(input: RegisterUserInput): Promise<ApiResponse> {
    const { name, email, password } = input;
    try {
      const user = await this.authService.registerUser(name, email, password);
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Registration failed",
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }
  }

  async login(input: LoginInput): Promise<ApiResponse> {
    const { email, password } = input;
    try {
      const { user, token } = await this.authService.login(email, password);
      // JwtUtil.setTokenCookie(token, res);
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        token,
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Login failed",
        statusCode: StatusCodes.UNAUTHORIZED,
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      return {
        status: "success",
        message: "Logged out successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Logout failed",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async forgotPassword(input: IForgotPasswordInput): Promise<ApiResponse> {
    try {
      await this.authService.forgotPassword(input);
      return {
        status: "success",
        data: null,
        message: "OTP sent to your email for password reset",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Forgot password failed",
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }
  }

  async resetPassword(input: IResetPasswordInput): Promise<ApiResponse> {
    try {
      await this.authService.resetPassword(input);
      return {
        status: "success",
        data: null,
        message: "Password reset successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Password reset failed",
        statusCode: StatusCodes.BAD_REQUEST,
      };
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
      console.error(error);
      return {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user details",
        statusCode: StatusCodes.UNAUTHORIZED,
      };
    }
  }
}
