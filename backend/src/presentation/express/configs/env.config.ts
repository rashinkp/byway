import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  // Server configuration
  PORT: process.env.PORT || "5001",
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database connection (PostgreSQL)
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:12345678@localhost:5432/byway",

  // JWT authentication
  JWT_SECRET: process.env.JWT_SECRET || "secret",

  // CORS settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Email configuration (Gmail)
  EMAIL_USER: process.env.EMAIL_USER || "mobilify45@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || "./logs/app.log",

  // Rate limiting for OTP resend
  RATE_LIMIT_OTP_RESEND_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_OTP_RESEND_WINDOW_MS || "60000",
    10
  ),
  RATE_LIMIT_OTP_RESEND_MAX: parseInt(
    process.env.RATE_LIMIT_OTP_RESEND_MAX || "1",
    10
  ),

  // Rate limiting for login
  RATE_LIMIT_LOGIN_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_LOGIN_WINDOW_MS || "900000",
    10
  ),
  RATE_LIMIT_LOGIN_MAX: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || "5", 10),

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_AUTH_REDIRECTION_URI:
    process.env.GOOGLE_AUTH_REDIRECTION_URI || "http://localhost:3000",
  GOOGLE_AUTH_VERIFY_URL:
    process.env.GOOGLE_AUTH_VERIFY_URL ||
    "https://www.googleapis.com/oauth2/v3/userinfo",

  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
};
