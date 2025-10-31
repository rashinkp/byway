// Centralized common messages

export const Messages = {
  // Generic
  INTERNAL_SERVER_ERROR: "Internal server error",
  VALIDATION_FAILED: "Validation failed",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",

  // Stripe / Payments
  STRIPE_SECRET_MISSING: "STRIPE_SECRET_KEY is not defined",
  STRIPE_CHECKOUT_CREATE_FAILED: "Failed to create Stripe checkout session",
  STRIPE_WEBHOOK_FAILED: "Webhook processing failed",
  WEBHOOK_REACHABLE: "Webhook endpoint is reachable",
  FRONTEND_URL_MISSING: "Server configuration error: FRONTEND_URL is missing",
  INVALID_WALLET_TOPUP_AMOUNT: "Invalid amount for wallet top-up",
  NO_COURSES_FOR_CHECKOUT: "No courses provided for checkout",
  INVALID_COURSE_DATA: "Invalid course data provided",
} as const;

export type MessageKey = keyof typeof Messages;


