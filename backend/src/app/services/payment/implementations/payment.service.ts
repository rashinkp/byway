import { IPaymentService } from "../interfaces/payment.service.interface";
import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
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
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
    }
    if (wallet.balance.amount < amount) {
      throw new HttpError("Insufficient wallet balance", StatusCodes.BAD_REQUEST);
    }

    // Deduct from wallet
    wallet.reduceAmount(amount);
    await this.walletRepository.update(wallet);

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

    // Update order status
    await this.orderRepository.updateOrderStatus(
      orderId,
      "COMPLETED",
      transaction.id,
      "WALLET"
    );

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
    input: CreateOrderDto
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
        isWalletTopUp: input.courses.length === 1 && input.courses[0].title === "Wallet Top-up",
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

  async handleStripeWebhook(event: WebhookEvent): Promise<ServiceResponse<{ order: any; transaction?: Transaction }>> {
    const metadata = this.webhookGateway.parseMetadata(event.data.object.metadata);
    const { userId, orderId, courses, isWalletTopUp } = metadata;

    if (!userId || !orderId) {
      throw new HttpError("Invalid webhook metadata", StatusCodes.BAD_REQUEST);
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
    }

    if (order.paymentStatus === "COMPLETED") {
      return {
        data: { order },
        message: "Order already processed",
      };
    }

    const paymentIntentId = this.webhookGateway.getPaymentIntentId(event);
    if (!paymentIntentId) {
      throw new HttpError("Payment intent ID not found", StatusCodes.BAD_REQUEST);
    }

    // Update order status
    await this.orderRepository.updateOrderStatus(
      orderId,
      "COMPLETED",
      paymentIntentId,
      "STRIPE"
    );

    // Create transaction
    const transaction = new Transaction({
      orderId,
      userId,
      amount: order.totalAmount,
      type: isWalletTopUp ? TransactionType.WALLET_TOPUP : TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGatewayEnum.STRIPE,
      transactionId: paymentIntentId,
    });
    await this.transactionRepository.create(transaction);

    // If it's a wallet top-up, update the wallet balance
    if (isWalletTopUp) {
      const wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
      }
      wallet.addAmount(order.totalAmount);
      await this.walletRepository.update(wallet);
    } else {
      // Create enrollments if courses are provided
      if (courses && Array.isArray(courses)) {
        await this.enrollmentRepository.create({
          userId,
          courseIds: courses.map(course => course.id),
        });
      }
    }

    return {
      data: {
        order,
        transaction,
      },
      message: "Payment processed successfully",
    };
  }
} 