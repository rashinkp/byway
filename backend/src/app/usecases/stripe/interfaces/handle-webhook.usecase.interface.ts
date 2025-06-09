import { Transaction } from "../../../../domain/entities/transaction.entity";
import { Order } from "../../../../domain/entities/order.entity";

export interface IWebhookInput {
  event: Buffer;
  signature: string;
}

export interface WebhookResponse {
  data: {
    order?: Order;
    transaction?: Transaction;
    status?: string;
    message?: string;
  };
  message: string;
}

export interface IHandleWebhookUseCase {
  execute(input: IWebhookInput): Promise<WebhookResponse>;
} 