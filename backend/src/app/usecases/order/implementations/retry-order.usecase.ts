import { IRetryOrderUseCase } from "../interfaces/retry-order.usecase.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { ICreateTransactionUseCase } from "../../transaction/interfaces/create-transaction.usecase.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { RetryOrderResponseDTO } from "../../../dtos/order.dto";
import { ITransactionOutputDTO } from "../../../dtos/transaction.dto";

export class RetryOrderUseCase implements IRetryOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService,
    private readonly createTransactionUseCase: ICreateTransactionUseCase
  ) {}

  async execute(userId: string, orderId: string): Promise<RetryOrderResponseDTO> {
    // Get the existing order
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
    }

    // Verify order ownership
    if (order.userId !== userId) {
      throw new HttpError("Unauthorized to retry this order", StatusCodes.FORBIDDEN);
    }

    // Get order items to calculate total amount
    const orderItems = await this.orderRepository.findOrderItems(orderId);
    if (!orderItems || orderItems.length === 0) {
      throw new HttpError("No items found in order", StatusCodes.BAD_REQUEST);
    }

    // Get course details for each order item
    const courses = await Promise.all(
      orderItems.map(async (item) => {
        const course = await this.orderRepository.findCourseById(item.courseId);
        if (!course) {
          throw new HttpError(`Course not found: ${item.courseId}`, StatusCodes.NOT_FOUND);
        }
        return course;
      })
    );

    // Calculate total amount
    const totalAmount = courses.reduce((sum, course) => {
      const price = course.price?.getValue()?.toNumber() || 0;
      const offer = course.offer?.getValue()?.toNumber() || 0;
      return sum + (offer || price);
    }, 0);

    // Create new transaction for retry
    const transaction: ITransactionOutputDTO = await this.createTransactionUseCase.execute({
      orderId: order.id,
      userId,
      amount: totalAmount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.PENDING,
      paymentGateway: PaymentGateway.STRIPE,
      paymentMethod: "STRIPE"
    });

    // Create new Stripe checkout session
    const session = await this.paymentService.createStripeCheckoutSession(userId, order.id!, {
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price?.getValue()?.toNumber() || 0,
        offer: course.offer?.getValue()?.toNumber(),
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