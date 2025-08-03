import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { CreateCheckoutSessionDto } from "../../../dtos/stripe/create-checkout-session.dto";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export interface IPaymentService {
  handleWalletPayment(
    userId: string,
    orderId: string,
    amount: number
  ): Promise<ServiceResponse<{ transaction: Transaction }>>;
  createStripeCheckoutSession(
    userId: string,
    orderId: string,
    input: CreateCheckoutSessionDto
  ): Promise<
    ServiceResponse<{
      session: {
        id: string;
        url: string;
        payment_status: string;
        amount_total: number;
      };
    }>
  >;
  handleStripeWebhook(
    event: WebhookEvent
  ): Promise<ServiceResponse<{ order?: any; transaction?: Transaction }>>;
}
