import { Response } from "express";
import jwt from "jsonwebtoken";

export class CookieService {
  private static generateToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
  }

  static setAuthCookie(
    res: Response,
    user: { id: string; email: string; role: string }
  ): void {
    const token = this.generateToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });
  }

  static clearAuthCookie(res: Response): void {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}
