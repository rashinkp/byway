import Stripe from "stripe";
import { PaymentGateway, CheckoutSession } from "../../app/providers/payment-gateway.interface";
import { CreateCheckoutSessionDto } from "../../domain/dtos/stripe/create-checkout-session.dto";
import { HttpError } from "../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";

export class StripePaymentGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionDto,
    customerEmail: string,
    orderId: string
  ): Promise<CheckoutSession> {
    const { courses, couponCode } = input;

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

    // Validate FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new HttpError(
        "Server configuration error: FRONTEND_URL is missing",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    try {
      // Create line items from course details
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = courses.map(
        (course) => ({
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
            unit_amount: Math.round((course?.offer || course?.price || 0) * 100),
          },
          quantity: 1,
        })
      );

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/payment-failed?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: customerEmail,
        metadata: {
          userId: input.userId,
          orderId,
          courses: JSON.stringify(courses),
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