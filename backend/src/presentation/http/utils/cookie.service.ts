import { Response } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { CookieUtils } from "../../express/middlewares/cookie.utils";

/**
 * CookieService - HTTP layer interface for cookie operations
 * This service delegates to CookieUtils to maintain separation of concerns
 * while ensuring consistent cookie management across the application
 */
export class CookieService {
  /**
   * Sets both access and refresh tokens as cookies. Used for login and token refresh flows.
   */
  static setAuthCookies(
    res: Response,
    user: { id: string; email: string; role: string },
    jwtProvider: JwtProvider
  ): void {
    console.log("[CookieService] Setting auth cookies for user:", user.email);
    CookieUtils.setAuthCookiesFromUser(res, user, jwtProvider);
  }

  /**
   * Clear authentication cookies
   */
  static clearAuthCookies(res: Response): void {
    console.log("[CookieService] Clearing auth cookies");
    CookieUtils.clearAuthCookies(res);
  }
}
