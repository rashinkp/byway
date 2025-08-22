import dotenv from "dotenv";

dotenv.config({ path: '.env.development' });

export const envConfig = {
  // Server configuration
  PORT: process.env.PORT || "5001",
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database connection (PostgreSQL)
  DATABASE_URL: process.env.DATABASE_URL || "",

  // JWT authentication
  JWT_SECRET: process.env.JWT_SECRET || "",
  ACCESS_TOKEN_SIGNATURE: process.env.ACCESS_TOKEN_SIGNATURE || "",
  REFRESH_TOKEN_SIGNATURE: process.env.REFRESH_TOKEN_SIGNATURE || "",

  // Cookie config
  COOKIE_SECRET: process.env.COOKIE_SECRET || "",

  // CORS settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",

  // Email configuration (Gmail)
  EMAIL_USER: process.env.EMAIL_USER || "",
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
  GOOGLE_AUTH_REDIRECTION_URI: process.env.GOOGLE_AUTH_REDIRECTION_URI || "",
  GOOGLE_AUTH_VERIFY_URL: process.env.GOOGLE_AUTH_VERIFY_URL || "",

  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
};
