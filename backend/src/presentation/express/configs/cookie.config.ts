/**
 * Cookie configuration for Express cookie parser
 * This configuration is used by the cookie-parser middleware
 * For auth cookies, use CookieUtils which has its own centralized config
 */
import { envConfig } from "./env.config";

export const cookieConfig = {
  secret: envConfig.COOKIE_SECRET || "your-cookie-secret",
  options: {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: 'none' as const,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
};
