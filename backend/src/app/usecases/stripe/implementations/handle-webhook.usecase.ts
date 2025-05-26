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
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { WebhookGateway } from "../../../../domain/interfaces/webhook-gateway.interface";
import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    private readonly webhookGateway: WebhookGateway,
    private readonly userRepository: IUserRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(input: IWebhookInput): Promise<ApiResponse> {
    try {
      const event = await this.webhookGateway.verifySignature(
        input.event,
        input.signature
      );

      if (this.webhookGateway.isCheckoutSessionCompleted(event)) {
        return await this.handleCheckoutSessionCompleted(event);
      }

      return this.handleOtherEvent(event.type);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async handleCheckoutSessionCompleted(
    event: WebhookEvent
  ): Promise<ApiResponse> {
    console.log('Processing checkout session:', {
      eventId: event.data.object.id,
      metadata: event.data.object.metadata
    });

    try {
      const metadata = this.webhookGateway.parseMetadata(event.data.object.metadata);
      const { userId, orderId, courses } = metadata;

      console.log('Parsed metadata:', { userId, orderId, coursesCount: courses.length });

      if (!userId || !orderId || !courses || !Array.isArray(courses)) {
        console.error('Invalid metadata format:', { userId, orderId, courses });
        throw new HttpError(
          "Invalid webhook metadata format",
          StatusCodes.BAD_REQUEST
        );
      }

      // Validate user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        console.error('User not found:', userId);
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }

      // Check for idempotency
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        console.error('Order not found:', orderId);
        throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
      }
      if (order.paymentStatus === "COMPLETED") {
        console.log('Order already processed:', orderId);
        return this.createSuccessResponse("Order already processed");
      }

      console.log('Updating order status:', {
        orderId,
        paymentIntent: this.webhookGateway.getPaymentIntentId(event)
      });

      // Update order status
      await this.orderRepository.updateOrderStatus(
        orderId,
        "COMPLETED",
        this.webhookGateway.getPaymentIntentId(event),
        "STRIPE"
      );

      console.log('Processing enrollments and transactions');
      // Process enrollments and transactions
      await this.processEnrollmentsAndTransactions(userId, courses, order);

      return this.createSuccessResponse("Payment processed successfully", {
        webhook: {
          orderId: event.data.object.id,
          status: "completed",
          transactionId: this.webhookGateway.getPaymentIntentId(event),
        },
      });
    } catch (error) {
      console.error('Error in handleCheckoutSessionCompleted:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        metadata: event.data.object.metadata
      });
      throw error;
    }
  }

  private async processEnrollmentsAndTransactions(
    userId: string,
    courses: any[],
    order: any
  ): Promise<void> {
    console.log('Starting enrollment process:', {
      userId,
      courseCount: courses.length,
      orderId: order.id
    });

    try {
      // Enroll user in courses
      await this.enrollmentRepository.create({
        userId,
        courseIds: courses.map((course) => course.id),
      });
      console.log('Enrollment completed successfully');

      // Create transaction records
      console.log('Creating transaction records');
      await Promise.all(
        courses.map(async (course) => {
          const coursePrice = course.offer ?? course.price ?? 0;
          if (coursePrice <= 0) {
            console.log('Skipping transaction for free course:', course.id);
            return;
          }

          console.log('Creating transaction for course:', {
            courseId: course.id,
            price: coursePrice
          });

          const transaction = new Transaction({
            orderId: order.id,
            userId: order.userId,
            courseId: course.id,
            amount: coursePrice,
            type: TransactionType.PURCHASE,
            status: TransactionStatus.COMPLETED,
            paymentGateway: PaymentGateway.STRIPE,
            transactionId: order.paymentId,
          });

          await this.transactionRepository.create(transaction);
          console.log('Transaction created successfully:', course.id);
        })
      );
      console.log('All transactions processed successfully');
    } catch (error) {
      console.error('Error in processEnrollmentsAndTransactions:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  private handleOtherEvent(eventType: string): ApiResponse {
    return this.createSuccessResponse(`${eventType} processed successfully`);
  }

  private createSuccessResponse(
    message: string,
    data: any = null
  ): ApiResponse {
    return {
      success: true,
      data,
      message,
      statusCode: StatusCodes.OK,
    };
  }

  private handleError(error: unknown): never {
    console.error("Webhook error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error instanceof HttpError
      ? error
      : new HttpError(
          "Failed to process webhook",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
  }
}
