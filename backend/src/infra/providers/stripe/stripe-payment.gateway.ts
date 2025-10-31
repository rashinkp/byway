import Stripe from "stripe";
import {
  PaymentGateway,
  CheckoutSession,
} from "../../../app/providers/payment-gateway.interface";
import { CreateCheckoutSessionDto } from "../../../app/dtos/payment.dto";
import { HttpError } from "../../../presentation/http/errors/http-error";
import { HttpStatus } from "../../../common/http-status";
import { Messages } from "../../../common/messages";
import { envConfig } from "../../../presentation/express/configs/env.config";

export class StripePaymentGateway implements PaymentGateway {
  private _stripe: Stripe;

  constructor() {
    const stripeKey = envConfig.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      throw new Error(Messages.STRIPE_SECRET_MISSING);
    }

   this._stripe = new Stripe(stripeKey, {
    apiVersion: "2025-07-30.basil",
  });
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionDto,
    customerEmail: string,
    orderId: string
  ): Promise<CheckoutSession> {
    const { courses, couponCode, isWalletTopUp, amount } = input;

    // Validate FRONTEND_URL
    const frontendUrl = (envConfig.FRONTEND_URL || "").split(",")[0].trim();
    if (!frontendUrl) {
      throw new HttpError(
        Messages.FRONTEND_URL_MISSING,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      if (isWalletTopUp) {
        if (!amount || amount <= 0) {
          throw new HttpError(
            Messages.INVALID_WALLET_TOPUP_AMOUNT,
            HttpStatus.BAD_REQUEST
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
            Messages.NO_COURSES_FOR_CHECKOUT,
            HttpStatus.BAD_REQUEST
          );
        }

        // Validate each course has required fields
        for (const course of courses) {
          if (!course || !course.id || !course.title) {
            throw new HttpError(
              Messages.INVALID_COURSE_DATA,
              HttpStatus.BAD_REQUEST
            );
          }
        }

        lineItems = courses.map((course) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description || undefined,
              // Stripe requires absolute URLs for images; only pass if thumbnail looks like a URL
              images:
                course.thumbnail && (course.thumbnail.startsWith("http://") || course.thumbnail.startsWith("https://"))
                  ? [course.thumbnail]
                  : undefined,
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

      const session = await this._stripe.checkout.sessions.create({
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
          ...(courses && {
            courseIds: JSON.stringify(courses.map((course) => course.id)),
          }),
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
        throw new HttpError(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpError(
        Messages.STRIPE_CHECKOUT_CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
