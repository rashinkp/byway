import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { UserService } from "../user/user.service";
import { OrderService } from "../order/order.service";
import {
  ICreateCheckoutSessionInput,
  IWebhookInput,
  IStripeCheckoutSessionResponse,
  IStripeWebhookResponse,
} from "./stripe.types";
import { ApiResponse } from "../../types/response";
import {
  checkoutSessionSchema,
  createCheckoutSessionSchema,
  webhookSchema,
} from "./stripe.validators";
import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async createCheckoutSession(
    input: ICreateCheckoutSessionInput
  ): Promise<ApiResponse> {
    const parsedInput = createCheckoutSessionSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createCheckoutSession", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { userId, courses, couponCode } = parsedInput.data;

    // Validate user exists
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for checkout session", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    // Create pending order
    const order = await this.orderService.createOrder(
      userId,
      courses,
      couponCode
    );

    // Validate FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      logger.error("FRONTEND_URL is not defined in environment variables");
      throw new AppError(
        "Server configuration error: FRONTEND_URL is missing",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }

    try {
      // Create line items from course details
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        courses.map((course) => ({
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
            unit_amount: Math.round((course.offer || course.price) * 100),
          },
          quantity: 1,
        }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/cancel`,
        customer_email: user.email,
        metadata: {
          userId,
          orderId: order.id,
          courses: JSON.stringify(courses),
        },
        discounts: couponCode ? [{ coupon: couponCode }] : undefined,
      });

      const response: IStripeCheckoutSessionResponse = {
        id: session.id,
        url: session.url!,
        payment_status: session.payment_status,
        amount_total: session.amount_total!,
      };

      return {
        status: "success",
        data: { session: response },
        message: "Stripe checkout session created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error creating Stripe checkout session", { error, input });
      throw error instanceof AppError
        ? error
        : error instanceof Stripe.errors.StripeInvalidRequestError
        ? new AppError(
            error.message,
            StatusCodes.BAD_REQUEST,
            "STRIPE_INVALID_REQUEST"
          )
        : new AppError(
            "Failed to create Stripe checkout session",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "STRIPE_ERROR"
          );
    }
  }

  async handleWebhook(input: IWebhookInput): Promise<ApiResponse> {
  const { event, signature } = input; // event is now the raw Buffer

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    logger.debug("Webhook secret:", {
      secret: webhookSecret.substring(0, 8) + "...",
    });

    // Verify signature with raw body
    const constructedEvent = this.stripe.webhooks.constructEvent(
      event, // Use raw body (Buffer)
      signature,
      webhookSecret
    );

    // Parse event for further processing
    const parsedEvent = JSON.parse(event.toString());
    logger.debug("Received webhook event", {
      eventType: parsedEvent.type,
      eventId: parsedEvent.id,
    });

    // Validate Checkout Session events
    if (
      [
        "checkout.session.completed",
        "checkout.session.expired",
        "checkout.session.async_payment_succeeded",
        "checkout.session.async_payment_failed",
      ].includes(constructedEvent.type)
    ) {
      const sessionParse = checkoutSessionSchema.safeParse(
        constructedEvent.data.object
      );
      if (!sessionParse.success) {
        logger.warn("Checkout session validation failed", {
          errors: sessionParse.error.errors,
        });
        throw new AppError(
          `Checkout session validation failed: ${sessionParse.error.message}`,
          StatusCodes.BAD_REQUEST,
          "VALIDATION_ERROR"
        );
      }
    }

    // Rest of the switch case remains the same
    switch (constructedEvent.type) {
      case "checkout.session.completed":
        // ... existing code ...
      // ... other cases ...
      default:
        logger.info("Unhandled webhook event", {
          type: constructedEvent.type,
        });
        return {
          status: "success",
          data: null,
          message: "Webhook received but not processed",
          statusCode: StatusCodes.OK,
        };
    }
  } catch (error) {
    logger.error("Error processing Stripe webhook", { error });
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      throw new AppError(
        "Invalid webhook signature",
        StatusCodes.BAD_REQUEST,
        "WEBHOOK_SIGNATURE_ERROR"
      );
    }
    throw error instanceof AppError
      ? error
      : new AppError(
          "Failed to process Stripe webhook",
          StatusCodes.INTERNAL_SERVER_ERROR,
          "STRIPE_ERROR"
        );
  }
}
}
