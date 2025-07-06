import Stripe from "stripe";
import {
  PaymentGateway,
  CheckoutSession,
} from "../../../app/providers/payment-gateway.interface";
import { CreateCheckoutSessionDto } from "../../../domain/dtos/stripe/create-checkout-session.dto";
import { HttpError } from "../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { envConfig } from "../../presentation/express/configs/env.config";

export class StripePaymentGateway implements PaymentGateway {
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

  async createCheckoutSession(
    input: CreateCheckoutSessionDto,
    customerEmail: string,
    orderId: string
  ): Promise<CheckoutSession> {
    const { courses, couponCode, isWalletTopUp, amount } = input;

    // Validate FRONTEND_URL
    const frontendUrl = envConfig.FRONTEND_URL;
    if (!frontendUrl) {
      throw new HttpError(
        "Server configuration error: FRONTEND_URL is missing",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    try {
      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      if (isWalletTopUp) {
        if (!amount || amount <= 0) {
          throw new HttpError(
            "Invalid amount for wallet top-up",
            StatusCodes.BAD_REQUEST
          );
        }
        // Create a single line item for wallet top-up
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Wallet Top-up",
                description: "Adding funds to your wallet",
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ];
      } else {
        // Create line items from course details
        if (!courses || !Array.isArray(courses) || courses.length === 0) {
          throw new HttpError(
            "No courses provided for checkout",
            StatusCodes.BAD_REQUEST
          );
        }

        // Validate each course has required fields
        for (const course of courses) {
          if (!course || !course.id || !course.title) {
            throw new HttpError(
              "Invalid course data provided",
              StatusCodes.BAD_REQUEST
            );
          }
        }

        lineItems = courses.map((course) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description || undefined,
              images: course.thumbnail ? [course.thumbnail] : undefined,
              metadata: {
                courseId: course.id,
                ...(course.duration && { duration: course.duration }),
                ...(course.level && { level: course.level }),
              },
            },
            unit_amount: Math.round(
              (course?.offer || course?.price || 0) * 100
            ),
          },
          quantity: 1,
        }));
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}${
          isWalletTopUp ? "&type=wallet-topup" : ""
        }`,
        cancel_url: `${frontendUrl}/payment-failed?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: customerEmail,
        metadata: {
          userId: input.userId,
          orderId,
          ...(courses && { courses: JSON.stringify(courses) }),
          ...(isWalletTopUp && { isWalletTopUp: "true" }),
        },
        discounts: couponCode ? [{ coupon: couponCode }] : undefined,
      });

      return {
        id: session.id,
        url: session.url!,
        payment_status: session.payment_status,
        amount_total: session.amount_total!,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw new HttpError(error.message, StatusCodes.BAD_REQUEST);
      }
      throw new HttpError(
        "Failed to create Stripe checkout session",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
