import { ICreateOrderUseCase } from "../interfaces/create-order.usecase.interface";
import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService
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
      // Create Stripe checkout session
      const session = await this.paymentService.createStripeCheckoutSession(userId, order.id, {
        ...input,
        userId
      });

      return {
        order,
        session: session.data.session
      };
    }

    return { order };
  }
} 