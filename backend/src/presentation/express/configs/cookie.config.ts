export const cookieConfig = {
  secret: process.env.COOKIE_SECRET || "your-cookie-secret",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000, 
  },
};
