import { Response } from "express";
import { IJwtProvider } from "../../../app/providers/jwt.provider.interface";
import { CookieUtils } from "../../express/middlewares/cookie.utils";

export class CookieService {
  static setAuthCookies(
    res: Response,
    user: { id: string; email: string; role: string },
    jwtProvider: IJwtProvider
  ): void {
    CookieUtils.setAuthCookiesFromUser(res, user, jwtProvider);
  }

  static clearAuthCookies(res: Response): void {
    CookieUtils.clearAuthCookies(res);
  }
}
