import { IHandleStripeWebhookUseCase } from "../interfaces/handle-stripe-webhook.usecase.interface";
import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { Order } from "../../../../domain/entities/order.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway as PaymentGatewayEnum } from "../../../../domain/enum/payment-gateway.enum";
import { OrderStatus } from "../../../../domain/enum/order-status.enum";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IDistributeRevenueUseCase } from "../../revenue-distribution/interfaces/distribute-revenue.usecase.interface";
import { StripeWebhookGateway } from "../../../../infra/providers/stripe/stripe-webhook.gateway";
import { getSocketIOInstance } from "../../../../presentation/socketio";
import Stripe from "stripe";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _orderRepository: IOrderRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _cartRepository: ICartRepository,
    private readonly _distributeRevenueUseCase: IDistributeRevenueUseCase,
    private readonly _webhookGateway: StripeWebhookGateway
  ) {}

  async execute(
    event: WebhookEvent
  ): Promise<ServiceResponse<{ order?: Order; transaction?: Transaction }>> {
    try {
      // Handle successful payments
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        const isWalletTopUp = session.metadata?.isWalletTopUp === "true";

        if (!orderId) {
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        let transaction = await this._transactionRepository.findByOrderId(
          orderId
        );

        if (!transaction && isWalletTopUp) {
          transaction = await this._transactionRepository.findById(orderId);
        }

        if (!transaction) {
          // Create transaction if it doesn't exist (this can happen if the initial transaction creation failed)
          console.log("Creating missing transaction for order:", orderId);
          try {
            transaction = await this._transactionRepository.create(
              new Transaction({
                orderId,
                userId: session.metadata?.userId || "",
                amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
                type: TransactionType.PURCHASE,
                status: TransactionStatus.COMPLETED,
                paymentGateway: PaymentGatewayEnum.STRIPE,
                transactionId: session.payment_intent as string,
                paymentMethod: "STRIPE",
                metadata: {
                  stripeSessionId: session.id,
                  isWalletTopUp: isWalletTopUp,
                  ...session.metadata,
                },
              })
            );
          } catch (error) {
            // If transaction creation fails due to duplicate transactionId, try to find existing transaction
            if (
              error instanceof Error &&
              error.message.includes("already exists")
            ) {
              console.log(
                "Transaction already exists, trying to find by transactionId"
              );
              // Try to find by transactionId instead
              transaction =
                await this._transactionRepository.findByTransactionId(
                  session.payment_intent as string
                );

              if (!transaction) {
                throw new HttpError(
                  "Failed to create or find transaction",
                  StatusCodes.INTERNAL_SERVER_ERROR
                );
              }
            } else {
              throw error;
            }
          }
        } else {
          // Update existing transaction status
          await this._transactionRepository.updateStatus(
            transaction.id,
            TransactionStatus.COMPLETED
          );
        }

        if (isWalletTopUp) {
          const wallet = await this._walletRepository.findByUserId(
            transaction.userId
          );
          if (!wallet) {
            throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
          }
          wallet.addAmount(transaction.amount);
          await this._walletRepository.update(wallet);
          return {
            data: { transaction },
            message: "Wallet top-up completed successfully",
          };
        } else {
          try {
            // Update order status
            const order = await this._orderRepository.findById(orderId);
            if (!order) {
              throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
            }

            await this._orderRepository.updateOrderStatus(
              orderId,
              OrderStatus.COMPLETED,
              session.payment_intent as string,
              PaymentGatewayEnum.STRIPE
            );

            const orderItems = await this._orderRepository.findOrderItems(
              orderId
            );

            if (!orderItems || orderItems.length === 0) {
              throw new HttpError(
                "No order items found",
                StatusCodes.NOT_FOUND
              );
            }

            for (const item of orderItems) {
              try {
                // Check if user is already enrolled in this course
                const existingEnrollment =
                  await this._enrollmentRepository.findByUserAndCourse(
                    order.userId,
                    item.courseId
                  );

                if (existingEnrollment) {
                  continue; // Skip creating duplicate enrollment
                }

                // Create new enrollment
                await this._enrollmentRepository.create({
                  userId: order.userId,
                  courseIds: [item.courseId],
                  orderItemId: item.id,
                });
              } catch (error) {
                throw error;
              }
            }

            try {
              await this._distributeRevenueUseCase.execute(orderId);
            } catch (error) {
              throw error;
            }

            for (const item of orderItems) {
              await this._cartRepository.deleteByUserAndCourse(
                order.userId,
                item.courseId
              );
            }

            // Send real-time notifications via Socket.IO
            const orderItemsWithPrices = await Promise.all(
              orderItems.map(async (item) => {
                const course = await this._orderRepository.findCourseById(
                  item.courseId
                );
                return {
                  courseId: item.courseId,
                  coursePrice: course?.price?.getValue()?.toNumber() || 0,
                };
              })
            );
            await this._sendPurchaseNotifications(order, orderItemsWithPrices);

            return {
              data: { order, transaction },
              message: "Payment completed successfully",
            };
          } catch (error) {
            await this._transactionRepository.updateStatus(
              transaction.id,
              TransactionStatus.FAILED
            );
            throw new HttpError(
              error instanceof Error
                ? error.message
                : "Error processing successful payment",
              StatusCodes.INTERNAL_SERVER_ERROR
            );
          }
        }
      }

      // Handle payment failures
      if (
        event.type === "payment_intent.payment_failed" ||
        event.type === "charge.failed"
      ) {
        const paymentIntentId =
          event.data.object.payment_intent || event.data.object.id;

        const metadata = await this._webhookGateway.getCheckoutSessionMetadata(
          paymentIntentId
        );

        const orderId = metadata.orderId;

        if (!orderId) {
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        const transaction = await this._transactionRepository.findByOrderId(
          orderId
        );

        if (transaction) {
          await this._transactionRepository.updateStatus(
            transaction.id,
            TransactionStatus.FAILED
          );
        }

        const order = await this._orderRepository.findById(orderId);
        if (!order) {
          throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
        }

        await this._orderRepository.updateOrderStatus(
          orderId,
          OrderStatus.FAILED,
          paymentIntentId,
          PaymentGatewayEnum.STRIPE
        );

        return {
          data: {
            order: order,
            transaction: transaction || undefined,
          },
          message: "Payment failure handled",
        };
      }

      return {
        data: {},
        message: "Webhook event processed",
      };
    } catch (error) {
      throw new HttpError(
        error instanceof Error
          ? error.message
          : "Error processing webhook event",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async _sendPurchaseNotifications(
    order: Order,
    orderItems: { courseId: string; coursePrice: number }[]
  ): Promise<void> {
    const io = getSocketIOInstance();
    if (io) {
      io.to(order.userId).emit("purchase_success", {
        message: "Purchase completed successfully!",
        courses: orderItems.map((item) => item.courseId),
        totalAmount: orderItems.reduce((sum, item) => sum + item.coursePrice, 0),
      });
    }
  }
}
