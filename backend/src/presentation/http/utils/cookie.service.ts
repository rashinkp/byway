import { Response } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { CookieUtils } from "../../express/middlewares/cookie.utils";

export class CookieService {
  static setAuthCookies(
    res: Response,
    user: { id: string; email: string; role: string },
    jwtProvider: JwtProvider
  ): void {
    CookieUtils.setAuthCookiesFromUser(res, user, jwtProvider);
  }

  static clearAuthCookies(res: Response): void {
    CookieUtils.clearAuthCookies(res);
  }
}
