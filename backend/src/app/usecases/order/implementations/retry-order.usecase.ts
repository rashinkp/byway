import { IRetryOrderUseCase } from "../interfaces/retry-order.usecase.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { ICreateStripeCheckoutSessionUseCase } from "../../payment/interfaces/create-stripe-checkout-session.usecase.interface";
import { ICreateTransactionUseCase } from "../../transaction/interfaces/create-transaction.usecase.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { RetryOrderResponseDTO } from "../../../dtos/order.dto";
import { ITransactionOutputDTO } from "../../../dtos/transaction.dto";
import { NotFoundError, UserAuthorizationError, ValidationError } from "../../../../domain/errors/domain-errors";

export class RetryOrderUseCase implements IRetryOrderUseCase {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _createStripeCheckoutSessionUseCase: ICreateStripeCheckoutSessionUseCase,
    private readonly _createTransactionUseCase: ICreateTransactionUseCase
  ) {}

  async execute(userId: string, orderId: string): Promise<RetryOrderResponseDTO> {
    // Get the existing order
    const order = await this._orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order", orderId);
    }

    // Verify order ownership
    if (order.userId !== userId) {
      throw new UserAuthorizationError("Unauthorized to retry this order");
    }

    // Get order items to calculate total amount
    const orderItems = await this._orderRepository.findOrderItems(orderId);
    if (!orderItems || orderItems.length === 0) {
      throw new ValidationError("No items found in order");
    }

    // Get course details for each order item
    const courses = await Promise.all(
      orderItems.map(async (item) => {
        const course = await this._orderRepository.findCourseById(item.courseId);
        if (!course) {
          throw new NotFoundError("Course", item.courseId);
        }
        return course;
      })
    );

    // Calculate total amount
    const totalAmount = courses.reduce((sum, course) => {
      const price = course.price?.getValue() || 0;
      const offer = course.offer?.getValue() || 0;
      return sum + (offer || price);
    }, 0);

    // Create new transaction for retry
    const transaction: ITransactionOutputDTO = await this._createTransactionUseCase.execute({
      orderId: order.id,
      userId,
      amount: totalAmount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.PENDING,
      paymentGateway: PaymentGateway.STRIPE,
      paymentMethod: "STRIPE"
    });

    // Create new Stripe checkout session
    const session = await this._createStripeCheckoutSessionUseCase.execute(userId, order.id!, {
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price?.getValue() || 0,
        offer: course.offer?.getValue() ?? undefined,
        thumbnail: course.thumbnail,
        duration: course.duration?.toString(),
        level: course.level?.toString()
      })),
      userId,
      amount: totalAmount
    });

    return {
      order,
      transaction,
      session: session.data.session
    };
  }
} 