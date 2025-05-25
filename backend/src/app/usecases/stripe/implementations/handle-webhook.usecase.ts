import { IHandleWebhookUseCase, IWebhookInput } from "../interfaces/handle-webhook.usecase.interface";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IStripeRepository } from "../../../repositories/stripe.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import { z } from "zod";

const checkoutSessionSchema = z.object({
  id: z.string(),
  payment_status: z.string(),
  payment_intent: z.string(),
  amount_total: z.number(),
  metadata: z.record(z.string()),
});

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  private stripe: Stripe;

  constructor(
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private transactionRepository: ITransactionRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async execute(input: IWebhookInput): Promise<ApiResponse> {
    const { event, signature } = input;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      // Verify signature with raw body
      const constructedEvent = this.stripe.webhooks.constructEvent(
        event,
        signature,
        webhookSecret
      );

      // Parse event for further processing
      const parsedEvent = JSON.parse(event.toString());

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
          throw new HttpError(
            `Checkout session validation failed: ${sessionParse.error.message}`,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      switch (constructedEvent.type) {
        case "checkout.session.completed": {
          const session = constructedEvent.data.object;
          const metadata = session.metadata || {};
          const { userId, orderId, courses } = metadata;

          if (!userId || !orderId) {
            return {
              success: true,
              data: null,
              message: "Webhook processed but no userId or orderId provided",
              statusCode: StatusCodes.OK,
            };
          }

          // Validate user exists
          const user = await this.userRepository.findById(userId);
          if (!user) {
            throw new HttpError("User not found", StatusCodes.NOT_FOUND);
          }

          // Check for idempotency
          const order = await this.orderRepository.findById(orderId);
          if (order?.paymentStatus === "COMPLETED") {
            return {
              success: true,
              data: null,
              message: "Order already processed",
              statusCode: StatusCodes.OK,
            };
          }

          // Update order status
          await this.orderRepository.updateOrderStatus(
            orderId,
            "COMPLETED",
            session.payment_intent as string,
            "STRIPE"
          );

          // Enroll user in courses and store transaction history
          if (courses) {
            const parsedCourses: {
              id: string;
              price?: number;
              offer?: number;
            }[] = JSON.parse(courses);
            const courseIds = parsedCourses.map((course) => course.id);

            // Enroll user in courses
            await this.enrollmentRepository.create({
              userId,
              courseIds
            });

            // Store transaction history for each course
            for (const course of parsedCourses) {
              const coursePrice = course.offer ?? course.price ?? 0;
              if (coursePrice <= 0) continue;

              await this.transactionRepository.createTransaction({
                orderId,
                userId,
                courseId: course.id,
                amount: coursePrice,
                type: "PAYMENT",
                status: "COMPLETED",
                paymentGateway: "STRIPE",
                transactionId: session.payment_intent as string,
              });
            }
          }

          return {
            success: true,
            data: {
              webhook: {
                orderId: session.id,
                status: "completed",
                transactionId: session.payment_intent,
              },
            },
            message: "Payment processed successfully",
            statusCode: StatusCodes.OK,
          };
        }

        case "charge.succeeded":
        case "payment_intent.succeeded":
        case "payment_intent.created":
        case "charge.updated":
          return {
            success: true,
            data: null,
            message: `${constructedEvent.type} processed successfully`,
            statusCode: StatusCodes.OK,
          };

        default:
          return {
           success: true,
            data: null,
            message: "Webhook received but not processed",
            statusCode: StatusCodes.OK,
          };
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new HttpError("Invalid webhook signature", StatusCodes.BAD_REQUEST);
      }
      throw error instanceof HttpError
        ? error
        : new HttpError(
            "Failed to process Stripe webhook",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
    }
  }
} 