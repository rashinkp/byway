// API route constants

export const ApiBase = {
  V1: "/api/v1",
} as const;

export const ApiRoutes = {
  AUTH: "/auth",
  USER: "/user",
  INSTRUCTOR: "/instructor",
  CATEGORY: "/category",
  COURSES: "/courses",
  LESSONS: "/lessons",
  CONTENT: "/content",
  CART: "/cart",
  STRIPE: "/stripe",
  TRANSACTIONS: "/transactions",
  ORDERS: "/orders",
  FILES: "/files",
  PROGRESS: "/progress",
  WALLET: "/wallet",
  REVENUE: "/revenue",
  CERTIFICATES: "/certificates",
  SEARCH: "/search",
  DASHBOARD: "/dashboard",
  REVIEWS: "/reviews",
} as const;

export const StripeRoutes = {
  CREATE_CHECKOUT_SESSION: "/create-checkout-session",
  RELEASE_CHECKOUT_LOCK: "/release-checkout-lock",
  WEBHOOK: "/stripe/webhook",
  WEBHOOK_TEST: "/stripe/webhook/test",
} as const;

export type RoutePath = typeof ApiRoutes[keyof typeof ApiRoutes];


