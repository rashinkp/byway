export interface ICourseInput {
  id: string;
  title: string;
  description?: string;
  price: number;
  offer?: number;
  thumbnail?: string;
  duration?: string;
  level?: string;
}

export interface ICreateStripeCheckoutSessionInput {
  courses: ICourseInput[];
  userId: string;
  couponCode?: string;
  orderId?: string;
}

export interface IStripeCheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
}

export interface IStripeWebhookResponse {
  orderId: string;
  status: string;
  transactionId: string;
}

export interface StripeApiResponse<T> {
  status: "success" | "error";
  data: { session: T } | null;
  message: string;
  statusCode: number;
}
