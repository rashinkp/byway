import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { UserService } from "../user/user.service";
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
import { IStripeRepository } from "./stripe.repository.interface";
import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(
    private userService: UserService
  ) // private stripeRepository: IStripeRepository
  {
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

    const { courseIds, userId, couponCode } = parsedInput.data;

    // Validate user exists
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for checkout session", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    try {
      // TODO: Fetch course details from database to validate and get prices
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        courseIds.map((courseId) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `Course ${courseId}`, // Replace with actual course name
              metadata: { courseId },
            },
            unit_amount: 1000, // Replace with actual price in cents (e.g., $10.00)
          },
          quantity: 1,
        }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        customer_email: user.email,
        metadata: {
          userId,
          courseIds: JSON.stringify(courseIds),
        },
        discounts: couponCode ? [{ coupon: couponCode }] : undefined,
      });

      // await this.stripeRepository.storeCheckoutSession({
      //   sessionId: session.id,
      //   userId,
      //   courseIds,
      //   status: session.payment_status,
      // });

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
        : new AppError(
            "Failed to create Stripe checkout session",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "STRIPE_ERROR"
          );
    }
  }

  async handleWebhook(input: IWebhookInput): Promise<ApiResponse> {
    const parsedInput = webhookSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for webhook", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { event, signature } = parsedInput.data;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      logger.debug("Webhook secret:", {
        secret: webhookSecret.substring(0, 8) + "...",
      });
      logger.debug("Received webhook event", {
        eventType: event.type,
        eventId: event.id,
      });

      // Verify signature
      const constructedEvent = this.stripe.webhooks.constructEvent(
        JSON.stringify(event),
        signature,
        webhookSecret
      );

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

      switch (constructedEvent.type) {
        case "checkout.session.completed":
          const session = constructedEvent.data.object;
          const metadata = session.metadata || {};
          const { userId, courseIds } = metadata;

          if (userId) {
            const user = await this.userService.findUserById(userId);
            if (!user) {
              logger.warn("User not found for webhook", { userId });
              throw new AppError(
                "User not found",
                StatusCodes.NOT_FOUND,
                "NOT_FOUND"
              );
            }

            // Parse courseIds if present
            let parsedCourseIds: string[] = [];
            if (courseIds) {
              try {
                parsedCourseIds = JSON.parse(courseIds);
                logger.debug("Parsed courseIds:", { parsedCourseIds });
              } catch (e) {
                logger.warn("Failed to parse courseIds", {
                  courseIds,
                  error: e,
                });
              }
            }

            // TODO: Create order and grant course access
            const response: IStripeWebhookResponse = {
              orderId: session.id,
              status: "completed",
              transactionId: (session.payment_intent as string) || "unknown",
            };

            return {
              status: "success",
              data: { webhook: response },
              message: "Webhook processed successfully",
              statusCode: StatusCodes.OK,
            };
          } else {
            logger.warn("No userId in metadata", { sessionId: session.id });
            return {
              status: "success",
              data: null,
              message: "Webhook processed but no userId provided",
              statusCode: StatusCodes.OK,
            };
          }

        case "checkout.session.expired":
          logger.info("Checkout session expired", {
            sessionId: constructedEvent.data.object.id,
          });
          return {
            status: "success",
            data: null,
            message: "Checkout session expired",
            statusCode: StatusCodes.OK,
          };

        case "checkout.session.async_payment_succeeded":
          logger.info("Async payment succeeded", {
            sessionId: constructedEvent.data.object.id,
          });
          return {
            status: "success",
            data: null,
            message: "Async payment succeeded",
            statusCode: StatusCodes.OK,
          };

        case "checkout.session.async_payment_failed":
          logger.warn("Async payment failed", {
            sessionId: constructedEvent.data.object.id,
          });
          return {
            status: "success",
            data: null,
            message: "Async payment failed",
            statusCode: StatusCodes.OK,
          };

        case "charge.refunded":
          logger.info("Charge refunded", {
            chargeId: constructedEvent.data.object.id,
          });
          return {
            status: "success",
            data: null,
            message: "Charge refunded",
            statusCode: StatusCodes.OK,
          };

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
      logger.error("Error processing Stripe webhook", { error, input: event });
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
