import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { JwtUtil } from "../../utils/jwt.util";

export class AuthController {
  constructor(private authService: AuthService) {}

  async registerAdmin(req: Request, res: Response) {
    console.log("Registering admin with body:", req.body);
    const { name, email, password } = req.body;

    try {
      const user = await this.authService.registerAdmin(name, email, password);
      const token = JwtUtil.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      JwtUtil.setTokenCookie(res, token);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
      console.log(error);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { user, token } = await this.authService.login(email, password);
      JwtUtil.setTokenCookie(res, token);

      res.status(StatusCodes.OK).json({
        status: "success",
        data: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      JwtUtil.clearTokenCookie(res);
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Logout failed",
      });
    }
  }
}
