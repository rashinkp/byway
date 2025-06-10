import { ICreateOrderUseCase } from "../interfaces/create-order.usecase.interface";
import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { ICreateTransactionUseCase } from "../../transaction/interfaces/create-transaction.usecase.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService,
    private readonly createTransactionUseCase: ICreateTransactionUseCase
  ) {}

  async execute(userId: string, input: CreateOrderDto) {
    const { courses, paymentMethod, couponCode } = input;

    // Create order with payment method
    const order = await this.orderRepository.createOrder(
      userId,
      courses,
      paymentMethod as PaymentGateway,
      couponCode
    );

    // Handle payment based on method
    if (paymentMethod === "WALLET") {
      // Calculate total amount for wallet payment
      const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);
      
      // Process wallet payment
      const paymentResult = await this.paymentService.handleWalletPayment(userId, order.id, totalAmount);

      return {
        order,
        transaction: paymentResult.data.transaction
      };
    } else if (paymentMethod === "STRIPE") {
      // Calculate total amount
      const totalAmount = courses.reduce((sum, course) => sum + (course.offer || course.price), 0);

      // Create transaction for Stripe payment
      const transaction = await this.createTransactionUseCase.execute({
        orderId: order.id,
        userId,
        amount: totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.PENDING,
        paymentGateway: PaymentGateway.STRIPE,
        paymentMethod: "STRIPE"
      });

      // Create Stripe checkout session
      const session = await this.paymentService.createStripeCheckoutSession(userId, order.id, {
        ...input,
        userId
      });

      return {
        order,
        transaction,
        session: session.data.session
      };
    }

    return { order };
  }
} 