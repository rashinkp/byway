export interface ICreateCheckoutSessionInput {
  courseIds: string[];
  userId: string;
  couponCode?: string;
}

export interface IWebhookInput {
  event: {
    id: string;
    type: string;
    data: {
      object: Record<string, any>; // Flexible object
    };
  };
  signature: string;
}

export interface IStripeCheckoutSessionResponse {
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
