import { CreateCheckoutSessionDto } from "../dtos/stripe.dto";

export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
}

export interface PaymentGateway {
  createCheckoutSession(
    input: CreateCheckoutSessionDto,
    customerEmail: string,
    orderId: string
  ): Promise<CheckoutSession>;
}
