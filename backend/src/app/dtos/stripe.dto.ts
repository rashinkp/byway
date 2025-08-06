export interface CourseDto {
  id: string;
  title: string;
  description?: string | null;
  price?: number;
  offer?: number;
  thumbnail?: string | null;
  duration?: string;
  level?: string;
}

export interface CreateCheckoutSessionDto {
  userId: string;
  amount?: number;
  currency?: string;
  isWalletTopUp?: boolean;
  courses?: CourseDto[]; // Optional array, but if present, at least one course should be validated in application logic
  couponCode?: string;
  orderId?: string;
  paymentMethod?: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
}
