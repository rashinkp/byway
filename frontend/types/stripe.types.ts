export interface ICreateStripeCheckoutSessionInput {
  userId: string;
  courseIds: string[];
  couponCode?: string;
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

// Type for backend response
export interface StripeApiResponse<T> {
  status: "success" | "error";
  data: { session: T } | null;
  message: string;
  statusCode: number;
}
