import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { Order } from "../../../../domain/entities/order.entity";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export interface IHandleStripeWebhookUseCase {
  execute(
    event: WebhookEvent
  ): Promise<ServiceResponse<{ order?: Order; transaction?: Transaction }>>;
}
