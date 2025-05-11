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

export interface ICreateCheckoutSessionInput {
  userId: string;
  courses: ICourseInput[];
  couponCode?: string;
}

export interface IWebhookInput {
  event: Buffer; 
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
