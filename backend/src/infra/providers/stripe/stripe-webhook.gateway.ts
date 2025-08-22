import { WebhookGateway } from "../../../app/providers/webhook-gateway.interface";
import { WebhookEvent } from "../../../domain/value-object/webhook-event.value-object";
import { WebhookMetadata } from "../../../domain/value-object/webhook-metadata.value-object";
import Stripe from "stripe";
import { HttpError } from "../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { envConfig } from "../../../presentation/express/configs/env.config";

export class StripeWebhookGateway implements WebhookGateway {
  private _stripe: Stripe;

  constructor() {
    const stripeKey = envConfig.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }

    this._stripe = new Stripe(stripeKey, {
      apiVersion: "2025-07-30.basil",
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
      const constructedEvent = this._stripe.webhooks.constructEvent(
        event,
        signature,
        webhookSecret
      );

      return WebhookEvent.create(constructedEvent.type, constructedEvent.data as unknown as {
        object: {
          id: string;
          payment_status: string;
          payment_intent: string;
          metadata: Record<string, string>;
          amount_total?: number;
          failure_message?: string;
          last_payment_error?: { message: string };
          amount?: number;
        };
      });
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
    } catch {
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
      const paymentIntent = await this._stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const latestCharge = paymentIntent.latest_charge;

      // Try to find session using the payment intent
      const sessions = await this._stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      // If no session found, try to find it using the charge
      if (!sessions.data.length && latestCharge) {
        const charge = await this._stripe.charges.retrieve(
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
    } catch  {
      return WebhookMetadata.create({
        paymentIntentId,
        status: "failed",
      });
    }
  }
}
