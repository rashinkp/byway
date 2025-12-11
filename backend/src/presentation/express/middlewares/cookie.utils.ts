import { Response } from "express";
import { envConfig } from "../configs/env.config";

/**
 * Centralized cookie configuration
 * - httpOnly: always true so JS can't read tokens
 * - sameSite: 'none' when prod (cross-site), 'lax' locally
 * - secure: required when sameSite is none
 */
const isProd = envConfig.NODE_ENV === "production";
const sameSite: "none" | "lax" = isProd ? "none" : "lax";
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: isProd,
  sameSite,
  path: "/",
};

/**
 * Utility functions for managing authentication cookies
 * This is the single source of truth for all cookie operations
 */
export class CookieUtils {
  /**
   * Clear authentication cookies (access_token and refresh_token)
   */
  static clearAuthCookies(res: Response): void {
    res.cookie("access_token", "", {
      ...COOKIE_CONFIG,
      maxAge: 0,
    });
    res.cookie("refresh_token", "", {
      ...COOKIE_CONFIG,
      maxAge: 0,
    });
  }

  /**
   * Set access token cookie
   */
  static setAccessTokenCookie(res: Response, token: string, maxAge: number = 2 * 60 * 60 * 1000): void {
    // Cookie setting is a low-level operation, no need for logging
    res.cookie("access_token", token, {
      ...COOKIE_CONFIG,
      maxAge,
    });
  }

  /**
   * Set refresh token cookie
   */
  static setRefreshTokenCookie(res: Response, token: string, maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    // Cookie setting is a low-level operation, no need for logging
    res.cookie("refresh_token", token, {
      ...COOKIE_CONFIG,
      maxAge,
    });
  }

    /**
   * Set both access and refresh token cookies
   */
  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    // Cookie setting is a low-level operation, no need for logging 
    this.setAccessTokenCookie(res, accessToken, 2 * 60 * 60 * 1000);
    this.setRefreshTokenCookie(res, refreshToken, 7 * 24 * 60 * 60 * 1000);
  }

  /**
   * Set auth cookies from user data and JWT provider
   * This method is used by the HTTP layer through CookieService
   */
  static setAuthCookiesFromUser(
    res: Response,
    user: { id: string; email: string; role: string },
    jwtProvider: { signAccessToken: (user: { id: string; email: string; role: string }) => string; signRefreshToken: (user: { id: string; email: string; role: string }) => string }
  ): void {
    const accessToken = jwtProvider.signAccessToken(user);
    const refreshToken = jwtProvider.signRefreshToken(user);
    this.setAuthCookies(res, accessToken, refreshToken);
  }
} 