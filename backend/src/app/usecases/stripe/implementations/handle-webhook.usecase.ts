import { PrismaClient } from "@prisma/client";
import {
  IHandleWebhookUseCase,
  IWebhookInput,
} from "../interfaces/handle-webhook.usecase.interface";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { WebhookGateway } from "../../../providers/webhook-gateway.interface";
import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { Wallet } from "../../../../domain/entities/wallet.entity";

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    private readonly webhookGateway: WebhookGateway,
    private readonly userRepository: IUserRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(input: IWebhookInput): Promise<ApiResponse> {
    try {
      const event = await this.webhookGateway.verifySignature(
        input.event,
        input.signature
      );

      console.log(event, "event received");

      if (this.webhookGateway.isCheckoutSessionCompleted(event)) {
        return await this.handleCheckoutSessionCompleted(event);
      }

      return await this.handleOtherEvent(event.type, event);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async handleCheckoutSessionCompleted(
    event: WebhookEvent
  ): Promise<ApiResponse> {
    console.log("Processing checkout session:", {
      eventId: event.data.object.id,
      metadata: event.data.object.metadata,
    });

    try {
      const metadata = this.webhookGateway.parseMetadata(
        event.data.object.metadata
      );
      const { userId, orderId, courses, isWalletTopUp } = metadata;

      if (!userId) {
        console.error("Invalid metadata format: userId missing");
        throw new HttpError(
          "Invalid webhook metadata format",
          StatusCodes.BAD_REQUEST
        );
      }

      // Validate user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        console.error("User not found:", userId);
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }

      // Handle wallet top-up
      if (isWalletTopUp) {
        return await this.handleWalletTopUp(event, userId);
      }

      // Handle course purchase
      if (!orderId || !courses || !Array.isArray(courses)) {
        console.error("Invalid metadata format for course purchase:", { 
          orderId, 
          courses,
          metadata: event.data.object.metadata 
        });
        throw new HttpError(
          "Invalid webhook metadata format",
          StatusCodes.BAD_REQUEST
        );
      }

      // Check for idempotency
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        console.error("Order not found:", orderId);
        throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
      }
      if (order.paymentStatus === "COMPLETED") {
        console.log("Order already processed:", orderId);
        return this.createSuccessResponse("Order already processed");
      }

      console.log("Updating order status:", {
        orderId,
        paymentIntent: this.webhookGateway.getPaymentIntentId(event),
      });

      // Update order status
      const paymentIntentId = this.webhookGateway.getPaymentIntentId(event);
      if (!paymentIntentId) {
        throw new HttpError(
          "Payment intent ID not found",
          StatusCodes.BAD_REQUEST
        );
      }

      await this.orderRepository.updateOrderStatus(
        orderId,
        "COMPLETED",
        paymentIntentId,
        "STRIPE"
      );

      console.log("Processing enrollments and transactions");
      // Process enrollments and transactions
      await this.processEnrollmentsAndTransactions(userId, courses, order);

      return this.createSuccessResponse("Payment processed successfully", {
        webhook: {
          orderId: event.data.object.id,
          status: "completed",
          transactionId: paymentIntentId,
        },
      });
    } catch (error) {
      console.error("Error in handleCheckoutSessionCompleted:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        metadata: event.data.object.metadata,
        eventType: event.type,
        eventId: event.data.object.id,
      });
      throw error;
    }
  }

  private async handleWalletTopUp(
    event: WebhookEvent,
    userId: string
  ): Promise<ApiResponse> {
    try {
      console.log("Starting wallet top-up processing:", {
        userId,
        eventId: event.data.object.id,
        amount: event.data.object.amount_total,
      });

      if (!event.data.object.amount_total) {
        throw new HttpError("Amount not found in webhook data", StatusCodes.BAD_REQUEST);
      }
      const amount = event.data.object.amount_total / 100; // Convert from cents to dollars
      const paymentIntentId = this.webhookGateway.getPaymentIntentId(event);

      if (!paymentIntentId) {
        throw new HttpError(
          "Payment intent ID not found",
          StatusCodes.BAD_REQUEST
        );
      }

      console.log("Fetching wallet for user:", userId);
      // Get or create wallet
      let wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        console.log("Creating new wallet for user:", userId);
        wallet = Wallet.create(userId);
        wallet = await this.walletRepository.create(wallet);
      }

      console.log("Updating wallet balance:", {
        walletId: wallet.id,
        currentBalance: wallet.balance,
        amountToAdd: amount,
      });

      // Add money to wallet
      wallet.addAmount(amount);
      await this.walletRepository.update(wallet);

      console.log("Creating transaction record:", {
        userId,
        walletId: wallet.id,
        amount,
        paymentIntentId,
      });

      // Create transaction record
      const transaction = new Transaction({
        userId,
        walletId: wallet.id,
        amount,
        type: TransactionType.WALLET_TOPUP,
        status: TransactionStatus.COMPLETED,
        paymentGateway: PaymentGateway.STRIPE,
        transactionId: paymentIntentId,
      });

      const createdTransaction = await this.transactionRepository.create(transaction);
      console.log("Transaction created successfully:", {
        transactionId: createdTransaction.id,
        status: createdTransaction.status,
      });

      return this.createSuccessResponse("Wallet top-up successful", {
        webhook: {
          status: "completed",
          transactionId: paymentIntentId,
          amount,
        },
      });
    } catch (error) {
      console.error("Error in handleWalletTopUp:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        eventId: event.data.object.id,
      });
      throw error;
    }
  }

  private async processEnrollmentsAndTransactions(
    userId: string,
    courses: any[],
    order: any
  ): Promise<void> {
    console.log("Starting enrollment process:", {
      userId,
      courseCount: courses.length,
      orderId: order.id,
      orderAmount: order.amount,
    });

    try {
      // Enroll user in courses using OrderItem IDs
      console.log("Creating enrollments for courses:", courses.map(c => c.id));
      await this.enrollmentRepository.create({
        userId,
        courseIds: courses.map((course) => course.id),
      });
      console.log("Enrollments created successfully");

      // Calculate total amount from courses
      const totalAmount = courses.reduce((sum, course) => {
        const coursePrice = course.offer ?? course.price ?? 0;
        return sum + coursePrice;
      }, 0);
      console.log("Calculated total amount:", totalAmount);

      // Create a single transaction for the total amount
      console.log("Creating transaction record:", {
        orderId: order.id,
        userId: order.userId,
        amount: totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
        paymentGateway: PaymentGateway.STRIPE,
      });

      const transaction = new Transaction({
        orderId: order.id,
        userId: order.userId,
        amount: totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
        paymentGateway: PaymentGateway.STRIPE,
      });

      console.log("Transaction object created, attempting to save...");
      const createdTransaction = await this.transactionRepository.create(transaction);
      console.log("Transaction saved successfully:", {
        transactionId: createdTransaction.id,
        status: createdTransaction.status,
        amount: createdTransaction.amount,
      });
    } catch (error) {
      console.error("Error in processEnrollmentsAndTransactions:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        orderId: order.id,
        courses: courses.map(c => c.id),
      });
      throw error;
    }
  }

  private async handleOtherEvent(
    eventType: string,
    event: WebhookEvent
  ): Promise<ApiResponse> {
    if (eventType === "payment_intent.payment_failed") {
      return await this.handlePaymentFailed(event);
    } else if (eventType === "checkout.session.expired") {
      // Handle session expiration (user abandoned checkout)
      console.log("Checkout session expired:", event.data.object.id);
      return this.createSuccessResponse("Checkout session expired");
    }
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

  private async handlePaymentFailed(event: WebhookEvent): Promise<ApiResponse> {
    console.log("Processing payment failed event:", {
      eventId: event.data.object.id,
      paymentIntent: this.webhookGateway.getPaymentIntentId(event),
    });

    try {
      const paymentIntentId = this.webhookGateway.getPaymentIntentId(event);
      if (!paymentIntentId) {
        throw new HttpError(
          "Payment intent ID not found",
          StatusCodes.BAD_REQUEST
        );
      }

      // Get failure reason
      const failureReason =
        event.data.object.failure_message ||
        event.data.object.last_payment_error?.message ||
        "Payment failed";

      // Get metadata from the webhook gateway
      const metadata = await this.webhookGateway.getCheckoutSessionMetadata(
        paymentIntentId
      );

      // If metadata is missing, return a basic response
      if (!metadata.userId || !metadata.orderId) {
        console.warn("Metadata missing, processing without order update:", {
          userId: metadata.userId,
          orderId: metadata.orderId,
        });
        return this.createSuccessResponse("Payment failure processed", {
          webhook: {
            status: "failed",
            transactionId: paymentIntentId,
            failureReason,
            redirectUrl: "/payment-failed",
          },
        });
      }

      // Find order by orderId
      const order = await this.orderRepository.findById(metadata.orderId);
      if (!order) {
        console.error("Order not found:", metadata.orderId);
        throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
      }

      // Check for idempotency
      if (order.paymentStatus === "FAILED") {
        console.log("Payment failure already processed:", metadata.orderId);
        return this.createSuccessResponse("Payment failure already processed", {
          webhook: {
            status: "failed",
            transactionId: paymentIntentId,
            failureReason,
            redirectUrl: "/payment-failed",
          },
        });
      }

      // Update order status to FAILED
      await this.orderRepository.updateOrderStatus(
        metadata.orderId,
        "FAILED",
        paymentIntentId,
        "STRIPE"
      );

      // Create transaction record for the failed payment
      const transaction = new Transaction({
        orderId: order.id,
        userId: order.userId,
        amount: (event.data.object?.amount ?? 0) / 100 || order.totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.FAILED,
        paymentGateway: PaymentGateway.STRIPE,
        transactionId: paymentIntentId,
      });
      await this.transactionRepository.create(transaction);

      return this.createSuccessResponse("Payment failure processed", {
        webhook: {
          status: "failed",
          transactionId: paymentIntentId,
          failureReason,
          redirectUrl: "/payment-failed",
        },
      });
    } catch (error) {
      console.error("Error in handlePaymentFailed:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}
