import { WebhookEvent } from "../value-object/webhook-event.value-object";
import { WebhookMetadata } from "../value-object/webhook-metadata.value-object";

export interface WebhookGateway {
  verifySignature(event: string | Buffer, signature: string): Promise<WebhookEvent>;
  parseMetadata(metadata: Record<string, string>): WebhookMetadata;
  isCheckoutSessionCompleted(event: WebhookEvent): boolean;
  getPaymentIntentId(event: WebhookEvent): string;
} 