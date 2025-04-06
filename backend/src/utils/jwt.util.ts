import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Response } from "express";

const SECRET_KEY: Secret = process.env.JWT_SECRET || "your-secret-key";

export class JwtUtil {
  // Generate a plain token (framework-agnostic)
  static generateToken(
    payload: { id: string; email: string; role: string },
    options: SignOptions = { expiresIn: "1d" }
  ): string {
    return jwt.sign(payload, SECRET_KEY, options);
  }

  // Framework-specific method to set cookie
  static setTokenCookie(
    res: Response,
    token: string,
    options: SignOptions = { expiresIn: "1d" }
  ) {
    const maxAge = options.expiresIn === "1d" ? 24 * 60 * 60 * 1000 : undefined; // Match expiresIn
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, SECRET_KEY) as {
        id: string;
        email: string;
        role: string;
      };
    } catch (error) {
      throw error instanceof jwt.JsonWebTokenError
        ? new Error("Invalid or expired token")
        : new Error("Token verification failed");
    }
  }

  static clearTokenCookie(res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }
}
