import Stripe from "stripe";

export interface IStripeWebhookService {
  verifyWebhookSignature(
    event: string | Buffer,
    signature: string
  ): Promise<Stripe.Event>;
} 