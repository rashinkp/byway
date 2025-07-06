import { WebhookGateway } from "../../../app/providers/webhook-gateway.interface";
import { WebhookEvent } from "../../../domain/value-object/webhook-event.value-object";
import { WebhookMetadata } from "../../../domain/value-object/webhook-metadata.value-object";
import Stripe from "stripe";
import { HttpError } from "../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { envConfig } from "../../presentation/express/configs/env.config";

export class StripeWebhookGateway implements WebhookGateway {
  private stripe: Stripe;

  constructor() {
    const stripeKey = envConfig.STRIPE_SECRET_KEY;
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
    const webhookSecret = envConfig.STRIPE_WEBHOOK_SECRET;
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
        throw new HttpError(
          "Invalid webhook signature",
          StatusCodes.BAD_REQUEST
        );
      }
      throw error;
    }
  }

  parseMetadata(metadata: Record<string, string>): WebhookMetadata {
    try {
      // Ensure all metadata values are strings
      const stringifiedMetadata: Record<string, string> = {};
      for (const [key, value] of Object.entries(metadata)) {
        if (typeof value === "object") {
          stringifiedMetadata[key] = JSON.stringify(value);
        } else {
          stringifiedMetadata[key] = String(value);
        }
      }
      return WebhookMetadata.create(stringifiedMetadata);
    } catch (error) {
      console.error("Error parsing webhook metadata:", error);
      throw new HttpError(
        "Failed to parse webhook metadata",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  isCheckoutSessionCompleted(event: WebhookEvent): boolean {
    return event.type === "checkout.session.completed";
  }

  getPaymentIntentId(event: WebhookEvent): string {
    if (
      event.type === "payment_intent.payment_failed" ||
      event.type === "payment_intent.created"
    ) {
      return event.data.object.id; // PaymentIntent ID for payment_intent events
    } else if (event.type === "charge.failed") {
      return event.data.object.payment_intent; // PaymentIntent ID in charge events
    }
    return event.data.object.payment_intent || ""; // For checkout.session.completed
  }

  isPaymentFailed(event: WebhookEvent): boolean {
    return (
      event.type === "payment_intent.payment_failed" ||
      event.type === "charge.failed"
    );
  }

  isCheckoutSessionExpired(event: WebhookEvent): boolean {
    return event.type === "checkout.session.expired";
  }

  async getCheckoutSessionMetadata(
    paymentIntentId: string
  ): Promise<WebhookMetadata> {
    try {
      // First try to get the payment intent to get the latest charge
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const latestCharge = paymentIntent.latest_charge;

      // Try to find session using the payment intent
      const sessions = await this.stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      // If no session found, try to find it using the charge
      if (!sessions.data.length && latestCharge) {
        const charge = await this.stripe.charges.retrieve(
          latestCharge as string
        );
        if (charge.metadata?.orderId) {
          return this.parseMetadata(charge.metadata);
        }
      }

      if (!sessions.data.length || !sessions.data[0].metadata) {
        console.warn(
          "No checkout session found for payment intent:",
          paymentIntentId
        );
        return WebhookMetadata.create({
          paymentIntentId,
          status: "failed",
        });
      }

      return this.parseMetadata(
        sessions.data[0].metadata as Record<string, string>
      );
    } catch (error) {
      console.error("Error fetching checkout session metadata:", error);
      return WebhookMetadata.create({
        paymentIntentId,
        status: "failed",
      });
    }
  }
}
