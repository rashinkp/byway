/**
 * Cookie configuration for Express cookie parser
 * This configuration is used by the cookie-parser middleware
 * For auth cookies, use CookieUtils which has its own centralized config
 */
export const cookieConfig = {
  secret: process.env.COOKIE_SECRET || "your-cookie-secret",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
};
