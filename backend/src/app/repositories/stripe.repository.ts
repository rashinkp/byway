import { StripeCheckout } from "../../domain/entities/stripe-checkout.entity";

export interface IStripeRepository {
  createCheckoutSession(checkout: StripeCheckout): Promise<StripeCheckout>;
  findCheckoutSessionById(id: string): Promise<StripeCheckout | null>;
  findCheckoutSessionBySessionId(sessionId: string): Promise<StripeCheckout | null>;
  updateCheckoutSession(checkout: StripeCheckout): Promise<StripeCheckout>;
} 