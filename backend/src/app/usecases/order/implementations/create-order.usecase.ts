import { ICreateOrderUseCase } from "../interfaces/create-order.usecase.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { ICreateTransactionUseCase } from "../../transaction/interfaces/create-transaction.usecase.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { Order } from "../../../../domain/entities/order.entity";
import { OrderStatus } from "../../../../domain/enum/order-status.enum";
import { PaymentStatus } from "../../../../domain/enum/payment-status.enum";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { CreateOrderDto } from "../../../dtos/order.dto";

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _paymentService: IPaymentService,
    private readonly _createTransactionUseCase: ICreateTransactionUseCase
  ) {}

  async execute(userId: string, input: CreateOrderDto) {
    const { courses, paymentMethod, couponCode } = input;

    // Calculate total amount
    const totalAmount = courses.reduce(
      (sum, course) => sum + (course.offer || course.price),
      0
    );

    // Create order items
    const orderItems = courses.map((course) => ({
      orderId: "", // Will be set after order creation
      courseId: course.id,
      courseTitle: course.title,
      coursePrice: course.price,
      discount: course.offer ? course.price - course.offer : null,
      couponId: couponCode || null,
      title: course.title,
      description: course.description || null,
      level: course.level || "BEGINNER",
      price: course.price,
      thumbnail: course.thumbnail || null,
      status: "ACTIVE",
      categoryId: "", // Default empty string since it's not available in input
      createdBy: userId, // Use the current user's ID as creator
      deletedAt: null,
      approvalStatus: "PENDING",
      details: null,
    }));

    // Create Order entity
    const order = new Order(
      userId,
      OrderStatus.PENDING,
      PaymentStatus.PENDING,
      null, // paymentIntentId
      paymentMethod as PaymentGateway,
      totalAmount,
      couponCode || null,
      orderItems
    );

    if (!order.isPending()) {
      throw new HttpError("Invalid order status", StatusCodes.BAD_REQUEST);
    }

    // Persist order
    const persistedOrder = await this._orderRepository.createOrder(
      userId,
      courses,
      paymentMethod as PaymentGateway,
      couponCode
    );

    // Set the ID from persisted order
    order.id = persistedOrder.id;

    // Handle payment based on method
    if (paymentMethod === "WALLET") {
      // Process wallet payment
      const paymentResult = await this._paymentService.handleWalletPayment(
        userId,
        order.id!,
        totalAmount
      );

      return {
        order,
        transaction: paymentResult.data.transaction,
      };
    } else if (paymentMethod === "STRIPE") {
      // Create transaction for Stripe payment
      const transaction = await this._createTransactionUseCase.execute({
        orderId: order.id!,
        userId,
        amount: totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.PENDING,
        paymentGateway: PaymentGateway.STRIPE,
        paymentMethod: "STRIPE",
      });

      // Create Stripe checkout session
      const session = await this._paymentService.createStripeCheckoutSession(
        userId,
        order.id!,
        {
          ...input,
          userId,
        }
      );

      return {
        order,
        transaction,
        session: session.data.session,
      };
    }

    return { order };
  }
}
