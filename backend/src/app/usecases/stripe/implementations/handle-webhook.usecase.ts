import {
  IHandleWebhookUseCase,
  IWebhookInput,
} from "../interfaces/handle-webhook.usecase.interface";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import { z } from "zod";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";

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
      console.log("Received webhook event:", {
        type: event.toString().slice(0, 100), // Log first 100 chars of event
        signature: signature.slice(0, 10) + "...", // Log part of signature
      });

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET");
        throw new HttpError(
          "Webhook secret not configured",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      // Verify signature with raw body
      const constructedEvent = this.stripe.webhooks.constructEvent(
        event,
        signature,
        webhookSecret
      );

      console.log("Constructed event type:", constructedEvent.type);

      // Handle different event types
      switch (constructedEvent.type) {
        case "checkout.session.completed": {
          const session = constructedEvent.data.object;
          console.log("Processing checkout.session.completed:", {
            sessionId: session.id,
            metadata: session.metadata,
          });

          const metadata = session.metadata || {};
          const { userId, orderId, courses } = metadata;

          if (!userId || !orderId) {
            console.log("Missing metadata:", { userId, orderId });
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
            console.error("User not found:", userId);
            throw new HttpError("User not found", StatusCodes.NOT_FOUND);
          }

          // Check for idempotency
          const order = await this.orderRepository.findById(orderId);
          if (!order) {
            throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
          }
          if (order.paymentStatus === "COMPLETED") {
            console.log("Order already processed:", orderId);
            return {
              success: true,
              data: null,
              message: "Order already processed",
              statusCode: StatusCodes.OK,
            };
          }

          console.log("Updating order status:", {
            orderId,
            paymentIntent: session.payment_intent,
          });

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

            console.log("Enrolling user in courses:", {
              userId,
              courseIds,
            });

            // Enroll user in courses
            await this.enrollmentRepository.create({
              userId,
              courseIds,
            });

            // Store transaction history for each course
            for (const course of parsedCourses) {
              const coursePrice = course.offer ?? course.price ?? 0;
              if (coursePrice <= 0) continue;

              const transaction = new Transaction({
                orderId: order.id,
                userId: order.userId,
                courseId: course.id,
                amount: coursePrice,
                type: TransactionType.PURCHASE,
                status: TransactionStatus.COMPLETED,
                paymentGateway: PaymentGateway.STRIPE,
                transactionId: session.payment_intent as string,
              });

              await this.transactionRepository.create(transaction);
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
          console.log(`Processing ${constructedEvent.type} event`);
          return {
            success: true,
            data: null,
            message: `${constructedEvent.type} processed successfully`,
            statusCode: StatusCodes.OK,
          };

        default:
          console.log("Unhandled event type:", constructedEvent.type);
          return {
            success: true,
            data: null,
            message: "Webhook received but not processed",
            statusCode: StatusCodes.OK,
          };
      }
    } catch (error: unknown) {
      console.error("Webhook error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        console.error("Stripe signature verification failed:", {
          signature: signature.slice(0, 10) + "...",
          eventType: event.toString().slice(0, 100),
        });
        throw new HttpError(
          "Invalid webhook signature",
          StatusCodes.BAD_REQUEST
        );
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
