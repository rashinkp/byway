import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { JwtUtil } from "../../utils/jwt.util";
import { ApiResponse } from "../../types/response";


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

      const { user, token } = await this.authService.registerAdmin(name, email, password);
      
      return {
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
        token,
        statusCode: StatusCodes.CREATED,
      }
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
      const { user, token } = await this.authService.registerUser(name, email, password);
      return {
        status: 'success',
        data: { id: user.id, email: user.email, role: user.role },
        token,
        statusCode: StatusCodes.CREATED,
      }
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : "Registration failed",
        statusCode: StatusCodes.BAD_REQUEST,
      }

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
        status: 'error',
        message: error instanceof Error ? error.message : "Login failed",
        statusCode: StatusCodes.UNAUTHORIZED,
      }

    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      return {
        status: "success",
        message: "Logged out successfully",
        statusCode: StatusCodes.OK,
      }
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Logout failed",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
  }

}
