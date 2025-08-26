import { IHandleWalletPaymentUseCase } from "../interfaces/handle-wallet-payment.usecase.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway as PaymentGatewayEnum } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IDistributeRevenueUseCase } from "../../revenue-distribution/interfaces/distribute-revenue.usecase.interface";
import { OrderStatus } from "../../../../domain/enum/order-status.enum";
import { getSocketIOInstance } from "../../../../presentation/socketio";
import { ValidationError, BusinessRuleViolationError } from "../../../../domain/errors/domain-errors";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class HandleWalletPaymentUseCase implements IHandleWalletPaymentUseCase {
  constructor(
    private readonly _walletRepository: IWalletRepository,
    private readonly _orderRepository: IOrderRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _cartRepository: ICartRepository,
    private readonly _distributeRevenueUseCase: IDistributeRevenueUseCase
  ) {}

  async execute(
    userId: string,
    orderId: string,
    amount: number
  ): Promise<ServiceResponse<{ transaction: Transaction }>> {
    const wallet = await this._walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new ValidationError("Wallet not found");
    }
    if (wallet.balance._amount < amount) {
      throw new BusinessRuleViolationError("Insufficient wallet balance");
    }

    // Deduct from wallet
    wallet.reduceAmount(amount);
    await this._walletRepository.update(wallet);

    // Create transaction
    const transaction = new Transaction({
      orderId,
      userId,
      amount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGatewayEnum.WALLET,
    });
    await this._transactionRepository.create(transaction);

    // Update order status
    await this._orderRepository.updateOrderStatus(
      orderId,
      OrderStatus.COMPLETED,
      transaction.id,
      PaymentGatewayEnum.WALLET
    );

    // Create enrollments for each course in the order
    const orderItems = await this._orderRepository.findOrderItems(orderId);

    if (!orderItems || orderItems.length === 0) {
      throw new ValidationError("No order items found");
    }

    for (const item of orderItems) {
      // Check if user is already enrolled in this course
      const existingEnrollment =
        await this._enrollmentRepository.findByUserAndCourse(
          userId,
          item.courseId
        );

      if (existingEnrollment) {
        continue;
      }

      // Create new enrollment
      await this._enrollmentRepository.create({
        userId,
        courseIds: [item.courseId],
        orderItemId: item.id,
      });
    }

    // Distribute revenue
    await this._distributeRevenueUseCase.execute(orderId);

    // Clear cart items for purchased courses (best-effort)
    try {
      for (const item of orderItems) {
        await this._cartRepository.deleteByUserAndCourse(userId, item.courseId);
      }
    } catch {}

    // Send real-time notifications via Socket.IO
    const orderItemsWithPrices = await Promise.all(
      orderItems.map(async (item) => {
        const course = await this._orderRepository.findCourseById(
          item.courseId
        );
        return {
          courseId: item.courseId,
          coursePrice: course?.price?.getValue() || 0,
        };
      })
    );
    await this._sendPurchaseNotifications({ userId }, orderItemsWithPrices);

    return {
      data: {
        transaction,
      },
      message: "Payment processed successfully using wallet",
    };
  }

  private async _sendPurchaseNotifications(
    user: { userId: string },
    orderItems: { courseId: string; coursePrice: number }[]
  ): Promise<void> {
    const io = getSocketIOInstance();
    if (io) {
      io.to(user.userId).emit("purchase_success", {
        message: "Purchase completed successfully!",
        courses: orderItems.map((item) => item.courseId),
        totalAmount: orderItems.reduce((sum, item) => sum + item.coursePrice, 0),
      });
    }
  }
}
