import { ICreateCheckoutSessionInput, IWebhookInput } from "./stripe.types";

export interface IStripeRepository {
  storeCheckoutSession(input: {
    sessionId: string;
    userId: string;
    courseIds: string[];
    status: string;
  }): Promise<void>;
  updateOrderStatus(input: {
    sessionId: string;
    userId: string;
    courseIds: string[];
    transactionId: string;
    status: string;
  }): Promise<void>;
}
