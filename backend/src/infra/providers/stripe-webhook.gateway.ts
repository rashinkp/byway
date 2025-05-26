import { WebhookGateway } from "../../domain/interfaces/webhook-gateway.interface";
import { WebhookEvent } from "../../domain/value-object/webhook-event.value-object";
import { WebhookMetadata } from "../../domain/value-object/webhook-metadata.value-object";
import Stripe from "stripe";
import { HttpError } from "../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";

export class StripeWebhookGateway implements WebhookGateway {
  private stripe: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async verifySignature(
    event: string | Buffer,
    signature: string
  ): Promise<WebhookEvent> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new HttpError(
        "Webhook secret not configured",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const constructedEvent = this.stripe.webhooks.constructEvent(
        event,
        signature,
        webhookSecret
      );

      return WebhookEvent.create(constructedEvent.type, constructedEvent.data);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new HttpError("Invalid webhook signature", StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  parseMetadata(metadata: Record<string, string>): WebhookMetadata {
    return WebhookMetadata.create(metadata);
  }

  isCheckoutSessionCompleted(event: WebhookEvent): boolean {
    return event.type === "checkout.session.completed";
  }

  getPaymentIntentId(event: WebhookEvent): string {
    return event.data.object.payment_intent;
  }
} 