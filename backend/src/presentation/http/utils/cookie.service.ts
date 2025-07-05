import { Response } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";

export class CookieService {
  /**
   * Sets both access and refresh tokens as cookies. Used for login and token refresh flows.
   */
  static setAuthCookies(
    res: Response,
    user: { id: string; email: string; role: string },
    jwtProvider: JwtProvider
  ): void {
    const accessToken = jwtProvider.signAccessToken(user);
    const refreshToken = jwtProvider.signRefreshToken(user);

    console.log("[CookieService] Setting access_token cookie");
    res.cookie("access_token", accessToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 60 * 1000, // 1 minute
    });
    console.log("[CookieService] Setting refresh_token cookie");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }

  static clearAuthCookies(res: Response): void {
    console.log("[CookieService] Clearing access_token cookie");
    res.clearCookie("access_token", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("[CookieService] Clearing refresh_token cookie");
    res.clearCookie("refresh_token", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
}
