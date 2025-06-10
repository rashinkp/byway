import { IPaymentService } from "../interfaces/payment.service.interface";
import { CreateCheckoutSessionDto } from "../../../../domain/dtos/stripe/create-checkout-session.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway as PaymentGatewayEnum } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { PaymentGateway } from "../../../providers/payment-gateway.interface";
import { StripeWebhookGateway } from "../../../../infra/providers/stripe-webhook.gateway";
import { IUserRepository } from "../../../repositories/user.repository";
import Stripe from "stripe";
import { OrderStatus } from "../../../../domain/enum/order-status.enum";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class PaymentService implements IPaymentService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly webhookGateway: StripeWebhookGateway,
    private readonly userRepository: IUserRepository
  ) {}

  async handleWalletPayment(userId: string, orderId: string, amount: number): Promise<ServiceResponse<{ transaction: Transaction }>> {
    console.log('Starting wallet payment process for order:', orderId);
    
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
    }
    if (wallet.balance.amount < amount) {
      throw new HttpError("Insufficient wallet balance", StatusCodes.BAD_REQUEST);
    }

    console.log('Wallet found with balance:', wallet.balance.amount);

    // Deduct from wallet
    wallet.reduceAmount(amount);
    await this.walletRepository.update(wallet);
    console.log('Amount deducted from wallet:', amount);

    // Create transaction
    const transaction = new Transaction({
      orderId,
      userId,
      amount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGatewayEnum.WALLET,
    });
    await this.transactionRepository.create(transaction);
    console.log('Transaction created:', transaction.id);

    // Update order status
    await this.orderRepository.updateOrderStatus(
      orderId,
      "COMPLETED",
      transaction.id,
      "WALLET"
    );
    console.log('Order status updated to COMPLETED');

    // Create enrollments for each course in the order
    console.log('Fetching order items for enrollment creation');
    const orderItems = await this.orderRepository.findOrderItems(orderId);
    console.log('Found order items:', orderItems);

    if (!orderItems || orderItems.length === 0) {
      console.error('No order items found for order:', orderId);
      throw new HttpError("No order items found", StatusCodes.NOT_FOUND);
    }

    console.log('Creating enrollments for each course');
    for (const item of orderItems) {
      console.log('Creating enrollment for course:', item.courseId);
      try {
        await this.enrollmentRepository.create({
          userId,
          courseIds: [item.courseId],
          orderItemId: item.id
        });
        console.log('Enrollment created successfully for course:', item.courseId);
      } catch (error) {
        console.error('Error creating enrollment for course:', item.courseId, error);
        throw new HttpError(
          `Failed to create enrollment for course ${item.courseId}`,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }

    console.log('All enrollments created successfully');

    return {
      data: {
        transaction,
      },
      message: "Payment processed successfully using wallet",
    };
  }

  async createStripeCheckoutSession(
    userId: string,
    orderId: string,
    input: CreateCheckoutSessionDto
  ): Promise<ServiceResponse<{ session: { id: string; url: string; payment_status: string; amount_total: number } }>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    const session = await this.paymentGateway.createCheckoutSession(
      {
        userId,
        courses: input.courses,
        couponCode: input.couponCode,
        orderId,
        amount: input.amount,
        isWalletTopUp: input.isWalletTopUp,
      },
      user.email,
      orderId
    );

    return {
      data: {
        session: {
          id: session.id,
          url: session.url,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
        },
      },
      message: "Checkout session created successfully",
    };
  }

  async handleStripeWebhook(event: WebhookEvent): Promise<ServiceResponse<{ order?: any; transaction?: Transaction }>> {
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const isWalletTopUp = session.metadata?.isWalletTopUp === 'true';

        if (!orderId) {
          throw new HttpError("No order ID found in session metadata", StatusCodes.BAD_REQUEST);
        }

        console.log('Processing webhook for orderId:', orderId);

        // Try to find transaction by orderId first
        let transaction = await this.transactionRepository.findByOrderId(orderId);
        
        // If not found and it's a wallet top-up, try finding by transaction ID
        if (!transaction && isWalletTopUp) {
          transaction = await this.transactionRepository.findById(orderId);
        }

        if (!transaction) {
          console.error('Transaction not found for orderId:', orderId);
          throw new HttpError("Transaction not found", StatusCodes.NOT_FOUND);
        }

        console.log('Found transaction:', transaction);

        // Update transaction status
        await this.transactionRepository.updateStatus(transaction.id, TransactionStatus.COMPLETED);

        if (isWalletTopUp) {
          // For wallet top-ups, update the wallet balance
          const wallet = await this.walletRepository.findByUserId(transaction.userId);
          if (!wallet) {
            throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
          }
          wallet.addAmount(transaction.amount);
          await this.walletRepository.update(wallet);
          console.log('Wallet updated with amount:', transaction.amount);
          return {
            data: { transaction },
            message: "Wallet top-up completed successfully"
          };
        } else {
          // For regular orders, handle order completion
          const order = await this.orderRepository.findById(orderId);
          if (!order) {
            throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
          }
          await this.orderRepository.updateOrderStatus(orderId, "COMPLETED", session.payment_intent as string, "STRIPE");

          // Create enrollments for each course in the order
          const orderItems = await this.orderRepository.findOrderItems(orderId);
          for (const item of orderItems) {
            await this.enrollmentRepository.create({
              userId: order.userId,
              courseIds: [item.courseId],
              orderItemId: item.id
            });
          }

          return {
            data: { order, transaction },
            message: "Payment completed successfully"
          };
        }
      }

      return {
        data: {},
        message: "Webhook processed successfully"
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new HttpError(
        error instanceof Error ? error.message : "Error processing webhook",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
} 