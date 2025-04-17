import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class JwtUtil {
  static generateToken(payload: JwtPayload, secret: string): string {
    if (!secret) {
      throw new AppError(
        "JWT_SECRET not provided",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
    return sign(payload, secret, { expiresIn: "1d" });
  }

  static verifyToken(token: string, secret: string): JwtPayload {
    if (!secret) {
      throw new AppError(
        "JWT_SECRET not provided",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
    try {
      return verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new AppError(
        "Invalid or expired token",
        StatusCodes.UNAUTHORIZED,
        "INVALID_TOKEN"
      );
    }
  }

  static setTokenCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  static clearTokenCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    });
  }
}
