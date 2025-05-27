import { WebhookEvent } from "../../domain/value-object/webhook-event.value-object";
import { WebhookMetadata } from "../../domain/value-object/webhook-metadata.value-object";

export interface WebhookGateway {
  verifySignature(event: Buffer, signature: string): Promise<WebhookEvent>;
  parseMetadata(metadata: Record<string, string>): WebhookMetadata;
  isCheckoutSessionCompleted(event: WebhookEvent): boolean;
  getPaymentIntentId(event: WebhookEvent): string | undefined;
  getCheckoutSessionMetadata(paymentIntentId: string): Promise<WebhookMetadata>;
}
